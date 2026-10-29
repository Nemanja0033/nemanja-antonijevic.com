import type { Metadata } from "next";
import Image from "next/image";
import { getPost, getPostSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/site";
import styles from "./post.module.css";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getPost(slug);
  const url = `/blog/${slug}`;

  // og:image comes from the colocated opengraph-image.tsx
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { Content, meta, cover } = await getPost(slug);

  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <h1>{meta.title}</h1>
        <time dateTime={meta.date}>{formatDate(meta.date)}</time>
      </header>
      {cover && (
        <Image
          src={cover}
          alt=""
          placeholder="blur"
          sizes="(max-width: 70ch) 100vw, 70ch"
          preload
          className={styles.cover}
        />
      )}
      <Content />
    </article>
  );
}
