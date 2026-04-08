type Promisable<T> = T | PromiseLike<T>;

const DEFAULT_OPTIONS: cors.Options = {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  exposedHeaders: [],
  allowedHeaders: ['Content-Type'],
};

export class CORS {
  private options: cors.Options;
  constructor(options: cors.Options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public async exec(request: Request, response: Response): Promise<Response> {
    let isPreflight = request.method.toLowerCase() === 'options';

    await this.configureOrigin(response.headers, request);
    this.configureCredentials(response.headers);
    this.configureExposedHeaders(response.headers);

    if (isPreflight) {
      this.configureMethods(response.headers);
      this.configureAllowedHeaders(response.headers, request);
      this.configureMaxAge(response.headers);

      if (response.status === 204) response.headers.set('Content-Length', '0');
    }

    return response;
  }

  private async resolveOrigin(request: Request) {
    let {origin} = this.options;
    if (typeof origin === 'function') {
      return await origin(request.headers.get('origin') ?? '');
    }
    return origin;
  }

  private configureMaxAge(headers: Headers) {
    const {maxAge} = this.options;

    if (!this.isNumber(maxAge)) return headers;

    headers.append('Access-Control-Max-Age', maxAge.toString());

    return headers;
  }

  private configureExposedHeaders(headers: Headers) {
    let exposedHeaders = this.options.exposedHeaders?.join(',');

    if (!this.isString(exposedHeaders) || exposedHeaders === '') return headers;

    headers.append('Access-Control-Expose-Headers', exposedHeaders);

    return null;
  }

  private configureAllowedHeaders(headers: Headers, request: Request) {
    let allowedHeaders = this.options.allowedHeaders?.join(',');

    if (!allowedHeaders) {
      let requestHeaders = request.headers.get(
        'Access-Control-Request-Headers',
      );

      if (this.isString(requestHeaders)) allowedHeaders = requestHeaders;

      headers.append('Vary', 'Access-Control-Request-Headers');
    }

    if (allowedHeaders && allowedHeaders !== '') {
      headers.append('Access-Control-Allow-Headers', allowedHeaders);
    }

    return headers;
  }

  private configureCredentials(headers: Headers) {
    if (this.options.credentials === true) {
      headers.append('Access-Control-Allow-Credentials', 'true');
    }
    return headers;
  }

  private configureMethods(headers: Headers) {
    let methods = this.options.methods?.join(',');

    if (!this.isString(methods)) return headers;

    headers.append('Access-Control-Allow-Methods', methods);

    return headers;
  }

  private async configureOrigin(headers: Headers, request: Request) {
    let origin = await this.resolveOrigin(request);
    let requestOrigin = request.headers.get('origin');

    if (!requestOrigin || origin === false) return headers;

    if (origin === undefined || origin === '*') {
      headers.set('Access-Control-Allow-Origin', '*');
      return headers;
    }

    if (this.isString(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.append('Vary', 'Origin');
      return headers;
    }

    if (!this.isOriginAllowed(requestOrigin, origin)) return headers;

    headers.set('Access-Control-Allow-Origin', requestOrigin);
    headers.append('Vary', 'Origin');

    return headers;
  }

  private isOriginAllowed(origin: string, allowedOrigin: cors.Origin) {
    if (Array.isArray(allowedOrigin)) {
      for (let element of allowedOrigin) {
        if (this.isOriginAllowed(origin, element)) return true;
      }
      return false;
    }

    if (this.isString(allowedOrigin)) {
      return origin === allowedOrigin;
    }

    if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }

    return !!allowedOrigin;
  }

  private isString(value: unknown): value is string {
    return typeof value === 'string' || value instanceof String;
  }

  private isNumber(value: unknown): value is number {
    return typeof value === 'number' || value instanceof Number;
  }
}

export async function cors(
  request: Request,
  response: Response,
  options: cors.Options = DEFAULT_OPTIONS,
): Promise<Response> {
  return new CORS(options).exec(request, response);
}

export namespace cors {
  export type Origin = boolean | string | RegExp | Array<string | RegExp>;

  export interface Options {
    origin?: Origin | ((origin: string) => Promisable<Origin>);
    methods?: Array<string>;
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  }
}
