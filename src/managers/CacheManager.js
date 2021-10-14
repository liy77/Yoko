const Collection = require("collection");
const Base = require("../structures/Base");
const BaseManager = require("./BaseManager");

module.exports = class CacheManager extends BaseManager {
  constructor(client, base = Base, limit = Infinity) {
    super(client);
      this.cache = new Collection(base, limit);
      
      this.cache.delete()
  }

  fetch(id) {
    return this.cache.get(id);
  }

  forge(id, ...props) {
    return this.cache.add({ id, ...props });
  }

  _add(item) {
    return this.cache.add(item);
  }
};
