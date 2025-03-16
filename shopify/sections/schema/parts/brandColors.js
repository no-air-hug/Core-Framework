/**
 * Brand Colours
 * - The global part used to choose colours, these
 *   are typically the brand colours set inside of
 *   the tailwind config under brand, but feel free
 *   to add any design-specific colours.
 *
 * -
 * Example:
 *  ...brand_colors({
 *    dflt: '#898D8D'
 8  }),
 *
 */

module.exports = (identity, label, dflt) => {
  return [
    {
      type: "select",
      id: identity ? identity : "colour",
      label: label ? label : "Colour",
      default: dflt ? dflt : "#F8F8F8",
      options: [
        {
          value: "#161616",
          label: "Black",
        },
        {
          value: "#FFF",
          label: "White",
        },
        {
          value: "#111",
          label: "Grey (5)",
        },
        {
          value: "#191919",
          label: "Grey (10)",
        },
        {
          value: "#222",
          label: "Grey (20)",
        },
        {
          value: "#4d4d4d",
          label: "Grey (30)",
        },
        {
          value: "#666",
          label: "Grey (40)",
        },
        {
          value: "#808080",
          label: "Grey (50)",
        },
        {
          value: "#999",
          label: "Grey (60)",
        },
        {
          value: "#b3b3b3",
          label: "Grey (70)",
        },
        {
          value: "#ccc",
          label: "Grey (80)",
        },
        {
          value: "#eee",
          label: "Grey (90)",
        },
        {
          value: "#f6f6f6",
          label: "Grey (100)",
        },
        {
          value: "#898D8D",
          label: "Brand (1)",
        }
      ],
    },
  ];
};
