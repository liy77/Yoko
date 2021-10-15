const { ComponentTypes } = require("../../constants/Constants");

module.exports = class MessageComponent {
  constructor(type) {
    this.type = ComponentTypes[typeof type === "string" ? ComponentTypes[type] : type];
  }
};
