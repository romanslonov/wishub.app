import { MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ClientOnly } from "remix-utils/client-only";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState, type ChangeEvent } from "react";
import { useRouteLoaderData } from "@remix-run/react";
import { type LocaleData } from "~/locales";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Message } from "./ui/message";
import { getUrlSchema } from "~/lib/schemas";

const defaultItemValue = { url: "", name: "" };

export function FormItems() {
  const data = useRouteLoaderData<{ t: LocaleData }>("root");
  const [loaders, setLoaders] = useState(new Set());

  type FormData = { items: { url: string; name: string }[] };

  const {
    getValues,
    getFieldState,
    setValue,
    setError,
    register,
    formState: { errors },
  } = useFormContext<FormData>();
  const { fields, append, remove } = useFieldArray<FormData>({ name: "items" });

  async function handleURLInputChange(
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const { value } = e.target;

    try {
      const urlSchema = getUrlSchema(data?.t.validation);

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
      if (!getValues(`items.${index}.name`)) {
        setError(
          `items.${index}.name`,
          { message: data?.t.validation.wish_name.unable_to_fetch },
          { shouldFocus: true }
        );
      }
    } finally {
      setLoaders((loaders) => new Set([...loaders].filter((i) => i !== index)));
    }
  }

  return (
    <ClientOnly>
      {() => (
        <ul className="space-y-4">
          {fields.map((field, index) => (
            <li key={field.id} className="space-y-2 bg-muted rounded-xl p-4">
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
                    {data?.t.dashboard.add_wishes.form.url.label}
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
                        data?.t.dashboard.add_wishes.form.url.placeholder
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
                        {data?.t.dashboard.add_wishes.form.name.label}
                      </Label>
                      <Input
                        id={`name-${field.id}`}
                        {...register(`items.${index}.name`)}
                        placeholder={
                          data?.t.dashboard.add_wishes.form.name.placeholder
                        }
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
              onClick={() => append(defaultItemValue)}
            >
              <PlusCircle size={20} />
            </Button>
          </li>
        </ul>
      )}
    </ClientOnly>
  );
}
