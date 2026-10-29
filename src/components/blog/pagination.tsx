import Link from "next/link";
import styles from "./blog.module.css";

type Props = { page: number; totalPages: number; basePath: string };

// "← Newer posts · Page 2 of 5 · Older posts →"; page 1 is the list's own URL
export function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);

  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev">
          ← Back
        </Link>
      ) : (
        <span />
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next">
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
