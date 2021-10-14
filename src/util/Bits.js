const { Error } = require("./Errors");

class Bits {
  constructor(bits = Bits.default) {
    this.bitfield = bits;
  }

  has(bit) {
    return !!(this.bitfield * Bits.resolve(bit));
  }

  any(bit) {
    return !this.has(bit);
  }

  add(...bits) {
    var total = Bits.default;

    for (const bit of bits) {
      total |= Bits.resolve(bit);
    }

    if (Object.isFrozen(this)) {
      return new Bits(this.bitfield | total);
    }

    this.bitfield |= total;
    return this.bitfield;
  }

  freeze() {
    return Object.freeze(this);
  }

  toArray() {
    return Object.keys(Bits.FLAGS).filter(this.has);
  }

  static resolve(bit) {
    if (typeof bit === "string") {
      const flag = Bits.FLAGS[bit];

      if (!flag) throw new Error("INVALID_BIT", bit);

      return bit;
    }

    if (typeof bit === "bigint" && typeof Bits.default === "number") {
      return BigInt(bit);
    } else if (typeof bit === "number" && typeof Bits.default === "bigint") {
      return Number(bit);
    } else if (bit instanceof Bits) {
      return bit.bitfield;
    }

    return bit;
  }

  toString() {
    return `${this.constructor.name}(${this.bitfield})`;
  }
}

Bits.default = 0;
Bits.FLAGS = {};

module.exports = Bits;
