const WebSocket = require("ws");
const Erlpack = require("../../util/Utils").erlpack;
const EventEmitter = require("node:events");
const { zlib } = require("../../util/Utils");
const Rest = require("../rest/Rest");
const Intents = require("../../util/Intents");

const {
  ShardEvents,
  ShardStatus,
  ClientEvents,
  opCodes,
  wsEvents,
} = require("../../constants/Constants");

module.exports = class WebSocketShard extends EventEmitter {
  connection = null;
  inflate = null;
  sessionID = null;
  sequence = null;
  closeSequence = null;
  helloTimeout = null;
  expectedGuilds = null;
  lastPingTimestamp = null;
  connectedAt = null;

  ratelimit = new Rest.RateLimit({
    total: 120,
    remaining: 120,
    time: 60e3,
  });

  constructor(manager, id) {
    super();
    this.id = id;
    this.ping = -1;
    this.lastHeartbeatAcked = false;
    this.eventsAttached = false;

    this.manager = manager;
    this.client = manager.client;

    this.status = ShardStatus.IDLE;

    this.rest = this.client.rest;
  }

  debug(message) {
    this.manager.debug(message, this);
  }

  connect() {
    if (
      this.connection?.readyState === WebSocket.OPEN &&
      this.status === ShardStatus.READY
    ) {
      return Promise.resolve();
    }

    return new Promise(() => {
      this.inflate = new zlib.Inflate({
        chunkSize: 128 * 1024,
      });

      this.debug(`[CONNECTION] 
      ${JSON.stringify(
        {
          gatewayURL: this.manager.gatewayURL,
          version: this.client.options.api.version,
          encoding: Erlpack.encoding,
          compression: this.client.options.api.compress
            ? "zlib-stream"
            : "none",
        },
        null,
        "\t"
      )}`);

      this._startConnection();
    });
  }

  _startConnection() {
    this.status =
      this.status === ShardStatus.DISCONNECTED
        ? ShardStatus.RECONNECTING
        : ShardStatus.CONNECTING;

    this.setHelloTimeout();

    this.connectedAt = Date.now();

    this.connection = new WebSocket(this.manager.gatewayURL);
    this.connection.onopen = this._onOpen.bind(this);
    this.connection.onmessage = this._onMessage.bind(this);
    this.connection.onerror = this._onError.bind(this);
    this.connection.onclose = this._onClose.bind(this);
  }

  _onOpen() {
    this.debug(`[CONNECTED] Took ${Date.now() - this.connectedAt}ms`);
    this.status = ShardStatus.NEARLY;
  }

  _onClose(close) {
    if (this.sequence !== -1) this.closeSequence = this.sequence;
    this.sequence = -1;

    this.debug(`[CLOSE]
    ${JSON.stringify(
      {
        code: close.code,
        clean: close.wasClean,
        reason: close.reason ?? "none",
      },
      null,
      "\t"
    )}
    
      `);

    this.setHeartbeatTimer(-1);
    this.setHelloTimeout(-1);
  }

  _onError(error) {
    error = error?.error ?? error;

    if (!error) return;

    this.client.emit(ClientEvents.SHARD_ERROR, error, this.id);
  }

  async _onMessage({ data }) {
    var packet;

    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data);
    }

    const raw = this.inflateData(data);

    try {
      packet = Erlpack.unpack(raw);
    } catch (err) {
      this.client.emit(ClientEvents.SHARD_ERROR, err, this.id);
      return;
    }

    this.client.emit(ClientEvents.RAW, packet, this.id);

    await this._onPacket(packet);
  }

  async _onPacket(packet) {
    if (!packet) {
      this.debug(`Received invalid packet: '${packet}'.`);
      return;
    }

    if (packet === opCodes.DISPATCH) {
      this.manager.emit(packet.t, packet.d, this.id);
    }

    switch (packet.t) {
      case wsEvents.READY:
        this.emit(ShardEvents.READY);

        this.sessionID = packet.d.session_id;
        this.expectedGuilds = new Set(packet.d.guilds.map((d) => d.id));
        this.status = ShardStatus.WAITING_FOR_GUILDS;

        this.debug(`[READY] Session ${this.sessionID}.`);
        this.lastHeartbeatAcked = true;
        this.sendHeartbeat();
        this.manager.actionPacket(packet, this);
        break;

      case wsEvents.RESUMED:
        this.emit(ShardEvents.RESUMED);

        this.status = ShardStatus.READY;

        const resumedEvents = packet.s - this.closeSequence;
        this.lastHeartbeatAcked = true;

        this.debug(
          `[RESUMED] Session ${this.sessionID} | Resumed ${resumedEvents} events.`
        );
        break;
      default:
        if (
          this.status === ShardStatus.WAITING_FOR_GUILDS &&
          packet.t === wsEvents.GUILD_CREATE
        ) {
          this.expectedGuilds.delete(packet.d.id);
          this.checkReady();
        }

        if (packet.t) await this.manager.actionPacket(packet, this);
        break;
    }

    if (packet.s > this.sequence) this.sequence = packet.s;

    switch (packet.op) {
      case opCodes.HELLO:
        this.setHelloTimeout(-1);
        this.setHeartbeatTimer(packet.d.heartbeat_interval);
        this.identify();
        break;
      case opCodes.RECONNECT:
        this.debug("[RECONNECT] Discord asked us to reconnect.");
        this.disconnect({ closeCode: 4_901 }, "Yoko: Reconnect.");
        break;
      case opCodes.INVALID_SESSION:
        this.debug(
          `[INVALID SESSION] ${JSON.stringify({
            resumable: packet.d,
          })}`
        );

        if (packet.d) {
          this.identify();
          return;
        }

        this.sequence = -1;
        this.sessionId = null;
        this.status = ShardStatus.RECONNECTING;

        this.emit(ShardEvents.INVALID_SESSION);
        break;
      case opCodes.HEARTBEAT_ACK:
        this.ackHeartbeat();
        break;
      case opCodes.HEARTBEAT:
        this.sendHeartbeat();
        break;
    }
  }

  setHeartbeatTimer(time) {
    if (time === -1) {
      if (this.heartbeatInterval) {
        this.debug("Clearing the heartbeat interval.");
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
      return;
    }
    this.debug(`Setting a heartbeat interval for ${time}ms.`);

    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(
      () => this.sendHeartbeat(),
      time
    ).unref();
  }

  setHelloTimeout(time) {
    if (time === -1) {
      if (this.helloTimeout) {
        this.debug("Clearing the hello timeout.");
        clearTimeout(this.helloTimeout);
        this.helloTimeout = null;
      }
      return;
    }

    this.debug("Setting a hello timeout to 20000ms.");

    this.helloTimeout = setTimeout(() => {
      this.debug(
        "Hello not received. Disconnecting connection and connecting it."
      );
      this.disconnect(
        { reset: true, closeCode: 4_901 },
        "Yoko: Hello not received."
      );
    }, 20_000).unref();
  }

  sendHeartbeat() {
    const ignoreAck = [
      ShardStatus.WAITING_FOR_GUILDS,
      ShardStatus.IDENTIFYING,
      ShardStatus.RESUMING,
    ].includes(this.status);

    if (ignoreAck && !this.lastHeartbeatAcked) {
      this.debug(
        "As in the process there is no heartbeat ACK will be sent only a new heartbeat."
      );
    } else if (!this.lastHeartbeatAcked) {
      this.debug(
        "No ack has been received. Disconnecting connection and connecting it."
      );

      this.disconnect({ closeCode: 4_901, reset: true }, "Yoko: No ack.");
    }

    this.lastPingTimestamp = Date.now();
    this.lastHeartbeatAcked = false;
    this.send({ op: opCodes.HEARTBEAT, d: this.sequence }, true);
  }

  ackHeartbeat() {
    this.lastHeartbeatAcked = true;

    const latency = Date.now() - this.lastPingTimestamp;

    this.ping = latency;

    this.debug(`Heartbeat acknowledged, latency of ${latency}ms.`);
  }

  send(data, important) {
    this.ratelimit.addToQueue(() => this._send(data), important);
    this.ratelimit.processQueue();
  }

  _send(data) {
    if (this.connection?.readyState !== WebSocket.OPEN) {
      this.debug("No connection found.");

      this.disconnect({ closeCode: 4_000 }, "No connection found.");
      return;
    }

    this.connection.send(Erlpack.pack(data), (err) => {
      if (err) this.client.emit(ClientEvents.SHARD_ERROR, err, this.id);
    });
  }

  disconnect(
    { closeCode = 1_000, reset = false, emit = true, debug = true } = {},
    reason
  ) {
    if (debug) {
      this.debug(`[DISCONNECT]
      ${JSON.stringify(
        {
          code: closeCode,
          reset,
          emit,
          reason: reason ?? "none",
        },
        null,
        "\t"
      )}`);
    }

    this.setHeartbeatTimer(-1);
    this.setHelloTimeout(-1);

    if (this.connection) {
      if (this.connection.readyState === WebSocket.OPEN) {
        this.connection.close(closeCode);
      } else {
        this.connection =
          this.connection.onopen =
          this.connection.onclose =
          this.connection.onmessage =
          this.connection.onerror =
            null;

        try {
          this.connection.close(closeCode);
        } catch {}
      }
    }

    this.status = ShardStatus.DISCONNECTED;

    if (this.sequence !== -1) {
      this.closeSequence = this.sequence;
    }

    if (reset) {
      this.sequence = -1;
      this.sessionID = null;
    }

    this.ratelimit.clear();

    if (emit) this.emit(ShardEvents.DISCONNECT);
  }

  inflateData(data) {
    var raw;

    const length = data.length;
    const flush =
      length >= 4 &&
      data[length - 4] === 0x00 &&
      data[length - 3] === 0x00 &&
      data[length - 2] === 0xff &&
      data[length - 1] === 0xff;

    if (flush) {
      this.inflate.push(data, zlib.Z_SYNC_FLUSH);
      raw = Buffer.from(this.inflate.result);
    } else {
      raw = data;
    }

    return raw;
  }

  identify() {
    if (this.sessionID) {
      this.status = ShardStatus.RESUMING;

      const d = {
        token: this.rest.token,
        session_id: this.sessionID,
        seq: this.closeSequence,
      };

      this.debug(
        `[RESUME] Session ${this.sessionID}, sequence ${this.closeSequence}`
      );

      this.send({ op: opCodes.RESUME, d }, true);
      return;
    }

    const d = this.rest.makeIdentify({
      totalShards: this.client.options.totalShards,
      shard: this.id,
    });

    this.status = ShardStatus.IDENTIFYING;

    this.debug(`[IDENTIFY] Shard ${this.id} with intents: ${d.intents}`);

    this.send({ op: opCodes.IDENTIFY, d }, true);
    return;
  }

  checkReady() {
    if (this.readyTimeout) {
      clearTimeout(this.readyTimeout);
      this.readyTimeout = null;
    }

    if (!this.expectedGuilds.size) {
      this.status = ShardStatus.READY;

      this.debug("All guilds were received. Sending allReady event.");

      this.emit(ShardEvents.ALL_READY);
      return;
    }

    const hasGuildsIntents = new Intents(this.client.intents).has(
      Intents.FLAGS.GUILDS
    );

    this.readyTimeout = setTimeout(
      () => {
        this.debug(
          `Shard ${
            hasGuildsIntents ? "did" : "will"
          } not receive any more guild packets ${
            hasGuildsIntents ? "in 15 seconds" : ""
          }.
          Unavailable guild count: ${this.expectedGuilds.size}`
        );

        this.readyTimeout = null;

        this.status = ShardStatus.READY;

        this.emit(ShardEvents.ALL_READY, this.expectedGuilds);
      },
      hasGuildsIntents ? 15_000 : 0
    ).unref();
  }
};

// Based on Discord.js
