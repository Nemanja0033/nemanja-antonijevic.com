import Link from "next/link";
import styles from "./blog.module.css";

type Props = { page: number; totalPages: number; basePath: string };

// "← novije · strana 2 / 5 · starije →"; page 1 is the list's own URL
export function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);

  return (
    <nav aria-label="Stranice" className={styles.pagination}>
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={styles.step}>
          ← novije
        </Link>
      ) : (
        <span className={styles.step}>← novije</span>
      )}
      <span>
        strana {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className={styles.step}>
          starije →
        </Link>
      ) : (
        <span className={styles.step}>starije →</span>
      )}
    </nav>
  );
}
