# Miguel's Shopify Theme Framework

A modern, modular Shopify theme framework built with React, TypeScript, and Tailwind CSS. Features custom sections, advanced product functionality, and integrated Klevu AI-powered search.

## Tech Stack

- **Frontend**: React 18, TypeScript 5.5
- **Styling**: Tailwind CSS 3.4, SCSS/SASS
- **Build System**: Webpack 5 with custom plugins
- **Search**: Klevu AI Search integration
- **UI Libraries**: Radix UI, a11y-dialog
- **Carousel**: Embla Carousel
- **Package Manager**: pnpm

## Project Structure

```
framework/
├── .webpack/              # Webpack configuration & custom plugins
├── dist/                  # Compiled theme output (Shopify-ready)
├── shopify/              # Shopify theme files
│   ├── sections/         # Liquid section files
│   ├── snippets/         # Reusable Liquid snippets
│   ├── templates/        # Template JSON files
│   ├── layout/           # Theme layouts
│   ├── config/           # Theme settings
│   └── locales/          # Translations
├── src/
│   ├── js/               # TypeScript/React source
│   │   ├── main/         # Feature modules
│   │   └── utils/        # Utility functions
│   └── scss/             # Stylesheets
│       ├── components/   # Component styles
│       ├── objects/      # Object styles
│       └── sections/     # Section-specific styles
├── types/                # TypeScript definitions
└── useful/               # Development utilities & snippets
```

## Core Features

### JavaScript/React Components

**Interactive UI**

- `accordion` - Collapsible content sections
- `dialog` - Modal and drawer system (cart, navigation, filters, account, pickup)
- `slider` - Embla-powered carousels with autoplay, thumbnails, and progress bar
- `lightbox` - Image zoom and gallery viewer
- `truncate` - Text truncation with expand/collapse
- `before-after` - Image comparison slider

**Product Features**

- `product-form` - Variant selection and add-to-cart
- `variant-options` - Swatch and dropdown variant selectors
- `quantity-input` - Quantity adjustment controls
- `product-inventory` - Real-time stock display
- `product-recommendations` - Dynamic product suggestions
- `quick-shop` - Quick view modal for products
- `recently-viewed` - Track and display recently viewed products
- `product-tooltip` - Product information popovers
- `shop-the-look` - Interactive hotspot product displays

**Shopping Experience**

- `cart-items` - Cart management and updates
- `facets` - Collection filtering and sorting
- `price-range` - Price range slider filter
- `search` - Native Shopify search
- `pagination` - Collection/blog pagination

**Media & Content**

- `video` - Multi-provider video player (YouTube, Vimeo, HTML5)
- `lazyload` - Lazy loading for images and content
- `share` - Social media sharing

**Account & Forms**

- `address-directory` - Customer address management
- `conditional-form-fields` - Dynamic form field visibility
- `delivery-countdown` - Delivery date countdown timer
- `help-center` - FAQ/help center functionality

**Header & Navigation**

- `header` - Sticky header with scroll behavior

### Shopify Sections

**Main Templates**

- Product pages (`main-product`, `main-product-quickshop`)
- Collection pages (`main-collection-banner`, `main-collection-products`, `main-collection-features`)
- Cart (`main-cart`)
- Search (`main-search`, `main-search-products`)
- Blog (`main-blog`, `main-article`, `main-blog-header`)
- Account pages (`main-account-*`)
- Static pages (`main-page`, `main-404`, `main-password`)

**Content Sections**

- `hero-banner` - Full-width hero banners
- `banner-grid` - Multi-image banner grids
- `banner-collage` - Collage-style banner layouts
- `banner-grid-carousel` - Carousel banner grid
- `text-media` - Text with image/video
- `rich-text` - Rich text content
- `content-cards` - Card layouts
- `content-cards-carousel` - Carousel card layouts
- `collapsible-content` - Accordion content sections
- `icons-text` - Icon with text displays
- `details-table` - Product specification tables

**Product Display**

- `products-slider` - Product carousel
- `product-swatches` - Variant swatch displays
- `product-stickers` - Product badges/stickers
- `bundle-hotspots` - Interactive product bundle displays

**Media Sections**

- `media` - Image/video media section
- `instagram` - Instagram feed
- `journal-feed` - Blog post feed
- `before-after` - Before/after image comparison

**Utility Sections**

- `header` / `header-minimal` - Site headers
- `footer` / `footer-minimal` - Site footers
- `promo-bar` - Promotional announcement bar
- `breadcrumbs` - Breadcrumb navigation
- `newsletter` - Newsletter signup
- `contact-us` - Contact forms
- `spacer` - Spacing/divider
- `divider` - Visual dividers
- `apps` - App embed section

### Integrations

#### Klevu AI Search

React-based search integration with advanced filtering and personalization.

**Features:**

- Quick search with instant results
- Dedicated search landing page
- Product filters and facets
- Sort by relevance, price, etc.
- Trending and recent searches
- Product recommendations
- Custom product cards with swatches
- Mobile-optimized drawer interface

**Components:**

- Quick search input and results
- Search results page with tabs
- Filter interactions
- Pagination
- Grid view options
- Product cards with pricing and variants

## Development Tools

### Snippets

**Debugging**

- `dump.liquid` - Console.log Liquid objects for debugging
  ```liquid
  {%- render 'dump', object: product -%}
  ```

**Theme Helpers**

- `theme_assets.liquid` - Auto-generated asset loader (webpack output)
- Section comment template in `useful/code-snippets/` for standardized documentation

**Component Snippets** (organized in subdirectories)

- `card/*` - Product/article/collection cards
- `cart/*` - Cart-related snippets
- `facets/*` - Filter/facet components
- `form/*` - Form field components
- `header/*` - Header components
- `footer/*` - Footer components
- `klevu/*` - Klevu search components
- `object/*` - Object templates (price, rating, media, etc.)
- `pagination/*` - Pagination components
- `product/*` - Product-specific snippets
- `section/*` - Section utilities
- `social/*` - Social media components
- `theme/*` - Theme-level utilities (assets, head, icons, SEO, breadcrumbs)

### Section Schema

TypeScript-based section schema definitions in `shopify/sections/schema/` allow for type-safe section configuration that compiles to JSON at build time.

## Theme Customization

The framework provides extensive customization options through Shopify's theme editor (`shopify/config/settings_schema.json`):

**Visual Customization**

- **Typography** - Custom font selection for headings and body text
- **Colors** - Comprehensive color system with inverse color support:
  - Highlight, primary, and secondary colors
  - Border colors (light/dark)
  - Pricing colors (sale/compare with inverse variants)
- **Buttons** - Four button styles (primary, secondary, tertiary, underline) with full state customization:
  - Border thickness and corner radius
  - Default, hover, active, focus, and disabled states
  - Independent color control for text, background, and borders

**Feature Toggles**

- **Product Settings**
  - Lightbox and image zoom enable/disable
  - Quick shop functionality
  - Variant images on product cards
- **Markets** - International selling with markets UI toggle
- **Free Delivery** - Configurable threshold for free shipping promotions
- **Delivery Estimates** - Optional delivery date countdown with:
  - Cutoff time configuration
  - Excluded dates (holidays, etc.)

**Search Configuration**

- **Search Method** - Switch between Standard Shopify search or Klevu AI
- **Klevu Settings**
  - Swatch source (variant images vs. section blocks)
  - Swatch display limits
- **Predictive Search** - Result count configuration (2-10 items)

**Integrations**

- **Custom Scripts** - Inject tracking/analytics scripts in head or body
- **Yotpo Reviews** - Widget instance configuration

All settings are merchant-editable through the Shopify admin without code changes.

## Quick Start

### Prerequisites

- Node.js >= 22
- pnpm (recommended) or npm
- Shopify CLI

### Installation

```bash
# Install dependencies
pnpm install

# Start development (builds + watches + runs Shopify dev server)
pnpm dev
```

This command will:

1. Clean the `dist/` directory
2. Start webpack in watch mode
3. Launch Shopify theme dev server
4. Open your development store

### Development Workflow

```bash
# Watch and build assets
pnpm webpack:dev

# Build for production
pnpm webpack:build

# Run Shopify dev server only (requires built assets)
pnpm shopify:dev

# Sync theme settings with Shopify
pnpm shopify:sync
```

### Code Quality

```bash
# Format code
pnpm format

# Lint JavaScript/TypeScript
pnpm lint:js

# Lint SCSS
pnpm lint:css

# Lint Liquid (Shopify theme check)
pnpm lint:theme

# Run all linters
pnpm lint
```

## Build System

The project uses a custom Webpack configuration with specialized plugins for Shopify theme development. See [`.webpack/README.md`](.webpack/README.md) for detailed documentation on:

- Webpack configuration architecture
- Custom plugins (AssetsSnippetPlugin, SectionsSchemaPlugin, etc.)
- Build optimization strategies
- Environment variables
- Cache configuration
- Troubleshooting

### Build Output

Production builds generate optimized assets in `dist/`:

- Minified JavaScript bundles with code splitting
- Optimized CSS with Tailwind compilation
- Processed Shopify sections with injected schemas
- Flattened snippets directory
- Build manifest for cache invalidation

## Dependencies

**UI Components & Interactions**

- **Radix UI** - Accessible primitives (Dialog, Slider, VisuallyHidden)
- **Embla Carousel** - Touch-friendly carousels with wheel gesture support
- **a11y-dialog** - Accessible modal dialogs
- **Floating UI** - Advanced positioning for tooltips and popovers
- **Pinch Zoom** - Touch-based image zoom
- **Body Scroll Lock** - Prevent scroll on background when modals open

**Routing & State**

- **React Router** - Client-side routing (used for Klevu search SPA)

**Utilities**

- **Day.js** - Lightweight date manipulation (for delivery countdown feature)
- **Postcode Validator** - International postcode/zipcode validation
- **he** - HTML entity encoding/decoding

## Browser Support

Targets modern browsers with the following Browserslist configuration:

- \> 0.5% market share
- Last 2 major versions
- Firefox ESR
- Not dead browsers

## License

**Proprietary and Confidential**

This is a private, proprietary Shopify theme framework. All rights reserved.

Unauthorized copying, distribution, modification, or use of this software, via any medium, is strictly prohibited without explicit written permission from the copyright holder.

For authorized collaborators: Contact Miguel at miguel-chitta@hotmail.com for any modifications or questions.
