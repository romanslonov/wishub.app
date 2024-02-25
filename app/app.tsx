import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import { NonFlashOfWrongThemeEls, useTheme } from "./theme-provder";
import { cn } from "./lib/cn";
import { Toaster } from "./components/ui/toast";
import { ProgressBar } from "./components/progress-bar";
import { Locale, LocaleData } from "./locales";

export default function App() {
  const data = useRouteLoaderData<{
    t: LocaleData;
    lang: Locale;
    origin: string;
    ENV: { UMAMI_ID?: string };
  }>("root");
  const theme = useTheme();

  return (
    <html lang={data?.lang} className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content={data?.t.website.meta.description} />
        <meta name="keywords" content={data?.t.website.meta.keywords} />
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
          sizes="48x48"
        />
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
        <meta name="color-scheme" content="dark light" />
        {/* pwa */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link
          rel="apple-touch-icon"
          href="/apple-icon-180x180.png"
          type="image/png"
          sizes="180x180"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        {/* open graph tags */}
        <meta property="og:title" content="Wishub" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={data?.origin} />
        <meta property="og:locale" content={data?.lang} />
        <meta
          property="og:description"
          content={data?.t.website.meta.description}
        />
        <meta property="og:site_name" content="Wishub" />
        <meta
          property="og:image"
          content={`${data?.origin}/og-image-${data?.lang}.png`}
        />
        <meta
          property="og:image:alt"
          content={`Wishub - ${data?.t.website.sections.join.title.part1} ${data?.t.website.sections.join.title.part2}`}
        />
        {/* twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="wishubdotapp" />
        <meta name="twitter:title" content="Wishub" />
        <meta
          name="twitter:description"
          content={data?.t.website.meta.description}
        />
        <meta
          name="twitter:image"
          content={`${data?.origin}/og-image-${data?.lang}.png`}
        />
        <meta
          name="twitter:image:alt"
          content={`Wishub - ${data?.t.website.sections.join.title.part1} ${data?.t.website.sections.join.title.part2}`}
        />
        {data?.ENV.UMAMI_ID ? (
          <script
            defer
            src="https://analytics.eu.umami.is/script.js"
            data-website-id={data?.ENV.UMAMI_ID}
          ></script>
        ) : null}
        <NonFlashOfWrongThemeEls />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Toaster />
        <ProgressBar />
      </body>
    </html>
  );
}
