const sectionSettings = require("./parts/sectionSettings");
const pagination = require("./parts/pagination");

module.exports = {
  name: "Blog Posts",
  tag: "section",
  class: "o-row shopify-section--blog-posts",
  enabled_on: {
    templates: ["blog"],
  },
  settings: [
    ...sectionSettings(),
    ...pagination(),
    {
      type: "header",
      content: "Content",
    },
    {
      type: "select",
      id: "layout",
      options: [
        {
          value: "grid",
          label: "Grid",
        },
        {
          value: "collage",
          label: "Collage",
        },
      ],
      default: "collage",
      label: "Layout",
      info: "Posts are stacked on mobile.",
    },
    {
      type: "checkbox",
      id: "show_image",
      default: true,
      label: "Show featured image",
    },
    {
      type: "checkbox",
      id: "show_date",
      default: true,
      label: "Show date",
    },
    {
      type: "checkbox",
      id: "show_author",
      default: true,
      label: "Show author",
    },
    {
      type: "paragraph",
      content:
        "Change excerpts by editing your blog posts. [Learn more](https://help.shopify.com/manual/online-store/blogs/writing-blogs#display-an-excerpt-from-a-blog-post)",
    },
  ],
};
