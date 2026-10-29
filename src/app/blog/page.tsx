import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/site";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className={styles.blog}>
      <h1>Blog</h1>
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className={styles.card}>
              {post.cover && (
                <Image
                  src={post.cover}
                  alt=""
                  placeholder="blur"
                  sizes="(max-width: 40rem) 100vw, 12rem"
                  className={styles.cover}
                />
              )}
              <div className={styles.body}>
                <h2>{post.title}</h2>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.description && <p>{post.description}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
