import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { AuthProvider } from "./lib/auth";
import { ToastProvider } from "./components/Toast";
import { ar } from "./lib/i18n";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{ar.appName}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // One QueryClient per app instance.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "خطأ";
  let details = "حدث خطأ غير متوقع.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "خطأ";
    details =
      error.status === 404
        ? "الصفحة المطلوبة غير موجودة."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-ink">{message}</h1>
      <p className="mt-2 text-muted">{details}</p>
      {stack && (
        <pre className="mt-4 w-full overflow-x-auto rounded-lg bg-gray-100 p-4 text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
