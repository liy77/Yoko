const Intents = require("../../util/Intents");
const { create } = require("../../util/Request");
const EndPoints = require("../../constants/EndPoints");
const { requestMethods: methods } = require("../../constants/Constants");
const Channel = require("../../structures/channels/Channel");
const MessageEmbed = require("../../structures/embed/MessageEmbed");
const { TypeError } = require("../../util/Errors");
const Message = require("../../structures/Message");
const DMChannel = require("../../structures/channels/DMChannel");

class Rest {
  constructor(client, intents = Intents.default) {
    this.client = client;
    this.intents = client.intents;
  }

  makeRequest(endpoint, method = "GET", body = {}) {
    return create(endpoint, {
      method,
      parseHeaders: true,
      auth: this.client.token,
      body,
    });
  }

  makeIdentify(
    sharding = {
      totalShards: 1,
      shard: 0,
    },
    presence
  ) {
    return {
      token: this.client.token,
      properties: {
        $os: process.platform,
        $browser: "yoko",
        $device: "yoko",
      },
      compress: this.client.options.api.compress ? "zlib-stream" : false,
      large_threshold: 250,
      shard: [sharding.shard, sharding.totalShards],
      presence,
      intents: this.intents,
    };
  }

  setIntents(intents) {
    this.intents = intents;
  }

  postMessage(channelID, options) {
    return this.makeRequest(
      EndPoints.CHANNEL_MESSAGES(channelID),
      methods.post,
      options
    ).then((data) => new Message(data, this.client));
  }

  createUserDm(recipientID) {
    return this.makeRequest(EndPoints.CREATE_DM, methods.post, {
      recipient_id: recipientID,
    }).then((data) =>
      this.client.channels._add(new DMChannel(data, this.client))
    );
  }

  deleteChannel(channelID, reason) {
    this.makeRequest(EndPoints.DELETE_CHANNEL(channelID), methods.post, {
      reason,
    }).then((data) => {
      const ch = new Channel(data, this.client);
      ch.deleted = true;
      this.client.channels.cache.delete(channelID);
      return ch;
    });
  }

  getGuildChannels(guildID) {
    return this.makeRequest(`/guilds/${guildID}/channels`, methods.get).then(
      (data) => data.map((ch) => Channel.transform(ch, this.client))
    );
  }

  static resolveToken(token) {
    return token.replace(/^Bot\s*/i, "");
  }

  static resolveAPIMessageContent(contentNotResolvable = {}) {
    var resolvedContent = {
      embeds: [],
    };

    if ("embeds" in contentNotResolvable) {
      const embeds = contentNotResolvable.embeds;

      if (Array.isArray(embeds)) {
        embeds
          .filter((embed) => MessageEmbed.isInstanceofEmbed(embed))
          .forEach((embed) => {
            resolvedContent.embeds.push(embed);
          });
      } else if (MessageEmbed.isInstanceofEmbed(embeds)) {
        resolvedContent.embeds.push(embeds);
      }
    }

    if ("content" in contentNotResolvable) {
      resolvedContent.content =
        typeof contentNotResolvable.content === "number"
          ? contentNotResolvable.content.toString()
          : contentNotResolvable.content;
    }

    if (!resolvedContent.content && resolvedContent.embeds.length === 0) {
      throw new TypeError("INVALID_MESSAGE_CONTENT");
    } else {
      return resolvedContent;
    }
  }
}

Rest.RateLimit = class RateLimit {
  timeout = null;

  constructor(options = {}) {
    this.ratelimit = {
      remaining: options.remaining,
      queue: [],
      total: options.total,
      timer: null,
      time: options.time,
    };
  }

  processQueue() {
    if (this.ratelimit.remaining === 0 || this.ratelimit.queue.length === 0) {
      return;
    }

    if (this.ratelimit.remaining === this.ratelimit.total) {
      this.ratelimit.timer = setTimeout(() => {
        this.ratelimit.remaining = this.ratelimit.total;
        this.processQueue();
      }, this.ratelimit.time).unref();
    }

    while (this.ratelimit.remaining > 0) {
      const item = this.ratelimit.queue.shift();
      if (!item) return;
      item();
      this.ratelimit.remaining--;
    }
  }

  addToQueue(func, important = false) {
    this.ratelimit.queue[important ? "unshift" : "push"](func);
  }

  clear() {
    this.ratelimit.remaining = this.ratelimit.total;
    this.ratelimit.queue.length = 0;
    if (this.ratelimit.timer) {
      clearTimeout(this.ratelimit.timer);
      this.ratelimit.timer = null;
    }
    return this;
  }
};

module.exports = Rest;
