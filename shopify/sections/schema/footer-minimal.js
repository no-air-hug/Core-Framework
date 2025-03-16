const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Footer (Minimal)",
  class: "o-row shopify-section--footer-minimal",
  tag: "section",
  presets: [
    {
      name: "Footer (Minimal)",
    },
  ],
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
      label: "Linklist",
    },
    {
      label: "Custom Payment Logos",
      id: "payment_logos",
      type: "image_picker",
    },
  ],
};
