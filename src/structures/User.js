const { NitroTypes } = require("../constants/Constants");
const { CDN } = require("../constants/EndPoints");
const Base = require("./Base");
const UserFlags = require("./UserFlags");

module.exports = class User extends Base {
  constructor(data, client) {
    super(data.id, client);

    this.bot = data.bot;
    this.avatar = data.avatar;
    this.banner = data.banner;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.flags = new UserFlags(data.public_flags);
    this.accentColor = data.accent_color;
    this.premiumType = NitroTypes[data.premium_type] ?? "NONE";
    this.system = !!data.system;
  }

  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  get partial() {
    return typeof this.username !== "string";
  }

  get hexAccentColor() {
    if (typeof this.accentColor !== "number") return this.accentColor;
    return `#${this.accentColor.toString(16).padStart(6, "0")}`;
  }

  avatarURL({ size = "2048", dynamic = false, format = "png" }) {
    if (!this.avatar) return null;
    return CDN.USER_AVATAR_URL(this.id, this.avatar, { size, dynamic, format });
  }

  defaultAvatarURL() {
    return CDN.DEFAULT_USER_AVATAR_URL(this.discriminator);
  }

  bannerURL({ size = "2048", dynamic = false, format = "png" }) {
    if (!this.banner) return null;
    return CDN.USER_BANNER_URL(this.id, this.banner, { size, dynamic, format });
  }

  createDM() {
    return this.client.rest.createDM(this.id);
  }

  toString() {
    return `<@${this.id}>`;
  }
};
