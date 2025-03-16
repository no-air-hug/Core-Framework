const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Before & After",
  tag: "section",
  class: "o-row shopify-section--before-and-after",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Before & After",
      blocks: [
        {
          type: "section_header"
        },
        {
          type: "before"
        },
        {
          type: "after"
        }
      ],
    },
  ],
  settings: [
    ...sectionSettings()
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "before",
      name: "Before",
      limit: 1,
      settings: [
        {
          type: "image_picker",
          id: "image",
          label: "Desktop image",
        },
        {
          type: "image_picker",
          id: "image_mobile",
          label: "Mobile image",
        },
      ],
    },
    {
      type: "after",
      name: "After",
      limit: 1,
      settings: [
        {
          type: "image_picker",
          id: "image",
          label: "Desktop image",
        },
        {
          type: "image_picker",
          id: "image_mobile",
          label: "Mobile image",
        },
      ],
    },
  ],
};
