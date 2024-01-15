import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { ChangeEvent, useEffect } from "react";
import { toast } from "sonner";
import { getUser } from "~/auth/get-user.server";
import { createList } from "./actions.server";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "~/components/ui/message";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { Description } from "~/components/ui/description";
import { Switch } from "~/components/ui/switch";
import { requireUserSession } from "~/auth/require-user-session.server";

export const meta: MetaFunction = () => [{ title: "Create new wish list" }];

const urlSchema = z.string().min(1, "URL is required.").url("URL is invalid.");

const schema = z.object({
  name: z.string().min(1, "Please enter a list name."),
  description: z.string().optional(),
  public: z.boolean().default(false),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Please enter a wish name."),
        url: urlSchema,
      })
    )
    .default([]),
});

type FormData = z.infer<typeof schema>;

const defaultItemValue = { url: "", name: "" };

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);

  if (!user) {
    return json(
      { error: "You must be logged in to create a list." },
      { status: 401 }
    );
  }

  const formData = await request.json();
  try {
    const data = schema.parse(formData);

    const list = await createList(user.id, data);

    return json({
      list,
      message: "List created.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors });
    }
    return json({ error: "Something goes wrong." }, { status: 500 });
  }
};

export default function DashboardListsCreate() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state !== "idle";
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    getFieldState,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      items: [],
    },
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
        throw new Error();
      }

      const { result } = await response.json();

      if (!result.ogTitle) {
        throw new Error();
      }

      setValue(`items.${index}.name`, result.ogTitle, { shouldValidate: true });
    } catch (error) {
      setError(
        `items.${index}.name`,
        { message: "Unable to fetch a wish name. Please, type name yourself." },
        { shouldFocus: true }
      );
    }
  }

  useEffect(() => {
    if (actionData && "error" in actionData) {
      toast.error(actionData.error);
    } else if (actionData && "message" in actionData) {
      toast.success(actionData.message);
      navigate(`/dashboard/lists/${actionData.list.id}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 border rounded-2xl p-8">
      <h1 className="font-bold tracking-tight text-2xl">Create list</h1>

      <Form
        method="post"
        onSubmit={handleSubmit(onsubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter a list name"
          />
          {errors.name && <Message>{errors.name?.message}</Message>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter a list description"
          />
          {errors.name ? (
            <Message>{errors.description?.message}</Message>
          ) : (
            <Description>Optional.</Description>
          )}
        </div>
        <div className="space-y-2">
          <Controller
            name="public"
            control={control}
            render={({ field }) => (
              <>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    name="public"
                    id="list-public-switch"
                  />
                  <Label htmlFor="list-public-switch">Public</Label>
                </div>
                <Description>
                  If public, you can share a link to your list.
                </Description>
              </>
            )}
          />
        </div>
        <hr />
        <div>
          <div className="text-lg font-bold tracking-tight mb-4">Wishes</div>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <p className="font-medium">Wish #{index + 1}</p>
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
                          <Message>
                            {errors.items[index]?.name?.message}
                          </Message>
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
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create list"}
        </Button>
      </Form>
    </div>
  );
}
