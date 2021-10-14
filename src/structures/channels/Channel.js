const { ChannelTypes } = require("../../constants/Constants");
const Base = require("../Base");

module.exports = class Channel extends Base {
  constructor(data, client) {
    super(data.id, client);

    this.type = ChannelTypes[data.type] ?? "UNKNOWN";

    this.deleted = false;
  }

  fetch() {
    return this.client.channels.fetch(this.id);
  }

  delete(reason) {
    return this.client.rest.deleteChannel(this.id, reason);
  }

  toString() {
    return `<#${this.id}>`;
  }

  toJSON() {
    return super.toJSON(["type", "deleted"]);
  }

  static transform(data, client) {
    switch (data.type) {
      case ChannelTypes.DM:
        return new DMChannel(data, client);
      case ChannelTypes.GUILD_TEXT:
        return new TextChannel(data, client);
      default:
        return new Channel(data);
    }
  }
};

const DMChannel = require("../channels/DMChannel");
const TextChannel = require("./TextChannel");
