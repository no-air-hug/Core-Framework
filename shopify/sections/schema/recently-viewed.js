const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const slider = require("./parts/slider");

module.exports = {
  name: "Recently Viewed",
  tag: "section",
  class: "o-row shopify-section--recently-viewed",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Recently Viewed",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "recently_viewed",
        }
      ],
    },
  ],
  settings: [
    ...sectionSettings(),
    ...slider({
      dots: false,
      loopable: false
    })
  ],
  blocks: [
    ...sectionHeader({
      content_settings: {
        default_heading: "Recently viewed products"
      }
    }),
    {
      type: "recently_viewed",
      name: "Recently Viewed",
      limit: 1,
      settings: [
        {
          type: "header",
          content: "Settings"
        },
        {
          type: "range",
          id: "limit",
          info: "The amount of products to display",
          min: 0,
          max: 14,
          step: 1,
          label: "Limit",
          default: 10,
        },
      ]
    },
  ],
};
