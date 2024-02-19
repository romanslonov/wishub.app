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
import { LocaleData } from "./locales";

export default function App({
  lang,
  origin,
  t,
}: {
  lang: string;
  origin: string;
  t: LocaleData;
}) {
  const theme = useTheme();
  return (
    <html lang={lang} className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* theme colors preference */}
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
        {/* pwa */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* open graph tags */}
        <meta property="og:title" content="Wishub" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={origin} />
        <meta property="og:locale" content={lang} />
        <meta property="og:description" content={t.website.meta.title} />
        <meta property="og:site_name" content="Wishub" />
        <meta property="og:image" content={`${origin}/og-image-${lang}.png`} />
        <meta
          property="og:image:alt"
          content={`Wishub - ${t.website.sections.join.title.part1} ${t.website.sections.join.title.part2}`}
        />
        {/* twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="wishubdotapp" />
        <meta name="twitter:title" content="Wishub" />
        <meta name="twitter:description" content={t.website.meta.title} />
        <meta name="twitter:image" content={`${origin}/og-image-${lang}.png`} />
        <meta
          name="twitter:image:alt"
          content={`Wishub - ${t.website.sections.join.title.part1} ${t.website.sections.join.title.part2}`}
        />
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
