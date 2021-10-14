const { ClientEvents } = require("../../constants/Constants");
const Message = require("../../structures/Message");
const BaseAction = require("./BaseAction");

module.exports = class messageCreateAction extends BaseAction {
  handle(data, shard) {
    const msg = new Message(data, this.client);

    if (msg.channel.messages) {
      msg.channel.messages._add(msg);
    }

    this.handleIfIsReady(
      () => this.client.emit(ClientEvents.MESSAGE_CREATE, msg),
      shard
    );
  }
};
