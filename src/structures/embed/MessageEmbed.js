const MessageEmbedAuthor = require("./MessageEmbedAuthor");
const MessageEmbedField = require("./MessageEmbedField");
const MessageEmbedFooter = require("./MessageEmbedFooter");
const MessageEmbedImage = require("./MessageEmbedImage");
const MessageEmbedProvider = require("./MessageEmbedProvider");
const MessageEmbedThumbnail = require("./MessageEmbedThumbnail");
const MessageEmbedVideo = require("./MessageEmbedVideo");

module.exports = class MessageEmbed {
  constructor(data = {}) {
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    this.url = data.url ?? null;
    this.timestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;

    this.author = data.author ? new MessageEmbedAuthor(data.author) : null;
    this.image = data.image ? new MessageEmbedImage(data.image) : null;
    this.video = data.video ? new MessageEmbedVideo(data.video) : null;
    this.footer = data.footer ? new MessageEmbedFooter(data.footer) : null;

    this.thumbnail = data.thumbnail
      ? new MessageEmbedThumbnail(data.thumbnail)
      : null;

    this.provider = data.provider
      ? new MessageEmbedProvider(data.provider)
      : null;

    this.fields = [];
    if (data.fields) {
      if (Array.isArray(data.fields)) {
        data.fields.forEach((field) => {
          this.fields.push(new MessageEmbedField(field));
        });
      } else {
        this.fields.push(new MessageEmbedField(data.fields));
      }
    }
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setTimestamp(timestamp = Date.now()) {
    this.timestamp = timestamp;
  }

  getFields(onlyInlineFields = false) {
    if (onlyInlineFields) {
      return this.fields.filter((field) => field.inline);
    }
    return this.fields;
  }

  getField(field = 0) {
    if (typeof field === "number") {
    } else if (typeof field === "string") {
      return this.fields.find((f) => f.name === field || f.value === field);
    } else {
      return this.fields[0];
    }
  }

  static isInstanceofEmbed(obj) {
    if (obj instanceof MessageEmbed) {
      return true;
    } else if (
      obj.title ||
      obj.description ||
      (obj.author && obj.author.name)
    ) {
      return true;
    } else {
      return false;
    }
  }
};
