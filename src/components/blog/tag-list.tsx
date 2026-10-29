import Link from "next/link";
import styles from "./blog.module.css";

// Small yellow tag pills linking to each tag's page (cards, post header)
export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/blog/tags/${tag}`}>{tag}</Link>
        </li>
      ))}
    </ul>
  );
}
