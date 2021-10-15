const { ComponentTypes } = require("../../constants/Constants");
const MessageButton = require("./MessageButton");
const MessageComponent = require("./MessageComponent");
const MessageSelectMenu = require("./select-menu/MessageSelectMenu");

module.exports = class MessageActionRow extends MessageComponent {
  constructor(data = {}) {
    super(ComponentTypes["ACTION_ROW"]);

    this.components = data.components
      ? data.components.map((component) =>
          MessageActionRow.transform(component)
        )
      : [];
  }

  addComponent(component) {
    this.components.push(MessageActionRow.transform(component));
    return this;
  }

  addComponents(...components) {
    for (const component of components) {
      this.addComponent(component);
    }

    return this;
  }

  static transform(component) {
    switch (component.type) {
      case ComponentTypes["BUTTON"]:
        return new MessageButton(component);
      case ComponentTypes["SELECT_MENU"]:
        return new MessageSelectMenu(component);
      default:
        return component;
    }
  }
};
