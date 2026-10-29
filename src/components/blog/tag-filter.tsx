import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/i18n";
import styles from "./blog.module.css";

type Props = { lang: Locale; tags: string[]; active?: string };

// Filter row above a post list: "all" + every tag, each its own static page
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
            <Link href={localePath(lang, path)} aria-current={current ? "page" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
