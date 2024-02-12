import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Baby,
  Cake,
  Gem,
  Heart,
  Infinity,
  MailCheck,
  MousePointerClick,
  PartyPopper,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { getUser } from "~/auth/get-user.server";
import { Footer } from "~/components/footer";
import { Navigation } from "~/components/navigation";
import { Button, buttonVariants } from "~/components/ui/button";
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
    <div className="min-h-screen flex relative flex-col">
      <div className="absolute inset-0 justify-center pointer-events-none hidden lg:flex">
        <div className="max-w-7xl px-4 md:px-8 mx-auto relative h-full w-full before:absolute before:bg-[repeating-linear-gradient(0deg,hsl(var(--border))_0_4px,transparent_0_8px)] before:top-0 before:left-0 before:h-full before:w-px after:absolute after:bg-[repeating-linear-gradient(0deg,hsl(var(--border))_0_4px,transparent_0_8px)] after:top-0 before:bottom-0 after:bottom-0 after:right-0 after:h-full after:w-px"></div>
      </div>
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
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <Infinity />
              <span className="text-sm font-medium text-muted-foreground">
                Unlimited wishlists
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick />
              <span className="text-sm font-medium text-muted-foreground">
                Easy to use
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WalletCards />
              <span className="text-sm font-medium text-muted-foreground">
                No cards required
              </span>
            </div>
          </div>
          <img
            src="/preview_dark.png"
            alt="Preview dashboard"
            className="mx-auto hidden dark:block max-w-7xl border shadow-2xl w-full bg-muted rounded-2xl"
          />
          <img
            src="/preview_light.png"
            alt="Preview dashboard"
            className="mx-auto max-w-7xl dark:hidden border shadow-2xl w-full bg-muted rounded-2xl"
          />
        </section>
        <section className="text-center">
          <p className="text-4xl tracking-tight font-bold">
            Everything you need
          </p>
          <p className="text-4xl tracking-tight font-bold text-muted-foreground">
            for your next event
          </p>
        </section>
        <section className="py-16 snap-y snap-mandatory min-h-screen">
          <div className="max-w-7xl px-4 md:px-8 mx-auto min-h-screen flex flex-col items-center justify-center sticky top-0 snap-start">
            <div className="grid grid-cols-2 border-2 border-black min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 border-black py-32 bg-[#D5F0D8]">
                <h2 className="text-black text-5xl font-bold max-w-sm mx-auto text-center">
                  {t.website.sections.create_wishlist.title}
                </h2>
              </div>
              <div className="bg-muted flex items-center justify-center">
                <img
                  src="/creating_list.gif"
                  alt="Creating list"
                  className="border-2 border-black max-w-md rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="max-w-7xl px-4 md:px-8 mx-auto min-h-screen flex flex-col items-center justify-center sticky top-0 snap-start">
            <div className="grid grid-cols-2 border-2 border-black min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 border-black py-32 bg-[#E9DCEE]">
                <h2 className="text-black text-5xl font-bold max-w-sm mx-auto text-center">
                  {t.website.sections.share_wishlist.title}
                </h2>
              </div>
              <div className="bg-muted"></div>
            </div>
          </div>
          <div className="max-w-7xl px-4 md:px-8 mx-auto min-h-screen flex flex-col items-center justify-center sticky top-0 snap-start">
            <div className="grid grid-cols-2 border-2 border-black min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 border-black py-32 bg-sky-200">
                <h2 className="text-black text-5xl font-bold max-w-xs mx-auto text-center">
                  {t.website.sections.reserve_gifts.title}
                </h2>
              </div>
              <div className="bg-muted"></div>
            </div>
          </div>
        </section>
        <section className="py-16 space-y-16">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight font-bold">And even more</h2>
            <p className="text-4xl tracking-tight font-bold text-muted-foreground">
              Explore extra features
            </p>
          </div>
          <div className="max-w-7xl px-4 md:px-8 mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="border bg-card rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center border-2 border-black bg-red-400">
                    <Gem />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-black bg-sky-400">
                    <Baby />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-black bg-violet-400">
                    <PartyPopper />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-black bg-pink-400">
                    <Heart />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-black bg-green-400">
                    <Cake />
                  </div>
                </div>
                <h2 className="text-2xl tracking-tight font-bold">
                  Any type of events
                </h2>
                <p className="text-lg text-muted-foreground">
                  Select from predefined types or set your own.
                </p>
              </div>
              <div className="border bg-card rounded-2xl p-8">
                <MailCheck className="w-16 h-16 mb-4" />
                <h2 className="text-2xl tracking-tight font-bold">Share</h2>
                <p className="text-lg text-muted-foreground">
                  Share wishlist via link or send invitation using email.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-16 text-center">
          <div className="max-w-7xl px-4 md:px-8 mx-auto">
            <div className="bg-card border space-y-4 h-[50vh] rounded-2xl flex flex-col items-center justify-center gap-4">
              <div>
                <h2 className="text-4xl tracking-tight font-bold">
                  Start sharing
                </h2>
                <p className="text-4xl tracking-tight font-bold text-muted-foreground">
                  and giving joy today
                </p>
              </div>
              <Link
                className={cn(buttonVariants({ size: "lg" }))}
                to="/register"
              >
                <Sparkles className="inline-block mr-2" size={20} />
                {t.website.header.cta}
              </Link>
            </div>
          </div>
        </section>
        <footer className="text-muted-foreground text-center pb-8 text-sm">
          2023. Wishub.{" "}
          <a
            href="/"
            className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
          >
            Open source.
          </a>
        </footer>
      </main>
    </div>
  );
}
