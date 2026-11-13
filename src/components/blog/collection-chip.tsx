import { Chip } from "@/components/ui";
import { collectionPath, localePath, type Locale } from "@/i18n";
import { getCollectionText } from "@/lib/collections";

/** Props for {@link CollectionChip}. */
type Props = {
  /** Language of the page; picks the collection's name and the link prefix. */
  lang: Locale;
  /** Slug of the post's collection, from its `meta.collection`. */
  slug: string;
};

/**
 * Small chip with a post's collection name, linking to the collection page.
 *
 * @remarks
 * Used in post cards and the post header, so a post's collection looks and behaves
 * the same everywhere. The name comes from `content/collections.json` in the page's
 * language; the slug is shared by every language.
 *
 * @example
 * ```tsx
 * <CollectionChip lang={lang} slug={meta.collection} />
 * ```
 */
export function CollectionChip({ lang, slug }: Props) {
  return (
    <Chip href={localePath(lang, collectionPath(lang, slug))}>
      {getCollectionText(lang, slug).name}
    </Chip>
  );
}
