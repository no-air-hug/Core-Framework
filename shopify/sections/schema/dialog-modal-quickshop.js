const { dialogSettings } = require("./parts/dialog");

module.exports = {
  name: "Quickshop Modal",
  tag: "section",
  class: "shopify-section--dialog-modal-quickshop",
  ...dialogSettings({
    is_drawer: false,
    additional_settings: [
      {
        type: "product",
        id: "test_product",
        label: "Test Product",
        info: "Populates the quickshop modal with a product when it's in test mode."
      }
    ]
  })
}
