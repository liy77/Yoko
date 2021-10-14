module.exports = class MessageEmbedProvider {
  constructor(data = {}) {
    this.name = data.name ?? null;
    this.url = data.url ?? null;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }
};
