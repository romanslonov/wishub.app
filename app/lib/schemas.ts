import { z } from "zod";
import { type LocaleData } from "~/locales";

export function getUrlSchema(t?: LocaleData["validation"]) {
  return z.string().min(1, t?.url.required).url(t?.url.invalid);
}

export function getItemSchema(t?: LocaleData["validation"]) {
  const urlSchema = getUrlSchema(t);

  return z.object({
    url: urlSchema,
    name: z.string().min(1, t?.name.required),
  });
}
