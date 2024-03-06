import { Link, Outlet } from "@remix-run/react";
import { ErrorState } from "~/components/error-state";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md bg-card rounded-2xl shadow-sm border w-full p-8">
        <Outlet />
      </div>
      <p className="text-sm max-w-md mt-4 text-center leading-relaxed text-muted-foreground">
        By submitting this form, you acknowledge that you have read and agree to{" "}
        <Link
          to="/terms-and-conditions"
          className="underline underline-offset-4 hover:no-underline font-medium text-foreground"
        >
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link
          className="underline underline-offset-4 hover:no-underline font-medium text-foreground"
          to="/privacy-policy"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorState />;
}
