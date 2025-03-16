const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Collapsible Content",
  tag: "section",
  class: "o-row shopify-section--collapsible-content",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Collapsible Content",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "collapsible",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings({
      default_width: 880
    })
  ],
  blocks: [
    {
      type: "@app",
    },
    ...sectionHeader(),
    {
      type: "collapsible",
      name: "Collapsible Content",
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
          default: "How do I...?",
        },
        {
          type: "richtext",
          id: "body",
          label: "Content",
          default: "<p>We're here to help.</p>",
        },
      ],
    },
  ]
};
