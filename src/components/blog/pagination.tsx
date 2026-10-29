import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/i18n";
import styles from "./blog.module.css";

type Props = { lang: Locale; page: number; totalPages: number; basePath: string };

// "← newer · page 2 / 5 · older →"; page 1 is the list's own URL
export function Pagination({ lang, page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const dict = getDictionary(lang).pagination;
  const href = (n: number) => localePath(lang, n === 1 ? basePath : `${basePath}/page/${n}`);

  return (
    <nav aria-label={dict.label} className={styles.pagination}>
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={styles.step}>
          {dict.newer}
        </Link>
      ) : (
        <span className={styles.step}>{dict.newer}</span>
      )}
      <span>{dict.page(page, totalPages)}</span>
      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className={styles.step}>
          {dict.older}
        </Link>
      ) : (
        <span className={styles.step}>{dict.older}</span>
      )}
    </nav>
  );
}
