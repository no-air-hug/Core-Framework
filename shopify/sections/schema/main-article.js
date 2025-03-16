const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Blog Post",
  class: "article shopify-section--article",
  tag: "article",
  enabled_on: {
    templates: ["article"],
  },
  settings: [
    ...sectionSettings()
  ],
  blocks: [
    {
      type: "@app",
    },
    {
      type: "featured_image",
      name: "Featured image",
      limit: 1,
      settings: [],
    },
    {
      type: "title",
      name: "Title",
      limit: 1,
    },
    {
      type: "content",
      name: "Content",
      limit: 1,
    },
  ],
};
