import {fromError} from 'zod-validation-error';
import * as onestock from '~/lib/onestock';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _executionContext: ExecutionContext,
  ): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {status: 204, headers: CORS_HEADERS});
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/onestock/delivery-promise') {
      if (request.method !== 'POST') {
        return jsonResponse(
          {message: 'OneStock Delivery Promise API. Use POST method.'},
          405,
        );
      }
      return handleDeliveryPromise(request, env);
    }

    if (url.pathname === '/api/onestock/pickup-points') {
      if (request.method !== 'POST') {
        return jsonResponse(
          {message: 'OneStock Pickup Points API. Use POST method.'},
          405,
        );
      }
      return handlePickupPoints(request, env);
    }

    return jsonResponse({
      message: 'OneStock Proxy API',
      endpoints: {
        'POST /api/onestock/delivery-promise': 'Delivery Promise',
        'POST /api/onestock/pickup-points': 'Pickup Points',
      },
    });
  },
};

async function handleDeliveryPromise(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = onestock.DeliveryPromiseRequestSchema.safeParse(body);

    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      console.log(JSON.stringify({type: 'invalid request params', error: validationError}));
      return jsonResponse(
        {type: 'invalid params', error: validationError.toString()},
        400,
      );
    }

    const result = await onestock.getDeliveryPromise(env, parsed.data);

    if (!result.success) {
      const validationError = fromError(result.error);
      console.log(JSON.stringify({type: 'invalid OneStock response', error: validationError}));
      return jsonResponse(
        {type: 'invalid OneStock response', error: validationError.toString()},
        502,
      );
    }

    return jsonResponse(result.data);
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.name === 'AbortError'
          ? 'Request aborted'
          : e.message
        : 'Unknown error';

    console.log(JSON.stringify({type: 'error', error: errorMessage}));
    return jsonResponse({type: 'error', error: errorMessage}, 500);
  }
}

const PICKUP_POINTS_DEADLINE_MS = 1900;

async function handlePickupPoints(
  request: Request,
  env: Env,
): Promise<Response> {
  const controller = new AbortController();

  const deadlinePromise = new Promise<'timeout'>((resolve) => {
    setTimeout(() => {
      controller.abort();
      resolve('timeout');
    }, PICKUP_POINTS_DEADLINE_MS);
  });

  try {
    const body = await request.json();
    const parsed = onestock.PickupPointsRequestSchema.safeParse(body);

    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      console.log(
        JSON.stringify({type: 'invalid pickup points params', error: validationError}),
      );
      return jsonResponse(
        {type: 'invalid params', error: validationError.toString()},
        400,
      );
    }

    const resultPromise = onestock.getPickupPoints(
      env,
      parsed.data,
      controller.signal,
    );

    const result = await Promise.race([resultPromise, deadlinePromise]);

    if (result === 'timeout') {
      console.log(
        JSON.stringify({
          type: 'pickup points timeout',
          params: parsed.data,
        }),
      );
      return jsonResponse({deliveryPoints: []});
    }

    return jsonResponse(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.name === 'AbortError'
          ? 'Request aborted'
          : e.message
        : 'Unknown error';

    console.log(JSON.stringify({type: 'pickup points error', error: errorMessage}));
    return jsonResponse({type: 'error', error: errorMessage}, 500);
  }
}
