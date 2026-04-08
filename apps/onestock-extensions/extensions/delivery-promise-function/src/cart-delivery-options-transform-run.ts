import type {
  CartDeliveryOptionsTransformRunInput,
  CartDeliveryOptionsTransformRunResult,
} from "../generated/api";

type DeliveryPromise = {
  source: "onestock";
  canDeliver: boolean;
  canCollect: boolean;
  options: Record<string, unknown>;
};

const ONESTOCK_DELIVERY_TITLES = [
  "Standard Delivery",
  "Express Shipping",
];

const NO_CHANGES: CartDeliveryOptionsTransformRunResult = {
  operations: [],
};

export function cartDeliveryOptionsTransformRun(
  input: CartDeliveryOptionsTransformRunInput,
): CartDeliveryOptionsTransformRunResult {
  const { deliveryGroups } = input.cart;

  const oneStockDeliveryGroup = deliveryGroups.find((g) =>
    g.deliveryOptions.some((o) =>
      ONESTOCK_DELIVERY_TITLES.includes(o.title ?? "_"),
    ),
  );

  if (!oneStockDeliveryGroup) {
    return NO_CHANGES;
  }

  const hideOnestockDeliveryOptions = () => {
    const operations: CartDeliveryOptionsTransformRunResult["operations"] = [];

    for (const option of oneStockDeliveryGroup.deliveryOptions) {
      if (!option.title) continue;
      if (option.deliveryMethodType === "PICKUP_POINT") continue;

      operations.push({
        deliveryOptionHide: {
          deliveryOptionHandle: option.handle,
        },
      });
    }
    return { operations };
  };

  const deliveryPromiseValue = input.cart.deliveryPromise?.jsonValue;

  // No metafield yet — hide OneStock delivery options until the extension writes the promise.
  if (!deliveryPromiseValue) {
    return hideOnestockDeliveryOptions();
  }

  const deliveryPromise = deliveryPromiseValue as DeliveryPromise;

  if (typeof deliveryPromise !== "object" || deliveryPromise === null) {
    return NO_CHANGES;
  }

  if (deliveryPromise.source !== "onestock") {
    return NO_CHANGES;
  }

  if (
    typeof deliveryPromise.options !== "object" ||
    deliveryPromise.options === null
  ) {
    return NO_CHANGES;
  }

  const operations: CartDeliveryOptionsTransformRunResult["operations"] = [];

  const validDeliveryOptions =
    deliveryPromise.canDeliver ? Object.keys(deliveryPromise.options) : [];

  const isPickupType = (type: string) =>
    type === "PICKUP_POINT" || type === "LOCAL";

  for (const option of oneStockDeliveryGroup.deliveryOptions) {
    if (!option.title) continue;

    if (isPickupType(option.deliveryMethodType)) {
      if (!deliveryPromise.canCollect) {
        operations.push({
          deliveryOptionHide: {
            deliveryOptionHandle: option.handle,
          },
        });
      }
      continue;
    }

    if (validDeliveryOptions.includes(option.title)) {
      continue;
    }

    operations.push({
      deliveryOptionHide: {
        deliveryOptionHandle: option.handle,
      },
    });
  }

  // Hide all pickup/local options across ALL delivery groups when C&C is unavailable
  if (!deliveryPromise.canCollect) {
    for (const group of deliveryGroups) {
      if (group === oneStockDeliveryGroup) continue;
      for (const option of group.deliveryOptions) {
        if (isPickupType(option.deliveryMethodType)) {
          operations.push({
            deliveryOptionHide: {
              deliveryOptionHandle: option.handle,
            },
          });
        }
      }
    }
  }

  return { operations };
}
