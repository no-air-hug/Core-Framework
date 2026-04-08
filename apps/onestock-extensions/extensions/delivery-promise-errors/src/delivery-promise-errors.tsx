import "@shopify/ui-extensions/preact";

import { useAppMetafields } from "@shopify/ui-extensions/checkout/preact";
import { render } from "preact";

type DeliveryPromise = {
  source: "onestock";
  canDeliver: boolean;
  canCollect: boolean;
  options: Record<string, unknown>;
};

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  const appMetafields = useAppMetafields({
    namespace: "onestock",
    key: "delivery-promise",
    type: "cart",
  });
  const deliveryPromiseValue = appMetafields[0]?.metafield.value;

  if (!deliveryPromiseValue) return null;

  let deliveryPromise: DeliveryPromise;
  try {
    deliveryPromise = JSON.parse(String(deliveryPromiseValue));
  } catch {
    return null;
  }

  if (deliveryPromise.source !== "onestock") return null;

  const hasChecked = Object.keys(deliveryPromise.options ?? {}).length > 0;
  if (!hasChecked) return null;

  const isShippingTarget =
    shopify.extension.target ===
    "purchase.checkout.shipping-option-list.render-after";
  const isPickupTarget =
    shopify.extension.target ===
    "purchase.checkout.pickup-point-list.render-after";

  if (isShippingTarget && deliveryPromise.canDeliver === false) {
    return (
      <s-banner tone="critical">
        <s-stack direction="block">
          <s-paragraph>
            <s-text type="strong">
              Your bag contains items that cannot all be shipped
            </s-text>
            , this could be due to stock availability or delivery restrictions in
            your area. Please amend your bag to continue.
          </s-paragraph>
        </s-stack>
      </s-banner>
    );
  }

  if (
    isPickupTarget &&
    deliveryPromise.canCollect === false &&
    deliveryPromise.canDeliver === false
  ) {
    return (
      <s-banner tone="critical">
        <s-stack direction="block">
          <s-paragraph>
            <s-text type="strong">
              Your bag contains items that cannot all be collected or shipped
            </s-text>
            . Please amend your bag to continue.
          </s-paragraph>
        </s-stack>
      </s-banner>
    );
  }

  return null;
}
