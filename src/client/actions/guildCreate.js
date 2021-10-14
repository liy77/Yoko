const { ClientEvents } = require("../../constants/Constants");
const Guild = require("../../structures/Guild");
const BaseAction = require("./BaseAction");

module.exports = class guildCreateAction extends BaseAction {
  async handle(data, shard) {
    this.client._guildShardsMap[data.id] = shard.id;
    const guild = new Guild(data, this.client);
    this.client.guilds._add(guild);

    const channels = await this.client.rest.getGuildChannels(data.id);

    channels.forEach((channel) => {
      this.client.channels.cache.set(channel.id, channel);
    });

    this.handleIfIsReady(
      () => this.client.emit(ClientEvents.GUILD_CREATE, guild),
      shard
    );
  }
};
