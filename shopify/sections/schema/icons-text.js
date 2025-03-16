const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const image = require("./parts/image");
const content = require("./parts/content");

module.exports = {
  name: "Logos + Text",
  tag: "section",
  class: "o-row shopify-section--logos-text",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Logos + Text",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "logo",
        },
        {
          type: "logo",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings(),
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "logo",
      name: "Logo",
      limit: 4,
      settings: [
        ...image({
          default_fit: 'contain'
        }),
        ...content({
          color_scheme: false,
          default_position: 'center',
          default_position_desktop: 'center'
        })
      ],
    },
  ],
};
