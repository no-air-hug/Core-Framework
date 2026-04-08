import * as z from 'zod';

export class OneStockAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
  ) {
    super(message);
    this.name = 'OneStockAPIError';
  }
}

export type OneStockResult<T> =
  | {success: true; data: T}
  | {success: false; error: z.ZodError | OneStockAPIError};

export const DeliveryPromiseRequestSchema = z.object({
  salesChannel: z.string(),
  totalPrice: z.number(),
  lineItems: z.array(
    z.object({
      sku: z.string(),
      qty: z.number().int().min(1).default(1),
    }),
  ),
  deliveryMethods: z.array(z.string()),
  destination: z.object({
    endpointId: z.string().optional(),
    location: z
      .object({
        country: z.string(),
        state: z.string().optional(),
        zip: z.string().optional(),
      })
      .optional(),
  }),
});

export const DeliveryPromiseResponseSchema = z.object({
  delivery_options: z.array(
    z.object({
      delivery_method: z.string(),
      delivery_routes: z
        .array(
          z.object({
            carrier: z.object({
              name: z.string(),
              option: z.string(),
            }),
          }),
        )
        .optional(),
      destination: z.object({
        delivery_zone: z.optional(z.string()),
        endpoint_id: z.optional(z.string()),
        location: z.optional(
          z.object({
            country: z.string(),
            state: z.string().optional(),
            zip_code: z.string().optional(),
          }),
        ),
      }),
      cutoff: z.number().optional(),
      eta_end: z.number().optional(),
      eta_start: z.number().optional(),
      status: z.string(),
      reason: z.string().optional(),
    }),
  ),
});

function getBaseUrl(env: Env): string {
  return `https://${env.ONESTOCK_SITE_ID}.${env.ONESTOCK_ENVIRONMENT}.onestock-retail.com/${env.ONESTOCK_API_VERSION}`;
}

let cachedToken: string | null = null;

async function getToken(env: Env): Promise<string> {
  if (cachedToken) return cachedToken;

  const url = `${getBaseUrl(env)}/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      user_id: env.ONESTOCK_AUTH_USER,
      password: env.ONESTOCK_AUTH_PASSWORD,
      site_id: env.ONESTOCK_SITE_ID,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new OneStockAPIError(
      `OneStock login failed ${response.status}: ${body}`,
      response.status,
      url,
    );
  }

  const data = (await response.json()) as {token: string};
  cachedToken = data.token;
  return cachedToken;
}

function clearToken() {
  cachedToken = null;
}

export async function getDeliveryPromise(
  env: Env,
  request: z.infer<typeof DeliveryPromiseRequestSchema>,
) {
  const token = await getToken(env);

  const payload = {
    delivery_options: request.deliveryMethods.map((m) => {
      const destination: Record<string, unknown> = {};
      if ('endpointId' in request.destination) {
        destination.endpoint_id = request.destination.endpointId;
      }
      if ('location' in request.destination) {
        destination.location = {
          country: request.destination.location?.country,
          state: request.destination.location?.state,
          zip_code: request.destination.location?.zip,
        };
      }
      return {
        delivery_method: m,
        destination,
      };
    }),
    fields: ['delivery_options.delivery_routes'],
    line_items: request.lineItems.map((item) => ({
      item_id: item.sku,
      qty: item.qty,
    })),
    pricing_details: {
      price: request.totalPrice,
    },
    sales_channel: request.salesChannel,
    site_id: env.ONESTOCK_SITE_ID,
    token,
  };

  const url = `${getBaseUrl(env)}/delivery_promises?${encodeURIComponent(JSON.stringify(payload))}`;

  let response = await fetch(url, {method: 'GET'});

  // Token expired — refresh and retry once
  if (response.status === 401) {
    clearToken();
    const newToken = await getToken(env);
    payload.token = newToken;
    const retryUrl = `${getBaseUrl(env)}/delivery_promises?${encodeURIComponent(JSON.stringify(payload))}`;
    response = await fetch(retryUrl, {method: 'GET'});
  }

  if (!response.ok) {
    const body = await response.text();
    console.error(`OneStock API ${response.status}: ${body}`);
    throw new OneStockAPIError(
      `OneStock API returned ${response.status}: ${body}`,
      response.status,
      url,
    );
  }

  const data = await response.json();
  return DeliveryPromiseResponseSchema.safeParse(data);
}

// --- Pickup Points / Stock Locations ---

export const PickupPointsRequestSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  cart: z.object({
    salesChannel: z.string(),
    collectionMethods: z.array(z.string()),
    items: z.array(
      z.object({
        sku: z.string().nullable(),
        quantity: z.number().int().min(1),
      }),
    ),
    totalPrice: z.number(),
  }),
});

const StockLocationsResponseSchema = z.object({
  endpoints: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      address: z.object({
        city: z.string().optional(),
        contact: z
          .object({
            email: z.string().optional(),
            phone_number: z.string().optional(),
          })
          .optional(),
        coordinates: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
        lines: z.array(z.string()).optional(),
        regions: z
          .object({
            country: z
              .object({
                name: z.string().optional(),
                code: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
        zip_code: z.string().optional(),
      }),
      opening_hours: z
        .object({
          timespans: z.array(
            z.object({
              start: z.number(),
              end: z.number(),
              options: z
                .object({
                  open: z.boolean(),
                })
                .optional(),
            }),
          ),
        })
        .optional(),
    }),
  ),
});

type StockLocation = z.infer<typeof StockLocationsResponseSchema>['endpoints'][number];

export type PickupPoint = {
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
    periods: Array<{openingTime: string; closingTime: string}>;
  }> | null;
  deliveryPromise: unknown;
  collectPromiseText: string;
};

function transformOpeningHours(
  openingHours?: StockLocation['opening_hours'],
): PickupPoint['openingHours'] {
  if (!openingHours?.timespans) {
    return null;
  }

  const dayNames = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];
  const secondsPerDay = 24 * 60 * 60;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  return dayNames.map((dayName, index) => {
    const timespan = openingHours.timespans[index];

    if (!timespan || !timespan.options?.open) {
      return {
        day: dayName,
        periods: [{openingTime: 'Closed', closingTime: 'Closed'}],
      };
    }

    const startSeconds = timespan.start % secondsPerDay;
    const endSeconds = timespan.end % secondsPerDay;

    return {
      day: dayName,
      periods: [
        {
          openingTime: formatTime(startSeconds),
          closingTime: formatTime(endSeconds),
        },
      ],
    };
  });
}

export async function getStockLocations(
  env: Env,
  params: {lat: number; lon: number; limit?: number},
): Promise<OneStockResult<StockLocation[]>> {
  const token = await getToken(env);

  const payload = {
    site_id: env.ONESTOCK_SITE_ID,
    token,
    fields: ['name', 'address', 'opening_hours'],
    modules: {ckc: true},
    classification: [
      {
        endpoint_type: [['store']],
      },
    ],
    near: {
      centre_coordinates: {
        lat: params.lat,
        lon: params.lon,
      },
      limit: params.limit ?? Number(env.ONESTOCK_CKC_STORES_LIMIT ?? 15),
    },
  };

  const url = `${getBaseUrl(env)}/endpoints?${encodeURIComponent(JSON.stringify(payload))}`;

  let response = await fetch(url, {method: 'GET'});

  if (response.status === 401) {
    clearToken();
    const newToken = await getToken(env);
    payload.token = newToken;
    const retryUrl = `${getBaseUrl(env)}/endpoints?${encodeURIComponent(JSON.stringify(payload))}`;
    response = await fetch(retryUrl, {method: 'GET'});
  }

  if (!response.ok) {
    const body = await response.text();
    console.error(`OneStock endpoints API ${response.status}: ${body}`);
    return {
      success: false,
      error: new OneStockAPIError(
        `OneStock endpoints API returned ${response.status}: ${body}`,
        response.status,
        url,
      ),
    };
  }

  const data = await response.json();
  const parsed = StockLocationsResponseSchema.safeParse(data);

  if (!parsed.success) {
    return {success: false, error: parsed.error};
  }

  return {success: true, data: parsed.data.endpoints};
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  timeZone: 'Europe/London',
});
const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZone: 'Europe/London',
});

function buildCollectPromiseText(deliveryPromise: any): string {
  if (!deliveryPromise?.eta_end) {
    return '';
  }

  const date = new Date(deliveryPromise.eta_end * 1000);
  const isExpress = deliveryPromise.delivery_method?.endsWith('express');

  if (isExpress) {
    const compare = new Date(date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (compare === today) {
      return `Collect from ${timeFormatter.format(date)}`;
    } else if (compare === today + 86400000) {
      return `Collect from ${timeFormatter.format(date)} tomorrow`;
    } else {
      return `Collect from ${timeFormatter.format(date)} on ${dateFormatter.format(date)}`;
    }
  }

  return `Collect from ${dateFormatter.format(date)}`;
}

export async function getPickupPoints(
  env: Env,
  params: z.infer<typeof PickupPointsRequestSchema>,
  abortSignal?: AbortSignal,
): Promise<{deliveryPoints: PickupPoint[]}> {
  const locationsResult = await getStockLocations(env, {
    lat: params.lat,
    lon: params.lon,
  });

  if (!locationsResult.success || !locationsResult.data.length) {
    console.error('No stock locations found', locationsResult);
    return {deliveryPoints: []};
  }

  const stores = locationsResult.data;
  const pickupPoints: PickupPoint[] = [];

  const validItems = params.cart.items.filter((item) => item.sku);

  const promises = stores.map(async (store) => {
    try {
      const deliveryPromiseResult = await getDeliveryPromise(env, {
        salesChannel: params.cart.salesChannel,
        totalPrice: params.cart.totalPrice,
        lineItems: validItems.map((item) => ({
          sku: item.sku!,
          qty: item.quantity,
        })),
        deliveryMethods: params.cart.collectionMethods,
        destination: {
          endpointId: store.id,
        },
      });

      if (abortSignal?.aborted) {
        return;
      }

      if (!deliveryPromiseResult.success) {
        console.error(`Delivery promise failed for store ${store.id}`, deliveryPromiseResult.error);
        return;
      }

      const validOptions = deliveryPromiseResult.data.delivery_options.filter(
        (o) => o.destination.endpoint_id === store.id && o.status === 'valid',
      );

      if (validOptions.length === 0) {
        return;
      }

      const deliveryPromise =
        validOptions.find((o) => o.delivery_method.endsWith('express')) ??
        validOptions[0];

      const pickupPoint: PickupPoint = {
        id: store.id,
        name: store.name,
        location: {
          address: {
            address1: store.address.lines?.[0] ?? '',
            address2: store.address.lines?.[1],
            city: store.address.city ?? '',
            countryCode: store.address.regions?.country?.code ?? 'GB',
            phone: store.address.contact?.phone_number,
            zip: store.address.zip_code ?? '',
          },
          geometry: {
            latitude: store.address.coordinates.lat,
            longitude: store.address.coordinates.lon,
          },
        },
        openingHours: transformOpeningHours(store.opening_hours),
        deliveryPromise,
        collectPromiseText: buildCollectPromiseText(deliveryPromise),
      };

      pickupPoints.push(pickupPoint);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error(`Error getting delivery promise for store ${store.id}`, err);
    }
  });

  await Promise.allSettled(promises);

  return {deliveryPoints: pickupPoints};
}
