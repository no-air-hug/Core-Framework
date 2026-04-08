# Delivery Promise Shipping Option Text

A UI extension that displays estimated delivery dates and cutoff information under each shipping option in the checkout.

## Extension Details

| Property | Value |
|----------|-------|
| Type | UI Extension |
| Target | `purchase.checkout.shipping-option-item.render-after` |
| Capabilities | `api_access` |

## What It Does

Renders below each shipping option with delivery ETA information from OneStock:

- **Express Shipping** (with cutoff today): "Order within X hrs, Y mins to receive your order tomorrow"
- **Express Shipping** (cutoff in future): "Order by [time] on [date] to receive your order by [date]"
- **Standard Delivery**: "Order now for delivery between [start date] and [end date]"

If the metafield is absent or the shipping option has no matching OneStock data, the extension renders nothing.

## Key Files

- `src/delivery-promise-shipping-option-text.tsx` — Extension component
- `shopify.extension.toml` — Configuration with metafield declaration

## How It Reads Data

Uses `useAppMetafields` (the non-deprecated replacement for `useMetafield`) to read the `onestock.delivery-promise` cart metafield, filtered by `type: "cart"`. The metafield must be declared in the TOML:

```toml
[[extensions.metafields]]
namespace = "onestock"
key = "delivery-promise"
```

The extension matches `shippingOptionTarget.title` against the keys in `deliveryPromise.options` to find the corresponding ETA data.

## Known Limitation

In dev mode, `useAppMetafields` may not reliably read cart metafields that were dynamically written by another extension (`delivery-promise`) in the same checkout session. This is a Shopify sandbox timing issue. The extension works correctly after deployment when the metafield has been committed to the cart from a previous checkout evaluation.
