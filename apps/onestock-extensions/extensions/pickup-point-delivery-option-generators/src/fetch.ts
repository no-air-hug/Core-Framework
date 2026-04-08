import {
  HttpRequestMethod,
  type FetchInput,
  type FunctionFetchResult,
} from "../generated/api";

export function fetch(input: FetchInput): FunctionFetchResult {
  if (!input?.deliveryAddress?.longitude || !input?.deliveryAddress?.latitude) {
    return { request: null };
  }

  const validLines = input.cart.lines.filter(
    (l) => l.merchandise?.__typename === "ProductVariant" && l.merchandise.sku,
  );
  if (validLines.length === 0) {
    return { request: null };
  }

  const deliveryMethodsMap = JSON.parse(
    input.shop.osDeliveryMapping?.value ?? "{}",
  );
  if (!deliveryMethodsMap?.["Click and Collect"]) {
    return { request: null };
  }

  const proxyUrl = input.shop.apiUrl?.value;
  if (!proxyUrl) {
    return { request: null };
  }

  const url = proxyUrl.replace(/\/$/, "") + "/api/onestock/pickup-points";

  const collectionMethods = deliveryMethodsMap["Click and Collect"];
  const body = {
    lat: input.deliveryAddress.latitude,
    lon: input.deliveryAddress.longitude,
    cart: {
      salesChannel: input.shop.osSalesChannel?.value,
      collectionMethods: Array.isArray(collectionMethods)
        ? collectionMethods
        : [collectionMethods],
      items: validLines.map((l) => ({
        sku:
          l.merchandise?.__typename === "ProductVariant"
            ? l.merchandise.sku
            : null,
        quantity: l.quantity,
      })),
      totalPrice: Number(input.cart.cost.subtotalAmount.amount),
    },
  };

  return {
    request: {
      method: HttpRequestMethod.Post,
      url,
      headers: [
        {
          name: "Content-Type",
          value: "application/json",
        },
        {
          name: "Accept",
          value: "application/json; charset=utf-8",
        },
      ],
      body: JSON.stringify(body),
      policy: {
        readTimeoutMs: 2000,
      },
    },
  };
}
