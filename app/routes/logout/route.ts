import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/auth/logout.server";

export const loader = async () => redirect("/");

export const action = async ({ context }: ActionFunctionArgs) =>
  logout(context.session);
