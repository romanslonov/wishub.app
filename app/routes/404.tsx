import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Logo } from "~/components/logo";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/cn";
import { getLocaleData } from "~/locales";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.t[404].meta.title,
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await getLocaleData(request);

  return { t };
}

export default function NotFoundRoute() {
  const { t } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen flex items-center justify-center flex-col relative">
      <div className="absolute overflow-hidden inset-0 -z-10 flex items-center justify-center">
        <h1 className="text-muted-foreground opacity-5 font-bold text-[16rem] md:text-[32rem] lg:text-[40rem]">
          404
        </h1>
      </div>
      <div className="text-center space-y-4 px-4">
        <Logo sizes={48} className="mx-auto" />
        <h2 className="text-2xl font-medium ">{t[404].title}</h2>
        <Link to="/" className={cn(buttonVariants({ size: "lg" }))}>
          Get home
        </Link>
      </div>
    </div>
  );
}
