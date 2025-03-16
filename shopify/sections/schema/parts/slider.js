module.exports = ({
  loopable = true,
  arrows = true,
  dots = true,
  full_width = true,
  arrows_colour = "#000",
  arrows_bg = "transparent",
  dots_colour = "#FFF"
} = {}) => {
  return [
    {
      type: "header",
      content: "Slider Settings",
    },
    full_width && {
      type: "checkbox",
      id: "full_width",
      label: "Full Width",
      info: "Ignores the slider's container's inline padding values and overflow-hidden declaration, allowing it to extend outside of the global container"
    },
    loopable && {
      type: "checkbox",
      id: "slider_loop",
      label: "Loop",
      default: true,
    },
    {
      type: "range",
      id: "slider_autoplay",
      min: 0,
      max: 10,
      step: 0.5,
      unit: "s",
      label: "Autoplay Delay",
      default: 0,
      info: "Set to 0s to disable autoplay",
    },
    arrows && {
      type: "checkbox",
      id: "slider_arrows",
      label: "Arrows",
      default: false,
    },
    arrows && {
      type: "color",
      id: "slider_arrows_color",
      label: "Slider Arrows Color",
      default: arrows_colour,
    },
    arrows && {
      type: "color",
      id: "slider_arrows_bg",
      label: "Slider Arrows Background",
      default: arrows_bg,
    },
    dots && {
      type: "checkbox",
      id: "slider_dots",
      label: "Dots",
      default: false,
    },
    dots && {
      type: "color",
      id: "slider_dots_color",
      label: "Slider Dots Color",
      default: dots_colour,
    }
  ].filter(Boolean)
}
