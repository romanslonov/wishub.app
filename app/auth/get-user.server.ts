import { parseCookies } from "oslo/cookie";
import { lucia } from "./lucia";

export async function getUser(request: Request) {
  const cookies = request.headers.get("cookie");

  const sessionId = parseCookies(cookies || "").get(lucia.sessionCookieName);

  if (!sessionId) {
    return null;
  }

  const response = await lucia.validateSession(sessionId);

  return response.user;
}
