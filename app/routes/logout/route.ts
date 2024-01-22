import type { ActionFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";

import { logout } from "~/auth/logout.server";

export const loader = async () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) =>
  logout(request);
