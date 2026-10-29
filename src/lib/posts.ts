import { readdir } from "node:fs/promises";
import path from "node:path";
import type { StaticImageData } from "next/image";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

export type PostMeta = {
  title: string;
  description?: string;
  date: string; // ISO date, e.g. "2026-10-08"
};

export type PostSummary = PostMeta & {
  slug: string;
  cover?: StaticImageData;
};

// Posts live in content/blog as <slug>.mdx, with an optional cover image
// next to them named <slug>.jpg, <slug>.png or <slug>.webp
const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const COVER_EXTENSIONS = ["jpg", "png", "webp"] as const;

type PostFiles = { slug: string; coverExt?: (typeof COVER_EXTENSIONS)[number] };

async function getPostFiles(): Promise<PostFiles[]> {
  "use cache";
  cacheLife("max");
  const files = new Set(await readdir(CONTENT_DIR));
  return [...files]
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.slice(0, -".mdx".length);
      const coverExt = COVER_EXTENSIONS.find((ext) => files.has(`${slug}.${ext}`));
      return { slug, coverExt };
    });
}

export async function getPostSlugs(): Promise<string[]> {
  return (await getPostFiles()).map(({ slug }) => slug);
}

// A static import gives next/image the width, height and blur placeholder.
// One template covers every extension, so the bundler never sees an empty match.
async function importCover(slug: string, ext: PostFiles["coverExt"]) {
  if (!ext) return undefined;
  const mod = await import(`../../content/blog/${slug}.${ext}`);
  return mod.default as StaticImageData;
}

function assertMeta(slug: string, meta: Partial<PostMeta> | undefined): asserts meta is PostMeta {
  if (!meta?.title || !meta.date || Number.isNaN(Date.parse(meta.date))) {
    throw new Error(
      `content/blog/${slug}.mdx must export \`meta\` with a \`title\` and an ISO \`date\``,
    );
  }
}

export async function getPost(slug: string) {
  const file = (await getPostFiles()).find((post) => post.slug === slug);
  if (!file) notFound();

  const [mod, cover] = await Promise.all([
    import(`../../content/blog/${slug}.mdx`),
    importCover(slug, file.coverExt),
  ]);
  assertMeta(slug, mod.meta);

  return { Content: mod.default, meta: mod.meta, cover };
}

export async function getAllPosts(): Promise<PostSummary[]> {
  "use cache";
  cacheLife("max");
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { meta, cover } = await getPost(slug);
      return { slug, ...meta, cover };
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
