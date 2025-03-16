/**
 * Grid Spacing
 * - The global part used across sections to generate
 *   consistent position settings.
 * -
 * Example:
 *  ...position({
 *    default_position = "center"
 *  })
 */

module.exports = ({
  default_position = "start",
  default_position_desktop = ""
} = {}) => {
  return [
    {
      type: "paragraph",
      content: "Positioning"
    },
    {
      type: "select",
      id: "position",
      label: "Position (Mobile/Tablet)",
      info: "Screen Width: < 1023px",
      options: [
        { value: "start", label: "Left" },
        { value: "center", label: "Center" },
        { value: "end", label: "Right" },
      ],
      default: default_position,
    },
    {
      type: "select",
      id: "position_desktop",
      label: "Position (Desktop)",
      info: "Screen Width: 1024px >",
      options: [
        { value: "", label: "as above" },
        { value: "start", label: "Left" },
        { value: "center", label: "Center" },
        { value: "end", label: "Right" },
      ],
      default: default_position_desktop
    },
  ]
}
