import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChangeEvent, useEffect } from "react";
import { requireUserSession } from "~/auth/require-user-session.server";
import { addListItems } from "./actions.server";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { toast } from "sonner";
import { Message } from "~/components/ui/message";

const urlSchema = z.string().min(1, "URL is required.").url("URL is invalid");

const schema = z.object({
  items: z
    .array(
      z.object({
        url: urlSchema,
        name: z.string().min(1, "Please enter a wish name"),
      })
    )
    .min(1, "Please add at least one wish"),
});

const defaultItemValue = { url: "", name: "" };

type FormData = z.infer<typeof schema>;

export async function loader({ request, params: { id } }: LoaderFunctionArgs) {
  await requireUserSession(request);

  return { listId: id };
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireUserSession(request);

  const formData = await request.json();
  try {
    const data = schema.parse(formData);

    await addListItems(params.id!, data.items);

    return json({
      listId: params.id!,
      message: "Wishes were added.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors });
    }
    return json({ error: "Something goes wrong." }, { status: 500 });
  }
};

export default function DashboardListsIdAddRoute() {
  const { listId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();
  const {
    handleSubmit,
    watch,
    register,
    setError,
    getFieldState,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [defaultItemValue],
    },
    mode: "onChange",
  });

  const items = watch("items");

  async function onsubmit(data: FormData) {
    submit(data, { method: "POST", encType: "application/json" });
  }

  async function handleURLInputChange(
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const { value } = e.target;

    try {
      if (!urlSchema.safeParse(value).success) {
        return;
      }

      const response = await fetch(`/api/extract?url=${value}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(await response.json());
      }

      const { result } = await response.json();

      if (!result.ogTitle) {
        throw new Error();
      }

      setValue(`items.${index}.name`, result.ogTitle, { shouldValidate: true });
    } catch (error) {
      setError(
        `items.${index}.name`,
        { message: "Unable to get a wish name. Please, type name yourself." },
        { shouldFocus: true }
      );
    }
  }

  useEffect(() => {
    if (actionData && "error" in actionData) {
      toast.error(actionData.error);
    } else if (actionData && "message" in actionData) {
      toast.success(actionData.message);
      navigate(`/dashboard/lists/${actionData.listId}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link
        to={`/dashboard/lists/${listId}`}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Back to list
      </Link>
      <h1 className="font-bold tracking-tight text-2xl">Add wishes</h1>
      <Form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="space-y-2">
              <div className="flex justify-between items-center gap-2">
                <p className="font-medium">Item {index + 1}</p>
                {items.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="w-8 h-8 flex items-center justify-center"
                    onClick={() =>
                      setValue("items", [
                        ...items.filter((_, i) => i !== index),
                      ])
                    }
                  >
                    <MinusCircle size={16} />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor={`url-${index}`}>URL</Label>
                  <Input
                    id={`url-${index}`}
                    {...register(`items.${index}.url`, {
                      onChange(e) {
                        handleURLInputChange(e, index);
                      },
                    })}
                    placeholder="Enter a wish URL"
                  />
                  {errors.items && (
                    <Message>{errors.items[index]?.url?.message}</Message>
                  )}
                </div>
                {(item.name ||
                  getFieldState(`items.${index}.name`).invalid) && (
                  <div className="">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        {...register(`items.${index}.name`)}
                        placeholder="Enter a wish name"
                      />
                      {errors.items && (
                        <Message>{errors.items[index]?.name?.message}</Message>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
          <li>
            <Button
              type="button"
              size={"icon"}
              className="w-full"
              variant={"outline"}
              onClick={() => setValue("items", [...items, defaultItemValue])}
            >
              <PlusCircle size={20} />
            </Button>
          </li>
        </ul>
        <Button className="w-full" type="submit">
          {isSubmitting ? "Adding..." : "Add wishes"}
        </Button>
      </Form>
    </div>
  );
}
