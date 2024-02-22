export const loader = () => {
  const content = process.env.PREVIEW
    ? `
      User-agent: *
      Disallow: /
    `
    : `
      User-agent: *
      Allow: /
      Disallow: /dashboard
    `;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
