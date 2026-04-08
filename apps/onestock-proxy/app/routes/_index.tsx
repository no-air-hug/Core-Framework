import {json} from '@shopify/remix-oxygen';

export function loader() {
  return json({
    message: 'OneStock Proxy API',
    endpoints: {
      deliveryPromise: 'POST /api/onestock/delivery-promise',
    },
  });
}
