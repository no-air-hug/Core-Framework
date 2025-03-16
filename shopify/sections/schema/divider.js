const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Divider",
  tag: "section",
  class: "o-row shopify-section--divider",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [{ name: "Divider" }],
  settings: [
    ...sectionSettings({
      text_color: false
    }),
    {
      type: "header",
      content: "Content"
    },
    {
      type: "color",
      id: "divider_color",
      label: "Divider Color",
      info: "If set to transparent, the global 'Border Light' colour setting will be used to color the divider line instead."
    }
  ],
};
