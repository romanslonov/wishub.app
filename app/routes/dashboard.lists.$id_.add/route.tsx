import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Button, buttonVariants } from "~/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChangeEvent, useEffect, useState } from "react";
import { requireUserSession } from "~/auth/require-user-session.server";
import { addListItems } from "./actions.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { toast } from "sonner";
import { Message } from "~/components/ui/message";
import { cn } from "~/lib/cn";
import { Spinner } from "~/components/ui/spinner";
import { getLocaleData } from "~/locales";
import { ErrorState } from "~/components/error-state";
import { ClientOnly } from "remix-utils/client-only";

const defaultItemValue = { url: "", name: "" };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.t.dashboard.add_wishes.meta.title}` }];
};

export async function loader({ request, params: { id } }: LoaderFunctionArgs) {
  await requireUserSession(request);

  const t = await getLocaleData(request);

  return { listId: id, t };
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireUserSession(request);

  const t = await getLocaleData(request);

  const formData = await request.json();

  const urlSchema = z
    .string()
    .min(1, t.validation.url.required)
    .url(t.validation.url.invalid);

  const schema = z.object({
    items: z
      .array(
        z.object({
          url: urlSchema,
          name: z.string().min(1, t.validation.name.required),
        })
      )
      .min(1, t.validation.wishes.required),
  });

  try {
    const data = schema.parse(formData);

    await addListItems(params.id!, data.items);

    return json({
      listId: params.id!,
      message: t.toasts.wishes_were_added,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors });
    }
    return json({ error: t.validation.unexpected_error }, { status: 500 });
  }
};

export default function DashboardListsIdAddRoute() {
  const { listId, t } = useLoaderData<typeof loader>();
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
    items: z
      .array(
        z.object({
          url: urlSchema,
          name: z.string().min(1, t.validation.name.required),
        })
      )
      .min(1, t.validation.wishes.required),
  });

  type FormData = z.infer<typeof schema>;

  const {
    handleSubmit,
    register,
    setError,
    getFieldState,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [defaultItemValue],
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
      navigate(`/dashboard/lists/${actionData.listId}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="max-w-2xl space-y-4 p-4 mx-auto">
      <div className="space-y-4">
        <Link
          to={`/dashboard/lists/${listId}`}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        >
          {t.dashboard.add_wishes.back}
        </Link>
        <h1 className="text-3xl line-clamp-2 font-bold tracking-tight">
          {t.dashboard.add_wishes.title}
        </h1>
      </div>
      <div className="bg-card shadow-sm border rounded-2xl p-6">
        <ClientOnly>
          {() => (
            <Form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
              <ul className="space-y-4">
                {fields.map((field, index) => (
                  <li
                    key={field.id}
                    className="space-y-2 bg-muted rounded-xl p-4"
                  >
                    <div className="h-8 flex justify-between items-center gap-2">
                      <p className="font-medium font-mono">#{index + 1}</p>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        disabled={loaders.has(index) || fields.length <= 1}
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
              <Button className="w-full" type="submit">
                {isSubmitting
                  ? t.dashboard.add_wishes.form.submitting
                  : t.dashboard.add_wishes.form.submit}
              </Button>
            </Form>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorState />;
}
