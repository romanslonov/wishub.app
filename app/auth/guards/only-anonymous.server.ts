import { redirect } from "@remix-run/node";
import type { Session, User } from "lucia";

export function onlyAnonymous(context: {
  session: Session | null;
  user: User | null;
}) {
  if (context.session && context.user) {
    throw redirect("/dashboard");
  }
}
