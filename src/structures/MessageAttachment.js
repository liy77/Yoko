const fs = require("node:fs");

module.exports = class MessageAttachment {
  constructor(data) {
    if (typeof data.attachment === "string") {
      this.attachment = fs.readFileSync(data.attachment);
    } else {
      this.attachment = data.attachment ?? null;
    }

    this.name = data.name;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setAttachment(attach) {
    this.attachment = attach;
    return this;
  }
};
