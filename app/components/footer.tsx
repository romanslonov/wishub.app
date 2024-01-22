import { Link } from "@remix-run/react";
import { Ghost } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2">
          <Ghost size={24} />
          <span className="font-bold">Wishub</span>
        </Link>
      </div>
    </footer>
  );
}
