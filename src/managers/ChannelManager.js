const Channel = require("../structures/channels/Channel");
const CacheManager = require("./CacheManager");

module.exports = class ChannelManager extends CacheManager {
  constructor(client, limit) {
    super(client, Channel, limit);
  }
};
