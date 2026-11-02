import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vitest/config";

// Unit and component tests (see the Next.js Vitest guide). Async Server Components,
// routes and the browser are covered by the Playwright tests in e2e/
export default defineConfig({
  plugins: [
    // Same remark/rehype plugins as next.config.ts, so MDX compiles the same way
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] }) },
    react(),
  ],
  // "@/…" imports, read from tsconfig.json
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", ".claude/**/*.test.ts"],
  },
});
