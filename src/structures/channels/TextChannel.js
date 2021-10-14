const MessageManager = require("../../managers/MessageManager");
const Channel = require("./Channel");
const TextBasedChannel = require("./TextBasedChannel");

class TextChannel extends Channel {
  constructor(data, client) {
    super(data, client);
    this.messages = new MessageManager(this.client, Infinity);
  }

  postMessage() {}
}

TextBasedChannel.addToClass(TextChannel, "postMessage");

module.exports = TextChannel;
