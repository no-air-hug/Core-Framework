/**
 * Aspect Ratios
 * - The global part used to set consistent aspect
 *   ratio options across the site.
 * -
 * Example:
 *  ...aspectRatios({
 *    default_ratio: 'square'
 8  }),
 *
 */

// !! Please apply any updates made here to media.js too !!

module.exports = ({
  /* Setting Defaults */
  prefix = "", // Applies a prefix to all settig id's, you'd use this if you want to reference the part multiple times on one section or block.
  default_ratio = 'square', // The default aspect ratio on desktop
  default_ratio_mob = 'square', // The default aspect ratio on mobile
  mobile_aspect = true // Enables and disables the mobile aspect ratio setting
} = {}) => {
  return [
    {
      type: "header",
      content: "Aspect Ratio Settings",
      info: "Applies to images and videos, if either or is present."
    },
    {
      type: "select",
      id: `${prefix}aspect_ratio`,
      label: "Media Aspect Ratio",
      options: [
        {
          value: "square",
          label: "Square",
        },
        {
          value: "portrait",
          label: "Portrait"
        },
        {
          value: "landscape-small",
          label: "Landscape (Small)",
        },
        {
          value: "landscape-large",
          label: "Landscape (Large)",
        },
        {
          value: "mobile-small",
          label: "Mobile (Small)",
        },
        {
          value: "mobile-large",
          label: "Mobile (Large)",
        },
        {
          value: "custom",
          label: "Custom",
        },
      ],
      default: default_ratio,
    },
    {
      type: "text",
      id: `${prefix}custom_aspect_ratio`,
      label: "Custom Media Aspect Ratio",
      info: "(Advanced) Set a specific aspect ratio of choice in the format: '1 / 1', '2 / 3', etc. Requires the aspect ratio setting above to be set to 'Custom'"
    },
    mobile_aspect && {
      type: "select",
      id: `${prefix}aspect_ratio_mob`,
      label: "Media Aspect Ratio on Mobile",
      options: [
        {
          value: "square",
          label: "Square",
        },
        {
          value: "portrait",
          label: "Portrait"
        },
        {
          value: "landscape-small",
          label: "Landscape (Small)",
        },
        {
          value: "landscape-large",
          label: "Landscape (Large)",
        },
        {
          value: "mobile-small",
          label: "Mobile (Small)",
        },
        {
          value: "mobile-large",
          label: "Mobile (Large)",
        },
        {
          value: "custom",
          label: "Custom",
        },
      ],
      default: default_ratio_mob,
    },
    mobile_aspect && {
      type: "text",
      id: `${prefix}custom_aspect_ratio_mob`,
      label: "Custom Image Aspect Ratio on Mobile",
      info: "(Advanced) Set a specific aspect ratio of choice in the format: '1 / 1', '2 / 3', etc. Requires the aspect ratio setting above to be set to 'Custom'"
    },
  ];
};
