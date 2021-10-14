# Yoko [WIP]

NodeJS Discord API Wrapper

## Requirements:

NodeJS v16.6+: [Download](https://nodejs.org/en/download/current/)

Git: [Download](https://git-scm.com/downloads)

Discord-Request: `npm i JustAWaifuHunter/requester`

Collection: `npm i JustAWaifuHunter/collection#pelicano`

Ws: `npm i ws`

## Optional:

ErlPack: `npm i erlpack`

Zlib-Sync: `npm i zlib-sync`

BufferUtil: `npm i bufferutil`

Utf8Validate: `npm i utf-8-validate`

## Example

```js
const Yoko = require("yoko");

const client = new Yoko.Client();

client.setIntents([Yoko.Intents.default]); // client.intents = Yoko.Intents.default

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand() && interaction.command.name === "ping") {
    interaction.reply("pong!");
  }
});

client.connect("BOT TOKEN");
```
