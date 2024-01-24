export type Locale = "en" | "ru";

export function getLocaleFromRequest(request: Request): Locale {
  return (request.headers.get("current-locale") as "ru" | undefined) || "en";
}

export async function getLocaleData(request: Request) {
  const locale = getLocaleFromRequest(request);
  const langs = {
    en: () => import("./en.json").then((m) => m.default),
    ru: () => import("./ru.json").then((m) => m.default),
  } as const;
  return await langs[locale]();
}

export type LocaleData = Awaited<ReturnType<typeof getLocaleData>>;
