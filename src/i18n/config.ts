// Supported languages; every route lives under /<lang>
export const locales = ["sr", "en"] as const;
export const defaultLocale = "sr";

export type Locale = (typeof locales)[number];

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// URL segment of the collections section, in each language's own words
export const collectionsSegment: Record<Locale, string> = { sr: "kolekcije", en: "collections" };

// "/blog" → "/sr/blog"; "" → "/sr"
export function localePath(lang: Locale, path = "") {
  return `/${lang}${path}`;
}

// Collections index, or one collection: "/blog/kolekcije" (sr), "/blog/collections/<slug>" (en)
export function collectionPath(lang: Locale, slug?: string) {
  return `/blog/${collectionsSegment[lang]}${slug ? `/${slug}` : ""}`;
}

// The same page's path in another language: only the collections segment differs,
// slugs are shared. "/blog/kolekcije/x" (sr) → "/blog/collections/x" (en)
export function translatePath(path: string, from: Locale, to: Locale) {
  const prefix = `/blog/${collectionsSegment[from]}`;
  if (path !== prefix && !path.startsWith(`${prefix}/`)) return path;
  return `/blog/${collectionsSegment[to]}${path.slice(prefix.length)}`;
}

// canonical + hreflang links for a page that exists in `available` languages;
// `path` is in `lang`'s words and is translated for the others
export function alternates(lang: Locale, path: string, available: readonly Locale[] = locales) {
  const href = (locale: Locale) => localePath(locale, translatePath(path, lang, locale));
  const languages: Record<string, string> = {};
  for (const locale of available) languages[locale] = href(locale);
  if (available.includes(defaultLocale)) languages["x-default"] = href(defaultLocale);
  return { canonical: localePath(lang, path), languages };
}
