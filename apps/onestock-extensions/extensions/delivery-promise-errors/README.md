# Delivery Promise Errors

A UI extension that displays error banners when OneStock indicates items cannot be shipped or collected.

## Extension Details

| Property | Value |
|----------|-------|
| Type | UI Extension |
| Targets | `purchase.checkout.shipping-option-list.render-after`, `purchase.checkout.pickup-point-list.render-after` |
| Capabilities | `api_access` |

## What It Does

Reads the `onestock.delivery-promise` cart metafield (via `useAppMetafields`) and shows contextual error banners:

- **Shipping target** (`shipping-option-list.render-after`): If `canDeliver` is false, shows "Your bag contains items that cannot all be shipped"
- **Pickup target** (`pickup-point-list.render-after`): If both `canDeliver` and `canCollect` are false, shows "Your bag contains items that cannot all be collected or shipped"

If the metafield is absent or the source is not `"onestock"`, the extension renders nothing.

## Key Files

- `src/delivery-promise-errors.tsx` — Extension component
- `shopify.extension.toml` — Two targeting blocks (one per checkout target)

## Metafield Declaration

The TOML declares access to the cart metafield:

```toml
[[extensions.metafields]]
namespace = "onestock"
key = "delivery-promise"
```

This is required for `useAppMetafields` to return the metafield data.
