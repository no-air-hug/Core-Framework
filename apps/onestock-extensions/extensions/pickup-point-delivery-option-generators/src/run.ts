import {
  type BusinessHours,
  type FunctionRunResult,
  type Operation,
  type PickupAddress,
  type PickupPointDeliveryOption,
  type Provider,
  type RunInput,
} from "../generated/api";

type PickupPoint = {
  id: string;
  name: string;
  location: {
    address: {
      address1: string;
      address2?: string;
      city: string;
      countryCode: string;
      phone?: string;
      zip: string;
    };
    geometry: {
      latitude: number;
      longitude: number;
    };
  };
  openingHours: Array<{
    day: string;
    periods: Array<{ openingTime: string; closingTime: string }>;
  }> | null;
  deliveryPromise?: unknown;
  collectPromiseText?: string;
};

export function run(input: RunInput): FunctionRunResult {
  const { fetchResult } = input;
  const status = fetchResult?.status;
  const body = fetchResult?.body;

  let operations: Operation[] = [];

  if (status === 200 && body) {
    try {
      const { deliveryPoints: externalApiDeliveryPoints } = JSON.parse(body);
      if (Array.isArray(externalApiDeliveryPoints)) {
        operations = buildPickupPointDeliveryOptionOperations(
          externalApiDeliveryPoints,
        );
      }
    } catch {
      // JSON parse error
    }
  }

  return { operations };
}

function buildPickupPointDeliveryOptionOperations(
  externalApiDeliveryPoints: PickupPoint[],
): Operation[] {
  return externalApiDeliveryPoints.map((externalApiDeliveryPoint) => ({
    add: buildPickupPointDeliveryOption(externalApiDeliveryPoint),
  }));
}

function buildPickupPointDeliveryOption(
  externalApiDeliveryPoint: PickupPoint,
): PickupPointDeliveryOption {
  return {
    cost: null,
    pickupPoint: {
      externalId: externalApiDeliveryPoint.id,
      name: externalApiDeliveryPoint.name,
      provider: buildProvider(externalApiDeliveryPoint),
      address: buildAddress(externalApiDeliveryPoint),
      businessHours: buildBusinessHours(externalApiDeliveryPoint),
    },
    metafields: [
      {
        namespace: "onestock",
        key: "delivery-promise",
        value: JSON.stringify(externalApiDeliveryPoint.deliveryPromise ?? {}),
        type: "json_string",
      },
    ],
  };
}

function buildProvider(externalApiDeliveryPoint: PickupPoint): Provider {
  const collectPromiseText = externalApiDeliveryPoint.collectPromiseText;

  return {
    name: collectPromiseText || externalApiDeliveryPoint.name || "Store Pickup",
    logoUrl:
      "https://cdn.shopify.com/s/files/1/0628/3830/9033/files/shopify_icon_146101.png?v=1706120545",
  };
}

function buildAddress(externalApiDeliveryPoint: PickupPoint): PickupAddress {
  const location = externalApiDeliveryPoint.location;
  const addressComponents = location.address;
  const geometry = location.geometry;

  return {
    address1: addressComponents.address1 || "",
    address2: addressComponents?.address2 ?? null,
    city: addressComponents.city || "",
    countryCode: (addressComponents.countryCode || "GB") as any,
    latitude: Number(geometry.latitude),
    longitude: Number(geometry.longitude),
    phone: addressComponents.phone ?? null,
    zip: addressComponents.zip || "",
  };
}

const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;

function buildBusinessHours(
  externalApiDeliveryPoint: PickupPoint,
): BusinessHours[] | null {
  if (!externalApiDeliveryPoint.openingHours) {
    return null;
  }

  return externalApiDeliveryPoint.openingHours
    .filter((o) =>
      o.periods?.some(
        (p) => TIME_RE.test(p.openingTime) && TIME_RE.test(p.closingTime),
      ),
    )
    .map((o) => ({
      day: o.day.toUpperCase() as any,
      periods: o.periods
        .filter(
          (p) => TIME_RE.test(p.openingTime) && TIME_RE.test(p.closingTime),
        )
        .map((p) => ({
          openingTime: p.openingTime,
          closingTime: p.closingTime,
        })),
    }));
}
