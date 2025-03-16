const { dialogSettings, dialogBlocks, dialogPresets } = require("./parts/dialog");
const resultsCount = require("./parts/resultsCount");

module.exports = {
  name: "Facets Drawer",
  tag: "section",
  class: "shopify-section--dialog-drawer-facets js-facets-dialog",
  ...dialogSettings(),
  ...dialogBlocks({
    header_controls_settings: [
      {
        type: "text",
        id: "title",
        label: "Title",
        default: "Filters"
      },
      ...resultsCount()
    ],
    blocks_main: [
      {
        type: "facets",
        name: "Facets",
        limit: 1,
      },
    ],
    blocks_footer: [
      {
        type: "clear-button",
        name: "Clear Button",
        limit: 1,
      },
    ]
  }),
  ...dialogPresets({
    presets_main: [
      {
        type: "facets"
      }
    ],
    presets_footer: [
      {
        type: "clear-button"
      }
    ],
    name: "Facets Drawer"
  })
};
