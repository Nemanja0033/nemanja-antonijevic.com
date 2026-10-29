import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  experimental: {
    // app/global-not-found.tsx: the 404 for URLs outside /sr and /en,
    // where no root layout exists (the root layout lives in app/[lang])
    globalNotFound: true,
  },
  // Every page lives under a language; / goes to the default one (src/i18n/config.ts)
  async redirects() {
    return [{ source: "/", destination: "/sr", permanent: false }];
  },
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
