import { Link } from "@remix-run/react";
import { ArrowUpRight } from "lucide-react";
import { HTMLAttributes } from "react";
import { cn } from "~/lib/cn";

export function Footer({ className }: HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn(
        "text-muted-foreground text-center pb-8 flex flex-col gap-4 md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-8",
        className
      )}
    >
      <p>{new Date().getFullYear()}. Wishub.</p>
      <ul className="flex items-center gap-4 md:flex-row flex-col">
        <li>
          <a
            href="https://github.com/romanslonov/wishub.app"
            target="_blank"
            className="text-foreground inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:no-underline"
            rel="noreferrer"
          >
            Open source
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </li>
        <li>
          <Link
            className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
            to="/terms-and-conditions"
          >
            Terms and Conditions
          </Link>
        </li>
        <li>
          <Link
            className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
            to="/privacy-policy"
          >
            Privacy policy
          </Link>
        </li>
      </ul>
    </footer>
  );
}
