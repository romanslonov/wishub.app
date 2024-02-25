import { redirect } from "@remix-run/node";
import { lucia } from "./lucia.server";
import { type Session } from "lucia";

export async function logout(session: Session | null) {
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
