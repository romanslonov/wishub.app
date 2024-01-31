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
import { List } from "@prisma/client";
import { Pencil } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { Form, useNavigation } from "@remix-run/react";

export function UpdateListDialog({
  list,
  isOpen,
  setIsOpen,
}: {
  list: List;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
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
          <DialogTitle>Update list</DialogTitle>
          <DialogDescription>
            Make changes to your list here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form method="put" id="update-list-form" className="space-y-4">
          <input type="hidden" name="intent" value="update-list" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input required id="name" name="name" defaultValue={list.name} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={list.description || ""}
            />
          </div>
        </Form>
        <DialogFooter>
          <Button type="submit" form="update-list-form" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
