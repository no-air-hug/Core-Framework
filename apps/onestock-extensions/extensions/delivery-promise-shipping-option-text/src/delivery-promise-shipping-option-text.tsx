import "@shopify/ui-extensions/preact";

import {
  useAppMetafields,
  useShippingOptionTarget,
} from "@shopify/ui-extensions/checkout/preact";
import { render } from "preact";

type DeliveryOption = {
  delivery_method: string;
  status: string;
  eta_start?: number;
  eta_end?: number;
  cutoff?: number;
};

type DeliveryPromise = {
  source: "onestock";
  canDeliver: boolean;
  canCollect: boolean;
  options: Record<string, DeliveryOption>;
};

const DELIVERY_METHOD_TITLES = {
  STANDARD: "Standard Delivery",
  EXPRESS: "Express Shipping",
} as const;

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  const { shippingOptionTarget } = useShippingOptionTarget();
  const appMetafields = useAppMetafields({
    namespace: "onestock",
    key: "delivery-promise",
    type: "cart",
  });
  const deliveryPromiseValue = appMetafields[0]?.metafield.value;

  if (!deliveryPromiseValue) {
    return null;
  }

  let deliveryPromise: DeliveryPromise;
  try {
    deliveryPromise = JSON.parse(String(deliveryPromiseValue));
  } catch {
    return null;
  }

  if (deliveryPromise.source !== "onestock") {
    return null;
  }

  const deliveryPromiseInfo =
    deliveryPromise.options[shippingOptionTarget.title];
  if (
    !deliveryPromiseInfo ||
    !deliveryPromiseInfo.eta_start ||
    !deliveryPromiseInfo.eta_end
  ) {
    return null;
  }

  const startDate = new Date(deliveryPromiseInfo.eta_start * 1000);
  const endDate = new Date(deliveryPromiseInfo.eta_end * 1000);

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "Europe/London",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Europe/London",
  });

  if (
    shippingOptionTarget.title === DELIVERY_METHOD_TITLES.EXPRESS &&
    deliveryPromiseInfo.cutoff
  ) {
    const cutoffDate = new Date(deliveryPromiseInfo.cutoff * 1000);

    const diff = (cutoffDate.getTime() - Date.now()) / 1000 / 60;
    const hours = Math.floor(diff / 60);
    const minutes = Math.floor(diff - hours * 60);

    if (isToday(cutoffDate) && diff > 0) {
      return (
        <s-paragraph type="small">
          Order within{" "}
          {hours > 0 && (
            <s-text type="strong">
              {hours} hr{hours > 1 ? "s" : ""}
            </s-text>
          )}
          {hours > 0 && minutes > 0 && ", "}
          {minutes > 0 && (
            <s-text type="strong">
              {minutes} min{minutes > 1 ? "s" : ""}
            </s-text>
          )}{" "}
          to receive your order <s-text type="strong">tomorrow</s-text>
        </s-paragraph>
      );
    }

    return (
      <s-paragraph type="small">
        Order by{" "}
        <s-text type="strong">{timeFormatter.format(cutoffDate)}</s-text> on{" "}
        <s-text type="strong">{dateFormatter.format(cutoffDate)}</s-text> to
        receive your order by{" "}
        <s-text type="strong">{dateFormatter.format(endDate)}</s-text>
      </s-paragraph>
    );
  }

  return (
    <s-paragraph type="small">
      Order now for delivery between{" "}
      <s-text type="strong">{dateFormatter.format(startDate)}</s-text> and{" "}
      <s-text type="strong">{dateFormatter.format(endDate)}</s-text>
    </s-paragraph>
  );
}

function isToday(date: Date): boolean {
  const check = new Date(date);
  check.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return check.getTime() === today.getTime();
}
