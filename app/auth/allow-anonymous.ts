import { parseCookies } from "oslo/cookie";
import { lucia } from "./lucia";
import { redirect } from "@remix-run/node";

export async function allowAnonymous(request: Request) {
  const cookies = request.headers.get("cookie");

  const sessionId = parseCookies(cookies || "").get(lucia.sessionCookieName);

  if (!sessionId) {
    return null;
  }

  const response = await lucia.validateSession(sessionId);

  if (response.session) {
    return redirect("/dashboard");
  }
}
