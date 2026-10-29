import { locales, type Locale } from "@/i18n/config";
import { extraPageNumbers, getAllPosts, getAllTags, getPostsByTag } from "./posts";

export type SitePath = { path: string; lastModified?: string };

// Every page that exists in a language, without the /<lang> prefix.
// Used by the sitemap and by the language switch to know where it can go
export async function getSitePaths(lang: Locale): Promise<SitePath[]> {
  const [posts, tags] = await Promise.all([getAllPosts(lang), getAllTags(lang)]);
  const tagPaths = await Promise.all(
    tags.map(async ({ tag }) => [
      { path: `/blog/tags/${tag}` },
      ...extraPageNumbers(await getPostsByTag(lang, tag)).map((page) => ({
        path: `/blog/tags/${tag}/page/${page}`,
      })),
    ]),
  );

  return [
    { path: "" },
    { path: "/about" },
    { path: "/contact" },
    { path: "/blog" },
    ...extraPageNumbers(posts).map((page) => ({ path: `/blog/page/${page}` })),
    ...posts.map((post) => ({ path: `/blog/${post.slug}`, lastModified: post.date })),
    ...tagPaths.flat(),
  ];
}

// Languages a page exists in, for its hreflang links
export async function availableIn(path: string): Promise<Locale[]> {
  const found = await Promise.all(
    locales.map(async (lang) => (await getSitePaths(lang)).some((p) => p.path === path)),
  );
  return locales.filter((_, i) => found[i]);
}
