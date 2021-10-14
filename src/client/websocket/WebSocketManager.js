const Collection = require("collection");
const Constants = require("../../constants/Constants");
const {
  erlpack,
  zlib,
  sleep,
  resolveAPIEventName,
} = require("../../util/Utils");
const WebSocketShard = require("./WebSocketShard");

module.exports = class WebSocketManager {
  shardQueue = null;
  readyAt = null;
  totalShards = null;

  constructor(client) {
    this.client = client;

    this.gatewayURL = Constants.Gateway(
      client.options.api.version,
      erlpack.encoding
    );

    if (client.options.api.compress) {
      this.gatewayURL += '&compress="zlib-stream"';
    }

    this.shards = new Collection(WebSocketShard);

    this.disconnected = false;
    this.reconnecting = false;
    this.status = Constants.ShardStatus.IDLE;
  }

  get ping() {
    const sum = this.shards.all().reduce((a, b) => a + b.ping, 0);
    return sum / this.shards.size;
  }

  debug(message, shard) {
    this.client.emit(
      Constants.ClientEvents.DEBUG,
      `[${shard ? `Shard (${shard.id})` : "WSManager"}] => ${message}`
    );
  }

  async connect() {
    const shards = this.client.options.shardList;

    this.shardQueue = new Set(shards.map((id) => new WebSocketShard(this, id)));

    this.totalShards = shards.length;

    this.debug(`Spawning shards: ${shards.join(", ")}`);

    await this.createShards();
  }

  async createShards() {
    if (!this.shardQueue.size) return;

    const [shard] = this.shardQueue;

    this.shardQueue.delete(shard);

    if (!shard.eventsAttached) {
      shard.on(Constants.ShardEvents.ALL_READY, (unavaibleGuilds) => {
        this.client.emit(
          Constants.ClientEvents.SHARD_READY,
          shard.id,
          unavaibleGuilds
        );

        if (!this.shardQueue.size) this.reconnecting = false;
        this.checkShardsReady();
      });

      shard.on(Constants.ShardEvents.CLOSE, (c) => {
        if (
          c.code === 1_000
            ? this.disconnected
            : Constants.UNRECOVERABLE_CLOSE_CODES.includes(c.code)
        ) {
          this.client.emit(Constants.ClientEvents.SHARD_DISCONNECT, shard.id);
          this.debug(Constants.wsCodes[c.code], shard);
          return;
        }

        if (Constants.UNRECOVERABLE_CLOSE_CODES.includes(c.code)) {
          shard.sessionID = null;
        }

        this.client.emit(Constants.ClientEvents.SHARD_RECONNECTING, shard.id);

        this.shardQueue.add(shard);

        if (shard.sessionId) {
          this.debug(
            `Session ID present, establishing gateway connection.`,
            shard
          );
          this.reconnect();
        } else {
          shard.disconnect({ reset: true, emit: false, log: false });
          this.reconnect();
        }
      });

      shard.on(Constants.ShardEvents.INVALID_SESSION, () => {
        this.client.emit(Constants.ClientEvents.SHARD_RECONNECTING, shard.id);
      });

      shard.on(Constants.ShardEvents.DISCONNECT, async () => {
        this.debug(
          `Shard ${shard.id} was disconnected because no connection to WebSocket was found.`,
          shard
        );

        this.client.emit(Constants.ClientEvents.SHARD_RECONNECTING, shard.id);

        this.shardQueue.add(shard);
        await this.reconnect();
      });

      shard.eventsAttached = true;
    }

    this.shards.set(shard.id, shard);

    try {
      await shard.connect();
    } catch (err) {
      if (err?.code) {
      } else if (!err || err.code) {
        this.debug("Error connecting to Shard. Trying again.");
        this.shardQueue.add(shard);
      } else {
        throw err;
      }
    }

    if (this.shardQueue.size === 0) {
      this.debug(`Total de shards no queue: ${this.shardQueue.size}.`);

      await sleep(5_000);

      return this.createShards();
    }

    return true;
  }

  checkShardsReady() {
    if (this.status === Constants.ShardStatus.READY) return;

    if (
      this.shards.size !== this.totalShards ||
      this.shards.some((shard) => shard.status !== Constants.ShardStatus.READY)
    ) {
      return;
    }

    this.setReady();
  }

  setReady() {
    this.status = Constants.ShardStatus.READY;

    this.client.readyAt = Date.now();

    this.client.emit(Constants.ClientEvents.READY);

    return;
  }

  async actionPacket(packet, shard) {
    await this.client.actions.exec(
      resolveAPIEventName(packet.t),
      packet.d,
      shard
    );
  }

  async reconnect() {
    if (this.reconnecting || this.status !== Constants.ShardStatus.READY)
      return false;

    this.reconnecting = true;

    try {
      await this.createShards();
    } catch (error) {
      await sleep(5_000);

      this.reconnecting = false;

      return this.reconnect();
    } finally {
      this.reconnecting = false;
    }

    return true;
  }
};

// Based on Discord.js
