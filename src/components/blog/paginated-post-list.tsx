import Link from "next/link";
import { getAllTags, paginate, type PostSummary } from "@/lib/posts";
import { Pagination } from "./pagination";
import { PostList } from "./post-list";
import { TagList } from "./tag-list";
import styles from "./blog.module.css";

type Props = {
  title: string;
  posts: PostSummary[]; // the whole list; this component picks the current page
  page?: number;
  basePath: string; // URL of page 1, e.g. "/blog" or "/blog/tags/css"
  activeTag?: string;
};

// A post list page: title, tags, one page of post cards and Newer/Older links.
// Used by /blog, /blog/page/n and the tag pages
export async function PaginatedPostList({ title, posts, page = 1, basePath, activeTag }: Props) {
  const tags = await getAllTags();
  const current = paginate(posts, page);

  return (
    <section className={styles.blog}>
      {activeTag && (
        <p className={styles.back}>
          <Link href="/blog">← All posts</Link>
        </p>
      )}
      <h1>{title}</h1>
      <TagList tags={tags.map(({ tag }) => tag)} active={activeTag} />
      <PostList posts={current.posts} />
      <Pagination page={current.page} totalPages={current.totalPages} basePath={basePath} />
    </section>
  );
}
