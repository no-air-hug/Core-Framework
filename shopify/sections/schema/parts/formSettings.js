/**
 * Form Settings
 * - The global part used across sections to generate
 *   consistent form settings.
 * -
 * Example:
 *  ...fieldSize()
 */

const fieldSize = () => {
  return [
    {
      type: "header",
      content: "Field Sizing",
    },
    {
      type: "select",
      id: "field_size",
      label: "Field Size",
      options: [
        {
          value: "full",
          label: "Full"
        },
        {
          value: "half",
          label: "Half"
        }
      ]
    },
  ]
}

module.exports = {
  fieldSize,
}
