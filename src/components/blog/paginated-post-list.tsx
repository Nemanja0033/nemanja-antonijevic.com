import Link from "next/link";
import { Pill } from "@/components/ui";
import { collectionPath, getDictionary, localePath, type Locale } from "@/i18n";
import type { Collection } from "@/lib/collections";
import { getCollections, paginate, type PostSummary } from "@/lib/posts";
import { CollectionFilter } from "./collection-filter";
import { Pagination } from "./pagination";
import { PostList } from "./post-list";
import styles from "./blog.module.css";

/** Props for {@link PaginatedPostList}. */
type Props = {
  /** Language of the page; picks texts, dates and link prefixes. */
  lang: Locale;
  /** Page heading, e.g. `"Blog"` or the collection's name. */
  title: string;
  /** The whole list, newest first. The component picks the slice for `page` itself. */
  posts: PostSummary[];
  /** 1-based page number (default `1`). Only values from `generateStaticParams` arrive here. */
  page?: number;
  /**
   * Path of page 1 without the language, e.g. `"/blog"` or `"/blog/kolekcije/<slug>"`;
   * page `n` lives at `${basePath}/page/n`.
   */
  basePath: string;
  /**
   * Collection whose page this is: adds a link back to all collections and its
   * description, and highlights it in the filter. Omit on the main blog list.
   */
  collection?: Pick<Collection, "slug" | "description">;
};

/**
 * A complete post list page: title with post count, collection filter, one page of
 * post cards and the newer/older links.
 *
 * @remarks
 * Four routes show a post list: `/blog`, `/blog/page/[page]`, a collection and its
 * pages 2..N. This server component keeps them identical, so each route only loads its
 * posts and passes them in. It runs at build time (the routes are statically
 * generated), so `getCollections` costs nothing per request.
 *
 * @example
 * ```tsx
 * // a collection page
 * <PaginatedPostList
 *   lang={lang}
 *   title={collection.name}
 *   posts={await getPostsByCollection(lang, collection.slug)}
 *   basePath={collectionPath(lang, collection.slug)}
 *   collection={collection}
 * />
 * ```
 */
export async function PaginatedPostList({
  lang,
  title,
  posts,
  page = 1,
  basePath,
  collection,
}: Props) {
  const dict = getDictionary(lang);
  const collections = await getCollections(lang);
  const current = paginate(posts, page);

  return (
    <>
      {collection && (
        <p className={styles.crumb}>
          <Link href={localePath(lang, collectionPath(lang))}>{dict.collections.back}</Link>
        </p>
      )}
      <div className={styles.titleRow}>
        <h1>{title}</h1>
        <Pill>{dict.blog.postCount(posts.length)}</Pill>
      </div>
      {collection && <p className={styles.intro}>{collection.description}</p>}
      <CollectionFilter lang={lang} collections={collections} active={collection?.slug} />
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
