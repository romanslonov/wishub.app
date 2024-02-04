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
import { type Item } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "~/components/ui/message";
import { useRouteLoaderData } from "@remix-run/react";
import { LocaleData } from "~/locales";

export function UpdateItemDialog({ item }: { item: Item }) {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );
  const [isOpen, setIsOpen] = useState(false);

  const schema = z.object({
    url: z
      .string()
      .min(1, data?.t.validation.url.required)
      .url(data?.t.validation.url.invalid),
    name: z
      .string()
      .min(1, "Name is required.")
      .max(255, data?.t.validation.name.too_long),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: item.name,
      url: item.url,
    },
    resolver: zodResolver(schema),
  });

  async function onsubmit() {}

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
        <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
          <input type="hidden" name="intent" value="update-list-item" />
          <input type="hidden" name="itemId" value={item.id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">
              {data?.t.modals.update_wish.form.url.label}
            </Label>
            <Input id="url" {...register("url")} />
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
