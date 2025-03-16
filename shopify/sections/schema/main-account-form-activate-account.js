const image = require("./parts/image");
const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Activate Account",
  tag: "section",
  class: "o-row shopify-section--activate-account",
  enabled_on: {
    templates: ["customers/activate_account"]
  },
  presets: [
    {
      name: "Activate Account",
      blocks: [
        {
          type: "media"
        }
      ]
    },
  ],
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings({
      default_spacing: "0"
    }),
  ],
  blocks: [
    {
      type: "media",
      name: "Media",
      limit: 1,
      settings: [
        {
          type: "checkbox",
          id: "mobile_hidden",
          label: "Hide Image on Mobile",
          default: true,
        },
        ...image(),
      ],
    },
  ],
};
