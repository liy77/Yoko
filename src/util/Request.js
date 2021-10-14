const discord_request = require("discord-request");
const { Error } = require("./Errors");

module.exports.create = async (
  endpoint,
  options = {
    method: "GET",
    parseHeaders: true,
    body: undefined,
    auth: undefined,
  },
  headers = {}
) => {
  if (!options.auth) throw new Error("INVALID_TOKEN");

  if (options.parseHeaders || options.parseHeaders === undefined) {
    headers = Object.assign(
      {
        Authorization: `Bot ${options.auth.replace(/^Bot\s*/i, "")}`,
        "Content-Type": "application/json",
        "User-Agent": `DiscordBot (https://github.com/JustAWaifuHunter/Yoko, ${
          require("../../package.json").version
        })`,
      },
      headers
    );
  }

  const requester = new discord_request(options.auth, {
    headers,
  });

  const res = await requester
    .request(endpoint, {
      auth: true,
      body: options.body,
      method: options.method ?? "GET",
    })
    .catch((err) => {
      throw new Error("HTTPS_ERROR", err);
    });

  return checkStatus(res, endpoint, options.method, options.body);
};

const checkStatus = (json, url, method, body) => {
  if (json.message || json.code) {
    throw new Error("DISCORD_API_ERROR", json.message, url, method, body);
  }
  return json;
};
