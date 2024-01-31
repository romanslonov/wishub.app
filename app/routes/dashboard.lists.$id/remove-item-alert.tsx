import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { Form, useNavigation } from "@remix-run/react";

export function RemoveItemAlert({ itemId }: { itemId: string }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" className="w-8 h-8">
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            wish.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form id="delete-list-item-form" method="delete">
          <input type="hidden" name="intent" value="delete-list-item" />
          <input type="hidden" name="itemId" value={itemId} />
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            form="delete-list-item-form"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
