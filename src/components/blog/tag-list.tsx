import Link from "next/link";
import styles from "./blog.module.css";

// Tag links, used above the post list and in the post header
export function TagList({ tags, active }: { tags: string[]; active?: string }) {
  if (!tags.length) return null;

  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/blog/tags/${tag}`}
            className={styles.tag}
            aria-current={tag === active ? "page" : undefined}
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
