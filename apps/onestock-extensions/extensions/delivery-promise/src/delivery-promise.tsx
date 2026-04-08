import "@shopify/ui-extensions/preact";

import { untracked, useComputed, useSignalEffect } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";
import {
  type DeliveryGroup,
  type PickupPointOption,
} from "@shopify/ui-extensions/checkout";
import { render } from "preact";

import {
  type DeliveryPromise,
  DeliveryType,
  DELIVERY_METHOD_TITLES,
} from "./delivery-promise.types";
import { updateDeliveryPromise } from "./utilities";

type ShopConfigResult = {
  shop: {
    proxyUrl: { value: string } | null;
    salesChannel: { value: string } | null;
    deliveryMapping: { value: string } | null;
  };
};

type Config = {
  proxyUrl: string;
  salesChannel: string;
  deliveryMapping: Record<string, string | string[]>;
  osLines: typeof shopify.lines.value;
};

export default async function extension() {
  const isEditableCheckout =
    shopify.instructions.value.attributes.canUpdateAttributes &&
    shopify.instructions.value.metafields.canSetCartMetafields &&
    shopify.instructions.value.metafields.canDeleteCartMetafield;

  if (!isEditableCheckout) {
    return;
  }

  const result = await shopify.query<ShopConfigResult>(`#graphql
    query ShopConfig {
      shop {
        proxyUrl: metafield(namespace: "integrations", key: "onestock_proxy_url") {
          value
        }
        salesChannel: metafield(
          namespace: "integrations"
          key: "onestock_sales_channel"
        ) {
          value
        }
        deliveryMapping: metafield(
          namespace: "integrations"
          key: "onestock_delivery_mapping"
        ) {
          value
        }
      }
    }
  `);

  if (
    !result.data ||
    !result.data.shop.proxyUrl?.value ||
    !result.data.shop.salesChannel?.value ||
    !result.data.shop.deliveryMapping?.value
  ) {
    console.error("Missing OneStock configuration in shop metafields", result);
    return;
  }

  const { shop } = result.data;
  const proxyUrl = shop.proxyUrl!.value;

  render(
    <Extension
      config={{
        proxyUrl,
        salesChannel: shop.salesChannel!.value,
        deliveryMapping: JSON.parse(shop.deliveryMapping!.value),
        osLines: shopify.lines.value,
      }}
    />,
    document.body,
  );
}

function Extension({ config }: { config: Config }) {
  shopify.applyAttributeChange({
    type: "updateAttribute",
    key: "sales-channel",
    value: config.salesChannel,
  });

  untracked(() => {
    updateDeliveryPromise({
      source: "onestock",
      canDeliver: false,
      canCollect: false,
      options: {},
    });
  });

  return <DeliveryPromiseWatcher config={config} />;
}

function DeliveryPromiseWatcher({ config }: { config: Config }) {
  const cachedPickupPoint = useSignalRef<PickupPointOption | null>(null);
  const cachedLocation = useSignalRef({
    country: null as string | null,
    state: null as string | null,
    zip: null as string | null,
  });

  const location = useComputed(() => {
    const _groups = shopify.deliveryGroups?.value;
    const address = shopify.shippingAddress?.value;
    if (!address) {
      return { country: null, state: null, zip: null };
    }
    return {
      country: address.countryCode ?? null,
      state: address.provinceCode ?? null,
      zip: address.zip ?? null,
    };
  });

  useSignalEffect(() => {
    const deliveryType = shopify.attributes?.value?.find(
      (a) => a.key === "delivery-type",
    )?.value;

    const deliveryGroups = shopify.deliveryGroups?.value ?? [];
    const hasPickupPointsGroup = deliveryGroups.some((g) =>
      g.deliveryOptions.some((o) => o.type === "pickupPoint"),
    );
    const newDeliveryType =
      hasPickupPointsGroup ? DeliveryType.ClickCollect : DeliveryType.Delivery;

    if (deliveryType === newDeliveryType) {
      return;
    }

    shopify.applyAttributeChange({
      type: "updateAttribute",
      key: "delivery-type",
      value: newDeliveryType,
    });
  });

  useSignalEffect(() => {
    const groups = shopify.deliveryGroups?.value ?? [];
    const pickupPointGroup = groups.find((g) =>
      g.deliveryOptions.some((o) => o.type === "pickupPoint"),
    ) as DeliveryGroup | undefined;

    if (!pickupPointGroup) return;

    const pickupPoint = pickupPointGroup.deliveryOptions.find(
      (o) => o.handle === pickupPointGroup.selectedDeliveryOption?.handle,
    );

    if (!pickupPoint || pickupPoint.type !== "pickupPoint") return;
    if (pickupPoint.handle === cachedPickupPoint.current?.handle) return;

    cachedPickupPoint.current = pickupPoint;

    const pickupPointPromise = pickupPoint.metafields.find(
      (m) => m.namespace === "onestock" && m.key === "delivery-promise",
    );
    if (!pickupPointPromise?.value) {
      console.error(
        `Pickup point ${pickupPoint.location.name} has no delivery promise`,
      );
      return;
    }

    updateDeliveryPromise((prev) => ({
      ...prev,
      canCollect: true,
      options: {
        ...prev.options,
        [DELIVERY_METHOD_TITLES.CLICK_AND_COLLECT]: {
          shopify: {
            locationName: pickupPoint.location.name,
          },
          ...JSON.parse(pickupPointPromise.value as string),
        },
      },
    }));
  });

  useSignalEffect(() => {
    if (config.osLines.length === 0) return;

    if (
      JSON.stringify(cachedLocation.current) === JSON.stringify(location.value)
    ) {
      return;
    }

    cachedLocation.current = location.value;

    if (!location.value.country || !location.value.zip) {
      return;
    }

    fetchOnestockDeliveryPromise(config, location.value);
  });

  return null;
}

async function fetchOnestockDeliveryPromise(
  config: Config,
  destination: { country: string | null; state: string | null; zip: string | null },
) {
  try {
    const proxyUrl = config.proxyUrl.replace(/\/$/, "");

    const deliveryMethods = Object.entries(config.deliveryMapping).map(
      ([_displayName, methodId]) => {
        return Array.isArray(methodId) ? methodId[0] : methodId;
      },
    );

    const lineItems = config.osLines.map((line) => ({
      sku: line.merchandise.sku || line.merchandise.product.id.split("/").pop() || "",
      qty: line.quantity,
    }));

    const requestBody = {
      salesChannel: config.salesChannel,
      totalPrice: Number(shopify.cost?.subtotalAmount?.current?.amount ?? 0),
      lineItems,
      deliveryMethods,
      destination: {
        location: {
          country: destination.country || "",
          ...(destination.state ? { state: destination.state } : {}),
          zip: destination.zip || "",
        },
      },
    };

    const response = await fetch(`${proxyUrl}/api/onestock/delivery-promise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Proxy error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    processDeliveryPromiseResponse(data, config);
  } catch (e) {
    console.error("OneStock delivery promise error:", e);
    updateDeliveryPromise((prev) => ({
      ...prev,
      canDeliver: false,
    }));
  }
}

function processDeliveryPromiseResponse(
  data: { delivery_options: any[] },
  config: Config,
) {
  const options: Record<string, any> = {};
  let hasDeliveryOptions = false;
  let hasCollectOptions = false;

  Object.entries(config.deliveryMapping).forEach(([displayName, methodId]) => {
    const id = Array.isArray(methodId) ? methodId[0] : methodId;
    const option = data.delivery_options?.find(
      (o: any) => o.delivery_method === id,
    );

    if (!option) return;

    if (
      option.status === "valid" ||
      option.status === "valid_estimation" ||
      option.status === "partial" ||
      option.status === "partial_estimation"
    ) {
      options[displayName] = option;

      if (displayName === DELIVERY_METHOD_TITLES.CLICK_AND_COLLECT) {
        hasCollectOptions = true;
      } else {
        hasDeliveryOptions = true;
      }
    }
  });

  updateDeliveryPromise((prev) => {
    if (
      prev.options?.[DELIVERY_METHOD_TITLES.CLICK_AND_COLLECT] &&
      !options[DELIVERY_METHOD_TITLES.CLICK_AND_COLLECT]
    ) {
      options[DELIVERY_METHOD_TITLES.CLICK_AND_COLLECT] =
        prev.options[DELIVERY_METHOD_TITLES.CLICK_AND_COLLECT];
      hasCollectOptions = true;
    }

    return {
      source: "onestock",
      canDeliver: hasDeliveryOptions,
      canCollect: hasCollectOptions || prev.canCollect,
      options,
    };
  });
}
