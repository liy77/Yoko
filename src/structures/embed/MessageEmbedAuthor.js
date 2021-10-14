module.exports = class MessageEmbedAuthor {
  constructor(data = {}) {
    this.name = data.name ?? null;
    this.url = data.url ?? null;
    this.icon_url = data.iconURL ?? null;
    this.proxy_icon_url = data.proxyIconURL ?? null;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setIconURL(url) {
    this.icon_url = url;
    return this;
  }

  setProxyIconURL(url) {
    this.proxy_icon_url = url;
    return this;
  }

  get iconURL() {
    return this.icon_url;
  }

  get proxyIconURL() {
    return this.proxy_icon_url;
  }
};
