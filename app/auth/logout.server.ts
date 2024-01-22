import { redirect } from "@vercel/remix";
import { lucia } from "./lucia";
import { getSession } from "./get-session.server";

export async function logout(request: Request) {
  const session = await getSession(request);

  if (!session) {
    return redirect("/login");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  return redirect("/", {
    headers: {
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}
