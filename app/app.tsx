import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { NonFlashOfWrongThemeEls, useTheme } from "./theme-provder";
import { cn } from "./lib/cn";
import { Toaster } from "./components/ui/toast";

export default function App({ lang }: { lang: string }) {
  const theme = useTheme();
  return (
    <html lang={lang} className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <NonFlashOfWrongThemeEls />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster />
      </body>
    </html>
  );
}
