import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Sparkles } from "lucide-react";
import { getUser } from "~/auth/get-user.server";
import { Footer } from "~/components/footer";
import { Navigation } from "~/components/navigation";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/cn";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      <Navigation user={user} />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl text-center px-4 py-32 md:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold">Wish. Create. Share.</h1>
              <p className="text-muted-foreground text-xl max-w-prose text-balance mx-auto mb-16">
                Create a shareble wishlists, reserve gifts and present what
                truly matters.
              </p>
            </div>
            <Link className={cn(buttonVariants({ size: "lg" }))} to="/register">
              <Sparkles className="inline-block mr-2" size={20} />
              Join now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
