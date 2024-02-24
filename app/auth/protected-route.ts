import { redirect } from "@remix-run/node";
import type { Session, User } from "lucia";

export function protectedRoute(context: {
  session: Session | null;
  user: User | null;
}) {
  if (context.session && context.user) {
    return {
      session: context.session,
      user: context.user,
    };
  }

  throw redirect("/login");
}
