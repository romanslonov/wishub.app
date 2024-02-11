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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.website.meta.title }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  const t = await getLocaleData(request);

  return json({ user, t });
}

export default function Index() {
  const { user, t } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      <Navigation user={user} t={t} className="border-b-0" />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl text-center px-4 py-32 md:px-8 space-y-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-7xl font-bold max-w-2xl mx-auto text-balance">
                {t.website.header.title}
              </h1>
              <p className="text-muted-foreground text-2xl max-w-prose text-balance mx-auto mb-16">
                {t.website.header.subtitle}
              </p>
            </div>
            <Link className={cn(buttonVariants({ size: "lg" }))} to="/register">
              <Sparkles className="inline-block mr-2" size={20} />
              {t.website.header.cta}
            </Link>
          </div>
          <div className="mx-auto max-w-6xl aspect-video bg-muted rounded-2xl"></div>
        </section>
        <section className="py-16 snap-y snap-mandatory min-h-screen">
          <div className="container mx-auto min-h-screen flex flex-col items-center justify-center sticky top-0 snap-start">
            <div className="grid grid-cols-2 border-2 border-black min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 py-32 bg-[#D5F0D8]">
                <h2 className="text-5xl font-bold max-w-sm mx-auto text-[#3F9E49] text-center">
                  {t.website.sections.create_wishlist.title}
                </h2>
              </div>
              <div className="bg-[#8FD496]"></div>
            </div>
          </div>
          <div className="container mx-auto min-h-screen flex flex-col items-center justify-center sticky top-0 snap-start">
            <div className="grid grid-cols-2 border-2 border-black min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 py-32 bg-[#E9DCEE]">
                <h2 className="text-5xl font-bold max-w-sm mx-auto text-[#9F62B4] text-center">
                  {t.website.sections.share_wishlist.title}
                </h2>
              </div>
              <div className="bg-[#BF8BD1]"></div>
            </div>
          </div>
          <div className="container mx-auto min-h-screen flex flex-col items-center justify-center sticky top-0 snap-start">
            <div className="grid grid-cols-2 border-2 border-black min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 py-32 bg-[#DCE6EE]">
                <h2 className="text-5xl font-bold max-w-xs mx-auto text-[#3B7FB5] text-center">
                  {t.website.sections.reserve_gifts.title}
                </h2>
              </div>
              <div className="bg-[#68A9DD]"></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
