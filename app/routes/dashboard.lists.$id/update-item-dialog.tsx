import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Pencil } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "~/components/ui/message";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { LocaleData } from "~/locales";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { getItemSchema } from "~/lib/schemas";

export function UpdateItemDialog({
  item,
}: {
  item: { id: string; name: string; url: string };
}) {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher<{ message: string; status: number }>();
  const isSubmitting = fetcher.state === "submitting";

  const schema = getItemSchema(data?.t.validation);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: item.name,
      url: item.url,
    },
    resolver: zodResolver(schema),
  });

  async function onsubmit() {
    return fetcher.submit(formRef.current, { method: "put" });
  }

  async function handleURLInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    try {
      if (!schema.pick({ url: true }).safeParse({ url: value }).success) {
        return;
      }

      setIsLoading(true);

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
      setValue("url", value);
      setValue("name", title, { shouldValidate: true });
    } catch (error) {
      setValue("url", value);
      if (!getValues("name")) {
        setError(
          "name",
          { message: data?.t.validation.wish_name.unable_to_fetch },
          { shouldFocus: true }
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (fetcher.data) {
      toast.success(fetcher.data.message);
      fetcher.data.status === 200 && setIsOpen(false);
    }
  }, [fetcher.data]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="w-8 h-8">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>{data?.t.modals.update_wish.title}</DialogTitle>
          <DialogDescription>
            {data?.t.modals.update_wish.description}
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form
          ref={formRef}
          method="put"
          className="space-y-4"
          onSubmit={handleSubmit(onsubmit)}
        >
          <input type="hidden" name="intent" value="update-list-item" />
          <input type="hidden" name="itemId" value={item.id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">
              {data?.t.modals.update_wish.form.url.label}
            </Label>
            <div className="relative">
              <Input
                id="url"
                name="url"
                {...(register("url"),
                {
                  defaultValue: item.url,
                  onChange(e) {
                    handleURLInputChange(e);
                  },
                })}
              />
              {isLoading && <Spinner className="absolute top-2 right-2" />}
            </div>
            {errors.url?.message && <Message>{errors.url.message}</Message>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              {data?.t.modals.update_wish.form.name.label}
            </Label>
            <Input id="name" {...register("name")} />
            {errors.name?.message && <Message>{errors.name.message}</Message>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? data?.t.modals.update_wish.form.submitting
              : data?.t.modals.update_wish.form.submit}
          </Button>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
