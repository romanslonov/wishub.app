import { LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const requestURL = new URL(request.url);
  const { user } = context;

  if (!user) {
    return json(
      { error: "You must be logged in to use this feature." },
      { status: 401 }
    );
  }

  try {
    const url = z.string().url().parse(requestURL.searchParams.get("url"));
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";

    const response = await fetch(url, {
      headers: { "user-agent": userAgent },
    });

    if (!response.ok) {
      throw new Error("Unable to fetch data from URL.");
    }

    const html = await response.text();

    const parseTitle = (body: string) => {
      const match = body.match(/<title>([^<]*)<\/title>/);
      if (!match || typeof match[1] !== "string")
        throw new Error("Unable to parse the title tag");
      return match[1];
    };

    const title = parseTitle(html);

    return json({ title }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw json(
        { error: "No url provided or it's not valid." },
        { status: 400 }
      );
    }
    throw json({ error: "Unable to fetch data from URL." }, { status: 500 });
  }
}
