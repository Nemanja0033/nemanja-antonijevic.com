import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/i18n";
import type { PostSummary } from "@/lib/posts";
import styles from "./blog.module.css";

/** Props for {@link LatestPosts}. */
type Props = {
  /** Language of the page; picks texts, date format and link prefixes. */
  lang: Locale;
  /** The newest posts to show, newest first (the home page passes the first three). */
  posts: PostSummary[];
};

/**
 * "Latest posts" section: a minimal list of post titles with their descriptions, then
 * a link to the full blog.
 *
 * @remarks
 * Used on the home page under the hero, so visitors see fresh writing without opening
 * the blog first. Deliberately minimal next to {@link PostList}: no card, cover, date
 * or tags, and only the title is a link. Renders nothing when there are no posts yet,
 * so the home page never shows an empty heading.
 *
 * @example
 * ```tsx
 * <LatestPosts lang={lang} posts={(await getAllPosts(lang)).slice(0, 3)} />
 * ```
 */
export function LatestPosts({ lang, posts }: Props) {
  if (!posts.length) return null;
  const dict = getDictionary(lang);

  return (
    <section aria-labelledby="latest-title" className={styles.latest}>
      <h2 id="latest-title">{dict.home.latestTitle}</h2>
      <ul className={styles.latestList}>
        {posts.map((post) => (
          <li key={post.slug}>
            <h3>
              <Link href={localePath(lang, `/blog/${post.slug}`)}>{post.title}</Link>
            </h3>
            {post.description && <p>{post.description}</p>}
          </li>
        ))}
      </ul>
      <Link href={localePath(lang, "/blog")} className={styles.allPosts}>
        {dict.home.allPosts}
      </Link>
    </section>
  );
}
