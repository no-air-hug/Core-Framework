const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Custom Liquid",
  tag: "section",
  class: "o-row shopify-section--custom-liquid",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Custom Liquid",
      blocks: [
        {
          type: "section_header"
        },
        {
          type: "custom_liquid"
        }
      ]
    }
  ],
  settings: [
    ...sectionSettings(),
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "custom_liquid",
      name: "Custom Liquid",
      limit: 1,
      settings: [
        {
          type: "liquid",
          id: "liquid",
          label: "Custom Liquid"
        }
      ]
    }
  ],
};
