const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Newsletter",
  class: "o-row",
  disabled_on: {
    groups: ["header", "custom.dialogs"],
  },
  presets: [
    {
      name: "Newsletter",
      blocks: [
        {
          type: "section_header"
        },
        {
          type: "newsletter"
        }
      ]
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
    ...sectionHeader({
      content_settings: {
        default_heading: "<p>Newsletter</p>",
        default_text: "<p>Your newsletter content goes here.</p>",
        default_position: "center",
        default_heading_size_mob: "2xl",
        default_heading_size_dsk: "5xl",
        default_text_size_mob: "lg",
        default_text_size_dsk: "xl",
      }
    }),
    {
      type: "newsletter",
      name: "Newsletter",
      limit: 1
    }
  ]
};
