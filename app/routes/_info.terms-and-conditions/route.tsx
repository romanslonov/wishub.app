import type { MetaFunction } from "@remix-run/node";
import Content from "./en.mdx";

export const meta: MetaFunction = () => {
  return [{ title: "Wishub - Terms And Conditions" }];
};

export default function TermsAndConditions() {
  return <Content />;
}
