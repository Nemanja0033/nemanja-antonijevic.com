import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/site";
import { TagList } from "./tag-list";
import styles from "./blog.module.css";

// Post cards shared by every post list
export function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug}>
          <article className={styles.card}>
            <div className={styles.body}>
              <div className={styles.meta}>
                <time dateTime={post.date} className="pill">
                  {formatDate(post.date)}
                </time>
                <span>{post.readingMinutes} min čitanja</span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.description && <p>{post.description}</p>}
              <div className={styles.footerRow}>
                <TagList tags={post.tags} />
                <span className={styles.slug}>/blog/{post.slug}</span>
              </div>
            </div>
            <Image
              src={post.cover}
              alt=""
              placeholder="blur"
              sizes="(max-width: 40rem) 100vw, 14rem"
              className={styles.cover}
            />
          </article>
        </li>
      ))}
    </ul>
  );
}
