/**
 * Grid Spacing
 * - The global part used across sections to generate
 *   consistent results count settings.
 * -
 * Example:
 *  ...resultsCount()
 */

module.exports = ({ } = {}) => {
  return [
    {
      type: "text",
      id: "results_none",
      label: "Results (None)",
      info: "The results area returns this text when there no items are returned by the filters, //count// will return the amount of items (0).",
      default: "Sorry, there are no products in this collection"
    },
    {
      type: "text",
      id: "results_one",
      label: "Results (One)",
      info: "The results area returns this text when there's only one item, //count// will return the amount of items (1).",
      default: "//count// result"
    },
    {
      type: "text",
      id: "results_other",
      label: "Results (Other)",
      info: "The results area returns this text when there are multiple items, //count// will return the amount of items (varies).",
      default: "//count// results"
    },
  ]
}
