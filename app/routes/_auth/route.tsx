import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md bg-card rounded-2xl shadow-sm border w-full p-8">
        <Outlet />
      </div>
    </div>
  );
}
