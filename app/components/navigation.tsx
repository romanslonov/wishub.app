import { cn } from "~/lib/cn";
import { UserMenu } from "./user-menu";

import { buttonVariants } from "~/components/ui/button";
import { Suspense } from "react";
import { Ghost, ListPlus } from "lucide-react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserSession } from "~/auth/require-user-session.server";
import { User } from "lucia";
import { Link } from "@remix-run/react";

function Skeleton() {
  return <div className="animate-pulse bg-muted h-9 w-16 rounded"></div>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUserSession(request);

  return json({ user });
};

export function Navigation({ user }: { user: User }) {
  return (
    <header className="border-b">
      <div className="flex h-16 justify-between items-center px-4 mx-auto max-w-7xl">
        <Link to={user ? "/dashboard" : "/"}>
          <Ghost size={24} />
        </Link>
        <div className="flex items-center gap-4">
          <Suspense fallback={<Skeleton />}>
            {user ? (
              <>
                <Link
                  className={cn(
                    buttonVariants({ size: "sm", variant: "secondary" })
                  )}
                  to="/dashboard/lists/create"
                >
                  <ListPlus size={16} className="mr-2" />
                  New List
                </Link>
                <UserMenu user={user} />
              </>
            ) : (
              <Link className={cn(buttonVariants({ size: "sm" }))} to="/login">
                Login
              </Link>
            )}
          </Suspense>
        </div>
      </div>
    </header>
  );
}
