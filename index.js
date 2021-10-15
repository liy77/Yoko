module.exports = {
  Client: require("./src/client/Client"),
  ClusterClient: require("./src/client/ClusterClient"),

  Rest: require("./src/client/rest/Rest"),

  WebSocketShard: require("./src/client/websocket/WebSocketShard"),
  WebSocketManager: require("./src/client/websocket/WebSocketManager"),

  ActionsManager: require("./src/client/actions/ActionsManager"),

  Bits: require("./src/util/Bits"),
  Request: require("./src/util/Request"),
  Intents: require("./src/util/Intents"),
  Errors: require("./src/util/Errors"),
  Utils: require("./src/util/Utils"),

  Constants: require("./src/constants/Constants"),

  Base: require("./src/structures/Base"),
  MessageEmbed: require("./src/structures/embed/MessageEmbed"),
  MessageEmbedAuthor: require("./src/structures/embed/MessageEmbedAuthor"),
  MessageEmbedField: require("./src/structures/embed/MessageEmbedField"),
  MessageEmbedFooter: require("./src/structures/embed/MessageEmbedFooter"),
  MessageEmbedImage: require("./src/structures/embed/MessageEmbedImage"),
  MessageEmbedProvider: require("./src/structures/embed/MessageEmbedProvider"),
  MessageEmbedThumbnail: require("./src/structures/embed/MessageEmbedThumbnail"),
  MessageEmbedVideo: require("./src/structures/embed/MessageEmbedVideo"),
  MessageAttachment: require("./src/structures/MessageAttachment"),
  MessageComponent: require("./src/structures/components/MessageComponent"),
  MessageButton: require("./src/structures/components/MessageButton"),
  MessageActionRow: require("./src/structures/components/MessageActionRow"),
  MessageSelectMenu: require("./src/structures/components/select-menu/MessageSelectMenu"),
  MessageSelectMenuOption: require("./src/structures/components/select-menu/MessageSelectMenuOption"),
  User: require("./src/structures/User"),
  UserFlags: require("./src/structures/UserFlags"),
  Message: require("./src/structures/Message"),
  TextBasedChannel: require("./src/structures/channels/TextBasedChannel"),
  Channel: require("./src/structures/channels/Channel"),
  DMChannel: require("./src/structures/channels/DMChannel"),
};
