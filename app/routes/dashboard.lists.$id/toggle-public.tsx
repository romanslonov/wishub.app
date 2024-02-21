import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { useEffect, useRef } from "react";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { LocaleData } from "~/locales";

export function TogglePublic({
  list,
  defaultValue = false,
}: {
  list: { description: string | null; public: boolean };
  defaultValue?: boolean;
}) {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );
  const fetcher = useFetcher<{ message: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data) {
      toast.success(fetcher.data.message);
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form
      method="put"
      ref={formRef}
      className="flex items-center justify-between gap-2"
    >
      <input type="hidden" name="intent" value="update-list-public" />
      <input
        type="hidden"
        defaultValue={list.description || ""}
        name="description"
      />
      <div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="list-public-switch"
            className="font-bold text-lg text-foreground tracking-tight"
          >
            {data?.t.dashboard.list.settings.public.label}
          </Label>
          {isSubmitting && <Spinner className="w-4 h-4" />}
        </div>

        <p className="text-muted-foreground text-sm">
          {data?.t.dashboard.list.settings.public.description}
        </p>
      </div>
      <Switch
        id="list-public-switch"
        name="public"
        disabled={isSubmitting}
        defaultChecked={defaultValue}
        onCheckedChange={() => {
          fetcher.submit(formRef.current, { method: "put" });
        }}
      />
    </fetcher.Form>
  );
}
