import type { MetaFunction } from "@remix-run/node";
import { Navigation } from "~/components/navigation";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      {" "}
      <Navigation />
      <div className="mx-auto max-w-7xl p-8">
        <h1 className="text-center py-20 text-7xl font-bold">
          Welcome to Remix
        </h1>
      </div>
    </>
  );
}
