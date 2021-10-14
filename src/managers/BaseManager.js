const Collection = require("collection");

module.exports = class BaseManager {
  constructor(client) {
    this.client = client;
  }
};
