import { Chip } from "@/components/ui";
import { localePath, type Locale } from "@/i18n";
import styles from "./blog.module.css";

/** Props for {@link TagList}. */
type Props = {
  /** Language of the page; picks link prefixes. */
  lang: Locale;
  /** The post's tags, from its `meta.tags`. */
  tags: string[];
};

/**
 * Small tag chips, each linking to its tag page.
 *
 * @remarks
 * Used in post cards, the post header and the post sidebar, so tags look and behave
 * the same everywhere. Renders nothing for a post without tags, so callers don't need
 * their own check.
 *
 * @example
 * ```tsx
 * <TagList lang={lang} tags={meta.tags} />
 * ```
 */
export function TagList({ lang, tags }: Props) {
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
