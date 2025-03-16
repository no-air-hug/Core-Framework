const { dialogSettings, dialogBlocks, dialogPresets } = require("./parts/dialog");

module.exports = {
  name: "Pickup Drawer",
  tag: "section",
  class: "shopify-section--dialog-drawer-pickup",
  enabled_on: {
    groups: ["custom.dialogs"],
  },
  limit: 1,
  ...dialogSettings(),
  ...dialogBlocks({
    header_controls_settings: [
      {
        type: "text",
        id: "title",
        label: "Title",
        default: "Pickup Availability"
      }
    ]
  }),
  ...dialogPresets({
    name: "Pickup Drawer"
  })
}
