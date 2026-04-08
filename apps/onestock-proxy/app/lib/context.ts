import {createWithCache, CacheShort} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const withCache = createWithCache({cache, waitUntil, request});

  return {
    env,
    session,
    waitUntil,
    withCache,
    // Stub required by @shopify/remix-oxygen's createRequestHandler
    storefront: {
      isStorefrontApiUrl: () => false,
      CacheShort: () => CacheShort(),
    },
  };
}
