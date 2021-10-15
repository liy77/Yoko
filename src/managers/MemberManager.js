const GuildMember = require("../structures/GuildMember");
const CacheManager = require("./CacheManager");

module.exports = class MemberManager extends CacheManager {
  constructor(client, limit) {
    super(client, GuildMember, limit);
  }
};
