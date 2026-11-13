import Image from "next/image";
import Link from "next/link";
import { Card, Pill } from "@/components/ui";
import { formatDate, getDictionary, localePath, type Locale } from "@/i18n";
import type { PostSummary } from "@/lib/posts";
import { CollectionChip } from "./collection-chip";
import styles from "./blog.module.css";

/** Props for {@link PostCard}. */
type Props = {
  /** Language of the page; picks texts, date format and link prefixes. */
  lang: Locale;
  /** The post to show: title, description, date, reading time, collection and cover. */
  post: PostSummary;
};

/**
 * One post in a list: date, reading time, title, description, collection, URL and cover.
 *
 * @remarks
 * The card is a {@link Card} laid out as text on the left and the cover on the right
 * (on phones the cover moves on top). Only the title is a link to the post, because
 * the collection chip inside links to its own page and links can't be nested. The cover is a
 * static import, so `next/image` knows its size and shows a blur placeholder.
 *
 * @example
 * ```tsx
 * <PostCard lang={lang} post={post} />
 * ```
 */
export function PostCard({ lang, post }: Props) {
  const dict = getDictionary(lang);
  const path = localePath(lang, `/blog/${post.slug}`);

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.body}>
        <div className={styles.meta}>
          <Pill>
            <time dateTime={post.date}>{formatDate(lang, post.date)}</time>
          </Pill>
          <span>{dict.post.readingTime(post.readingMinutes)}</span>
        </div>
        <h2>
          <Link href={path}>{post.title}</Link>
        </h2>
        {post.description && <p>{post.description}</p>}
        <div className={styles.footerRow}>
          <CollectionChip lang={lang} slug={post.collection} />
          <span className={styles.slug}>{path}</span>
        </div>
      </div>
      <Image
        src={post.cover}
        alt=""
        placeholder="blur"
        sizes="(max-width: 40rem) 100vw, 14rem"
        className={styles.cover}
      />
    </Card>
  );
}
