import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/delivery-promise.tsx' {
  const shopify: import('@shopify/ui-extensions/purchase.checkout.delivery-address.render-after').Api;
  const globalThis: { shopify: typeof shopify };
}

//@ts-ignore
declare module './src/delivery-promise.types.ts' {
  const shopify: import('@shopify/ui-extensions/purchase.checkout.delivery-address.render-after').Api;
  const globalThis: { shopify: typeof shopify };
}

//@ts-ignore
declare module './src/utilities.tsx' {
  const shopify: import('@shopify/ui-extensions/purchase.checkout.delivery-address.render-after').Api;
  const globalThis: { shopify: typeof shopify };
}
