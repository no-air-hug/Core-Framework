const content = require("./parts/content");
const media = require("./parts/media");
const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Content Cards",
  tag: "section",
  class: "o-row shopify-section--content-cards",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Content Cards",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "card",
        },
        {
          type: "card",
        },
      ],
    },
  ],
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings(),
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "card",
      name: "Card",
      limit: 4,
      settings: [
        {
          type: "header",
          content: "Width",
        },
        {
          type: "select",
          id: "width",
          label: "Card width",
          options: [
            {
              value: "col-span-8",
              label: "Two thirds",
            },
            {
              value: "col-span-6",
              label: "Half",
            },
            {
              value: "col-span-4",
              label: "One third",
            },
            {
              value: "col-span-3",
              label: "Quarter",
            },
          ],
          default: "col-span-6",
        },
        ...content({
          color_scheme: false,
          vertical_position_setting: false
        }),
        ...media({
          // Aspect Ratio Settings
          ar_setting: false
        }),
      ],
    },
  ],
};
