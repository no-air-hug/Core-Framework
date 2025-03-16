/**
 * Pagination
 * - The global part used to set consistent media
 *   settings across the site. For use exclusively
 *   with the 'section_media' snippet
 * -
 * Example:
 *  ...media(),
 *
 */

const aspectRatios = require("./aspectRatios");
const image = require("./image");
const video = require("./video");

module.exports = ({
  // General
  prefix = "",
  // Applies a prefix to all setting id's, you'd use this if you want to
  // reference the part multiple times on one section or block. Ensure
  // the prefix is also passed into the 'section_media' snippet!
  // -------------------------------------------------------------------------------
  // Aspect Ratio Defaults
  ar_setting = true, // Disables the aspect ratio settings here all together, you'd use this on a carousel section where
  // multiple cards would require the same aspect ratio, disable it here, and add ...aspectRatios() on the
  // section-level instead.
  ar_default_ratio = 'square', // The default aspect ratio on desktop
  ar_default_ratio_mob = 'square', // The default aspect ratio on mobile
  ar_mobile_aspect = true, // Enables and disables the mobile aspect ratio setting
  // Image Defaults
  image_header = "Image", // Applies text to the image header content.
  image_info = "Image content", // Applies information to the image header content.
  image_overlay = false, // Adds the ability for the user to choose an overlay.
  image_default_overlay = "linear-gradient(360deg, rgb(25 25 25 / 50%) 0%, rgb(25 25 25 / 0%) 72.5%)", // The default overlay application.
  image_default_fit = "cover", // The default image fit
  // Video Defaults
  video_header = "Video", // Applies text to the video header content.
  video_info = "Video content", // Applies information to the video header content.
  video_file = true, // Displays the hosted file option
  video_url = true, // Displays the url option
  video_autoplay = true, // Displays the autoplay option
  video_play_overlay = true, // Displays the play button w/ overlay option
  video_mute = true, // Displays the mute option
  video_loop = true, // Displays the mute option
  video_fit = true // Displays the fit option
} = {}) => {
  return [
    ...(ar_setting ? aspectRatios({
      prefix: prefix,
      default_ratio: ar_default_ratio,
      default_ratio_mob: ar_default_ratio_mob,
      mobile_aspect: ar_mobile_aspect
    }) : []),
    ...image({
      prefix: prefix,
      header: image_header,
      info: image_info,
      overlay: image_overlay,
      default_overlay: image_default_overlay,
      default_fit: image_default_fit
    }),
    ...video({
      prefix: prefix,
      header: video_header,
      info: video_info,
      file: video_file,
      url: video_url,
      autoplay: video_autoplay,
      play_overlay: video_play_overlay,
      mute: video_mute,
      loop: video_loop,
      fit: video_fit
    })
  ];
};
