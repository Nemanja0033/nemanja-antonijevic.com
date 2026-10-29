import { readdir } from "node:fs/promises";
import path from "node:path";
import type { StaticImageData } from "next/image";
import { notFound } from "next/navigation";

export type PostMeta = {
  title: string;
  description?: string;
  date: string; // ISO date, e.g. "2026-10-08"
};

export type PostSummary = PostMeta & {
  slug: string;
  cover: StaticImageData;
};

// Each post is a folder: content/blog/<slug>/index.mdx + cover.{jpg,png,webp}
const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const COVER_EXTENSIONS = ["jpg", "png", "webp"] as const;

type PostFiles = { slug: string; coverExt: (typeof COVER_EXTENSIONS)[number] };

async function getPostFiles(): Promise<PostFiles[]> {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory());

  return Promise.all(
    folders.map(async ({ name: slug }) => {
      const files = await readdir(path.join(CONTENT_DIR, slug));
      const coverExt = COVER_EXTENSIONS.find((ext) => files.includes(`cover.${ext}`));
      if (!files.includes("index.mdx") || !coverExt) {
        throw new Error(
          `content/blog/${slug}/ must contain index.mdx and cover.jpg, cover.png or cover.webp`,
        );
      }
      return { slug, coverExt };
    }),
  );
}

export async function getPostSlugs(): Promise<string[]> {
  return (await getPostFiles()).map(({ slug }) => slug);
}

function assertMeta(slug: string, meta: Partial<PostMeta> | undefined): asserts meta is PostMeta {
  if (!meta?.title || !meta.date || Number.isNaN(Date.parse(meta.date))) {
    throw new Error(
      `content/blog/${slug}/index.mdx must export \`meta\` with a \`title\` and an ISO \`date\``,
    );
  }
}

export async function getPost(slug: string) {
  const file = (await getPostFiles()).find((post) => post.slug === slug);
  if (!file) notFound();

  // Static imports: the bundler compiles every post and cover at build time,
  // and the cover comes with width, height and a blur placeholder for next/image
  const [mod, coverMod] = await Promise.all([
    import(`../../content/blog/${slug}/index.mdx`),
    import(`../../content/blog/${slug}/cover.${file.coverExt}`),
  ]);
  assertMeta(slug, mod.meta);

  return { Content: mod.default, meta: mod.meta, cover: coverMod.default as StaticImageData };
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { meta, cover } = await getPost(slug);
      return { slug, ...meta, cover };
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
