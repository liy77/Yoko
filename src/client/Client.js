const EventEmitter = require("node:events");
const { Error } = require("../util/Errors");
const Intents = require("../util/Intents");
const Rest = require("./rest/Rest");
const Constants = require("../constants/Constants");
const { getRecommendedShards } = require("../util/Utils");
const WebSocketManager = require("./websocket/WebSocketManager");
const ActionsManager = require("./actions/ActionsManager");
const { makeCache } = require("../util/CacheFactory");

module.exports = class Client extends EventEmitter {
  intents = 0;
  readyAt = null;
  user = null
  constructor(options = {}) {
    super();
    this.intents = 0;

    if (options.intents) {
      this.intents = this.setIntents(options.intents);
    } else {
      this.intents = Intents.default;
    }

    if (options.token) {
      this.token = Rest.resolveToken(options.token);
    }

    options.api = {
      version: options.api?.version ?? Constants.apiVersion,
      compress: options.api?.compress ?? false,
    };

    options.shardList = options?.shardList ?? "auto";
    options.totalShards = options?.totalShards ?? "auto";

    this.options = options;

    this.rest = new Rest(this);
    this.rest.setIntents(this.intents);

    this.actions = new ActionsManager(this);
    this.ws = new WebSocketManager(this);

    const cache = makeCache(this, options.cache);

    this.guilds = cache.GuildManager;
    this.channels = cache.ChannelManager;
    this.users = cache.UserManager;

    this._guildShardsMap = {};

    if (options.debug) {
      this.on(Constants.ClientEvents.DEBUG, (message) => {
        console.log(message);
      });
    }
  }

  setIntents(intents) {
    if (
      typeof intents !== "string" &&
      typeof intents !== "number" &&
      !Array.isArray(intents)
    ) {
      throw new Error("INVALID_INTENTS");
    }

    if (Array.isArray(intents)) {
      for (var intent of intents) {
        if (typeof intent === "string") {
          intent = Intents.FLAGS[intent];

          if (!intent) throw new Error("INVALID_INTENTS");
        }

        this.intents |= intent;
      }
      return this.intents;
    }

    const int =
      typeof intents === "string"
        ? (this.intents |= Intents.FLAGS[intents])
        : (this.intents |= intents);

    return int;
  }

  async connect(token) {
    if (!token && !this.token) {
      throw new Error("INVALID_TOKEN");
    } else if (token) {
      this.token = Rest.resolveToken(token);
    } else if (this.token) {
      this.token = this.token;
    }

    if (
      this.options?.totalShards === "auto" &&
      (this.options.shardList === "auto" || this.options.shardList.length === 0)
    ) {
      this.options.totalShards = await getRecommendedShards(this.token);

      this.options.shardList = Array.from(
        { length: this.options.totalShards },
        (_, i) => i
      );
    }

    this.options = Object.freeze(this.options);

    await this.ws.connect();
    return this.token;
  }

  get login() {
    return this.connect;
  }
};