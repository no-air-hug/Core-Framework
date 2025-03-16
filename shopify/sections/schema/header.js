const brandLogos = require("./parts/brandLogos");
const megaMenu = require("./parts/megaMenu");

module.exports = {
  name: "Header",
  tag: "section",
  class: "o-row shopify-section-header header js-header shopify-section--header",
  enabled_on: {
    groups: ["header", "custom.header_minimal"],
  },
  settings: [
    {
      type: "header",
      content: "Menu",
    },
    {
      type: "link_list",
      id: "main_menu",
      label: "Main menu",
      default: "main-menu",
    },
    ...brandLogos()
  ],
  blocks: [
    ...megaMenu()
  ],
};
