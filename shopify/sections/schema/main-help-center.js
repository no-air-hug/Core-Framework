const sectionSettings = require("./parts/sectionSettings");
const pagination = require("./parts/pagination");

module.exports = {
  name: "Help Center",
  tag: "section",
  class: "o-row shopify-section--help-center",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  settings: [
    ...sectionSettings({
      default_width: 773
    }),
    ...pagination(),
    {
      type: "text",
      id: "author",
      label: "Author assigned to Help Center article",
      default: "Help Centre",
    }
  ],
};
