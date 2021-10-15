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

  static isInstanceofEmbedField(obj) {
    if (obj instanceof MessageEmbedField) {
      return true;
    } else if (obj.name || obj.value) {
      return true;
    } else {
      return false;
    }
  }
};
