const { TypeError } = require("../../util/Errors");

module.exports = class MessageEmbedImage {
  constructor(data = {}) {
    this.url = data.url ?? null;
    this.proxy_url = data.proxyURL ?? null;
    this.height = data.height ?? null;
    this.width = data.width ?? null;

    this._checkInteger();
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setProxyURL(url) {
    this.proxy_url = url;
    return this;
  }

  setHeight(height = null) {
    this._checkInteger(height);
    this.height = height;
    return this;
  }

  setWidth(width = null) {
    this._checkInteger(null, width);
    this.width = width;
    return this;
  }

  get proxyURL() {
    return this.proxy_url;
  }

  _checkInteger() {
    if (this.height && !Number.isInteger(this.height)) {
      throw new TypeError("INVALID_OPTION", "height", "a integer.");
    }

    if (this.width && !Number.isInteger(this.width)) {
      throw new TypeError("INVALID_OPTION", "width", "a integer.");
    }
  }
};
