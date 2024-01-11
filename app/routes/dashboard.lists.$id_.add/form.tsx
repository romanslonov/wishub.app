"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
// import { addListItems } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Message } from "~/components/ui/message";
import { PlusCircle, MinusCircle } from "lucide-react";
import { ChangeEvent } from "react";
import { Label } from "~/components/ui/label";

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

export function AddlistItemsForm({ listId }: { listId: string }) {
  const {
    handleSubmit,
    watch,
    register,
    setError,
    getFieldState,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [defaultItemValue],
    },
    mode: "onChange",
  });

  const items = watch("items");

  // const router = useRouter();

  async function onsubmit(data: FormData) {
    // const modifiedData = data.items.map((item) => ({ ...item, listId }));

    // await addListItems(listId, modifiedData);

    toast.success("Item added successfully");

    // router.push(`/dashboard/lists/${listId}`);
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/extract?url=${value}`
      );

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

  return (
    <>
      <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
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
      </form>
    </>
  );
}
