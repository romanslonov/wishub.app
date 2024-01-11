import { Loader2 } from "lucide-react";
import { type HTMLAttributes } from "react";
import { cn } from "~/lib/cn";

export function Spinner({
  className,
  ...props
}: HTMLAttributes<SVGSVGElement>) {
  return <Loader2 className={cn(["animate-spin", className])} {...props} />;
}
