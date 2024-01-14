import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { updateList } from "./actions.server";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { useState } from "react";

export function TogglePublic({
  listId,
  defaultValue,
}: {
  listId: string;
  defaultValue: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex items-center justify-between">
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
        disabled={isSubmitting}
        defaultChecked={defaultValue}
        onCheckedChange={async (value) => {
          setIsSubmitting(true);
          try {
            await updateList(listId, { public: value });

            toast.success(
              value
                ? "List is public now. Everyone who have a link can see it."
                : "List is private now. Only you can see it."
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
        name="public"
      />
    </div>
  );
}
