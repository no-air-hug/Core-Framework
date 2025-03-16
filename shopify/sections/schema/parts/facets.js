/**
 * Facets
 * - The global part used across sections to generate
 *   consistent facets settings.
 * -
 * Example:
 *  ...facets({
 *    default_layout = "horizontal"
 *  })
 */

const resultsCount = require("./resultsCount");

module.exports = ({
  default_layout = "horizontal",
  template_collection = false, // Displays collection-appropriate' sort by' options
  template_search = false // Displays search-appropriate' sort by' options
} = {}) => {
  return [
    {
      type: "header",
      content: "Facets",
    },
    {
      type: "select",
      id: "facets_layout",
      label: "Facets Layout",
      options: [
        { value: "horizontal", label: "Horizontal" },
        { value: "vertical", label: "Vertical" },
      ],
      default: default_layout,
    },
    {
      type: "checkbox",
      id: "filtering",
      label: "Filtering",
      default: true
    },
    {
      type: "checkbox",
      id: "sorting",
      label: "Sorting",
      default: true
    },
    (template_collection || template_search) && {
      type: "paragraph",
      content: "Sort Choices"
    },
    template_search && {
      type: "checkbox",
      id: "sort_relevance",
      default: true,
      label: "Relevance"
    },
    template_collection && {
      type: "checkbox",
      id: "sort_manual",
      default: true,
      label: "Manual"
    },
    template_collection && {
      type: "checkbox",
      id: "sort_best_selling",
      default: true,
      label: "Best Selling"
    },
    template_collection && {
      type: "checkbox",
      id: "sort_title",
      default: true,
      label: "Title"
    },
    (template_collection || template_search) && {
      type: "checkbox",
      id: "sort_price",
      default: true,
      label: "Price"
    },
    template_collection && {
      type: "checkbox",
      id: "sort_created",
      default: true,
      label: "Created"
    },
    ...resultsCount()
  ].filter(Boolean);
};


