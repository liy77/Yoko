const { ShardStatus } = require("../../constants/Constants");

module.exports = class BaseAction {
  constructor(client) {
    this.client = client;
  }

  handle(data, shard) {
    return data;
  }

  handleIfIsReady(func, shard) {
    if (shard.status === ShardStatus.READY) {
      func();
    }
  }
};
