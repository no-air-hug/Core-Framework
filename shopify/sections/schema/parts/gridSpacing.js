/**
 * Grid Spacing
 * - The global part used across sections to generate
 *   consistent grid spacing settings.
 * -
 * Example:
 *  ...gridSpacing()
 */

module.exports = ({
  header = "Grid Spacing"
} = {}) => {
  return [
    {
      type: "header",
      content: header,
    },
    {
      type: "range",
      id: "mob_gap_x",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - X Axis (Mobile)",
      info: "Screen Width: < 767px",
    },
    {
      type: "range",
      id: "mob_gap_y",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - Y Axis (Mobile)",
      info: "Screen Width: < 767px",
    },
    {
      type: "range",
      id: "tab_gap_x",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - X Axis (Tablet)",
      info: "Screen Width: 768px > 1023px",
    },
    {
      type: "range",
      id: "tab_gap_y",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - Y Axis (Tablet)",
      info: "Screen Width: 768px > 1023px",
    },
    {
      type: "range",
      id: "dsk_gap_x",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - X Axis (Desktop)",
      info: "Screen Width: 1024px >",
    },
    {
      type: "range",
      id: "dsk_gap_y",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - Y Axis (Desktop)",
      info: "Screen Width: 1024px >",
    },
    {
      type: "range",
      id: "xl_dsk_gap_x",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - X Axis (XL Desktop)",
      info: "Screen Width: 1280px >",
    },
    {
      type: "range",
      id: "xl_dsk_gap_y",
      min: 8,
      max: 48,
      step: 8,
      default: 24,
      label: "Spacing - Y Axis (XL Desktop)",
      info: "Screen Width: 1280px >",
    },

  ].filter(Boolean);
};
