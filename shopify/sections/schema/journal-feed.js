const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const slider = require("./parts/slider");
const aspectRatios = require("./parts/aspectRatios");

module.exports = {
  name: "Journal Feed",
  tag: "section",
  class: "o-row shopify-section--journal-feed",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Journal Feed",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "blog",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings(),
    ...slider({
      dots: false
    }),
    ...aspectRatios({
      default_ratio: "square"
    }),
    {
      type: "header",
      content: "Content Settings",
    },
    {
      type: "checkbox",
      id: "show_images",
      label: "Show Article Images",
      default: true
    },
    {
      type: "checkbox",
      id: "show_dates",
      label: "Show Article Dates",
      default: true
    },
    {
      type: "checkbox",
      id: "show_authors",
      label: "Show Article Authors",
      default: true
    },
    {
      type: "checkbox",
      id: "show_excerpts",
      label: "Show Article Excerpts",
      default: true
    },
    {
      type: "checkbox",
      id: "show_badges",
      label: "Show Article Badges",
      default: true
    },
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "blog",
      name: "Blog",
      limit: 1,
      settings: [
        {
          type: "blog",
          id: "blog",
          label: "Select Blog"
        },
        {
          type: "range",
          id: "limit",
          min: 2,
          max: 8,
          step: 1,
          label: "Post Limit",
          info: "Number of posts to show",
          default: 4,
        },
      ],
    },
    {
      type: "article",
      name: "Article",
      limit: 8,
      settings: [
        {
          type: "article",
          id: "article",
          label: "Select Brticle",
        },
      ],
    },
  ],
};
