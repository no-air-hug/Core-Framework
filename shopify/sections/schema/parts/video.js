/**
 * Video
 * - The global part used across most sections to generate
 *   consistent videoes. Instructions can be fed into
 *   ...video() to alter it's default content settings
 *   based on the section it's featured in.
 * -
 * Example:
 *  ...video({
 *    info: "This or that"
 *  })
 */

// !! Please apply any updates made here to media.js too !!

module.exports = ({
  /* Setting Defaults */
  prefix = "", // Applies a prefix to all settig id's, you'd use this if you want to reference the part multiple times on one section or block.
  header = "Video", // Applies text to the video header content.
  info = "Video content", // Applies information to the video header content.
  file = true, // Displays the hosted file option
  url = true, // Displays the url option
  autoplay = true, // Displays the autoplay option
  play_overlay = true, // Displays the play button w/ overlay option
  mute = true, // Displays the mute option
  loop = true, // Displays the mute option
  fit = true // Displays the fit option
} = {}) => {
  return [
    header !== "" && {
      type: "header",
      content: header,
      info: info
    },
    file && {
      type: "video",
      id: `${prefix}video_file`,
      label: "Hosted video",
      info: "A Shopify-hosted video",
    },
    url && {
      type: "video_url",
      id: `${prefix}video_url`,
      accept: ["youtube", "vimeo"],
      label: "Youtube/Vimeo hosted video",
    },
    fit && {
      type: "select",
      id: `${prefix}video_fit`,
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
      default: "cover",
    },
    autoplay && {
      type: "checkbox",
      id: `${prefix}video_autoplay`,
      label: "Autoplay",
      default: true,
    },
    loop && {
      type: "checkbox",
      id: `${prefix}video_loop`,
      label: "Loop",
      default: true,
    },
    mute && {
      type: "checkbox",
      id: `${prefix}video_muted`,
      label: "Muted",
      info: "If unchecked, then 'Autoplay' must also be unchecked - this is a security policy for all modern browsers, no video can autoplay with sound, all videos need to be interacted with first by the user for them to play sound.",
      default: true,
    },
    play_overlay && {
      type: "checkbox",
      id: `${prefix}video_play_overlay`,
      label: "'Play' Button w/ Overlay",
      info: "Requires 'Autoplay' to be disabled",
      default: true,
    },
  ].filter(Boolean);
};
