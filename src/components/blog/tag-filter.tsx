import { Chip } from "@/components/ui";
import { getDictionary, localePath, type Locale } from "@/i18n";
import styles from "./blog.module.css";

/** Props for {@link TagFilter}. */
type Props = {
  /** Language of the page; picks texts and link prefixes. */
  lang: Locale;
  /** Every tag used in this language, most used first (from `getAllTags`). */
  tags: string[];
  /** Tag of the current page; omit on the main blog list, where "all" is active. */
  active?: string;
};

/**
 * Row of filter chips above a post list: "all" followed by every tag.
 *
 * @remarks
 * Looks like a filter, but each chip is a link to a statically generated tag page.
 * That keeps the site free of client-side JavaScript for filtering and lets search
 * engines index every tag page. The chip for the current page gets
 * `aria-current="page"`.
 *
 * @example
 * ```tsx
 * <TagFilter lang={lang} tags={tags.map(({ tag }) => tag)} active={activeTag} />
 * ```
 */
export function TagFilter({ lang, tags, active }: Props) {
  const dict = getDictionary(lang);
  const items = [{ label: dict.blog.all, path: "/blog", current: !active }].concat(
    tags.map((tag) => ({ label: tag, path: `/blog/tags/${tag}`, current: tag === active })),
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
