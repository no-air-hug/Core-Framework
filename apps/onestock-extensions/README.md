# OneStock Delivery Promise Extensions

Shopify checkout extensibility app that integrates OneStock's Delivery Promise API to display accurate delivery dates and filter delivery options based on real-time stock availability.

## Architecture

The app consists of 5 extensions that communicate via a cart metafield (`onestock.delivery-promise`):

1. **delivery-promise** (UI Extension) - Fetches delivery promises from the OneStock proxy and writes results to the cart metafield
2. **delivery-promise-function** (Delivery Customization) - Reads the metafield and hides shipping options that OneStock says are unavailable
3. **delivery-promise-errors** (UI Extension) - Displays error banners when delivery is unavailable
4. **delivery-promise-shipping-option-text** (UI Extension) - Shows ETA/cutoff text under each shipping option
5. **pickup-point-delivery-option-generators** (Function) - Generates Click & Collect pickup points by calling the proxy for nearby stores with stock

```
Checkout loads
     |
     v
delivery-promise extension
  -> Calls OneStock proxy (Hydrogen app on Oxygen)
  -> Proxy authenticates with OneStock (token-based)
  -> Writes response to cart metafield
     |
     v
Cart Metafield: onestock.delivery-promise (JSON)
     |
     +---> delivery-promise-function (hides invalid shipping options)
     +---> delivery-promise-shipping-option-text (shows ETAs)
     +---> delivery-promise-errors (shows error banners)

Separately:
pickup-point-delivery-option-generators (Shopify Function)
  -> Shopify calls fetch() with customer lat/lon
  -> Function builds request to proxy /api/onestock/pickup-points
  -> Shopify calls the proxy server-side
  -> Function run() maps response to pickup point options
  -> delivery-promise extension picks up selected pickup point
```

## Prerequisites

- The **OneStock Proxy** Hydrogen app must be deployed on Oxygen (see `apps/onestock-proxy/README.md`)
- Shopify shipping rates must be configured with exact names matching OneStock delivery methods

## Setup

### 1. Install Dependencies

```bash
cd apps/onestock-extensions
pnpm install
```

### 2. Configure Shop Metafields

Set the following metafields in the Shopify admin (Settings > Custom data > Shop) or via GraphQL.

| Namespace | Key | Type | Value |
|-----------|-----|------|-------|
| `integrations` | `onestock_proxy_url` | `single_line_text_field` | Oxygen deployment URL (e.g. `https://onestock-proxy-xxxxx.o2.myshopify.dev`) |
| `integrations` | `onestock_sales_channel` | `single_line_text_field` | `shopify_demo_store` |
| `integrations` | `onestock_delivery_mapping` | `single_line_text_field` | See below |

All metafields must have **Storefront access** set to `Public read`.

#### Delivery Mapping

```json
{"Standard Delivery":"standard_delivery","Express Shipping":"express_shipping","Click and Collect":"c&c_standard"}
```

The keys must match your Shopify shipping rate names exactly (case-sensitive).

#### GraphQL Mutation

```graphql
mutation {
  metafieldsSet(metafields: [
    {
      namespace: "integrations"
      key: "onestock_proxy_url"
      type: "single_line_text_field"
      value: "https://onestock-proxy-672b6a0358db64477bf2.o2.myshopify.dev"
      ownerId: "gid://shopify/Shop/YOUR_SHOP_ID"
    },
    {
      namespace: "integrations"
      key: "onestock_sales_channel"
      type: "single_line_text_field"
      value: "shopify_demo_store"
      ownerId: "gid://shopify/Shop/YOUR_SHOP_ID"
    },
    {
      namespace: "integrations"
      key: "onestock_delivery_mapping"
      type: "single_line_text_field"
      value: "{\"Standard Delivery\":\"standard_delivery\",\"Express Shipping\":\"express_shipping\",\"Click and Collect\":\"c&c_standard\"}"
      ownerId: "gid://shopify/Shop/YOUR_SHOP_ID"
    }
  ]) {
    metafields { id namespace key value }
    userErrors { field message }
  }
}
```

### 3. Configure Shipping Rates

In Shopify admin (Settings > Shipping and delivery), create shipping rates with these exact names:

- **Standard Delivery** - maps to OneStock `standard_delivery`
- **Express Shipping** - maps to OneStock `express_shipping`

Set whatever prices you want. The function will hide them if OneStock says they're unavailable.

### 4. Register the Delivery Customization

After deploying, register the function via GraphiQL:

```graphql
mutation {
  deliveryCustomizationCreate(
    deliveryCustomization: {
      functionHandle: "delivery-promise-function"
      title: "[OneStock] Delivery Options Filter"
      enabled: true
    }
  ) {
    deliveryCustomization { id }
    userErrors { field message }
  }
}
```

Verify it's active:

```graphql
{
  deliveryCustomizations(first: 10) {
    nodes { id title enabled }
  }
}
```

### 5. Add Extension Blocks to Checkout

In Shopify admin > Settings > Checkout > Customize, add the app blocks:
- [OneStock] Delivery Promise
- [OneStock] Shipping Option Information
- [OneStock] Delivery Promise Errors

Enable "Include block in Shop Pay" and "Automatically expand sections to show app" for each.

### 6. Development

```bash
pnpm shopify app dev
```

### 7. Deploy

```bash
pnpm shopify app deploy
```

## App Scopes

The app requires these access scopes (configured in `shopify.app.onestock-delivery-promise.toml`):

- `write_cart_transforms` - for the delivery customization function
- `write_delivery_customizations` - for registering the delivery customization

## Function Behavior

The delivery customization function (`delivery-promise-function`) runs server-side and:

1. Finds the delivery group containing "Standard Delivery" or "Express Shipping"
2. Reads the `onestock.delivery-promise` cart metafield
3. If no metafield exists: hides all OneStock delivery options (safe default)
4. If metafield exists: hides shipping options not in the valid OneStock response
5. Hides pickup/local options across all delivery groups when `canCollect` is false

## Known Limitations

- **Shipping option text**: The `useMetafield` hook in the `purchase.checkout.shipping-option-item.render-after` target may not read dynamically written cart metafields in dev mode. Test in production after deploying.
- **Pick up tab**: The "Ship"/"Pick up" strategy toggle is controlled by Shopify based on store pickup locations. The function cannot hide the tab itself, only individual pickup options within it.
- **First checkout timing**: The function runs before the extension writes the metafield on the first checkout load. The metafield gets committed during checkout progression and works on subsequent evaluations.

## OneStock Environment

| Key | Value |
|-----|-------|
| Site ID | `p0009` |
| Backoffice URL | `https://admin.eu1.qualif.onestock-retail.com/p0009` |
| API Base URL | `https://p0009.api.eu1.qualif.onestock-retail.com` |
| API Version | `v4` |
| Sales Channel | `shopify_demo_store` |

## Delivery Methods

| Display Name | OneStock ID |
|--------------|-------------|
| Standard Delivery | `standard_delivery` |
| Express Shipping | `express_shipping` |
| Click and Collect | `c&c_standard` |

## Troubleshooting

### Function not filtering options

1. Check the delivery customization is enabled: `deliveryCustomizations` query in GraphiQL
2. Check function logs in Shopify admin (Settings > Custom data > Functions, or app page > Share function logs)
3. Verify shipping rate names match exactly ("Standard Delivery", "Express Shipping")
4. Verify the cart metafield exists: check function input logs for `deliveryPromise.jsonValue`

### OneStock API errors

1. Check the proxy app logs on Oxygen
2. Verify environment variables are set in Oxygen (Hydrogen > OneStock Proxy > Environments > Production)
3. Test credentials directly: `curl -X POST 'https://p0009.api.eu1.qualif.onestock-retail.com/v4/login' -H 'Content-Type: application/json' -d '{"user_id":"tryzens","password":"...","site_id":"p0009"}'`

### Extensions not showing

1. Ensure the store has Shopify Plus (required for checkout extensibility)
2. Check that app blocks are added in Checkout customization
3. Check browser console for extension errors

### Function typegen fails with "Cannot convert undefined or null to object"

Shopify CLI's `function typegen` command uses `npm exec` internally, which can resolve to an ancient deprecated `graphql-code-generator` package instead of the local `@graphql-codegen/cli`. To work around this, run codegen directly from the extension directory:

```bash
cd extensions/pickup-point-delivery-option-generators
npx graphql-codegen --config package.json
```

For the `delivery-promise-function`, the same approach works:
```bash
cd extensions/delivery-promise-function
npx graphql-codegen --config package.json
```
