import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { StaticImageData } from "next/image";
import { notFound } from "next/navigation";
import GithubSlugger from "github-slugger";

export type PostMeta = {
  title: string;
  description?: string;
  date: string; // ISO date, e.g. "2026-10-08"
  tags: string[]; // URL-safe, e.g. ["nextjs", "css"]; optional in index.mdx
};

export type PostSummary = PostMeta & {
  slug: string;
  cover: StaticImageData;
  readingMinutes: number;
};

export type Heading = { id: string; text: string };

// Each post is a folder: content/blog/<slug>/index.mdx + cover.{jpg,png,webp}
const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const COVER_EXTENSIONS = ["jpg", "png", "webp"] as const;
// Folder names that would collide with static routes under /blog
const RESERVED_SLUGS = ["tags", "page"];
const TAG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

type PostFiles = { slug: string; coverExt: (typeof COVER_EXTENSIONS)[number] };

async function getPostFiles(): Promise<PostFiles[]> {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory());

  return Promise.all(
    folders.map(async ({ name: slug }) => {
      if (RESERVED_SLUGS.includes(slug)) {
        throw new Error(`content/blog/${slug}/ uses a reserved name: ${RESERVED_SLUGS.join(", ")}`);
      }
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

function parseMeta(slug: string, meta: Partial<PostMeta> | undefined): PostMeta {
  if (!meta?.title || !meta.date || Number.isNaN(Date.parse(meta.date))) {
    throw new Error(
      `content/blog/${slug}/index.mdx must export \`meta\` with a \`title\` and an ISO \`date\``,
    );
  }
  const tags = meta.tags ?? [];
  const invalid = tags.filter((tag) => !TAG_PATTERN.test(tag));
  if (invalid.length) {
    throw new Error(
      `content/blog/${slug}/index.mdx has invalid tags (${invalid.join(", ")}); use lowercase letters, digits and dashes`,
    );
  }
  return { ...meta, tags } as PostMeta;
}

export async function getPost(slug: string) {
  const file = (await getPostFiles()).find((post) => post.slug === slug);
  if (!file) notFound();

  // Static imports: the bundler compiles every post and cover at build time,
  // and the cover comes with width, height and a blur placeholder for next/image
  const [mod, coverMod, source] = await Promise.all([
    import(`../../content/blog/${slug}/index.mdx`),
    import(`../../content/blog/${slug}/cover.${file.coverExt}`),
    readFile(path.join(CONTENT_DIR, slug, "index.mdx"), "utf8"),
  ]);

  return {
    Content: mod.default,
    meta: parseMeta(slug, mod.meta),
    cover: coverMod.default as StaticImageData,
    readingMinutes: readingMinutes(source),
    headings: getHeadings(source),
  };
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { meta, cover, readingMinutes } = await getPost(slug);
      return { slug, ...meta, cover, readingMinutes };
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

// Every tag with its post count, most used first
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const post of await getAllPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// The posts right before and after this one, by date
export async function getAdjacentPosts(slug: string) {
  const posts = await getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  return { newer: posts[index - 1], older: posts[index + 1] };
}

export async function getPostsByTag(tag: string): Promise<PostSummary[]> {
  return (await getAllPosts()).filter((post) => post.tags.includes(tag));
}

export const POSTS_PER_PAGE = 10;

// One page of a post list; page numbers start at 1
export function paginate(posts: PostSummary[], page: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  return { posts: posts.slice(start, start + POSTS_PER_PAGE), page, totalPages };
}

// Pages 2..N for generateStaticParams; page 1 lives at the list's own URL
export function extraPageNumbers(posts: PostSummary[]): string[] {
  const { totalPages } = paginate(posts, 1);
  return Array.from({ length: totalPages - 1 }, (_, i) => String(i + 2));
}

// Words in the post body (without the meta export) at ~200 words per minute
function readingMinutes(source: string) {
  const body = source.replace(/^export const meta[\s\S]*?\n};?\n/m, "");
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// The post's ## headings with the same ids rehype-slug gives them, for the sidebar
function getHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCode = false;
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) inCode = !inCode;
    const match = !inCode && line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (!match) continue;
    // Plain text as rehype-slug sees it: no code ticks, emphasis or link syntax
    const text = match[2].replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_]/g, "");
    const id = slugger.slug(text); // every level counts toward duplicate ids
    if (match[1].length === 2) headings.push({ id, text });
  }
  return headings;
}
