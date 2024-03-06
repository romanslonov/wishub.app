/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

declare module "*.mdx" {
  let MDXComponent: (props: unknown) => JSX.Element;
  export const frontmatter: unknown;
  export default MDXComponent;
}
