const { createEnum, arrayKeyMirror } = require("../util/Utils");

module.exports.apiVersion = 9;

module.exports.Gateway = (version = this.apiVersion, encoding = "json") => {
  return `wss://gateway.discord.gg/?v=${version}&encoding=${encoding}`;
};

module.exports.requestMethods = {
  get: "GET",
  patch: "PATCH",
  delete: "DELETE",
  put: "PUT",
  post: "POST",
};

module.exports.ClientEvents = {
  // Connection
  READY: "ready",
  SHARD_ERROR: "shardError",
  SHARD_READY: "shardReady",
  SHARD_DISCONNECT: "shardDisconnect",
  SHARD_RECONNECTING: "shardReconnecting",
  RAW: "rawWs",

  // Message
  MESSAGE_CREATE: "messageCreate",
  MESSAGE_DELETE: "messageDelete",
  MESSAGE_UPDATE: "messageUpdate",
  MESSAGE_BULK_DELETE: "messageDeleteBulk",
  MESSAGE_REACTION_ADD: "messageReactionAdd",
  MESSAGE_REACTION_REMOVE: "messageReactionRemove",
  MESSAGE_REACTION_REMOVE_ALL: "messageReactionRemoveAll",
  MESSAGE_REACTION_REMOVE_EMOJI: "messageReactionRemoveEmoji",

  // Thread
  THREAD_CREATE: "threadCreate",
  THREAD_DELETE: "threadDelete",
  THREAD_UPDATE: "threadUpdate",
  THREAD_LIST_SYNC: "threadListSync",
  THREAD_MEMBER_UPDATE: "threadMemberUpdate",
  THREAD_MEMBERS_UPDATE: "threadMembersUpdate",

  // Guild
  GUILD_CREATE: "guildCreate",
  
  // Util
  DEBUG: "debug",
};

module.exports.ShardEvents = {
  CLOSE: "close",
  READY: "ready",
  RESUMED: "resumed",
  INVALID_SESSION: "invalidSession",
  DISCONNECT: "disconnect",
  ALL_READY: "allReady",
};

module.exports.wsCodes = {
  1000: "WS_CLOSE_REQUESTED",
  4004: "TOKEN_INVALID",
  4010: "SHARDING_INVALID",
  4011: "SHARDING_REQUIRED",
  4013: "INVALID_INTENTS",
  4014: "DISALLOWED_INTENTS",
};

module.exports.UNRECOVERABLE_CLOSE_CODES = Object.keys(this.wsCodes)
  .slice(1)
  .map(Number);

module.exports.opCodes = createEnum([
  "DISPATCH",
  "HEARTBEAT",
  "IDENTIFY",
  "PRESENCE_UPDATE",
  "VOICE_STATE_UPDATE",
  "VOICE_GUILD_PING",
  "RESUME",
  "RECONNECT",
  "REQUEST_GUILD_MEMBERS",
  "INVALID_SESSION",
  "HELLO",
  "HEARTBEAT_ACK",
]);

module.exports.ShardStatus = createEnum([
  "READY",
  "CONNECTING",
  "RECONNECTING",
  "IDLE",
  "NEARLY",
  "DISCONNECTED",
  "RECONNECTING",
  "WAITING_FOR_GUILDS",
  "IDENTIFYING",
  "RESUMING",
]);

module.exports.ChannelTypes = createEnum([
  "GUILD_TEXT",
  "DM",
  "GUILD_VOICE",
  "GROUP_DM",
  "GUILD_CATEGORY",
  "GUILD_NEWS",
  "GUILD_STORE",
  "GUILD_NEWS_THREAD",
  "GUILD_PUBLIC_THREAD",
  "GUILD_PRIVATE_THREAD",
  "GUILD_STATE_VOICE",
]);

module.exports.MessageTypes = createEnum([
  "DEFAULT",
  "RECIPIENT_ADD",
  "RECIPIENT_REMOVE",
  "CALL",
  "CHANNEL_NAME_CHANGE",
  "CHANNEL_ICON_CHANGE",
  "CHANNEL_PINNED_MESSAGE",
  "GUILD_MEMBER_JOIN",
  "USER_PREMIUM_GUILD_SUBSCRIPTION",
  "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1",
  "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2",
  "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3",
  "CHANNEL_FOLLOW_ADD",
  "GUILD_DISCOVERY_DISQUALIFIED",
  "GUILD_DISCOVERY_REQUALIFIED",
  "GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING",
  "GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING",
  "THREAD_CREATED",
  "REPLY",
  "CHAT_INPUT_COMMAND",
  "THREAD_STARTER_MESSAGE",
  "GUILD_INVITE_REMINDER",
  "CONTEXT_MENU_COMMAND",
]);

module.exports.wsEvents = arrayKeyMirror([
  "READY",
  "RESUMED",
  "APPLICATION_COMMAND_CREATE",
  "APPLICATION_COMMAND_DELETE",
  "APPLICATION_COMMAND_UPDATE",
  "GUILD_CREATE",
  "GUILD_DELETE",
  "GUILD_UPDATE",
  "INVITE_CREATE",
  "INVITE_DELETE",
  "GUILD_MEMBER_ADD",
  "GUILD_MEMBER_REMOVE",
  "GUILD_MEMBER_UPDATE",
  "GUILD_MEMBERS_CHUNK",
  "GUILD_INTEGRATIONS_UPDATE",
  "GUILD_ROLE_CREATE",
  "GUILD_ROLE_DELETE",
  "GUILD_ROLE_UPDATE",
  "GUILD_BAN_ADD",
  "GUILD_BAN_REMOVE",
  "GUILD_EMOJIS_UPDATE",
  "CHANNEL_CREATE",
  "CHANNEL_DELETE",
  "CHANNEL_UPDATE",
  "CHANNEL_PINS_UPDATE",
  "MESSAGE_CREATE",
  "MESSAGE_DELETE",
  "MESSAGE_UPDATE",
  "MESSAGE_DELETE_BULK",
  "MESSAGE_REACTION_ADD",
  "MESSAGE_REACTION_REMOVE",
  "MESSAGE_REACTION_REMOVE_ALL",
  "MESSAGE_REACTION_REMOVE_EMOJI",
  "THREAD_CREATE",
  "THREAD_UPDATE",
  "THREAD_DELETE",
  "THREAD_LIST_SYNC",
  "THREAD_MEMBER_UPDATE",
  "THREAD_MEMBERS_UPDATE",
  "USER_UPDATE",
  "PRESENCE_UPDATE",
  "TYPING_START",
  "VOICE_STATE_UPDATE",
  "VOICE_SERVER_UPDATE",
  "WEBHOOKS_UPDATE",
  "INTERACTION_CREATE",
  "STAGE_INSTANCE_CREATE",
  "STAGE_INSTANCE_UPDATE",
  "STAGE_INSTANCE_DELETE",
  "GUILD_STICKERS_UPDATE",
]);

module.exports.NitroTypes = createEnum(["NONE", "NITRO_CLASSIC", "NITRO"]);
