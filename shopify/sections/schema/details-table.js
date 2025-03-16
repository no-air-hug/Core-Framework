const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Details Table",
  tag: "section",
  class: "o-row shopify-section--details-table",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Details Table",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "item",
          settings: {
            text: "Measurements",
            info: "12w x 12h x 12d"
          }
        },
        {
          type: "item",
          settings: {
            text: "Release Date",
            info: "July 2023"
          }
        },
        {
          type: "item",
          settings: {
            text: "Included Parts",
            info: "22"
          }
        },
      ],
    },
  ],
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings({
      default_width: 800
    }),
  ],
  blocks: [
    {
      type: "@app",
    },
    ...sectionHeader(),
    {
      type: "item",
      name: "Item",
      settings: [
        {
          type: "text",
          id: "text",
          label: "Text",
        },
        {
          type: "text",
          id: "info",
          label: "Info",
        },
      ],
    },
  ],
};
