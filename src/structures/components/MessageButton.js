const { ButtonStyles, ComponentTypes } = require("../../constants/Constants");
const MessageComponent = require("./MessageComponent");

module.exports = class MessageButton extends MessageComponent {
  constructor(data = {}) {
    super(ComponentTypes["BUTTON"]);

    this.url = data.url ?? null;
    this.label = data.label ?? null;
    this.style = MessageButton.resolveStyle(data.style);
    this.custom_id = data.custom_id ?? data.customID ?? null;
    this.disabled = data.disabled ?? false;
    this.emoji = data.emoji;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setLabel(label) {
    this.label = label;
    return this;
  }

  setStyle(style) {
    this.style = MessageButton.resolveStyle(style);
    return this;
  }

  setDisabled(disabled = null) {
    this.disabled = disabled;
    return this;
  }

  setCustomID(customID) {
    this.custom_id = customID;
    return this;
  }

  setEmoji(emoji) {
    this.emoji = emoji;
    return this;
  }

  getCustomID() {
    return this.custom_id;
  }

  static resolveStyle(style) {
    if (typeof style === "string") {
      return ButtonStyles[style];
    } else {
      return style;
    }
  }
};
