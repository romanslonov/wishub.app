import { useRouteLoaderData } from "@remix-run/react";
import { CircleSlash } from "lucide-react";
import { type LocaleData } from "~/locales";

export function ErrorState() {
  const data = useRouteLoaderData<{ t: LocaleData }>("root");
  return (
    <div className="flex items-center justify-center flex-col py-16 space-y-4">
      <CircleSlash className="w-16 h-16 text-red-500" />
      <h1 className="font-bold text-2xl">{data?.t.error_boundary.title}</h1>
      <p className="max-w-prose mx-auto text-center text-muted-foreground">
        {data?.t.error_boundary.subtitle}
      </p>
    </div>
  );
}
