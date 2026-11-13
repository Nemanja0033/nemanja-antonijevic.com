import { Chip } from "@/components/ui";
import { collectionPath, getDictionary, localePath, type Locale } from "@/i18n";
import type { Collection } from "@/lib/collections";
import styles from "./blog.module.css";

/** Props for {@link CollectionFilter}. */
type Props = {
  /** Language of the page; picks texts and link prefixes. */
  lang: Locale;
  /** Every collection with posts in this language (from `getCollections`). */
  collections: Pick<Collection, "slug" | "name">[];
  /** Slug of the current page's collection; omit on the main blog list, where "all" is active. */
  active?: string;
};

/**
 * Row of filter chips above a post list: "all" followed by every collection.
 *
 * @remarks
 * Looks like a filter, but each chip is a link to a statically generated collection
 * page. That keeps the site free of client-side JavaScript for filtering and lets
 * search engines index every collection. The chip for the current page gets
 * `aria-current="page"`.
 *
 * @example
 * ```tsx
 * <CollectionFilter lang={lang} collections={await getCollections(lang)} active={collection?.slug} />
 * ```
 */
export function CollectionFilter({ lang, collections, active }: Props) {
  const dict = getDictionary(lang);
  const items = [{ label: dict.blog.all, path: "/blog", current: !active }].concat(
    collections.map(({ slug, name }) => ({
      label: name,
      path: collectionPath(lang, slug),
      current: slug === active,
    })),
  );

  return (
    <nav aria-label={dict.blog.filterLabel}>
      <ul className={styles.filter}>
        {items.map(({ label, path, current }) => (
          <li key={path}>
            <Chip href={localePath(lang, path)} variant="filter" active={current}>
              {label}
            </Chip>
          </li>
        ))}
      </ul>
    </nav>
  );
}
