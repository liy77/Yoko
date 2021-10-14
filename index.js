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
  User: require("./src/structures/User"),
  UserFlags: require("./src/structures/UserFlags"),
  Message: require("./src/structures/Message"),
  TextBasedChannel: require("./src/structures/channels/TextBasedChannel"),
  Channel: require("./src/structures/channels/Channel"),
  DMChannel: require("./src/structures/channels/DMChannel"),
};
