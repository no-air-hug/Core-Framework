import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {fromError} from 'zod-validation-error';
import * as onestock from '~/lib/onestock';

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const validatedRequestBody =
      onestock.DeliveryPromiseRequestSchema.safeParse(
        (await request.json()) as any,
      );

    if (!validatedRequestBody.success) {
      const validationError = fromError(validatedRequestBody.error);
      console.log(
        JSON.stringify({
          type: 'missing or invalid request params',
          error: validationError,
        }),
      );
      return new Response(
        JSON.stringify({
          type: 'missing or invalid params',
          error: validationError.toString(),
        }),
        {
          status: 400,
        },
      );
    }

    const deliveryPromiseResult = await onestock.getDeliveryPromise(
      context,
      validatedRequestBody.data,
    );

    if (!deliveryPromiseResult.success) {
      const validationError = fromError(deliveryPromiseResult.error);
      console.log(
        JSON.stringify({
          type: 'invalid response from OneStock',
          error: validationError,
        }),
      );
      return new Response(
        JSON.stringify({
          type: 'invalid response from OneStock',
          error: validationError.toString(),
        }),
        {
          status: 400,
        },
      );
    }

    return deliveryPromiseResult.data;
  } catch (e: any) {
    let errorMessage = 'Unknown error';
    if (e instanceof Error) {
      errorMessage = e.name === 'AbortError' ? 'Request aborted' : e.message;
    }
    console.log(
      JSON.stringify({
        type: 'something went wrong',
        error: errorMessage,
      }),
    );

    return new Response(
      JSON.stringify({
        type: 'something went wrong',
        error: errorMessage,
      }),
      {
        status: 400,
      },
    );
  }
}

export async function loader() {
  return new Response(
    JSON.stringify({
      message: 'OneStock Delivery Promise API. Use POST method.',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
