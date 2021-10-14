const Message = require("../structures/Message");
const CacheManager = require("./CacheManager");

module.exports = class MessageManager extends CacheManager {
  constructor(client, limit) {
    super(client, Message, limit);
  }
};
