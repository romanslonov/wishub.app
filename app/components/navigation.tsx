import { cn } from "~/lib/cn";
import { UserMenu } from "./user-menu";
import { buttonVariants } from "~/components/ui/button";
import { CheckCircle, Ghost, ListPlus, XCircle } from "lucide-react";
import { User } from "lucia";
import { Link } from "@remix-run/react";

export function Navigation({ user }: { user: User }) {
  return (
    <header className="border-b">
      <div className="flex h-16 justify-between items-center px-8 mx-auto max-w-7xl">
        <Link to={user ? "/dashboard" : "/"}>
          <Ghost size={24} />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.emailVerified ? (
                <CheckCircle size={16} className="text-emerald-500" />
              ) : (
                <XCircle size={16} className="text-rose-500" />
              )}
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
            <>
              <Link
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" })
                )}
                to="/login"
              >
                Login
              </Link>
              <Link
                className={cn(buttonVariants({ size: "sm" }))}
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
