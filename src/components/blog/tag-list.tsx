import { Chip } from "@/components/ui";
import { localePath, type Locale } from "@/i18n";
import styles from "./blog.module.css";

// Tag chips linking to each tag's page (cards, post header)
export function TagList({ lang, tags }: { lang: Locale; tags: string[] }) {
  if (!tags.length) return null;

  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag}>
          <Chip href={localePath(lang, `/blog/tags/${tag}`)}>{tag}</Chip>
        </li>
      ))}
    </ul>
  );
}
