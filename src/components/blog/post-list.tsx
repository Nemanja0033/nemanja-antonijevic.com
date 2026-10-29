import Image from "next/image";
import Link from "next/link";
import { Card, Pill } from "@/components/ui";
import { formatDate, getDictionary, localePath, type Locale } from "@/i18n";
import type { PostSummary } from "@/lib/posts";
import { TagList } from "./tag-list";
import styles from "./blog.module.css";

// Post cards shared by every post list
export function PostList({ lang, posts }: { lang: Locale; posts: PostSummary[] }) {
  const dict = getDictionary(lang);

  return (
    <ul className={styles.list}>
      {posts.map((post) => {
        const path = localePath(lang, `/blog/${post.slug}`);
        return (
          <li key={post.slug}>
            <Card as="article" className={styles.card}>
              <div className={styles.body}>
                <div className={styles.meta}>
                  <Pill>
                    <time dateTime={post.date}>{formatDate(lang, post.date)}</time>
                  </Pill>
                  <span>{dict.post.readingTime(post.readingMinutes)}</span>
                </div>
                <h2>
                  <Link href={path}>{post.title}</Link>
                </h2>
                {post.description && <p>{post.description}</p>}
                <div className={styles.footerRow}>
                  <TagList lang={lang} tags={post.tags} />
                  <span className={styles.slug}>{path}</span>
                </div>
              </div>
              <Image
                src={post.cover}
                alt=""
                placeholder="blur"
                sizes="(max-width: 40rem) 100vw, 14rem"
                className={styles.cover}
              />
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
