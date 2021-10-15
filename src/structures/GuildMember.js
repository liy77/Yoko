const { CDN } = require("../constants/EndPoints");
const Base = require("./Base");
const User = require("./User");

module.exports = class GuildMember extends Base {
  constructor(data, guild, client) {
    super(data.id, client);

    this.guilds = guild;
    this.nickname = data.nick ?? null;
    this.avatar = data.avatar ?? null;
    this.user =
      client.users.cache.get(data.user.id) ?? new User(data.user, client);

    this.id = this.user.id;
  }

  displayName() {
    return this.nickname ?? this.user.username;
  }

  avatarURL({ size = "2048", dynamic = false, format = "png" }) {
    return CDN.MEMBER_AVATAR_URL(this.guild.id, this.user.id, this.avatar, {
      size,
      dynamic,
      format,
    });
  }
};
