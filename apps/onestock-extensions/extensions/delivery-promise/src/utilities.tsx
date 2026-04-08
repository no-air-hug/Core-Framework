import { type DeliveryPromise } from "./delivery-promise.types";

export function updateDeliveryPromise(
  value: DeliveryPromise | ((prev: DeliveryPromise) => DeliveryPromise),
) {
  let deliveryPromise: DeliveryPromise = {
    source: "onestock",
    canDeliver: false,
    canCollect: false,
    options: {},
  };

  const m = shopify.metafields.value.find(
    (m) => m.namespace === "onestock" && m.key === "delivery-promise",
  );
  if (m?.valueType === "json_string" && typeof m.value === "string") {
    try {
      deliveryPromise = JSON.parse(m.value);
    } catch {
      // keep default
    }
  }

  const result = JSON.stringify(
    typeof value === "function" ? value(deliveryPromise) : value,
  );

  shopify.applyMetafieldChange({
    type: "updateCartMetafield",
    metafield: {
      namespace: "onestock",
      key: "delivery-promise",
      value: result,
      type: "json_string",
    },
  });
}
