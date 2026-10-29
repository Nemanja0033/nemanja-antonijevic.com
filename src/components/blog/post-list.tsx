import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/site";
import styles from "./blog.module.css";

// Post cards shared by /blog and /blog/tags/[tag]
export function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`} className={styles.card}>
            <Image
              src={post.cover}
              alt=""
              placeholder="blur"
              sizes="(max-width: 40rem) 100vw, 12rem"
              className={styles.cover}
            />
            <div className={styles.body}>
              <h2>{post.title}</h2>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.description && <p>{post.description}</p>}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
