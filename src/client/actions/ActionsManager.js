const { importFS } = require("../../util/Utils");

module.exports = class ActionsManager {
  constructor(client) {
    this.client = client;

    const mods = importFS("./client/actions", ["BaseAction.js", "ActionsManager.js"]);

    for (const mod of mods) {
      this.addAction(mod);
    }
  }

  addAction(Action) {
    this[Action.name.replace(/Action$/, "")] = new Action(this.client);
  }

  async exec(ActionName, data, shard) {
    if (!this[ActionName]) return;
    await this[ActionName].handle(data, shard);
  }
};

// Based on Discord.js
