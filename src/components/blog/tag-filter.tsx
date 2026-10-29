import Link from "next/link";
import styles from "./blog.module.css";

// Filter row above a post list: "sve" (all posts) + every tag, each its own static page
export function TagFilter({ tags, active }: { tags: string[]; active?: string }) {
  const items = [{ label: "sve", href: "/blog", current: !active }].concat(
    tags.map((tag) => ({ label: tag, href: `/blog/tags/${tag}`, current: tag === active })),
  );

  return (
    <nav aria-label="Filter po oznakama">
      <ul className={styles.filter}>
        {items.map(({ label, href, current }) => (
          <li key={label}>
            <Link href={href} aria-current={current ? "page" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
