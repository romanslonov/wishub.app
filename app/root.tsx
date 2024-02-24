import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/globals.css?url";
import { ThemeProvider } from "./theme-provder";
import App from "./app";
import { getLocaleData, getLocaleFromRequest } from "./locales";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const lang = getLocaleFromRequest(request);
  const t = await getLocaleData(request);
  const url = new URL(request.url);

  return json({
    ENV: {
      DOMAIN: process.env.DOMAIN!,
      ORIGIN: url.origin,
    },
    lang,
    t,
  });
}

export default function Root() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider>
      <App lang={data.lang} origin={data.ENV.ORIGIN} t={data.t} />
    </ThemeProvider>
  );
}
