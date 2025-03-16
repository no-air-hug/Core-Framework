const sectionSettings = require("./parts/sectionSettings");
const icon = require("./parts/icon");

module.exports = {
  name: "Promo Bar",
  enabled_on: {
    groups: ["header", "custom.header_minimal"],
  },
  class: "o-row sticky top-0 z-10 promo-bar js-promo-bar shopify-section--promo-bar",
  presets: [{ name: "Promo Bar" }],
  tag: "section",
  limit: 1,
  settings: [
    ...sectionSettings({
      spacing: false,
      width: false,
      default_text_color: "light"
    })
  ],
  blocks: [
    {
      type: "promo_text",
      name: "Promo text",
      limit: 1,
      settings: [
        ...icon(),
        {
          type: "inline_richtext",
          id: "text",
          label: "Text",
        },
      ],
    },
  ],
};
