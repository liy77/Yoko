const { createDefaultOptions } = require("./Utils");
const ChannelManager = require("../managers/ChannelManager");
const GuildManager = require("../managers/GuildManager");
const UserManager = require("../managers/UserManager");

class CacheFactory {
  constructor(client, options = {}) {
    this.ChannelManager = new ChannelManager(client, options.ChannelManager);
    this.GuildManager = new GuildManager(client, options.GuildManager);
    this.UserManager = new UserManager(client, options.UserManager);
  }
}

module.exports.default = CacheFactory;

module.exports.makeCache = (client, options = {}) => {
  options = createDefaultOptions("allInfinity", options);
  return new CacheFactory(client, options);
};
