import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { createList } from "./actions.server";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "~/components/ui/message";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { Description } from "~/components/ui/description";
import { Switch } from "~/components/ui/switch";
import { requireUserSession } from "~/auth/require-user-session.server";
import { Spinner } from "~/components/ui/spinner";
import { getLocaleData } from "~/locales";
import { ErrorState } from "~/components/error-state";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.t.dashboard.create_list.meta.title },
];

const defaultItemValue = { url: "", name: "" };

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);

  const t = await getLocaleData(request);

  return { t };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user } = await requireUserSession(request);

  const t = await getLocaleData(request);

  const formData = await request.json();

  const urlSchema = z
    .string()
    .min(1, t.validation.url.required)
    .url(t.validation.url.invalid);

  const schema = z.object({
    name: z.string().min(1, t.validation.list_name.required),
    description: z.string().optional(),
    public: z.boolean().default(false),
    items: z
      .array(
        z.object({
          name: z.string().min(1, t.validation.wish_name.required),
          url: urlSchema,
        })
      )
      .default([]),
  });

  try {
    const data = schema.parse(formData);

    const list = await createList(user.id, data);

    return json({
      list,
      message: t.toasts.list_was_created,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors });
    }
    return json({ error: t.validation.unexpected_error }, { status: 500 });
  }
};

export default function DashboardListsCreate() {
  const { t } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();
  const [loaders, setLoaders] = useState(new Set());

  const urlSchema = z
    .string()
    .min(1, t.validation.url.required)
    .url(t.validation.url.invalid);

  const schema = z.object({
    name: z.string().min(1, t.validation.list_name.required),
    description: z.string().optional(),
    public: z.boolean().default(false),
    items: z
      .array(
        z.object({
          name: z.string().min(1, t.validation.wish_name.required),
          url: urlSchema,
        })
      )
      .default([]),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getFieldState,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      items: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ name: "items", control });

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

      setLoaders((loaders) => new Set(loaders.add(index)));

      const response = await fetch(`/api/extract?url=${value}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(await response.json());
      }

      const { title } = await response.json();

      if (!title) {
        throw new Error();
      }
      setValue(`items.${index}.url`, value);
      setValue(`items.${index}.name`, title, { shouldValidate: true });
    } catch (error) {
      setValue(`items.${index}.url`, value);
      setError(
        `items.${index}.name`,
        { message: t.validation.wish_name.unable_to_fetch },
        { shouldFocus: true }
      );
    } finally {
      setLoaders((loaders) => new Set([...loaders].filter((i) => i !== index)));
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
    <div className="max-w-2xl mx-auto bg-card space-y-8 border rounded-2xl p-4 md:p-8">
      <h1 className="font-bold tracking-tight text-2xl">
        {t.dashboard.create_list.title}
      </h1>

      <Form
        method="post"
        onSubmit={handleSubmit(onsubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">
            {t.dashboard.create_list.form.name.label}
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder={t.dashboard.create_list.form.name.placeholder}
          />
          {errors.name && <Message>{errors.name?.message}</Message>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">
            {t.dashboard.create_list.form.description.label}
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder={t.dashboard.create_list.form.description.placeholder}
          />
          {errors.name ? (
            <Message>{errors.description?.message}</Message>
          ) : (
            <Description>
              {t.dashboard.create_list.form.description.description}
            </Description>
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
                  <Label htmlFor="list-public-switch">
                    {t.dashboard.create_list.form.toggle.label}
                  </Label>
                </div>
                <Description>
                  {t.dashboard.create_list.form.toggle.description}
                </Description>
              </>
            )}
          />
        </div>
        <hr />
        <div>
          <div className="font-bold text-sm mb-4">
            {t.dashboard.create_list.wishes}
          </div>
          <ul className="space-y-4">
            {fields.map((field, index) => (
              <li key={field.id} className="space-y-2 bg-muted rounded-xl p-4">
                <div className="h-8 flex justify-between items-center gap-2">
                  <p className="font-medium font-mono">#{index + 1}</p>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={loaders.has(index)}
                    type="button"
                    className="w-8 h-8 flex items-center justify-center"
                    onClick={() => remove(index)}
                  >
                    <MinusCircle size={16} />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor={`url-${field.id}`}>
                      {t.dashboard.add_wishes.form.url.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`url-${field.id}`}
                        {...register(`items.${index}.url`, {
                          onChange(e) {
                            handleURLInputChange(e, index);
                          },
                        })}
                        disabled={loaders.has(index)}
                        placeholder={
                          t.dashboard.add_wishes.form.url.placeholder
                        }
                      />
                      {loaders.has(index) && (
                        <Spinner className="absolute top-2 right-2" />
                      )}
                    </div>
                    {errors.items && (
                      <Message>{errors.items[index]?.url?.message}</Message>
                    )}
                  </div>
                  {(getValues(`items.${index}.name`) ||
                    getFieldState(`items.${index}.name`).invalid) && (
                    <div className="">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${field.id}`}>
                          {t.dashboard.add_wishes.form.name.label}
                        </Label>
                        <Input
                          id={`name-${field.id}`}
                          {...register(`items.${index}.name`)}
                          placeholder={
                            t.dashboard.add_wishes.form.name.placeholder
                          }
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
                onClick={() => append(defaultItemValue)}
              >
                <PlusCircle size={20} />
              </Button>
            </li>
          </ul>
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t.dashboard.create_list.form.submitting
            : t.dashboard.create_list.form.submit}
        </Button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorState />;
}
