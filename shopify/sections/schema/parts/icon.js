/**
 * Icons
 * - The global part used across most sections to generate
 *   consistent icon options. Instructions can be fed into
 *   ...icon() to alter it's default settings based on the
 *   section it's featured in.
 * -
 * Example:
 *  ...icon({
 *    id: "cta_icon",
 *    label: "CTA Icon",
 *    default_icon: "arrow-left",
 *  })
 *
 */

module.exports = (
  {
    id = "icon",
    label = "Icon",
    default_icon = "arrow-right"
  } = {}) => {
  return [
    {
      type: "select",
      id: id,
      label: label,
      default: default_icon,
      options: [
        {
          value: "none",
          label: "None",
        },
        {
          value: "dollar",
          label: "Dollar",
        },
        {
          value: "download",
          label: "Download",
        },
        {
          value: "drop",
          label: "Drop",
        },
        {
          value: "ear",
          label: "Ear",
        },
        {
          value: "edit",
          label: "Edit",
        },
        {
          value: "ellipses",
          label: "Ellipses",
        },
        {
          value: "ellipses-vertical",
          label: "Ellipses (Vertical)",
        },
        {
          value: "entrance",
          label: "Entrance",
        },
        {
          value: "envelope",
          label: "Envelope",
        },
        {
          value: "envelope-alt",
          label: "Envelope (Alt)",
        },
        {
          value: "error",
          label: "Error",
        },
        {
          value: "exit",
          label: "Exit",
        },
        {
          value: "explore",
          label: "Explore",
        },
        {
          value: "extension",
          label: "Extension",
        },
        {
          value: "eye",
          label: "Eye",
        },
        {
          value: "eye-closed",
          label: "Eye (Closed)",
        },
        {
          value: "eye-crossed",
          label: "Eye (Crossed)",
        },
        {
          value: "favourite",
          label: "Favourite",
        },
        {
          value: "feather",
          label: "Feather",
        },
        {
          value: "feed",
          label: "Feed",
        },
        {
          value: "file",
          label: "File",
        },
        {
          value: "film",
          label: "Film",
        },
        {
          value: "filter",
          label: "Filter",
        },
        {
          value: "fit",
          label: "Fit",
        },
        {
          value: "flag",
          label: "Flag",
        },
        {
          value: "flower",
          label: "Flower",
        },
        {
          value: "folder",
          label: "Folder",
        },
        {
          value: "folder-add",
          label: "Folder (Add)",
        },
        {
          value: "folder-remove",
          label: "Folder (Remove)",
        },
        {
          value: "folder-warning",
          label: "Folder (Warning)",
        },
        {
          value: "forward",
          label: "Forward",
        },
        {
          value: "glasses",
          label: "Glasses",
        },
        {
          value: "grid",
          label: "Grid",
        },
        {
          value: "services",
          label: "Services",
        },
        {
          value: "grid-alt",
          label: "Grid (Alt)",
        },
        {
          value: "grid-small",
          label: "Grid (Small)",
        },
        {
          value: "hamburger",
          label: "Hamburger",
        },
        {
          value: "happy-face",
          label: "Happy Face",
        },
        {
          value: "hash",
          label: "Hash",
        },
        {
          value: "hdr",
          label: "HDR",
        },
        {
          value: "headphones",
          label: "Headphones",
        },
        {
          value: "hearing-disability",
          label: "Hearing Disability",
        },
        {
          value: "help",
          label: "Help",
        },
        {
          value: "history",
          label: "History",
        },
        {
          value: "home",
          label: "Home",
        },
        {
          value: "home-alt",
          label: "Home (Alt #1)",
        },
        {
          value: "home-alt2",
          label: "Home (Alt #2)",
        },
        {
          value: "horn",
          label: "Horn",
        },
        {
          value: "hourglass",
          label: "Hourglass",
        },
        {
          value: "image",
          label: "Image",
        },
        {
          value: "inbox",
          label: "Inbox",
        },
        {
          value: "inbox-alt",
          label: "Inbox (Alt)",
        },
        {
          value: "info",
          label: "Info",
        },
        {
          value: "iphone",
          label: "iPhone",
        },
        {
          value: "justify",
          label: "Justify",
        },
        {
          value: "key",
          label: "Key",
        },
        {
          value: "language",
          label: "Language",
        },
        {
          value: "laptop",
          label: "Laptop",
        },
        {
          value: "layers",
          label: "Layers",
        },
        {
          value: "layout-left",
          label: "Layout (Left)",
        },
        {
          value: "layout-right",
          label: "Layout (Right)",
        },
        {
          value: "lightbulb",
          label: "Lightbulb",
        },
        {
          value: "line-chart",
          label: "Line Chart",
        },
        {
          value: "link",
          label: "Link",
        },
        {
          value: "list",
          label: "List",
        },
        {
          value: "list-alt",
          label: "List (Alt)",
        },
        {
          value: "list-view",
          label: "List View",
        },
        {
          value: "location",
          label: "Location",
        },
        {
          value: "lock",
          label: "Lock",
        },
        {
          value: "lock-open",
          label: "Lock (Open)",
        },
        {
          value: "lock-alt",
          label: "Lock (Alt)",
        },
        {
          value: "lock-alt-open",
          label: "Lock (Alt/Open)",
        },
        {
          value: "map",
          label: "Map",
        },
        {
          value: "marker",
          label: "Marker",
        },
        {
          value: "mask",
          label: "Mask",
        },
        {
          value: "maximise",
          label: "Maximise",
        },
        {
          value: "microphone",
          label: "Microphone",
        },
        {
          value: "minimise",
          label: "Minimise",
        },
        {
          value: "minus",
          label: "Minus",
        },
        {
          value: "moon",
          label: "Moon",
        },
        {
          value: "mouse",
          label: "Mouse",
        },
        {
          value: "music",
          label: "Music",
        },
        {
          value: "mute",
          label: "Mute",
        },
        {
          value: "neutral-face",
          label: "Neutral Face",
        },
        {
          value: "new",
          label: "New",
        },
        {
          value: "news",
          label: "News",
        },
        {
          value: "next",
          label: "Next",
        },
        {
          value: "next-alt",
          label: "Next (Alt)",
        },
        {
          value: "night-mode",
          label: "Night Mode",
        },
        {
          value: "no-entry",
          label: "No Entry",
        },
        {
          value: "not-allowed",
          label: "Not Allowed",
        },
        {
          value: "notebook",
          label: "Notebook",
        },
        {
          value: "octagon",
          label: "Octagon",
        },
        {
          value: "ok",
          label: "Ok",
        },
        {
          value: "ok-circle",
          label: "Ok (Circled)",
        },
        {
          value: "origin",
          label: "Origin",
        },
        {
          value: "pan",
          label: "Pan",
        },
        {
          value: "paperclip",
          label: "Paperclip",
        },
        {
          value: "pause",
          label: "Pause",
        },
        {
          value: "pause-circle",
          label: "Pause (Circled)",
        },
        {
          value: "pen",
          label: "Pen",
        },
        {
          value: "people",
          label: "People",
        },
        {
          value: "person",
          label: "Person",
        },
        {
          value: "person-add",
          label: "Person (Add)",
        },
        {
          value: "phone",
          label: "Phone",
        },
        {
          value: "pie-chart",
          label: "Pie Chart",
        },
        {
          value: "pizza",
          label: "Pizza",
        },
        {
          value: "placeholder",
          label: "Placeholder",
        },
        {
          value: "plane",
          label: "Plane",
        },
        {
          value: "play",
          label: "Play",
        },
        {
          value: "plus",
          label: "Plus",
        },
        {
          value: "poll",
          label: "Poll",
        },
        {
          value: "power",
          label: "Power",
        },
        {
          value: "presentation",
          label: "Presentation",
        },
        {
          value: "previous",
          label: "Previous",
        },
        {
          value: "previous-alt",
          label: "Previous (Alt)",
        },
        {
          value: "print",
          label: "Print",
        },
        {
          value: "qr",
          label: "QR",
        },
        {
          value: "radio",
          label: "Radio",
        },
        {
          value: "radio-button",
          label: "Radio Button",
        },
        {
          value: "radio-button-selected",
          label: "Radio Button (Selected)",
        },
        {
          value: "rain",
          label: "Rain",
        },
        {
          value: "rectangle",
          label: "Rectangle",
        },
        {
          value: "redo",
          label: "Redo",
        },
        {
          value: "refresh",
          label: "Refresh",
        },
        {
          value: "remove",
          label: "Remove",
        },
        {
          value: "repeat",
          label: "Repeat",
        },
        {
          value: "restaurant",
          label: "Restaurant",
        },
        {
          value: "return",
          label: "Return",
        },
        {
          value: "retweet",
          label: "Retweet",
        },
        {
          value: "rocket",
          label: "Rocket",
        },
        {
          value: "rotate",
          label: "Rotate",
        },
        {
          value: "rss",
          label: "RSS",
        },
        {
          value: "sad-face",
          label: "Sad Face",
        },
        {
          value: "save",
          label: "Save",
        },
        {
          value: "search",
          label: "Search",
        },
        {
          value: "send",
          label: "Send",
        },
        {
          value: "settings",
          label: "Settings",
        },
        {
          value: "share",
          label: "Share",
        },
        {
          value: "share-android",
          label: "Share (Android)",
        },
        {
          value: "share-ios",
          label: "Share (iOS)",
        },
        {
          value: "logic-branch",
          label: "Logic Branch",
        },
        {
          value: "shield",
          label: "Shield",
        },
        {
          value: "shift",
          label: "Shift",
        },
        {
          value: "shuffle",
          label: "Shuffle",
        },
        {
          value: "signal",
          label: "Signal",
        },
        {
          value: "signal-alt",
          label: "Signal (Alt)",
        },
        {
          value: "sign-language",
          label: "Sign Language",
        },
        {
          value: "skull",
          label: "Skull",
        },
        {
          value: "smartphone",
          label: "Smartphone",
        },
        {
          value: "snow",
          label: "Snow",
        },
        {
          value: "sorting",
          label: "Sorting",
        },
        {
          value: "sort-up",
          label: "Sort (Up)",
        },
        {
          value: "sort-down",
          label: "Sort (Down)",
        },
        {
          value: "sounds",
          label: "Sounds",
        },
        {
          value: "spam",
          label: "Spam",
        },
        {
          value: "stack",
          label: "Stack",
        },
        {
          value: "star",
          label: "Star",
        },
        {
          value: "stats",
          label: "Stats",
        },
        {
          value: "stats-alt",
          label: "Stats (Alt)",
        },
        {
          value: "sticker",
          label: "Sticker",
        },
        {
          value: "stop",
          label: "Stop",
        },
        {
          value: "stopwatch",
          label: "Stopwatch",
        },
        {
          value: "suitcase",
          label: "Suitcase",
        },
        {
          value: "suitcase-alt",
          label: "Suitcase (Alt)",
        },
        {
          value: "sun",
          label: "Sun",
        },
        {
          value: "sun-cloud",
          label: "Sun Cloud",
        },
        {
          value: "sunset",
          label: "Sunset",
        },
        {
          value: "support",
          label: "Support",
        },
        {
          value: "support-alt",
          label: "Support (Alt)",
        },
        {
          value: "swap-horizontal",
          label: "Swap (Horizontal)",
        },
        {
          value: "swap-vertical",
          label: "Swap (Vertical)",
        },
        {
          value: "switch-off",
          label: "Switch Off",
        },
        {
          value: "switch-on",
          label: "Switch On",
        },
        {
          value: "table-horizontal",
          label: "Table (Horizontal)",
        },
        {
          value: "table-vertical",
          label: "Table (Vertical)",
        },
        {
          value: "tag",
          label: "Tag",
        },
        {
          value: "tag-alt",
          label: "Tag (Alt)",
        },
        {
          value: "text",
          label: "Text",
        },
        {
          value: "thermometer",
          label: "Thermometer",
        },
        {
          value: "thumb-down",
          label: "Thumbs Down",
        },
        {
          value: "thumb-up",
          label: "Thumbs Up",
        },
        {
          value: "thunder",
          label: "Thunder",
        },
        {
          value: "time",
          label: "Time",
        },
        {
          value: "timer",
          label: "Timer",
        },
        {
          value: "tool",
          label: "Tool",
        },
        {
          value: "train",
          label: "Train",
        },
        {
          value: "transport",
          label: "Transport",
        },
        {
          value: "trending-down",
          label: "Trending Down",
        },
        {
          value: "trending-up",
          label: "Tranding Up",
        },
        {
          value: "turn-left",
          label: "Turn Left",
        },
        {
          value: "turn-right",
          label: "Turn Right",
        },
        {
          value: "tv",
          label: "TV",
        },
        {
          value: "typography",
          label: "Typography",
        },
        {
          value: "umbrella",
          label: "Umbrella",
        },
        {
          value: "undo",
          label: "Undo",
        },
        {
          value: "upload",
          label: "Upload",
        },
        {
          value: "user",
          label: "User",
        },
        {
          value: "verified",
          label: "Verified",
        },
        {
          value: "vertical",
          label: "Vertical",
        },
        {
          value: "video",
          label: "Video",
        },
        {
          value: "voicemail",
          label: "Voicemail",
        },
        {
          value: "volume-loud",
          label: "Volume (Loud)",
        },
        {
          value: "volume-off",
          label: "Volume (Off)",
        },
        {
          value: "volume-quiet",
          label: "Volume (Quiet)",
        },
        {
          value: "walking",
          label: "Walking",
        },
        {
          value: "wallpaper",
          label: "Wallpaper",
        },
        {
          value: "watch",
          label: "Watch",
        },
        {
          value: "wheelchair",
          label: "Wheelchair",
        },
        {
          value: "wifi",
          label: "Wifi",
        },
        {
          value: "window",
          label: "Window",
        },
        {
          value: "wine",
          label: "Wine",
        },
        {
          value: "zoom-in",
          label: "Zoom In",
        },
        {
          value: "zoom-out",
          label: "Zoom Out",
        },
        {
          value: "accessibility",
          label: "Accessibility",
        },
        {
          value: "accessibility-human",
          label: "Accessibility (Human)",
        },
        {
          value: "activity",
          label: "Activity",
        },
        {
          value: "add",
          label: "Add",
        },
        {
          value: "add-to-list",
          label: "Add to List",
        },
        {
          value: "alarm",
          label: "Alarm",
        },
        {
          value: "align-centre",
          label: "Align (Centre)",
        },
        {
          value: "align-left",
          label: "Align (Left)",
        },
        {
          value: "align-right",
          label: "Align (Right)",
        },
        {
          value: "anchor",
          label: "Anchor",
        },
        {
          value: "aperture",
          label: "Aperture",
        },
        {
          value: "apps",
          label: "Apps",
        },
        {
          value: "apps-alt",
          label: "Apps (Alt)",
        },
        {
          value: "arrow-down",
          label: "Arrow (Down)",
        },
        {
          value: "arrow-down-circle",
          label: "Arrow (Down/Circled)",
        },
        {
          value: "arrow-left",
          label: "Arrow (Left)",
        },
        {
          value: "arrow-left-bottom",
          label: "Arrow (Left-Bottom)",
        },
        {
          value: "arrow-left-circle",
          label: "Arrow (Left/Circled)",
        },
        {
          value: "arrow-left-top",
          label: "Arrow (Left-Top)",
        },
        {
          value: "arrow-right",
          label: "Arrow (Right)",
        },
        {
          value: "arrow-right-bottom",
          label: "Arrow (Right-Bottom)",
        },
        {
          value: "arrow-right-circle",
          label: "Arrow (Right/Circled)",
        },
        {
          value: "arrow-right-top",
          label: "Arrow (Right-Top)",
        },
        {
          value: "arrow-up",
          label: "Arrow (Up)",
        },
        {
          value: "arrow-up-circle",
          label: "Arrow (Up/Circled)",
        },
        {
          value: "back",
          label: "Back",
        },
        {
          value: "back-alt",
          label: "Back (Alt)",
        },
        {
          value: "back-left",
          label: "Back (Left)",
        },
        {
          value: "back-right",
          label: "Back (Right)",
        },
        {
          value: "shopping-bag",
          label: "Shopping Bag",
        },
        {
          value: "basket",
          label: "Basket",
        },
        {
          value: "basketball",
          label: "Basketball",
        },
        {
          value: "battery",
          label: "Battery",
        },
        {
          value: "battery-alt",
          label: "Battery (Alt)",
        },
        {
          value: "battery-charging",
          label: "Battery (Charging)",
        },
        {
          value: "battery-low",
          label: "Battery (Low)",
        },
        {
          value: "battery-medium",
          label: "Battery (Medium)",
        },
        {
          value: "battery-full",
          label: "Battery (Full)",
        },
        {
          value: "bell",
          label: "Bell",
        },
        {
          value: "bike",
          label: "Bike",
        },
        {
          value: "bin",
          label: "Bin",
        },
        {
          value: "bluetooth",
          label: "Bluetooth",
        },
        {
          value: "bolt",
          label: "Bolt",
        },
        {
          value: "book",
          label: "Book",
        },
        {
          value: "bookmark",
          label: "Bookmark",
        },
        {
          value: "book-opened",
          label: "Book (Opened)",
        },
        {
          value: "box",
          label: "Box",
        },
        {
          value: "box-alt",
          label: "Box (Alt #1)",
        },
        {
          value: "box-alt2",
          label: "Box (Alt #2)",
        },
        {
          value: "brightness",
          label: "Brightness",
        },
        {
          value: "bug",
          label: "Bug",
        },
        {
          value: "calendar",
          label: "Calendar",
        },
        {
          value: "calendar-add",
          label: "Calendar (Add)",
        },
        {
          value: "calendar-decline",
          label: "Calendar (Decline)",
        },
        {
          value: "calendar-event",
          label: "Calendar Event",
        },
        {
          value: "camera",
          label: "Camera",
        },
        {
          value: "camera-rear",
          label: "Camera Rear",
        },
        {
          value: "cancel",
          label: "Cancel",
        },
        {
          value: "car",
          label: "Car",
        },
        {
          value: "car-alt",
          label: "Car (Alt)",
        },
        {
          value: "cards",
          label: "Cards",
        },
        {
          value: "cart",
          label: "Cart",
        },
        {
          value: "cart-add",
          label: "Cart (Add)",
        },
        {
          value: "cellular",
          label: "Cellular",
        },
        {
          value: "chart",
          label: "Chart",
        },
        {
          value: "chat",
          label: "Chat",
        },
        {
          value: "chat-add",
          label: "Chat (Add)",
        },
        {
          value: "chat-alt",
          label: "Chat (Alt)",
        },
        {
          value: "chat-remove",
          label: "Chat (Remove)",
        },
        {
          value: "chat-warning",
          label: "Chat (Warning)",
        },
        {
          value: "checkbox",
          label: "Checkbox",
        },
        {
          value: "checkbox-intermediate",
          label: "Checkbox (Intermediate)",
        },
        {
          value: "chevron-down",
          label: "Chevron (Down)",
        },
        {
          value: "chevron-left",
          label: "Chevron (Left)",
        },
        {
          value: "chevron-right",
          label: "Chevron (Right)",
        },
        {
          value: "chevrons-down",
          label: "Chevrons (Down)",
        },
        {
          value: "chevrons-left",
          label: "Chevrons (Left)",
        },
        {
          value: "chevrons-right",
          label: "Chevrons (Right)",
        },
        {
          value: "chevrons-up",
          label: "Chevrons (Up)",
        },
        {
          value: "chevron-up",
          label: "Chevron (Up)",
        },
        {
          value: "circle",
          label: "Circle",
        },
        {
          value: "clip",
          label: "Clip",
        },
        {
          value: "clipboard",
          label: "Clipboard",
        },
        {
          value: "close",
          label: "Close",
        },
        {
          value: "cloud",
          label: "Cloud",
        },
        {
          value: "cloud-crossed",
          label: "Cloud (Crossed)",
        },
        {
          value: "cloud-upload",
          label: "Cloud Upload",
        },
        {
          value: "code",
          label: "Code",
        },
        {
          value: "code-alt",
          label: "Code (Alt)",
        },
        {
          value: "coffee",
          label: "Coffee",
        },
        {
          value: "colours",
          label: "Colours",
        },
        {
          value: "component",
          label: "Component",
        },
        {
          value: "contact-book",
          label: "Contact Book",
        },
        {
          value: "contrast",
          label: "Contrast",
        },
        {
          value: "control-centre",
          label: "Control Centre",
        },
        {
          value: "controls",
          label: "Controls",
        },
        {
          value: "controls-alt",
          label: "Controls (Alt)",
        },
        {
          value: "controls-vertical-alt",
          label: "Controls (Alt/Vertical)",
        },
        {
          value: "copy",
          label: "Copy",
        },
        {
          value: "documents",
          label: "Documents",
        },
        {
          value: "credit-card",
          label: "Credit Card",
        },
        {
          value: "crop",
          label: "Crop",
        },
        {
          value: "crossing",
          label: "Crossing",
        },
        {
          value: "cup",
          label: "Cup",
        },
        {
          value: "cursor",
          label: "Cursor",
        },
        {
          value: "cut",
          label: "Cut",
        },
        {
          value: "danger",
          label: "Danger",
        },
        {
          value: "dashboard",
          label: "Dashboard",
        },
        {
          value: "delete",
          label: "Delete",
        },
        {
          value: "dialpad",
          label: "Dialpad",
        },
        {
          value: "diamond",
          label: "Diamond",
        },
        {
          value: "direction-left",
          label: "Direction (Left)",
        },
        {
          value: "direction-right",
          label: "Direction (Right)",
        },
        {
          value: "directions-left",
          label: "Directions (Left)",
        },
        {
          value: "directions-right",
          label: "Directions (Right)",
        },
      ]
    }
  ]
};
