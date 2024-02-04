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
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import { LocaleData } from "~/locales";

export function RemoveItemAlert({ itemId }: { itemId: string }) {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );
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
          <AlertDialogTitle>
            {data?.t.modals.remove_wish.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {data?.t.modals.remove_wish.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form id="delete-list-item-form" method="delete">
          <input type="hidden" name="intent" value="delete-list-item" />
          <input type="hidden" name="itemId" value={itemId} />
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {data?.t.modals.remove_wish.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            form="delete-list-item-form"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? data?.t.modals.remove_wish.submitting
              : data?.t.modals.remove_wish.submit}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
