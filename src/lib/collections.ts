import data from "../../content/collections.json";
import type { Locale } from "@/i18n/config";

export type CollectionText = { name: string; description: string };

export type Collection = CollectionText & {
  slug: string; // shared by every language, e.g. "ai-renaissance"
  count: number; // posts in this collection in the given language
};

// content/collections.json: { "<slug>": { "sr": { name, description }, "en": { … } } }
const collections = data as Record<string, Record<Locale, CollectionText>>;

export function hasCollection(slug: string) {
  return Object.hasOwn(collections, slug);
}

// Name and description of a collection in a language; throws for an unknown slug,
// which parseMeta already rules out for every post
export function getCollectionText(lang: Locale, slug: string): CollectionText {
  const text = collections[slug]?.[lang];
  if (!text?.name || !text.description) {
    throw new Error(`content/collections.json: "${slug}" needs a name and description in "${lang}"`);
  }
  return text;
}

// Every collection slug, in the order of collections.json
export const collectionSlugs = Object.keys(collections);
