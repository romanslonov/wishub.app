import { LoaderFunctionArgs, MetaFunction, defer } from "@remix-run/node";
import { Lists, ListsSkeleton } from "./lists";
import { Reserves, ReservesSkeleton } from "./reserves";
import { requireUserSession } from "~/auth/require-user-session.server";
import { getLists, getReserves } from "./actions.server";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { getLocaleData } from "~/locales";
import { ErrorState } from "~/components/error-state";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.dashboard.lists.meta.title }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  const t = await getLocaleData(request);

  const lists = getLists(session.user.id);
  const reserves = getReserves(session.user.id);

  return defer({ lists, reserves, t });
}

export default function DashboardIndex() {
  const { lists, reserves, t } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t.dashboard.lists.sections.lists.name}
          </h2>
          <div className="flex items-center gap-2"></div>
        </div>

        <Suspense fallback={<ListsSkeleton />}>
          <Await resolve={lists}>{(lists) => <Lists lists={lists} />}</Await>
        </Suspense>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t.dashboard.lists.sections.reserves.name}
          </h2>
          <div className="flex items-center gap-2"></div>
        </div>

        <Suspense fallback={<ReservesSkeleton />}>
          <Await resolve={reserves}>
            {(reserves) => <Reserves reserves={reserves} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorState />;
}
