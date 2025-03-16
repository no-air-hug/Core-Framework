/**
 * Mega Menu
 * - The global part used across navigation sections
 *   to generate consistent megamenu settings.
 * -
 * Example:
 *  ...megaMenu()
 */

module.exports = ({ } = {}) => {
  return [{
    type: "mega_menu",
    name: "Mega menu",
    settings: [
      {
        type: "text",
        id: "parent",
        label: "Main nav item",
        info: "Select the Main Nav item, for these images to appear in the subnav e.g Womens",
      },
      {
        type: "header",
        content: "Block 1",
      },
      {
        type: "image_picker",
        id: "image_1",
        label: "Image",
      },
      {
        type: "text",
        id: "title_1",
        label: "Title",
      },
      {
        type: "url",
        id: "link_1",
        label: "Link",
      },
      {
        type: "header",
        content: "Block 2",
      },
      {
        type: "image_picker",
        id: "image_2",
        label: "Image",
      },
      {
        type: "text",
        id: "title_2",
        label: "Title",
      },
      {
        type: "url",
        id: "link_2",
        label: "Link",
      },
      {
        type: "header",
        content: "Block 3",
      },
      {
        type: "image_picker",
        id: "image_3",
        label: "Image",
      },
      {
        type: "text",
        id: "title_3",
        label: "Title",
      },
      {
        type: "url",
        id: "link_3",
        label: "Link",
      },
    ],
  }]
}
