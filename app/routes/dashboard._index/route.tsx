import { LoaderFunctionArgs, MetaFunction, defer } from "@remix-run/node";
import { Lists, ListsSkeleton } from "./lists";
import { Reserves, ReservesSkeleton } from "./reserves";
import { getLists, getReserves } from "./actions.server";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { ErrorState } from "~/components/error-state";
import { protectedRoute } from "~/auth/guards/protected-route.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.dashboard.lists.meta.title }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { user } = protectedRoute(context, request);

  const lists = getLists(user.id);
  const reserves = getReserves(user.id);

  return defer({ lists, reserves, t: context.t });
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
