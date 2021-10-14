module.exports.kCode = Symbol("code");

module.exports.create = (Base) => {
  return class YokoError extends Base {
    constructor(key, ...args) {
      super(module.exports.createMessage(key, ...args));
      this[module.exports.kCode] = key;

      if (Error.captureStackTrace) Error.captureStackTrace(this, YokoError);
    }

    get code() {
      return this[module.exports.kCode];
    }

    get name() {
      return `${super.name} [${this[module.exports.kCode]}]`;
    }
  };
};

module.exports.createMessage = (key, ...args) => {
  if (typeof key !== "string") throw new TypeError("Key must be a string.");

  const msg = module.exports.Messages[key];

  if (!msg) throw new Error("Invalid key provided.");

  if (typeof msg === "function") return msg(...args);
  if (!args?.length || typeof msg === "string") return msg;

  args.unshift();
  return String(...args);
};

module.exports.Messages = {
  INVALID_TOKEN: "Invalid token provided.",
  SHARDING_INVALID_EVAL: "Script to evaluate must be a function.",
  SHARDING_NO_SHARDS: "No shards have been spawned.",
  SHARDING_IN_PROCESS: "Shards are still being spawned.",
  CLUSTER_INVALID: "Invalid cluster settings were provided.",
  CLUSTER_NO_CLUSTERS: "No clusters have been spawned.",
  CLUSTER_IN_PROCESS: "Clusters are still being spawned.",
  CLUSTER_INVALID_EVAL: "Script to evaluate must be a function",
  CLUSTER_IS_PRIMARY:
    "Clusters cannot be spawned from a Primary cluster manager.",
  INVALID_INTENTS: "Invalid intents provided.",
  INVALID_MESSAGE_CONTENT: "Invalid Message Content.",

  HTTPS_ERROR: (err) => err,
  INVALID_BIT: (bit) => `Bit ${bit} is invalid.`,
  INVALID_OPTION: (prop, must) => `The ${prop} option must be ${must}`,
  HARDING_ALREADY_SPAWNED: (count) => `Already spawned ${count} shards.`,
  SHARDING_INVALID_SHARD_ID: (id) => `Shard ${id} does not exists.`,
  SHARDING_PROCESS_EXISTS: (id) => `Shard ${id} already has an active process.`,
  SHARDING_WORKER_EXISTS: (id) => `Shard ${id} already has an active worker.`,
  SHARDING_READY_TIMEOUT: (id) =>
    `Shard ${id}'s Client took too long to become ready.`,
  SHARDING_READY_DISCONNECTED: (id) =>
    `Shard ${id}'s Client disconnected before becoming ready.`,
  SHARDING_READY_DIED: (id) =>
    `Shard ${id}'s process exited before its Client became ready.`,
  SHARDING_NO_CHILD_EXISTS: (id) =>
    `Shard ${id} has no active process or worker.`,
  SHARDING_SHARD_MISCALCULATION: (shard, guild, count) =>
    `Calculated invalid shard ${shard} for guild ${guild} with ${count} shards.`,

  CLUSTER_INVALID_CLUSTER_ID: (id) => `Cluster ${id} does not exists.`,
  CLUSTER_ALREADY_SPAWNED: (count) => `Already spawned ${count} clusters.`,
  CLUSTER_PROCESS_EXISTS: (id) =>
    `Cluster ${id} already has an active process.`,
  CLUSTER_WORKER_EXISTS: (id) => `Cluster ${id} already has an active worker.`,
  CLUSTER_READY_TIMEOUT: (id) =>
    `Cluster ${id}'s Client took too long to become ready.`,
  CLUSTER_READY_DISCONNECTED: (id) =>
    `Cluster ${id}'s Client disconnected before becoming ready.`,
  CLUSTER_READY_DIED: (id) =>
    `Cluster ${id}'s process exited before its Client became ready.`,
  CLUSTER_NO_CHILD_EXISTS: (id) =>
    `Cluster ${id} has no active process or worker.`,
  CLUSTER_CLUSTER_MISCALCULATION: (cluster, guild, clusterCount, shardCount) =>
    `Calculated invalid cluster ${cluster} for guild ${guild} with ${clusterCount} clusters and ${shardCount} shards.`,
  CLUSTER_SHARD_MISCALCULATION: (shard, guild, clusterCount, shardCount) =>
    `Calculated invalid shard ${shard} for guild ${guild} with ${clusterCount} clusters and ${shardCount} shards.`,

  DISCORD_API_ERROR: (message, url, method, body) =>
    `${message}\nEndPoint: ${url}\nMethod: ${method}${
      body ? `\nBody: ${body}` : ""
    }`,
};

module.exports.addMessage = (key, value) => {
  module.exports.Messages[key] = value;
};

module.exports.Error = this.create(Error);
module.exports.TypeError = this.create(TypeError);
module.exports.RangeError = this.create(RangeError);
