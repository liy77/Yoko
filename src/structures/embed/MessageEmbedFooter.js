module.exports = class MessageEmbedFooter {
  constructor(data = {}) {
    this.text = data.text;
    this.icon_url = data.iconURL;
    this.proxy_icon_url = data.proxyIconURL;
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
};
