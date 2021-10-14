const Base = require("../Base");

module.exports = class TextBasedChannel extends Base {
  postMessage(options = {}) {
    const { resolveAPIMessageContent } = require("../../client/rest/Rest");
    options = resolveAPIMessageContent(options);
    return this.client.rest.postMessage(this.id, options);
  }

  static addToClass(target, ...props) {
    for (const prop of props) {
      Object.defineProperty(target.prototype, prop, {
        value: TextBasedChannel.prototype[prop],
      });
    }
  }
};
