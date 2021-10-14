const User = require("../structures/User");
const CacheManager = require("./CacheManager");

module.exports = class UserManager extends CacheManager {
  constructor(client, limit) {
    super(client, User, limit);
  }
};
