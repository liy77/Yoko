module.exports = class MessageEmbedFooter {
  constructor(data = {}) {
    this.text = data.text ?? null;
    this.icon_url = data.icon_url ?? data.iconURL ?? null;
    this.proxy_icon_url = data.proxy_icon_url ?? data.proxyIconURL ?? null;
  }

  setText(text) {
    this.text = text;
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

  static isInstanceofEmbedFooter(obj) {
    if (obj instanceof MessageEmbedFooter) {
      return true;
    } else if (obj.text) {
      return true;
    } else {
      return false;
    }
  }
};
