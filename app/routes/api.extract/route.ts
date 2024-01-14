import { LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { getUser } from "~/auth/get-user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams.get("url");

  const user = await getUser(request);

  if (!user) {
    return json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!params || !z.string().url().safeParse(params).success) {
    return json(
      { error: "No url provided or it's not valid." },
      { status: 400 }
    );
  }

  return json({ result: { ogTitle: "Example name" } });
}
