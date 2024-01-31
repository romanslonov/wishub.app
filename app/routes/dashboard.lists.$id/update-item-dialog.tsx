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

const schema = z.object({
  url: z.string().min(1, "URL is required.").url("URL is invalid"),
  name: z.string().min(1, "Name is required.").max(255),
});

export function UpdateItemDialog({ item }: { item: Item }) {
  const [isOpen, setIsOpen] = useState(false);

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
          <DialogTitle>Update wish</DialogTitle>
          <DialogDescription>
            Make changes to your wish here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
          <input type="hidden" name="intent" value="update-list-item" />
          <input type="hidden" name="itemId" value={item.id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" {...register("url")} />
            {errors.url?.message && <Message>{errors.url.message}</Message>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name?.message && <Message>{errors.name.message}</Message>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
