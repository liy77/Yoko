const Guild = require("../structures/Guild");
const CacheManager = require("./CacheManager");

module.exports = class GuildManager extends CacheManager {
  constructor(client, limit) {
    super(client, Guild, limit);
  }
};
