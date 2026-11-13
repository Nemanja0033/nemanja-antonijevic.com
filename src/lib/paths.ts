import { collectionPath, locales, translatePath, type Locale } from "@/i18n/config";
import { extraPageNumbers, getAllPosts, getCollections, getPostsByCollection } from "./posts";

export type SitePath = { path: string; lastModified?: string };

// Every page that exists in a language, without the /<lang> prefix.
// Used by the sitemap and by the language switch to know where it can go
export async function getSitePaths(lang: Locale): Promise<SitePath[]> {
  const [posts, collections] = await Promise.all([getAllPosts(lang), getCollections(lang)]);
  const collectionPaths = await Promise.all(
    collections.map(async ({ slug }) => [
      { path: collectionPath(lang, slug) },
      ...extraPageNumbers(await getPostsByCollection(lang, slug)).map((page) => ({
        path: `${collectionPath(lang, slug)}/page/${page}`,
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
    ...(collections.length ? [{ path: collectionPath(lang) }] : []),
    ...collectionPaths.flat(),
  ];
}

// Languages a page exists in, for its hreflang links; `path` is in `lang`'s words
export async function availableIn(lang: Locale, path: string): Promise<Locale[]> {
  const found = await Promise.all(
    locales.map(async (locale) => {
      const translated = translatePath(path, lang, locale);
      return (await getSitePaths(locale)).some((p) => p.path === translated);
    }),
  );
  return locales.filter((_, i) => found[i]);
}
