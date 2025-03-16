const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Account Addresses",
  presets: [
    {
      name: "Account Addresses",
      blocks: [
        {
          type: "section_header"
        },
        {
          type: "addresses"
        }
      ]
    }],
  class: "o-row shopify-section--account-addresses",
  tag: "section",
  enabled_on: {
    templates: ["customers/addresses"]
  },
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings({
      width: false
    }),
  ],
  blocks: [
    ...sectionHeader({
      content_settings: {
        default_heading: "My Addresses"
      }
    }),
    {
      type: "addresses",
      name: "Addresses",
      limit: 1
    },
  ]
};
