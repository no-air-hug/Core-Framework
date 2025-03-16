const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Instagram",
  tag: "section",
  class: "o-row shopify-section--instagram",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Instagram",
      blocks: [
        {
          type: "section_header",
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
    {
      type: "@app",
    },
    ...sectionHeader(),
  ],
};
