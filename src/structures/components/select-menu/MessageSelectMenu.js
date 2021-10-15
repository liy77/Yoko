const { ComponentTypes } = require("../../../constants/Constants");
const MessageComponent = require("../MessageComponent");
const MessageSelectMenuOption = require("./MessageSelectMenuOption");

module.exports = class MessageSelectMenu extends MessageComponent {
  constructor(data = {}) {
    super(ComponentTypes["SELECT_MENU"]);

    this.custom_id = data.custom_id ?? data.customID ?? null;
    this.placeholder = data.placeholder;
    this.min_values = data.min_values ?? data.minValues ?? null;
    this.max_values = data.max_values ?? data.maxValues ?? null;
    this.disabled = data.disabled;

    this.options = [];
    if (Array.isArray(data.options)) {
      this.options = data.options.map(
        (option) => new MessageSelectMenuOption(option)
      );
    } else if (data.options) {
      this.options.push(new MessageSelectMenuOption(data.options));
    }
  }

  setCustomID(customID) {
    this.custom_id = customID;
    return this;
  }

  setPlaceholder(placeholder) {
    this.placeholder = placeholder;
    return this;
  }

  setMinValues(minValues) {
    this.min_values = minValues;
    return this;
  }

  setMaxValues(maxValues) {
    this.max_values = maxValues;
    return this;
  }

  setDisabled(disabled = null) {
    this.disabled = disabled;
    return this;
  }

  addOption(option) {
    this.options.push(
      new MessageSelectMenuOption({
        label: option.label,
        value: option.value,
        description: option.description,
        emoji: option.emoji,
        default: option.default,
      })
    );
    return this;
  }

  addOptions(...options) {
    for (const option of options) {
      this.addOption(option);
    }

    return this;
  }

  getCustomID() {
    return this.custom_id;
  }

  getMinValues() {
    return this.min_values;
  }

  getMaxValues() {
    return this.max_values;
  }
};
