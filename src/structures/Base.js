const Utils = require("../util/Utils");

module.exports = class Base {
  constructor(id, client) {
    this.id = id;
    this.client = client;
  }

  get createdTimestamp() {
    return Base.createdTimestamp(this.id);
  }

  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  toString() {
    return `${this.constructor.name}(${this.id})`;
  }

  clone() {
    return Object.assign(Object.create(this), this);
  }

  toJSON(props = []) {
    if (this.id) {
      props.push("id", "createdAt", "createdTimestamp");
    }

    return Utils.toJSON(this, props);
  }

  static createdTimestamp(id) {
    return Math.round(id / 4194304) + 1420070400000;
  }
};
