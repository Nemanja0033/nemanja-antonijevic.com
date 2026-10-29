import { Button } from "@/components/ui";
import { getDictionary, localePath, type Locale } from "@/i18n";
import styles from "./blog.module.css";

type Props = { lang: Locale; page: number; totalPages: number; basePath: string };

// "← newer · page 2 / 5 · older →"; page 1 is the list's own URL
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
