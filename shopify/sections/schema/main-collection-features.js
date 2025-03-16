const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Collection Features",
  tag: "section",
  class: "o-row shopify-section--collection-features",
  presets: [{ name: "Collection Features" }],
  enabled_on: {
    templates: ["collection"],
  },
  settings: [
    ...sectionSettings({
      width: false,
      default_spacing: "sm",
      default_padding: "full",
      secondary_bg: true
    }),
    {
      type: "header",
      content: "Feature Settings",
      info: "Below you can set the collections to display on ALL collections pages. If you wanted to reference specific collections on a single collection, then you should add them to the 'Feature Collections' metafield at the bottom of the Collection's admin page instead. If this metafield isn't present, just create a brand new collection metafield with the key and namespace: 'custom.feature_collections'"
    },
    {
      type: "collection_list",
      id: "feature_collections",
      label: "Feature Collections",
      limit: 8
    }
  ],
};
