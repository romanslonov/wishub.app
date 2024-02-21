import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Pencil } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import { LocaleData } from "~/locales";

export function UpdateListDialog({
  list,
  isOpen,
  setIsOpen,
}: {
  list: { name: string; description: string | null };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-10 px-0 py-0">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>{data?.t.modals.update_list.title}</DialogTitle>
          <DialogDescription>
            {data?.t.modals.update_list.description}
          </DialogDescription>
        </DialogHeader>
        <Form method="put" id="update-list-form" className="space-y-4">
          <input type="hidden" name="intent" value="update-list" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              {data?.t.modals.update_list.form.name.label}
            </Label>
            <Input required id="name" name="name" defaultValue={list.name} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              {data?.t.modals.update_list.form.description.label}
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={list.description || ""}
            />
          </div>
        </Form>
        <DialogFooter>
          <Button type="submit" form="update-list-form" disabled={isSubmitting}>
            {isSubmitting
              ? data?.t.modals.update_list.form.submitting
              : data?.t.modals.update_list.form.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
