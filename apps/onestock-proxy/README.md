# OneStock Proxy (Hydrogen on Oxygen)

A lightweight Hydrogen app deployed on Shopify Oxygen that acts as a secure proxy between Shopify checkout extensions and the OneStock Delivery Promise API. Handles authentication, CORS, and keeps OneStock credentials server-side.

## Why a Proxy?

Shopify checkout extensions run in a sandboxed environment that:
- Requires HTTPS for all fetch requests
- Cannot store secrets securely (client-side code)
- Is subject to CORS restrictions when calling external APIs

This proxy solves all three by running on Oxygen (HTTPS by default), storing OneStock credentials as environment variables, and returning proper CORS headers.

## Architecture

```
Checkout Extension
     |
     | POST /api/onestock/delivery-promise
     | (salesChannel, lineItems, destination, deliveryMethods)
     v
OneStock Proxy (Oxygen)
     |
     | 1. POST /v4/login -> get token (cached)
     | 2. GET /v4/delivery_promises?{payload with token}
     v
OneStock API
     |
     | delivery_options with status, ETAs, carriers
     v
Response back to extension
```

The proxy is a pure Cloudflare Worker (no Remix routing) that handles:
- CORS preflight (OPTIONS) and response headers
- Token-based authentication (login + auto-retry on 401)
- Request validation via Zod schemas
- JSON response forwarding

## API Endpoints

### POST `/api/onestock/delivery-promise`

Called by the checkout delivery-promise UI extension to get delivery ETAs and availability.

Request body:
```json
{
  "salesChannel": "shopify_demo_store",
  "totalPrice": 49.99,
  "lineItems": [
    { "sku": "1001183", "qty": 2 }
  ],
  "deliveryMethods": ["standard_delivery", "express_shipping", "c&c_standard"],
  "destination": {
    "location": {
      "country": "GB",
      "state": "ENG",
      "zip": "EC2A 2AS"
    }
  }
}
```

Response: OneStock delivery promise response (passed through directly).

### POST `/api/onestock/pickup-points`

Called by the `pickup-point-delivery-option-generators` Shopify Function to find nearby stores with Click & Collect availability. Has a 1.9 second hard deadline (Shopify functions timeout at 2s for external requests).

Request body:
```json
{
  "lat": 51.5074,
  "lon": -0.1278,
  "cart": {
    "salesChannel": "shopify_demo_store",
    "collectionMethods": ["c&c_standard"],
    "items": [
      { "sku": "1001183", "quantity": 1 }
    ],
    "totalPrice": 49.99
  }
}
```

Response:
```json
{
  "deliveryPoints": [
    {
      "id": "store-001",
      "name": "London Store",
      "location": {
        "address": {
          "address1": "20 Appold Street",
          "city": "London",
          "countryCode": "GB",
          "zip": "EC2A 2AS"
        },
        "geometry": { "latitude": 51.5207, "longitude": -0.0840 }
      },
      "openingHours": [
        { "day": "MONDAY", "periods": [{ "openingTime": "09:00:00", "closingTime": "17:00:00" }] }
      ],
      "deliveryPromise": { "delivery_method": "c&c_standard", "status": "valid", "eta_end": 1772308801 },
      "collectPromiseText": "Collect from 26 Feb"
    }
  ]
}
```

The proxy:
1. Calls OneStock `/v4/endpoints` API to find nearby stores by geo-proximity
2. For each store, calls `/v4/delivery_promises` with the store's endpoint ID
3. Filters to stores with valid delivery promises
4. Formats addresses, opening hours, and collect promise text

## Setup

### 1. Install Dependencies

```bash
cd apps/onestock-proxy
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```env
SESSION_SECRET="any-random-string"
ONESTOCK_SITE_ID="p0009"
ONESTOCK_ENVIRONMENT="api.eu1.qualif"
ONESTOCK_API_VERSION="v4"
ONESTOCK_AUTH_USER="tryzens"
ONESTOCK_AUTH_PASSWORD="your-password-here"
```

### 3. Local Development

```bash
pnpm shopify hydrogen dev
```

The local server runs on `http://localhost:3000`. Note: checkout extensions require HTTPS, so local dev is only useful for testing the proxy directly (e.g. with curl).

### 4. Deploy to Oxygen

```bash
pnpm shopify hydrogen deploy --force
```

Select **Production** environment. After deploying:

1. Go to Hydrogen > OneStock Proxy > Environments > Production
2. Set **URL privacy** to **Public** (required for checkout extensions to reach it)
3. Use the **environment URL** (e.g. `https://onestock-proxy-xxxxx.o2.myshopify.dev`), not the per-deployment URL

### 5. Push Environment Variables to Oxygen

```bash
pnpm shopify hydrogen env push
```

Or set them manually in the Oxygen admin under Environment Variables. Verify the password is correct (special characters can get mangled during push).

### 6. Update Shop Metafield

Set the `integrations.onestock_proxy_url` shop metafield to the Oxygen environment URL:

```graphql
mutation {
  metafieldsSet(metafields: [{
    namespace: "integrations"
    key: "onestock_proxy_url"
    value: "https://onestock-proxy-672b6a0358db64477bf2.o2.myshopify.dev"
    type: "single_line_text_field"
    ownerId: "gid://shopify/Shop/YOUR_SHOP_ID"
  }]) {
    metafields { id }
    userErrors { field message }
  }
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SESSION_SECRET` | Session encryption key | Any random string |
| `ONESTOCK_SITE_ID` | OneStock site identifier | `p0009` |
| `ONESTOCK_ENVIRONMENT` | OneStock API environment | `api.eu1.qualif` |
| `ONESTOCK_API_VERSION` | OneStock API version | `v4` |
| `ONESTOCK_AUTH_USER` | OneStock API username | `tryzens` |
| `ONESTOCK_AUTH_PASSWORD` | OneStock API password | (keep secret) |
| `ONESTOCK_CKC_STORES_LIMIT` | Max nearby stores to return for C&C (optional) | `15` |

## Testing

Test the proxy directly with curl:

```bash
# Test CORS preflight
curl -v -X OPTIONS 'https://onestock-proxy-xxxxx.o2.myshopify.dev/api/onestock/delivery-promise' \
  -H 'Origin: https://extensions.shopifycdn.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Content-Type'

# Test delivery promise
curl -X POST 'https://onestock-proxy-xxxxx.o2.myshopify.dev/api/onestock/delivery-promise' \
  -H 'Content-Type: application/json' \
  -d '{"salesChannel":"shopify_demo_store","totalPrice":100,"lineItems":[{"sku":"1001183","qty":1}],"deliveryMethods":["standard_delivery","express_shipping"],"destination":{"location":{"country":"GB","zip":"EC2A 2AS"}}}'

# Test pickup points
curl -X POST 'https://onestock-proxy-xxxxx.o2.myshopify.dev/api/onestock/pickup-points' \
  -H 'Content-Type: application/json' \
  -d '{"lat":51.5074,"lon":-0.1278,"cart":{"salesChannel":"shopify_demo_store","collectionMethods":["c&c_standard"],"items":[{"sku":"1001183","quantity":1}],"totalPrice":100}}'
```

## Troubleshooting

### CORS errors from checkout extension
- Verify the Oxygen environment is set to **Public** (not Private)
- Use the **environment URL** (`*.o2.myshopify.dev`), not the per-deployment URL (`*.myshopify.dev`)

### 401 authentication errors
- Verify `ONESTOCK_AUTH_USER` and `ONESTOCK_AUTH_PASSWORD` are set correctly in Oxygen
- Test login directly: `curl -X POST 'https://p0009.api.eu1.qualif.onestock-retail.com/v4/login' -H 'Content-Type: application/json' -d '{"user_id":"tryzens","password":"...","site_id":"p0009"}'`
- Special characters in passwords can get corrupted during `env push` - set them manually in the Oxygen admin

### DNS / 530 errors
- Verify `ONESTOCK_SITE_ID` is correct (`p0009`, not `P00009`)
- Verify environment variables are pushed to Oxygen (`pnpm shopify hydrogen env push`)
- Redeploy after pushing env variables
