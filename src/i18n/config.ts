// Supported languages; every route lives under /<lang>
export const locales = ["sr", "en"] as const;
export const defaultLocale = "sr";

export type Locale = (typeof locales)[number];

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// "/blog" → "/sr/blog"; "" → "/sr"
export function localePath(lang: Locale, path = "") {
  return `/${lang}${path}`;
}

// canonical + hreflang links for a page that exists in `available` languages
export function alternates(lang: Locale, path: string, available: readonly Locale[] = locales) {
  const languages: Record<string, string> = {};
  for (const locale of available) languages[locale] = localePath(locale, path);
  if (available.includes(defaultLocale)) languages["x-default"] = localePath(defaultLocale, path);
  return { canonical: localePath(lang, path), languages };
}
