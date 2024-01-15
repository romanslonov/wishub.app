import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { List } from "@prisma/client";

export function TogglePublic({
  list,
  defaultValue = false,
}: {
  list: List;
  defaultValue?: boolean;
}) {
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
      className="flex items-center justify-between"
    >
      <input type="hidden" defaultValue={list.name} name="name" />
      <input
        type="hidden"
        defaultValue={list.description || ""}
        name="description"
      />
      <div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="list-public-switch"
            className="font-bold text-lg tracking-tight"
          >
            Public
          </Label>
          {isSubmitting && <Spinner className="w-4 h-4" />}
        </div>

        <p className="text-muted-foreground text-sm">
          Change the list visibility to other users.
        </p>
      </div>
      <Switch
        id="list-public-switch"
        name="public"
        disabled={isSubmitting}
        defaultChecked={defaultValue}
        onCheckedChange={async () => {
          fetcher.submit(formRef.current, { method: "put" });
          // setIsSubmitting(true);
          // try {
          //   await updateList(listId, { public: value });

          //   toast.success(
          //     value
          //       ? "List is public now. Everyone who have a link can see it."
          //       : "List is private now. Only you can see it."
          //   );
          // } finally {
          //   setIsSubmitting(false);
          // }
        }}
      />
    </fetcher.Form>
  );
}
