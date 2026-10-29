import { Pill } from "@/components/ui";
import { getDictionary, type Locale } from "@/i18n";
import { getAllTags, paginate, type PostSummary } from "@/lib/posts";
import { Pagination } from "./pagination";
import { PostList } from "./post-list";
import { TagFilter } from "./tag-filter";
import styles from "./blog.module.css";

type Props = {
  lang: Locale;
  title: string;
  posts: PostSummary[]; // the whole list; this component picks the current page
  page?: number;
  basePath: string; // path of page 1 without the language, e.g. "/blog" or "/blog/tags/css"
  activeTag?: string;
};

// A post list page: title with count, tag filter, one page of cards, pagination.
// Used by /blog, /blog/page/n and the tag pages
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
