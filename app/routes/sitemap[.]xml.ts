import { type LoaderFunctionArgs } from "@remix-run/node";
import { xml } from "remix-utils/responses";

export function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;

  const urls = [
    { loc: `${origin}/` },
    { loc: `${origin}/privacy-policy` },
    { loc: `${origin}/terms-and-conditions` },
  ];

  return xml(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[
      ...urls,
    ].map((url) => `<url><loc>${url.loc.toString()}</loc></url>`)}</urlset>`,
    {
      headers: {
        "Cache-Control": `public, max-age=${60 * 5}`,
      },
    }
  );
}
