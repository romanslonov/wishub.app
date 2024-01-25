import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/globals.css";
import { ThemeProvider } from "./theme-provder";
import App from "./app";
import { getLocaleFromRequest } from "./locales";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const lang = getLocaleFromRequest(request);
  const url = new URL(request.url);

  return json({
    ENV: {
      DOMAIN: process.env.DOMAIN!,
      ORIGIN: url.origin,
    },
    lang,
  });
}

export default function Root() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider>
      <App lang={data.lang} />
    </ThemeProvider>
  );
}
