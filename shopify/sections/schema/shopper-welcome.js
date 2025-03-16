const media = require("./parts/media");

module.exports = {
  name: "Shopper Welcome View",
  tag: "section",
  class: "contents",
  presets: [{ name: "Shopper Welcome View" }],
  blocks: [
    {
      type: "media",
      name: "Media",
      limit: 1,
      settings: [
        ...media({
          ar_setting: false,
        }),
      ],
    },
    {
      type: "text",
      name: "Text",
      limit: 1,
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
          default: "Hello World!",
        },
        {
          type: "color",
          id: "color",
          default: "#000",
          label: "Color",
        },
      ],
    },
  ],
};
