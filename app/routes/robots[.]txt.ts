import { type LoaderFunctionArgs } from "@remix-run/node";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const origin = new URL(request.url).origin;

  const content = process.env.PREVIEW
    ? `
      User-agent: *
      Disallow: /
    `
    : `
      User-agent: *
      Allow: /
      Disallow: /dashboard/
      Disallow: /s/

      Sitemap: ${origin}/sitemap.xml
    `;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
