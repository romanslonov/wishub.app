import { type ReactNode } from "react";

export function Message({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-xs text-rose-500">
      {children}
    </p>
  );
}
