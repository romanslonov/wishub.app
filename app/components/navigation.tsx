import { cn } from "~/lib/cn";
import { UserMenu } from "./user-menu";
import { buttonVariants } from "~/components/ui/button";
import { Ghost, ListPlus } from "lucide-react";
import { User } from "lucia";
import { Link } from "@remix-run/react";
import { LocaleData } from "~/locales";

export function Navigation({ user, t }: { user: User | null; t: LocaleData }) {
  return (
    <header className="border-b">
      <div className="flex h-16 justify-between items-center px-4 md:px-8 mx-auto max-w-7xl">
        <Link
          to={user ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2"
        >
          <Ghost size={24} />
          <span className="font-bold">Wishub</span>
        </Link>
        <div className="flex items-center gap-4">
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
              <UserMenu user={user} t={t} />
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
