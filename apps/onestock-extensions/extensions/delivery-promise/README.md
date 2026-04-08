# Delivery Promise (Orchestrator Extension)

The main UI extension that fetches OneStock delivery promise data and writes it to a cart metafield for other extensions to consume.

## Extension Details

| Property | Value |
|----------|-------|
| Type | UI Extension |
| Target | `purchase.checkout.delivery-address.render-after` |
| Capabilities | `api_access`, `network_access`, `block_progress` |

## What It Does

1. Queries shop metafields for OneStock configuration (proxy URL, sales channel, delivery mapping)
2. Watches the shipping address for changes (country, state, zip)
3. On address change, calls the Hydrogen proxy at `/api/onestock/delivery-promise`
4. Writes the OneStock response to the `onestock.delivery-promise` cart metafield
5. Monitors pickup point selection and updates the metafield with C&C data
6. Sets a `delivery-type` cart attribute (`"delivery"` or `"click-collect"`)

## Cart Metafield Format

The extension writes JSON to `onestock.delivery-promise`:

```json
{
  "source": "onestock",
  "canDeliver": true,
  "canCollect": true,
  "options": {
    "Standard Delivery": {
      "delivery_method": "standard_delivery",
      "status": "valid",
      "eta_start": 1772467201,
      "eta_end": 1772654401,
      "cutoff": 1772035200
    },
    "Express Shipping": { ... },
    "Click and Collect": { ... }
  }
}
```

## Key Files

- `src/delivery-promise.tsx` — Main extension logic (address watcher, proxy fetch, pickup point handler)
- `src/delivery-promise.types.ts` — TypeScript types for `DeliveryPromise`, `DeliveryOption`, delivery method title constants
- `src/utilities.tsx` — `updateDeliveryPromise()` helper that reads/writes the cart metafield

## Capabilities

- **`network_access`** — Required to call the Hydrogen proxy from the checkout sandbox. Must also be approved in the Shopify Partners app settings (API access requests > Allow network access).
- **`block_progress`** — Blocks checkout progression until the metafield is written, ensuring the delivery function has data before evaluating options.
- **`api_access`** — Required for Storefront API queries (reading shop metafields).

## Shop Metafields Read

| Namespace | Key | Purpose |
|-----------|-----|---------|
| `integrations` | `onestock_proxy_url` | Hydrogen proxy URL on Oxygen |
| `integrations` | `onestock_sales_channel` | OneStock sales channel ID |
| `integrations` | `onestock_delivery_mapping` | JSON mapping of display names to OneStock method IDs |
