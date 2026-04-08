# Delivery Promise Function (Delivery Customization)

A Shopify Function that runs server-side to hide shipping options that OneStock says are unavailable.

## Extension Details

| Property | Value |
|----------|-------|
| Type | Function (Delivery Customization) |
| Target | `cart.delivery-options.transform.run` |
| API | `delivery_customization` |

## What It Does

1. Finds the delivery group containing OneStock-managed options ("Standard Delivery", "Express Shipping")
2. Reads the `onestock.delivery-promise` cart metafield (written by the delivery-promise UI extension)
3. Applies filtering logic:
   - **No metafield**: Hides all OneStock delivery options (safe default until the UI extension writes data)
   - **Metafield present**: Hides shipping options whose titles are NOT in the valid `options` keys
   - **`canCollect` is false**: Hides `PICKUP_POINT` and `LOCAL` type options across all delivery groups
4. Never hides options it doesn't manage

## Key Files

- `src/cart-delivery-options-transform-run.ts` — Main function logic
- `src/cart-delivery-options-transform-run.graphql` — Input query (delivery groups, options, metafield)
- `generated/api.ts` — Auto-generated TypeScript types from the GraphQL schema

## Input Query

The function receives:
- `cart.deliveryGroups[].deliveryOptions[]` — title, handle, deliveryMethodType
- `cart.deliveryPromise.jsonValue` — the OneStock metafield data

## Activation

After deploying, activate via GraphQL:

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

Requires `write_delivery_customizations` scope on the app.

## Debugging

View function logs in the Shopify admin:
1. Go to Settings > Apps > OneStock Delivery Promise
2. Enable "Share function logs"
3. Check the function execution input/output in the app's function logs
