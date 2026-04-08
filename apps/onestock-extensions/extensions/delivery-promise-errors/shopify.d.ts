import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/delivery-promise-errors.tsx' {
  const shopify:
    | import('@shopify/ui-extensions/purchase.checkout.shipping-option-list.render-after').Api
    | import('@shopify/ui-extensions/purchase.checkout.pickup-point-list.render-after').Api;
  const globalThis: { shopify: typeof shopify };
}
