const { MessageTypes } = require("../constants/Constants");
const { MESSAGE_LINK } = require("../constants/EndPoints");
const Base = require("./Base");
const MessageEmbed = require("./embed/MessageEmbed");
const User = require("./User");

module.exports = class Message extends Base {
  guild = null;
  constructor(data, client) {
    super(data.id, client);
    this.type = MessageTypes[data.type];
    this.timestamp = Date.parse(data.timestamp);
    this.channel = this.client.channels.cache.get(data.channel_id);
    this.guildID = data.guild_id;
    this.tts = data.tts;
    this.content = data.content;

    this.author =
      this.client.users.cache.get(data.author.id) ?? new User(data.author);
    
    if (this.guildID) {
      this.guild = this.client.guilds.cache.get(this.guildID);
    }

    if (data.member && this.guild) {
      this.member = this.guild.members.cache.get(data.member.id);
    }

    if (data.embeds && data.embeds.length) {
      this.embeds = data.embeds.map((embed) => new MessageEmbed(embed));
    }
  }

  get link() {
    if (!this.channel) return null;
    return MESSAGE_LINK(this.guildID ?? "@me", this.channel.id, this.id);
  }
};
