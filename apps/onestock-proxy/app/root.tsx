import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';

export function loader() {
  return Response.json({ok: true});
}

export function Layout({children}: {children?: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    const data = error.data as {message?: string} | string;
    errorMessage =
      typeof data === 'object' ? (data.message ?? String(data)) : data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div>
      <h1>Error {errorStatus}</h1>
      <pre>{errorMessage}</pre>
    </div>
  );
}
