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
import { ProgressBar } from "./components/progress-bar";

export default function App({ lang }: { lang: string }) {
  const theme = useTheme();
  return (
    <html lang={lang} className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fcfcfc"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#131316"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
        <meta name="color-scheme" content="dark light" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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
        <ProgressBar />
      </body>
    </html>
  );
}
