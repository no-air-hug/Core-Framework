const { dialogSettings } = require("./parts/dialog");

module.exports = {
  name: "Markets Modal",
  tag: "section",
  class: "shopify-section--dialog-modal-markets",
  ...dialogSettings({
    is_drawer: false,
    additional_settings: [
      {
        type: "header",
        content: "Important",
        info: "For this section's content to display, please ensure that the 'Enable Markets UI' setting under 'Markets' in the global theme settings is checked",
      },
      {
        type: "header",
        content: "Settings",
      },
      {
        id: "default_market",
        type: "text",
        label: "Default market code",
        default: "GB",
      },
    ],
  }),
  blocks: [
    {
      type: "market",
      name: "Market",
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
          default: "United Kingdom",
        },
        {
          type: "text",
          id: "code",
          label: "Code",
          default: "GB",
        },
        {
          type: "text",
          id: "currency",
          label: "Currency",
        },
        {
          type: "text",
          id: "country_codes",
          label: "Country codes",
          info: "List of country codes that belong to this market",
          default: "GB,UK",
        },
        {
          type: "url",
          id: "domain",
          label: "Market domain URL",
        },
        {
          type: "image_picker",
          id: "image",
          label: "Image",
          info: "Override default image or provide one for custom markets e.g International",
        },
      ],
    },
  ],
};
