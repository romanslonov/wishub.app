export type Locale = "en" | "ru";

export function getLocaleFromRequest(request: Request): Locale {
  return (request.headers.get("current-locale") as "ru" | undefined) || "en";
}

export function getLocaleData(request: Request) {
  const locale = getLocaleFromRequest(request);
  const langs = {
    en: () => import("./en.json").then((m) => m.default),
    ru: () => import("./ru.json").then((m) => m.default),
  } as const;
  return langs[locale];
}
