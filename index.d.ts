import Collection from "collection";
import EventEmitter from "node:events";
import WebSocket from "ws";

export type RequestMethods = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
export type snowflake = `${number}`;
export type toJSON = Record<any, any>;
export type ImageFormat = "png" | "webp" | "jpg" | "jpeg" | "gif";

export interface RateLimitOptions {
  remaining: number;
  queue: any[];
  total: number;
  timer: null;
  time: number;
}

export interface ClientOptions {
  token?: string;
  intents?: number | number[];
  api?: {
    version?: number;
    compress?: boolean;
  };
  shardList?: number[] | "auto";
  totalShards?: number | "auto";
}

export interface ClientEvents {
  messageCreate: [message: Message];
  ready: [];
}

export class Base {
  constructor(public id: snowflake, public client: Client);

  get createdTimestamp(): number;
  get createdAt(): Date;
  toString(): string;

  clone(): Base;
  toJSON(props = []): toJSON;

  static createdTimestamp(id: snowflake): number;
}

export class User extends Base {
  username: string;
  discriminator: string;
  banner?: string;
  avatar?: string;
  constructor(data, public client);

  get tag(): string;
  get partial(): boolean;
  toString(): string;
  avatarURL(options?: {
    size: "128" | "2048";
    dynamic: boolean;
    format: ImageFormat;
  }): string;
  defaultAvatarURL(): string;
  bannerURL(options?: {
    size: "512" | "2048";
    dynamic: boolean;
    format: ImageFormat;
  });
}

export class Message extends Base {
  content: string;
  author: User;
  constructor(data, public client);

  get link(): string | null;
}

export class Rest {
  constructor(token?: string, intents?: number);
  makeRequest(
    endpoint: string,
    method: RequestMethods = "GET",
    body: any = {}
  ): Promise<any>;

  makeIdentify(
    sharding?: {
      totalShards: number;
      shard: number;
    },
    presence: any
  ): {
    token: string;
    properties: {
      $os: NodeJS.Platform;
      $browser: string;
      $device: string;
    };
    compress: string | boolean;
    large_threshold: number;
    shard: number[];
    presence: any;
    intents: number;
  };

  setToken(token: string): void;

  setIntents(intents: number): void;

  static resolveToken(token: string): string;

  static RateLimit = class RateLimit {
    timeout?: NodeJS.Timeout;
    ratelimit: RateLimitOptions;

    constructor(options: RateLimitOptions);
    processQueue(): void;
    addToQueue(func: () => any, important: boolean = false): void;
    clear(): RateLimit;
  };
}

export namespace Constants {
  export const Gateway: (version?: number, encoding?: "json" | "etf") => string;

  export const ShardEvents: {
    CLOSE: "close";
    READY: "ready";
    RESUMED: "resumed";
    INVALID_SESSION: "invalidSession";
    DISCONNECT: "disconnect";
    ALL_READY: "allReady";
  };

  export const wsCodes: {
    1000: "WS_CLOSE_REQUESTED";
    4004: "TOKEN_INVALID";
    4010: "SHARDING_INVALID";
    4011: "SHARDING_REQUIRED";
    4013: "INVALID_INTENTS";
    4014: "DISALLOWED_INTENTS";
  };

  export const enum ShardStatus {
    READY = 0,
    CONNECTING = 1,
    RECONNECTING = 2,
    IDLE = 3,
    NEARLY = 4,
    DISCONNECTED = 5,
    RECONNECTING = 6,
    WAITING_FOR_GUILDS = 7,
    IDENTIFYING = 8,
    RESUMING = 9,
  }

  export const enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_STORE = 6,
    GUILD_NEWS_THREAD = 7,
    GUILD_PUBLIC_THREAD = 8,
    GUILD_PRIVATE_THREAD = 9,
    GUILD_STATE_VOICE = 10,
  }
}

export class WebSocketShard {
  connection?: WebSocket;
  ratelimit: typeof Rest.RateLimit;
  lastPingTimestamp?: number;
  ping: number;
  lastHeartbeatAcked: number;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  constructor(public manager: WebSocketManager, id: number);

  connect(): Promise<void>;

  debug(message: string): void;

  setHelloTimeout(time: number): void;

  sendHeartbeat(): void;

  ackHeartbeat(): void;

  send(data: any): void;

  checkReady(): void;

  identify(): void;

  disconnect(
    {
      closeCode,
      reset,
      emit,
      debug,
    }: {
      closeCode: number;
      reset: boolean;
      emit: boolean;
      debug: boolean;
    },
    reason?: string
  ): void;
}

export class WebSocketManager {
  shards: Collection<number, WebSocketShard>;
  get ping(): number;
  debug(message: string, shard: WebSocketShard);
  connect(): Promise<void>;
  createShards(): Promise<void>;
  checkShardsReady(): void;
}

export class Client extends EventEmitter {
  intents: number;
  readAy?: Date;
  token?: string;
  options: ClientOptions;
  constructor(options?: ClientOptions);

  setIntents(intents: number | number[]): number;
  connect(): Promise<string>;
  login(): Promise<string>;

  on<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => any
  ): Client;

  on<K extends keyof ClientEvents>(
    eventName: K,
    listener: (...args: ClientEvents[K]) => any
  ): Client;
}

export class Intents {
  static FLAGS = {
    GUILDS: 1 << 0,
    GUILD_MEMBERS: 1 << 1,
    GUILD_BANS: 1 << 2,
    GUILD_EMOJIS_AND_STICKERS: 1 << 3,
    GUILD_INTEGRATIONS: 1 << 4,
    GUILD_WEBHOOKS: 1 << 5,
    GUILD_INVITES: 1 << 6,
    GUILD_VOICE_STATES: 1 << 7,
    GUILD_PRESENCES: 1 << 8,
    GUILD_MESSAGES: 1 << 9,
    GUILD_MESSAGE_REACTIONS: 1 << 10,
    GUILD_MESSAGE_TYPING: 1 << 11,
    DIRECT_MESSAGES: 1 << 12,
    DIRECT_MESSAGE_REACTIONS: 1 << 13,
    DIRECT_MESSAGE_TYPING: 1 << 14,
  };

  static default =
    Intents.FLAGS.GUILDS |
    Intents.FLAGS.GUILD_MEMBERS |
    Intents.FLAGS.GUILD_WEBHOOKS |
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS;
}

export * from "./typings/extra";
