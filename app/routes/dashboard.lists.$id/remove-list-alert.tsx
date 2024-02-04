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

export function RemoveListAlert() {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="w-10 px-0 py-0">
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {data?.t.modals.remove_list.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {data?.t.modals.remove_list.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form id="delete-list-form" method="delete">
          <input type="hidden" name="intent" value="delete-list" />
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            form="delete-list-form"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? data?.t.modals.remove_list.submitting
              : data?.t.modals.remove_list.submit}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
