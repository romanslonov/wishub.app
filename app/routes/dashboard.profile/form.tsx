// import { updateProfile } from "@/shared/actions";
// import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "~/components/ui/button";
import { Description } from "~/components/ui/description";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Message } from "~/components/ui/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucia";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required."),
});

export function ProfileForm({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: user.email || "",
      name: user.name || "",
    },
    resolver: zodResolver(schema),
  });
  // const router = useRouter();

  async function onsubmit(data: z.infer<typeof schema>) {
    try {
      // await updateProfile(user.id, data);
      // router.refresh();
      // toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      toast.success("Something went wrong.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
      <div className="flex items-center justify-center">
        {/* <Avatar className="h-16 w-16">
          <AvatarImage
            src={user.image as string | undefined}
            alt={user.email as string | undefined}
          />
          <AvatarFallback>
            <div className="animate-pulse bg-muted"></div>
          </AvatarFallback>
        </Avatar> */}
      </div>

      <div className="space-y-1">
        <Label id="email">Email</Label>
        <Input id="email" readOnly {...register("email")} />
      </div>

      <div className="space-y-1">
        <Label id="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name?.message ? (
          <Message>{errors.name.message}</Message>
        ) : (
          <Description id="name">
            The name usually used in public lists.
          </Description>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update profile"}
      </Button>
    </form>
  );
}
