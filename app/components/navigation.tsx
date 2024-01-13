import { cn } from "~/lib/cn";
import { UserMenu } from "./user-menu";
import { buttonVariants } from "~/components/ui/button";
import { Ghost, ListPlus, LogOut } from "lucide-react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserSession } from "~/auth/require-user-session.server";
import { User } from "lucia";
import { Form, Link } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await requireUserSession(request);

  return json({ user });
};

export function Navigation({ user }: { user: User }) {
  return (
    <header className="border-b">
      <div className="flex h-16 justify-between items-center px-4 mx-auto max-w-7xl">
        <Link to={user ? "/dashboard" : "/"}>
          <Ghost size={24} />
        </Link>
        <div className="flex items-center gap-2">
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
              <Form action="/logout" method="post">
                <button type="submit" className="flex items-center w-full p-0">
                  <LogOut className="h-4 w-4" />
                </button>
              </Form>
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
