const { dialogSettings } = require("./parts/dialog");

module.exports = {
  name: "Lightbox Modal",
  tag: "section",
  class: "shopify-section--dialog-modal-lightbox",
  enabled_on: {
    groups: ["custom.dialogs"],
  },
  limit: 1,
  ...dialogSettings({
    is_drawer: false,
    additional_settings: [
      {
        type: "product",
        id: "test_product",
        label: "Test Product",
        info: "Populates the lightbox modal with a product when it's in test mode."
      },
      {
        type: "header",
        content: "Important",
        info: "For this section's content to display, please ensure that the 'Lightbox and Image Zoom' setting under 'Product' in the global theme settings is set to enabled"
      }
    ]
  })
}
