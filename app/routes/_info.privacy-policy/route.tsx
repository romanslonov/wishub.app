import type { MetaFunction } from "@remix-run/node";
import Content from "./en.mdx";

export const meta: MetaFunction = () => {
  return [{ title: "Wishub - Privacy Policy" }];
};

export default function PrivacyPolicy() {
  return <Content />;
}
