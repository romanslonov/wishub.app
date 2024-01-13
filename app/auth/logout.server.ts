import { redirect } from "@remix-run/node";
import { lucia } from "./lucia";
import { requireUserSession } from "./require-user-session.server";

export async function logout(request: Request) {
  const { session } = await requireUserSession(request);

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
