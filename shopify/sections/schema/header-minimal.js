const cta = require("./parts/cta");
const brandLogos = require("./parts/brandLogos");

module.exports = {
  name: "Header (Minimal)",
  class: "o-row shopify-section-header-minimal header header--minimal js-header",
  tag: "section",
  presets: [
    {
      name: "Header (Minimal)",
    },
  ],
  enabled_on: {
    groups: ["header", "custom.header_minimal"],
  },
  settings: [
    {
      type: "header",
      content: "Content",
    },
    ...brandLogos(),
    {
      type: "header",
      content: "CTAs",
      info: "The second CTA will be hidden on mobile"
    },
    ...cta({
      default_text: 'Contact us'
    }),
    ...cta({
      index: 2,
      default_text: 'Login',
      default_style: 'secondary'
    }),
  ],
};
