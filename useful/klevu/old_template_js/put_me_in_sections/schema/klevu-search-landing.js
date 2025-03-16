const sectionSettings = require("./parts/sectionSettings");
const gridSpacing = require("./parts/gridSpacing");
const gridItems = require("./parts/gridItems");

module.exports = {
  name: "Klevu - Search Landing",
  tag: "section",
  class: "o-row shopify-section--main-klevu-search-results",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  settings: [
    ...sectionSettings(),
    ...gridSpacing(),
    ...gridItems()
  ],
};
