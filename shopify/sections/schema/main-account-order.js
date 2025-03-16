const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Account Order",
  presets: [
    {
      name: "Account Order",
      blocks: [
        {
          type: "section_header"
        },
        {
          type: "order"
        }
      ]
    }],
  class: "o-row shopify-section--account-order",
  tag: "section",
  enabled_on: {
    templates: ["customers/order"]
  },
  settings: [
    ...sectionSettings({
      width: false
    }),
  ],
  blocks: [
    ...sectionHeader({
      content_settings: {
        default_heading: "Order [[order_number]]",
      },
      info: "The section's header. On the Account Order template, you can insert [[order_number]] in here to reference the order number inside of the title."
    }),
    {
      type: "order",
      name: "Order",
      limit: 1
    }
  ]
};
