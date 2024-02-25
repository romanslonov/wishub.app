import "@remix-run/server-runtime";
import type { Session, User } from "lucia";
import { Locale, LocaleData } from "~/locales";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    session: Session | null;
    user: User | null;
    t: LocaleData;
    lang: Locale;
  }
}
