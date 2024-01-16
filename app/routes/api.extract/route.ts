import { LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { getUser } from "~/auth/get-user.server";
import ogs from "open-graph-scraper";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestURL = new URL(request.url);
  const url = requestURL.searchParams.get("url");

  const user = await getUser(request);

  if (!user) {
    return json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!url || !z.string().url().safeParse(url).success) {
    return json(
      { error: "No url provided or it's not valid." },
      { status: 400 }
    );
  }

  try {
    const data = await ogs({ url }).then((data) => data);

    const { result } = data;

    return json({ result }, { status: 200 });
  } catch (error) {
    return json({ message: "Unable to fetch data from URL." }, { status: 500 });
  }
}
