import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { toast } from "sonner";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Message } from "~/components/ui/message";
// import { create } from "./actions";
import { Textarea } from "~/components/ui/textarea";
import { MinusCircle, PlusCircle } from "lucide-react";
import { ChangeEvent } from "react";
import { Description } from "~/components/ui/description";

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

const defaultItemValue = { url: "", name: "" };

type FormData = z.infer<typeof schema>;

export function CreateListForm() {
  const {
    register,
    control,
    watch,
    getFieldState,
    setValue,
    setError,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      items: [],
    },
  });

  const items = watch("items");

  // const router = useRouter();

  async function onsubmit(data: FormData) {
    // const response = await create(data);
    // if (response.status === "success") {
    //   toast.success("List was created.");
    //   // router.push("/dashboard/lists");
    // } else {
    //   toast.error("Something went wrong. Please try again later.");
    // }
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

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
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
      </div>
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create list"}
      </Button>
    </form>
  );
}
