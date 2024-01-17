import { parseCookies } from "oslo/cookie";
import { lucia } from "./lucia";
import { redirect } from "@remix-run/node";

export async function requireUserSession(request: Request) {
  const cookies = request.headers.get("cookie");

  const sessionId = parseCookies(cookies || "").get(lucia.sessionCookieName);

  if (!sessionId) {
    throw redirect("/login");
  }

  const response = await lucia.validateSession(sessionId);

  if (response.session && response.session.fresh) {
    const sessionCookie = lucia.createSessionCookie(response.session.id);

    throw redirect(request.url, {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  }

  if (!response.session || !response.user) {
    const sessionCookie = lucia.createBlankSessionCookie();

    throw redirect("/login", {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  }

  if (!response.user.emailVerified) {
    throw redirect("/welcome");
  }

  return response;
}
