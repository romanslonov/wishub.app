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
import { getLocaleData } from "~/locales";

export const meta: MetaFunction<typeof loader> = ({ data: { t } }) => {
  return [
    { title: t.website.meta.title },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  const data = getLocaleData(request);

  const t = await data();

  return json({ user, t });
}

export default function Index() {
  const { user, t } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      <Navigation user={user} />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl text-center px-4 py-32 md:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold">{t.website.header.title}</h1>
              <p className="text-muted-foreground text-xl max-w-prose text-balance mx-auto mb-16">
                {t.website.header.subtitle}
              </p>
            </div>
            <Link className={cn(buttonVariants({ size: "lg" }))} to="/register">
              <Sparkles className="inline-block mr-2" size={20} />
              {t.website.header.cta}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
