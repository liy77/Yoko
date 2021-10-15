const { User } = require("../../..");
const BaseAction = require("./BaseAction");

module.exports = class readyAction extends BaseAction {
  handle(data) {
    this.client.user = new User(data.user, this.client);
  }
};
