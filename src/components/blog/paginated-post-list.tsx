import { Pill } from "@/components/ui";
import { getDictionary, type Locale } from "@/i18n";
import { getAllTags, paginate, type PostSummary } from "@/lib/posts";
import { Pagination } from "./pagination";
import { PostList } from "./post-list";
import { TagFilter } from "./tag-filter";
import styles from "./blog.module.css";

/** Props for {@link PaginatedPostList}. */
type Props = {
  /** Language of the page; picks texts, dates and link prefixes. */
  lang: Locale;
  /** Page heading, e.g. `"Blog"` or `"#css"`. */
  title: string;
  /** The whole list, newest first. The component picks the slice for `page` itself. */
  posts: PostSummary[];
  /** 1-based page number (default `1`). Only values from `generateStaticParams` arrive here. */
  page?: number;
  /**
   * Path of page 1 without the language, e.g. `"/blog"` or `"/blog/tags/css"`;
   * page `n` lives at `${basePath}/page/n`.
   */
  basePath: string;
  /** Tag whose page this is; highlighted in the filter. Omit on the main blog list. */
  activeTag?: string;
};

/**
 * A complete post list page: title with post count, tag filter, one page of post
 * cards and the newer/older links.
 *
 * @remarks
 * Four routes show a post list: `/blog`, `/blog/page/[page]`, `/blog/tags/[tag]` and
 * `/blog/tags/[tag]/page/[page]`. This server component keeps them identical, so each
 * route only loads its posts and passes them in. It runs at build time (the routes are
 * statically generated), so `getAllTags` costs nothing per request.
 *
 * @example
 * ```tsx
 * // src/app/[lang]/blog/tags/[tag]/page.tsx
 * <PaginatedPostList
 *   lang={lang}
 *   title={`#${tag}`}
 *   posts={await getPostsByTag(lang, tag)}
 *   basePath={`/blog/tags/${tag}`}
 *   activeTag={tag}
 * />
 * ```
 */
export async function PaginatedPostList({
  lang,
  title,
  posts,
  page = 1,
  basePath,
  activeTag,
}: Props) {
  const tags = await getAllTags(lang);
  const current = paginate(posts, page);

  return (
    <>
      <div className={styles.titleRow}>
        <h1>{title}</h1>
        <Pill>{getDictionary(lang).blog.postCount(posts.length)}</Pill>
      </div>
      <TagFilter lang={lang} tags={tags.map(({ tag }) => tag)} active={activeTag} />
      <PostList lang={lang} posts={current.posts} />
      <Pagination
        lang={lang}
        page={current.page}
        totalPages={current.totalPages}
        basePath={basePath}
      />
    </>
  );
}
