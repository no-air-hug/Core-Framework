const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Footer",
  class: "o-row shopify-section--footer",
  tag: "section",
  enabled_on: {
    groups: ["footer", "custom.footer_minimal"],
  },
  settings: [
    ...sectionSettings({
      spacing: false,
      padding: false,
      width: false
    }),
    {
      type: "header",
      content: "Baseline",
    },
    {
      type: "link_list",
      id: "footer_link_bottom",
      label: "Baseline Linklist",
    },
    {
      label: "Custom Payment Logos",
      id: "payment_logos",
      type: "image_picker",
    },
    {
      type: "range",
      id: "payment_logos_width",
      min: 0,
      max: 700,
      step: 10,
      default: 0,
      unit: "px",
      label: "Payment Logos Width",
    },
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "link-column",
      name: "Link Column",
      limit: 5,
      settings: [
        {
          type: "link_list",
          id: "column_linklist",
          label: "Column Linklist",
        },
      ]
    },
    {
      type: "social-column",
      name: "Footer Social Column",
      limit: 1
    },
    {
      type: "newsletter-column",
      name: "Newsletter Column",
      limit: 1,
      settings: [
        {
          label: "Newsletter Title",
          type: "textarea",
          id: "heading_newsletter",
          default: "Stay up to date\nand receive 10% off",
        }
      ]
    }
  ]
};
