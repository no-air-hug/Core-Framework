# Webpack Configuration Documentation

This directory contains the webpack build configuration for the Shopify theme framework. The setup uses a modular approach with base configuration and environment-specific overrides.

## File Structure

```
.webpack/
├── webpack.config.js      # Base configuration (entry point)
├── webpack.dev.js         # Development mode overrides
├── webpack.prod.js        # Production mode overrides
└── plugins/
    ├── AssetsSnippetPlugin.js    # Generates theme_assets.liquid snippet & manifest
    ├── DoNotEditNoticePlugin.js  # Adds warning comments to generated files
    └── SectionsSchemaPlugin.js   # Processes Shopify section schemas
```

## Architecture

The configuration follows a **base + environment merge** pattern:

1. **Base Config** (`webpack.config.js`) - Common settings for all environments
2. **Dev Config** (`webpack.dev.js`) - Development-specific overrides (merged with base)
3. **Prod Config** (`webpack.prod.js`) - Production-specific overrides (merged with base)

The final config is determined by the `production` environment flag:

```bash
# Development (default)
webpack

# Production
webpack --env production
```

## Configuration Details

### Base Configuration (`webpack.config.js`)

#### Entry Points

- **Main bundle**: `./src/js/index.ts` + `./src/scss/main.scss`
- **Section styles**: Automatically discovers all `*.scss` files in `src/scss/sections/` and creates separate entry points (e.g., `section-product`, `section-hero`)

#### Module Rules

1. **SVG Files** (`*.svg`)

   - Uses `@svgr/webpack` to transform SVGs into React components

2. **TypeScript/JavaScript** (`*.ts`, `*.tsx`, `*.js`, `*.jsx`)

   - **Babel Loader** with:
     - TypeScript preset
     - Modern ES features
     - React JSX transform
     - Runtime helpers for smaller bundles
   - Excludes `node_modules`

3. **Stylesheets** (`*.scss`, `*.css`)
   - Processing pipeline:
     1. `sass-loader` (modern API) - Compiles SCSS
     2. `postcss-loader` - Processes CSS (includes Tailwind)
     3. `css-loader` - Resolves CSS imports (with `url: false` to prevent asset processing)
     4. `MiniCssExtractPlugin.loader` - Extracts CSS into separate files

#### Code Splitting Strategy

The optimization configuration splits code into logical chunks:

- **Framework chunk** (`framework.min.js`): React, React-DOM, and Scheduler
  - Priority: 40 (highest)
  - Enforced separation from other code
- **Library chunk** (`lib.min.js`): All other `node_modules` dependencies
  - Shared across all entry points
- **Entry chunks**: Main application code and section-specific styles
  - Only chunks used in 2+ places are split out

#### Output Configuration

- **Path**: `dist/` (or `SHOPIFY_FLAG_PATH` if set)
- **JavaScript**: `assets/[name].min.js`
- **CSS**: `assets/[name].min.css`
- **Module format**: ES Modules (`outputModule: true`)
- **Public path**: Empty (relative paths)

#### Externals

- `jquery` → `jQuery` (assumes jQuery is loaded globally in Shopify theme)

### Development Configuration (`webpack.dev.js`)

- **Mode**: `development` (no minification, source maps enabled)
- **Stats**: Minimal output (errors only, with sass-loader debug logs)
- **Watch Options**: Ignores `dist/` and `node_modules/` for faster rebuilds
- **No output cleaning**: Preserves existing files

### Production Configuration (`webpack.prod.js`)

- **Mode**: `production` (enables optimizations)
- **Output cleaning**: Removes old files before build
- **Minimizers**:
  - **TerserPlugin**: JavaScript minification
    - Disables comparison optimizations (for better debugging)
    - Inline level 2
    - ECMAScript 2018 target
  - **CssMinimizerPlugin**: CSS minification using LightningCSS
    - Browser targets from `browserslist`
    - Removes all comments
    - Supports custom media queries

## Custom Plugins

### AssetsSnippetPlugin

**Purpose**: Generates the `theme_assets.liquid` snippet and build manifest.

**Features**:

1. **Theme Assets Snippet** (`snippets/theme_assets.liquid`):

   - Auto-generated Liquid snippet for loading theme assets
   - Supports CSS and JS files
   - Handles module scripts
   - Provides import map functionality
   - Usage:
     ```liquid
     {%- render 'theme_assets', import_map: true -%}
     {%- render 'theme_assets' with 'main.min.js' -%}
     {%- render 'theme_assets' with 'section-product.min.css', preload: true -%}
     ```

2. **Build Manifest** (Production only):
   - Creates `assets/__manifest` JSON file
   - Maps asset filenames to content hashes
   - Useful for cache invalidation and CI/CD tracking
   - Excludes template JSON files

**Configuration**:

```javascript
new AssetsSnippetPlugin({
  manifestFileName: process.env.BUILD_MANIFEST || "assets/__manifest",
});
```

#### Asset Loading Flow

The asset loading system bridges webpack's code-splitting with Shopify's asset URL system. Here's the complete flow:

**Build Time:**

1. **CopyPlugin** copies the placeholder file:

   - Source: `shopify/snippets/theme/_assets.liquid` (placeholder with comments only)
   - Destination: `dist/snippets/theme_assets.liquid` (flattened path)

2. **AssetsSnippetPlugin** generates the actual snippet content:

   - Runs at `PROCESS_ASSETS_STAGE_ADDITIONS`
   - Scans all webpack chunks to build an import map
   - Generates Liquid code that:
     - Creates a `<script data-public-path>` tag with the Shopify asset base path
     - Includes a JSON import map mapping filenames to Shopify's cache-busting query strings
     - Provides helper functions to load individual assets

3. **Generated snippet structure**:
   ```liquid
   {% elsif import_map == true %}
     <script type="application/json" data-public-path="...">
       {"main.min.js": "?v=1234567890", "framework.min.js": "?v=9876543210", ...}
     </script>
   {% endif %}
   ```

**Runtime (Browser):**

1. **Theme layout** renders the import map:

   ```liquid
   {%- render 'theme_assets', import_map: true -%}
   ```

   This outputs the `<script data-public-path>` tag in the HTML head.

2. **`public-path.ts`** (imported first in `src/js/index.ts`):

   - Reads the `data-public-path` attribute to set `__webpack_public_path__`
   - Parses the JSON import map from the script tag
   - Overrides webpack's internal filename getters:
     - `__webpack_get_script_filename__` - Appends query strings to JS chunks
     - `__webpack_require__.miniCssF` - Appends query strings to CSS chunks

3. **Dynamic chunk loading**:
   - When webpack needs to load a code-split chunk (e.g., `framework.min.js`)
   - It calls the overridden filename getter
   - The getter appends the Shopify query string from the import map
   - Result: `framework.min.js?v=9876543210` loads correctly from Shopify's CDN

**Why This Is Necessary:**

Shopify adds cache-busting query strings to asset URLs (e.g., `?v=1234567890`). Without this system:

- Code-split chunks would fail to load (wrong paths, missing query strings)
- Shopify's CDN would reject requests
- Dynamic imports would break

The `public-path.ts` file is marked as a side effect in `package.json` to ensure webpack never tree-shakes it.

### DoNotEditNoticePlugin

**Purpose**: Adds warning comments to auto-generated files in production builds.

**Behavior**:

- Only runs in production mode
- Adds Liquid comment headers to `.liquid` files
- Warns developers not to manually edit generated files
- Includes contact information

### SectionsSchemaPlugin

**Purpose**: Processes Shopify section schema files and injects them into section templates.

**How it works**:

1. Scans `shopify/sections/` directory for section files
2. Looks for corresponding schema files in `shopify/sections/schema/`
3. Supports both TypeScript (`.ts`) and JavaScript (`.js`) schema files
4. Injects schema JSON into section templates using `{% schema %}` tags
5. Handles watch mode efficiently (only rebuilds changed sections)

**Supported Section Structures**:

- **File-based**: `section-name.liquid` + `schema/section-name.ts`
- **Folder-based**: `section-name/template.liquid` + `section-name/schema.ts`
- **JSON sections**: `section-name.json` (copied as-is)

**Configuration**:

```javascript
new SectionsSchemaPlugin({
  sections: path.resolve(WORK_DIR, "./shopify/sections"),
  schema: path.resolve(WORK_DIR, "./shopify/sections/schema"),
});
```

**Verbose Mode**: Set `WEBPACK_VERBOSE=1` for detailed logging

### CopyPlugin

**Purpose**: Copies static files to the output directory.

**Patterns**:

1. **Shopify files**: Copies everything from `./shopify/` except sections

   - Snippets are flattened to `snippets/` (removes nested directories)
     - Example: `shopify/snippets/theme/_assets.liquid` → `dist/snippets/theme_assets.liquid`
   - Other files go to root of output
   - **Note**: The `theme_assets.liquid` placeholder is copied first, then overwritten by `AssetsSnippetPlugin`

2. **jQuery**: Concatenates all files from `./src/js/jquery/` into `assets/jquery.js`
   - Silently fails if directory doesn't exist

### Other Plugins

- **MiniCssExtractPlugin**: Extracts CSS into separate files
- **RemoveEmptyScriptsPlugin**: Removes empty JavaScript files created by CSS extraction

## Environment Variables

| Variable            | Purpose                       | Default              | Used In              |
| ------------------- | ----------------------------- | -------------------- | -------------------- |
| `GITHUB_WORKSPACE`  | GitHub Actions workspace path | `../` (project root) | Base config          |
| `SHOPIFY_FLAG_PATH` | Override output directory     | `dist/`              | Base config          |
| `BUILD_MANIFEST`    | Custom manifest filename      | `assets/__manifest`  | AssetsSnippetPlugin  |
| `WEBPACK_VERBOSE`   | Enable verbose logging        | `undefined`          | SectionsSchemaPlugin |

**Note**: All environment variables have sensible defaults for local development.

## Build Output Structure

```
dist/
├── assets/
│   ├── main.min.js              # Main JavaScript bundle
│   ├── main.min.css             # Main stylesheet
│   ├── framework.min.js         # React framework chunk
│   ├── lib.min.js               # Other dependencies
│   ├── section-*.min.css        # Section-specific styles
│   ├── jquery.js                # Concatenated jQuery
│   └── __manifest               # Build manifest (production only)
├── snippets/
│   └── theme_assets.liquid      # Auto-generated asset loader
├── sections/
│   └── *.liquid                 # Processed section files with schemas
└── [other shopify files]        # Copied from ./shopify/
```

## Usage

### Development

```bash
# Watch mode (default)
webpack --watch

# One-time build
webpack
```

### Production

```bash
webpack --env production
```

### With Custom Output Path

```bash
SHOPIFY_FLAG_PATH=./custom-dist webpack --env production
```

## Cache Configuration

The build uses **filesystem caching** for faster rebuilds:

- Cache location: `.webpack_cache/` (in project root)
- Cache version: `1` (increment to invalidate)
- Dependencies tracked:
  - Webpack config file
  - `package.json`

## Notes

- **Module Format**: Outputs ES Modules (`type="module"`), not CommonJS
- **Path Normalization**: All path operations normalize Windows/Unix separators
- **Section Schemas**: Schema files are processed with `jiti` (supports TypeScript without compilation)
- **Watch Mode**: In development, only changed sections are rebuilt (not all sections)
- **Manifest**: Currently disabled for local development (commented out in config)
- **Asset Loading**: `src/js/utils/public-path.ts` must be imported first (it's the first import in `src/js/index.ts`) to configure webpack's runtime before any code-split chunks are loaded

## Troubleshooting

### Build fails with schema errors

- Check that schema files export objects (not functions or primitives)
- Verify schema file paths match section names
- Enable verbose mode: `WEBPACK_VERBOSE=1 webpack`

### Styles not updating

- Clear webpack cache: Delete `.webpack_cache/` directory
- Check that SCSS files are in the correct location
- Verify Tailwind configuration

### Sections not generating

- Ensure schema files exist in `shopify/sections/schema/`
- Check file naming matches (e.g., `product.liquid` → `schema/product.js`)
- Review console output for specific errors

### Code-split chunks failing to load

- Verify `theme_assets.liquid` snippet is rendered with `import_map: true` in theme layouts
- Check browser console for 404 errors on chunk files
- Ensure `public-path.ts` is imported first in `src/js/index.ts`
- Verify the import map script tag exists in the HTML head with `data-public-path` attribute
- Check that Shopify's asset URLs include query strings (if missing, the import map may be empty)
