import { cn } from "~/lib/cn";
import { UserMenu } from "./user-menu";
import { buttonVariants } from "~/components/ui/button";
import { Ghost, ListPlus } from "lucide-react";
import { User } from "lucia";
import { Link } from "@remix-run/react";
import { LocaleData } from "~/locales";
import { LocaleSwitcher } from "./locale-switcher";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
  t: LocaleData;
}

export function Navigation({ user, t, className }: Props) {
  return (
    <header className={cn("border-b", className)}>
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
                {t.common.navigation.create_list}
              </Link>
              <UserMenu user={user} t={t} />
            </>
          ) : (
            <>
              <Link
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" })
                )}
                to="/login"
              >
                {t.common.navigation.login}
              </Link>
              <Link
                className={cn(buttonVariants({ size: "sm" }))}
                to="/register"
              >
                {t.common.navigation.register}
              </Link>
              <div className="h-7 w-px bg-border"></div>
              <LocaleSwitcher />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
