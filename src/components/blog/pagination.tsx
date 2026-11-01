import { Button } from "@/components/ui";
import { getDictionary, localePath, type Locale } from "@/i18n";
import styles from "./blog.module.css";

/** Props for {@link Pagination}. */
type Props = {
  /** Language of the page; picks texts and link prefixes. */
  lang: Locale;
  /** Current 1-based page. */
  page: number;
  /** Number of pages in the list; with `1` nothing is rendered. */
  totalPages: number;
  /** Path of page 1 without the language, e.g. `"/blog"`; page `n` is `${basePath}/page/n`. */
  basePath: string;
};

/**
 * "← newer · page 2 / 5 · older →" links under a post list.
 *
 * @remarks
 * Every page of a list is a static page, so these are plain links with `rel="prev"` /
 * `rel="next"`. Page 1 links to the list's own URL (`/blog`), never `/blog/page/1`, so
 * each page has exactly one address. An unavailable step stays visible but muted,
 * which keeps the layout from jumping between pages.
 *
 * @example
 * ```tsx
 * <Pagination lang={lang} page={2} totalPages={5} basePath="/blog" />
 * ```
 */
export function Pagination({ lang, page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const dict = getDictionary(lang).pagination;
  const href = (n: number) => localePath(lang, n === 1 ? basePath : `${basePath}/page/${n}`);
  const hasNewer = page > 1;
  const hasOlder = page < totalPages;

  return (
    <nav aria-label={dict.label} className={styles.pagination}>
      <Button
        href={hasNewer ? href(page - 1) : undefined}
        variant={hasNewer ? "primary" : "muted"}
        rel="prev"
      >
        {dict.newer}
      </Button>
      <span>{dict.page(page, totalPages)}</span>
      <Button
        href={hasOlder ? href(page + 1) : undefined}
        variant={hasOlder ? "primary" : "muted"}
        rel="next"
      >
        {dict.older}
      </Button>
    </nav>
  );
}
