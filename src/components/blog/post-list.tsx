import type { Locale } from "@/i18n";
import type { PostSummary } from "@/lib/posts";
import { PostCard } from "./post-card";
import styles from "./blog.module.css";

/** Props for {@link PostList}. */
type Props = {
  /** Language of the page; picks texts, date format and link prefixes. */
  lang: Locale;
  /** Posts to show, already sliced to the current page. */
  posts: PostSummary[];
};

/**
 * Vertical list of {@link PostCard}s.
 *
 * @remarks
 * Shared by every post list through {@link PaginatedPostList}, so a post looks the same
 * on the blog page and on tag pages. The list only handles the spacing between cards;
 * everything about a single post lives in `PostCard`.
 *
 * @example
 * ```tsx
 * <PostList lang={lang} posts={paginate(posts, page).posts} />
 * ```
 */
export function PostList({ lang, posts }: Props) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug}>
          <PostCard lang={lang} post={post} />
        </li>
      ))}
    </ul>
  );
}
