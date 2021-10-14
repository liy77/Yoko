const User = require("../structures/User");
const CacheManager = require("./CacheManager");

module.exports = class MemberManager extends CacheManager {
  constructor(client, limit) {
    super(client, User, limit);
  }
};
