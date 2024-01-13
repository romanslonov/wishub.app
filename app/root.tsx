import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";

import stylesheet from "~/globals.css";
import { ThemeProvider } from './theme-provder';
import App from './app';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function Root() {
  
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
