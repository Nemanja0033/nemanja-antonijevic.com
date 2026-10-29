import { getAllTags, paginate, type PostSummary } from "@/lib/posts";
import { Pagination } from "./pagination";
import { PostList } from "./post-list";
import { TagFilter } from "./tag-filter";
import styles from "./blog.module.css";

type Props = {
  title: string;
  posts: PostSummary[]; // the whole list; this component picks the current page
  page?: number;
  basePath: string; // URL of page 1, e.g. "/blog" or "/blog/tags/css"
  activeTag?: string;
};

// "1 zapis", "2 zapisa", "11 zapisa", "21 zapis"
function countLabel(n: number) {
  return `${n} ${n % 10 === 1 && n % 100 !== 11 ? "zapis" : "zapisa"}`;
}

// A post list page: title with count, tag filter, one page of cards, pagination.
// Used by /blog, /blog/page/n and the tag pages
export async function PaginatedPostList({ title, posts, page = 1, basePath, activeTag }: Props) {
  const tags = await getAllTags();
  const current = paginate(posts, page);

  return (
    <>
      <div className={styles.titleRow}>
        <h1>{title}</h1>
        <span className="pill">{countLabel(posts.length)}</span>
      </div>
      <TagFilter tags={tags.map(({ tag }) => tag)} active={activeTag} />
      <PostList posts={current.posts} />
      <Pagination page={current.page} totalPages={current.totalPages} basePath={basePath} />
    </>
  );
}
