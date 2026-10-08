import { readdir } from "node:fs/promises";
import path from "node:path";

export type PostMeta = {
  title: string;
  description?: string;
  date: string; // ISO date, e.g. "2026-10-08"
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export async function getPostSlugs(): Promise<string[]> {
  "use cache";
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export async function getPost(slug: string) {
  // Each post exports `meta` (see content/blog/hello-world.mdx)
  const mod = await import(`../../content/blog/${slug}.mdx`);
  return { Content: mod.default, meta: mod.meta as PostMeta };
}

export async function getAllPosts() {
  "use cache";
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => ({ slug, ...(await getPost(slug)).meta })),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
