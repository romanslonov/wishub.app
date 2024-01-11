import { Link } from "@remix-run/react";

export function Navigation() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between  max-w-7xl mx-auto p-8">
        <Link to="/" className="font-mono font-medium">
          logo
        </Link>

        <ul className="flex items-center gap-4">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/login">Signin</Link>
          </li>
          <li>
            <Link to="/register">Signup</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
