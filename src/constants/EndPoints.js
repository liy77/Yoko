module.exports.CHANNEL_MESSAGES = (channel, message) => {
  return `/channels/${channel}/messages${message ? `/${message}` : ""}`;
};

module.exports.MESSAGE_LINK = (guildID, channelID, messageID) => {
  return `https://discord.com/channels/${guildID}/${channelID}/${messageID}`;
};

module.exports.DELETE_CHANNEL = (channelID) => {
  return `channels/${channelID}`;
};

module.exports.CREATE_DM = `/users/@me/channels`;

module.exports.CDN = {
  DEFAULT_URL: "https://cdn.discordapp.com",
  USER_AVATAR_URL: (
    userID,
    hash,
    { size = "2048", dynamic = false, format = "png" }
  ) => {
    return `${this.CDN.DEFAULT_URL}/avatars/${userID}/${hash}.${
      hash.startsWith("a_") ? (dynamic ? "gif" : format) : format
    }?size=${size}`;
  },

  USER_BANNER_URL: (
    userID,
    hash,
    { size = "2048", dynamic = false, format = "png" }
  ) => {
    return `${this.CDN.DEFAULT_URL}/banners/${userID}/${hash}.${
      hash.startsWith("a_") ? (dynamic ? "gif" : format) : format
    }?size=${size}`;
  },
  DEFAULT_USER_AVATAR_URL: (discriminator) => {
    return `${this.CDN.DEFAULT_URL}/embed/avatars/${discriminator % 5}.png`;
  },

  MEMBER_AVATAR_URL: (
    guildID,
    userID,
    hash,
    { size = "2048", dynamic = false, format = "png" }
  ) => {
    return `${
      this.CDN.DEFAULT_URL
    }/guilds/${guildID}/users/${userID}/avatars/${hash}.${
      hash.startsWith("a_") ? (dynamic ? "gif" : format) : format
    }?size=${size}`;
  },
};
