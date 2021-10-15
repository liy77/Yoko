module.exports = class MessageSelectMenuOption {
  constructor(data = {}) {
    this.label = data.label ?? null;
    this.value = data.value ?? null;
    this.description = data.description ?? null;
    this.emoji = data.emoji ?? null;
    this.default = data.default ?? null;
  }

  setLabel(label) {
    this.label = label;
    return this;
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setEmoji(emoji) {
    this.emoji = emoji;
    return this;
  }

  setDefault(def) {
    this.default = def;
    return this;
  }
};
