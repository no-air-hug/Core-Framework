const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");
const buttonStyles = require("./parts/buttonStyles");
const pagination = require("./parts/pagination");

module.exports = {
  name: "Account Orders",
  presets: [
    {
      name: "Account Orders",
      blocks: [
        {
          type: "section_header"
        },
        {
          type: "orders"
        }
      ]
    }
  ],
  class: "o-row shopify-section--account-orders",
  tag: "section",
  enabled_on: {
    templates: ["customers/account"]
  },
  settings: [
    ...sectionSettings({
      width: false
    }),
  ],
  blocks: [
    ...sectionHeader({
      content_settings: {
        default_heading: "My Orders"
      }
    }),
    {
      type: "orders",
      name: "Orders",
      limit: 1,
      settings: [
        {
          type: "header",
          content: "Styles",
        },
        ...buttonStyles({
          id: "track_button_style",
          label: "Track Button Style",
          default_style: "primary"
        }),
        ...buttonStyles({
          id: "view_button_style",
          label: "View Button Style",
          default_style: "secondary"
        }),
        ...pagination()
      ]
    },
  ]
};
