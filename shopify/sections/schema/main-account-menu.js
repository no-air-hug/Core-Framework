const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Account Menu",
  class: "o-row shopify-section--account-menu",
  tag: "section",
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings({
      spacing: false,
      width: false,
      default_bg: "#f7f7f7"
    }),
    {
      type: "header",
      content: "Content",
    },
    {
      type: "link_list",
      id: "menu",
      label: "Menu Linklist",
    },
  ]
};
