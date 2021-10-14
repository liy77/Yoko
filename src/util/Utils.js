const { create } = require("./Request");
const fs = require("node:fs");
const p = require("node:path");
const Module = require("node:module");

module.exports.sleep = (time = 5_000) =>
  new Promise((res) => setTimeout(res, time));

module.exports.getRecommendedShards = (
  token,
  { guildsPerShard = 1_000, multipleOf = 1 } = {}
) => {
  return create("/gateway/bot", {
    auth: token,
    method: "GET",
  }).then(
    (data) =>
      Math.ceil((data.shards * (1_000 / guildsPerShard)) / multipleOf) *
      multipleOf
  );
};

module.exports.chunk = (arr, size) => {
  var result = [],
    dom = arr.length / size;

  while (arr.length > 0) {
    result.push(arr.splice(0, Math.ceil(dom)));
  }

  return result;
};

module.exports.createEnum = (arr = []) => {
  var enumerable = {};
  for (const [index, value] of arr.entries()) {
    enumerable[index] = value;
    enumerable[value] = index;
  }
  return enumerable;
};

module.exports.arrayKeyMirror = (arr = []) => {
  var obj = {};
  for (const value of arr) {
    obj[value] = value;
  }
  return obj;
};

module.exports.erlpack = (() => {
  const decoder = new TextDecoder();

  var Erlpack,
    encoding = "json";

  try {
    Erlpack = require("erlpack");
    encoding = "etf";
  } catch {
    encoding = "json";

    Erlpack = {
      pack: JSON.stringify,
    };

    Erlpack.unpack = (data, type = encoding) => {
      if (type === "json") {
        if (typeof data !== "string") {
          data = decoder.decode(data);
        }
        return JSON.parse(data);
      }

      if (!Buffer.isBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      }

      return erlpack.unpack(data);
    };
  }

  return {
    encoding,
    ...Erlpack,
  };
})();

module.exports.zlib = (() => {
  var zlib;

  try {
    zlib = require("zlib-sync");
  } catch {
    zlib = require("pako");
  }

  return zlib;
})();

module.exports.importFS = (path, ignoredFiles = []) => {
  const resolvedPath = p.resolve(__dirname, "..", path);

  const files = fs.readdirSync(resolvedPath);

  const requires = files.map((file) => [
    file,
    () => require(p.join(resolvedPath, file)),
  ]);

  const mods = [];
  for (const [file, mod] of requires) {
    if (ignoredFiles.includes(file)) continue;
    mods.push(mod());
  }

  return mods;
};

module.exports.runAsync = (code) => {
  (async () => await code())();
};

module.exports.toJSON = (target, props) => {
  const json = {};

  for (const prop of props) {
    const value = target[prop];
    const type = typeof value;

    if (value === undefined) {
      continue;
    } else if (
      (type !== "object" && type !== "function" && type !== "bigint") ||
      value === null
    ) {
      json[prop] = value;
    } else if (value.toJSON) {
      json[prop] = value.toJSON();
    } else if (value.values) {
      json[prop] = [...value.values()];
    } else if (type === "bigint") {
      json[prop] = value.toString();
    } else if (type === "object") {
      json[prop] = value;
    }
  }

  return json;
};

module.exports.createDefaultOptions = (defaultOptions, options) => {
  const dp = {};

  if (typeof defaultOptions === "string" && defaultOptions.startsWith("all")) {
    var trueOrFalse = defaultOptions.split("all")[1];

    if (trueOrFalse === "True" || trueOrFalse === "False") {
      trueOrFalse = trueOrFalse === "True";
    } else if (!isNaN(Number(trueOrFalse))) {
      trueOrFalse = Number(trueOrFalse);
    }

    defaultOptions = {};

    Object.keys(options).forEach((key) => {
      defaultOptions[key] = trueOrFalse;
    });
  }

  Object.entries(options).forEach(([key, value]) => {
    dp[key] = typeof value === "undefined" ? defaultOptions[key] : value;
  });

  return Object.assign(dp, options);
};

module.exports.capitalize = (str = "") => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

module.exports.resolveAPIEventName = (eventName) => {
  const split = eventName.split("_");

  var resolvedName = "";
  for (const name of split) {
    if (name === split[0]) resolvedName += name.toLowerCase();
    else {
      resolvedName += this.capitalize(name);
    }
  }

  return resolvedName;
};
