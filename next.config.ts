import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
};

// Compiles .mdx imports (posts live in content/, not as app/ routes)
const withMDX = createMDX({
  options: {
    // Plugins are passed as strings so they stay serializable for Turbopack
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
