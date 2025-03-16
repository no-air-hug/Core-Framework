/**
 * Image
 * - The global part used across most sections to generate
 *   consistent images. Instructions can be fed into
 *   ...image() to alter it's default content settings
 *   based on the section it's featured in.
 * -
 * Example:
 *  ...image({
 *    overlay: true
 *  })
 */

// !! Please apply any updates made here to media.js too !!

module.exports = (
  {
    /* Setting Defaults */
    prefix = "", // Applies a prefix to all settig id's, you'd use this if you want to reference the part multiple times on one section or block.
    header = "Image", // Applies text to the image header content.
    info = "Image content", // Applies information to the image header content.
    overlay = false, // Adds the ability for the user to choose an overlay.
    default_overlay = "linear-gradient(360deg, rgb(25 25 25 / 50%) 0%, rgb(25 25 25 / 0%) 72.5%)", // The default overlay application.
    default_fit = "cover" // The default image fit
  } = {}) => {
  return [
    header !== "" && {
      type: "header",
      content: header,
      info: info
    },
    {
      type: "image_picker",
      id: `${prefix}image`,
      label: "Image",
    },
    {
      type: "image_picker",
      id: `${prefix}image_mobile`,
      label: "Mobile override",
    },
    overlay && {
      type: "color_background",
      id: `${prefix}image_overlay`,
      label: "Overlay",
      default: default_overlay
    },
    {
      type: "select",
      id: `${prefix}image_fit`,
      label: "Fit",
      options: [
        {
          value: "cover",
          label: "Cover",
        },
        {
          value: "contain",
          label: "Contain",
        },
      ],
      default: default_fit,
    }
  ].filter(Boolean);
};


