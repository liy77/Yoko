module.exports = class MessageEmbedField {
  constructor(data = {}) {
    this.name = data.name ?? null;
    this.value = data.value ?? null;
    this.inline = this.setInline(data.inline);
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  setInline(inline = false) {
    this.inline = inline;
  }
};
