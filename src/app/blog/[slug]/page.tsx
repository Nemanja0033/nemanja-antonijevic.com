import type { Metadata } from "next";
import Image from "next/image";
import { getPost, getPostSlugs } from "@/lib/posts";
import { formatDate, site } from "@/lib/site";
import { TagList } from "@/components/blog/tag-list";
import styles from "./post.module.css";

// Only slugs from generateStaticParams exist; anything else is a 404
export const dynamicParams = false;

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
      tags: meta.tags,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { Content, meta, cover } = await getPost(slug);
  const url = `${site.url}/blog/${slug}`;

  // Structured data for search engines (https://schema.org/BlogPosting)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    keywords: meta.tags,
    author: { "@type": "Person", name: site.author, url: site.url },
    image: `${url}/opengraph-image`,
    url,
    mainEntityOfPage: url,
  };

  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <h1>{meta.title}</h1>
        <time dateTime={meta.date}>{formatDate(meta.date)}</time>
        <TagList tags={meta.tags} />
      </header>
      <Image
        src={cover}
        alt=""
        placeholder="blur"
        sizes="(max-width: 70ch) 100vw, 70ch"
        preload
        className={styles.cover}
      />
      <Content />
      <script
        type="application/ld+json"
        // Escape "<" so post content can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      </article>
  );
}
