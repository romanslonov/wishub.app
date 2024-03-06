import { Outlet } from "@remix-run/react";
import { Link } from "react-router-dom";
import { Footer } from "~/components/footer";
import { Logo } from "~/components/logo";

export default function InfoLayout() {
  return (
    <main className="space-y-8">
      <header className="max-w-prose mx-auto pt-8 px-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <Logo />
          <span className="font-bold">wishub.</span>
        </Link>
      </header>
      <article className="prose mx-auto p-4 prose-neutral dark:prose-invert">
        <Outlet />
      </article>
      <Footer className="max-w-prose md:px-4" />
    </main>
  );
}
