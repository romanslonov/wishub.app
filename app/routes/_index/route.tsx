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
import { Navigation } from "~/components/navigation";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/cn";
import { getLocaleData, getLocaleFromRequest } from "~/locales";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.website.meta.title }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  const locale = await getLocaleFromRequest(request);

  const t = await getLocaleData(request);

  return json({ user, t, locale });
}

export default function Index() {
  const { user, t, locale } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex relative flex-col">
      <div className="absolute inset-0 justify-center pointer-events-none hidden lg:flex">
        <div className="max-w-7xl px-4 md:px-8 mx-auto relative h-full w-full before:absolute before:bg-[repeating-linear-gradient(0deg,hsl(var(--border))_0_4px,transparent_0_8px)] before:top-0 before:left-0 before:h-full before:w-px after:absolute after:bg-[repeating-linear-gradient(0deg,hsl(var(--border))_0_4px,transparent_0_8px)] after:top-0 before:bottom-0 after:bottom-0 after:right-0 after:h-full after:w-px"></div>
      </div>
      <Navigation user={user} t={t} className="border-b-0" />
      <main className="flex-1">
        <section className="relative mx-auto max-w-7xl text-center px-4 pt-16 pb-32 md:px-8 space-y-8 md:space-y-16">
          <div className="absolute -z-10 inset-0 h-[800px] w-full bg-dot">
            <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="w-fit bg-card py-1.5 pl-2 pr-6 ring-4 flex items-center gap-2 ring-muted rounded-full font-medium text-sm shadow-sm border mx-auto">
                <span className="bg-yellow-500 uppercase font-bold text-xs text-black rounded-full px-2 py-0.5">
                  News
                </span>
                <span className="">{t.website.header.banner.text} 🎉</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold max-w-2xl mx-auto text-balance">
                <div className="">{t.website.header.title.part1}</div>
                <div className="w-fit mx-auto">
                  {t.website.header.title.part2}
                  <img src="/underline.svg" alt="underline" className="mt-2" />
                </div>
              </h1>
              <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl text-balance mx-auto mb-16">
                {t.website.header.subtitle}
              </p>
            </div>
            <Link className={cn(buttonVariants({ size: "lg" }))} to="/register">
              <Sparkles className="inline-block mr-2" size={20} />
              {t.website.header.cta}
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Infinity />
              <span className="text-sm font-medium text-muted-foreground">
                {t.website.header.features.unlimited.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick />
              <span className="text-sm font-medium text-muted-foreground">
                {t.website.header.features.easy.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WalletCards />
              <span className="text-sm font-medium text-muted-foreground">
                {t.website.header.features.no_cards.title}
              </span>
            </div>
          </div>
          <img
            src={`/preview_${locale}_dark.webp`}
            alt="Preview dashboard"
            className="mx-auto hidden md:dark:block max-w-7xl w-full shadow-xl border rounded-lg md:rounded-xl"
          />
          <img
            src={`/preview_${locale}_light.webp`}
            alt="Preview dashboard"
            className="mx-auto max-w-7xl hidden md:block md:dark:hidden w-full shadow-xl border rounded-lg md:rounded-xl"
          />
          <img
            src={`/preview_${locale}_mobile_light.webp`}
            alt="Preview dashboard"
            className="mx-auto max-w-xl dark:hidden md:hidden w-full shadow-xl border rounded-lg md:rounded-xl"
          />
          <img
            src={`/preview_${locale}_mobile_dark.webp`}
            alt="Preview dashboard"
            className="mx-auto max-w-xl hidden dark:block md:dark:hidden w-full shadow-xl border rounded-lg md:rounded-xl"
          />
        </section>
        <section className="snap-y snap-mandatory md:min-h-screen space-y-8 md:space-y-0">
          <div className="text-center">
            <p className="text-4xl tracking-tight font-bold">
              {t.website.sections.main_features.title.part1}
            </p>
            <p className="text-4xl tracking-tight font-bold text-muted-foreground">
              {t.website.sections.main_features.title.part2}
            </p>
          </div>
          <div className="max-w-7xl px-4 md:px-8 mx-auto md:min-h-screen flex flex-col items-center justify-center md:sticky md:top-0 md:snap-start">
            <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-black md:min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 px-8 md:px-16 border-black py-32 bg-green-100">
                <h2 className="text-black text-5xl font-bold mx-auto text-center">
                  <div className="text-green-500">
                    {
                      t.website.sections.main_features.create_wishlist.title
                        .part1
                    }
                  </div>
                  <div>
                    {
                      t.website.sections.main_features.create_wishlist.title
                        .part2
                    }
                  </div>
                  <div>
                    {
                      t.website.sections.main_features.create_wishlist.title
                        .part3
                    }
                  </div>
                </h2>
              </div>
              <div className="bg-muted flex items-center justify-center">
                <img
                  className="dark:hidden"
                  src="/creating_light.webp"
                  alt="Creating list light"
                />
                <img
                  className="hidden dark:block"
                  src="/creating_dark.webp"
                  alt="Creating list dark"
                />
              </div>
            </div>
          </div>
          <div className="max-w-7xl px-4 md:px-8 mx-auto md:min-h-screen flex flex-col items-center justify-center md:sticky md:top-0 md:snap-start">
            <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-black md:min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 px-8 md:px-16 border-black py-32 bg-pink-100">
                <h2 className="text-black text-5xl font-bold mx-auto text-center">
                  <div className="text-pink-500">
                    {
                      t.website.sections.main_features.share_wishlist.title
                        .part1
                    }
                  </div>
                  <div>
                    {
                      t.website.sections.main_features.share_wishlist.title
                        .part2
                    }
                  </div>
                </h2>
              </div>
              <div className="bg-muted flex items-center justify-center">
                <img
                  className="hidden dark:block"
                  src="/sharing_dark.webp"
                  alt="Sharing list dark"
                />
                <img
                  className="dark:hidden"
                  src="/sharing_light.webp"
                  alt="Sharing list light"
                />
              </div>
            </div>
          </div>
          <div className="max-w-7xl px-4 md:px-8 mx-auto md:min-h-screen flex flex-col items-center justify-center md:sticky md:top-0 md:snap-start">
            <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-black md:min-h-[90vh] w-full rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center border-r-2 px-8 md:px-16 border-black py-32 bg-sky-200">
                <h2 className="text-black text-5xl font-bold mx-auto text-center">
                  <div className="text-sky-500">
                    {t.website.sections.main_features.reserve_gifts.title.part1}
                  </div>
                  <div>
                    {t.website.sections.main_features.reserve_gifts.title.part2}
                  </div>
                </h2>
              </div>
              <div className="bg-muted flex items-center justify-center">
                <img
                  className="hidden dark:block"
                  src="/reserving_dark.webp"
                  alt="Reserving gift dark"
                />
                <img
                  className="dark:hidden"
                  src="/reserving_light.webp"
                  alt="Reserving gift light"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 space-y-16">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight font-bold">
              {t.website.sections.extra_features.title.part1}
            </h2>
            <p className="text-4xl tracking-tight font-bold text-muted-foreground">
              {t.website.sections.extra_features.title.part2}
            </p>
          </div>
          <div className="max-w-7xl px-4 md:px-8 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border bg-card rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center border-2 border-card bg-red-400">
                    <Gem />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-card bg-sky-400">
                    <Baby />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-card bg-violet-400">
                    <PartyPopper />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-card bg-pink-400">
                    <Heart />
                  </div>
                  <div className="h-16 w-16 rounded-full text-black flex items-center justify-center -ml-8 border-2 border-card bg-green-400">
                    <Cake />
                  </div>
                </div>
                <h2 className="text-2xl tracking-tight font-bold">
                  {t.website.sections.extra_features.events.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.website.sections.extra_features.events.text}
                </p>
              </div>
              <div className="border bg-card rounded-2xl p-8">
                <MailCheck className="w-16 h-16 mb-4" />
                <h2 className="text-2xl tracking-tight font-bold">
                  {t.website.sections.extra_features.share.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.website.sections.extra_features.share.text}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-16 text-center">
          <div className="max-w-7xl px-4 md:px-8 mx-auto">
            <div className="bg-card border px-4 space-y-4 h-[50vh] rounded-2xl flex flex-col items-center justify-center gap-4">
              <div>
                <h2 className="text-4xl text-foreground tracking-tight font-bold">
                  {t.website.sections.join.title.part1}
                </h2>
                <p className="text-4xl tracking-tight font-bold text-muted-foreground">
                  {t.website.sections.join.title.part2}
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
            href="https://github.com/romanslonov/wishub.app"
            target="_blank"
            className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
            rel="noreferrer"
          >
            Open source.
          </a>
        </footer>
      </main>
    </div>
  );
}
