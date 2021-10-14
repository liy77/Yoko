const MemberManager = require("../managers/MemberManager");
const Base = require("./Base");

module.exports = class Guild extends Base {
  constructor(data, client) {
    super(data.id, client);

    this.name = data.name;
    this.unavaible = !!data.unavaible;
    this.applicationID = data.application_id;
    this.icon = data.icon;
    this.shard = this.client.ws.shards.get(
      this.client._guildShardsMap[data.id]
    );

    this.members = new MemberManager(this.client, Infinity);
  }
};
