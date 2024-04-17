import { redirect } from "@remix-run/node";
import type { Session, User } from "lucia";

export function protectedRoute(
  context: {
    session: Session | null;
    user: User | null;
  },
  request: Request
) {
  if (context.session && context.user) {
    const { pathname } = new URL(request.url);
    if (!context.user.emailVerified && pathname !== "/welcome") {
      throw redirect("/welcome");
    }
    return {
      session: context.session,
      user: context.user,
    };
  }

  throw redirect("/login");
}
