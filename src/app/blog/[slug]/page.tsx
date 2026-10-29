import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAdjacentPosts, getPost, getPostSlugs } from "@/lib/posts";
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
  const [{ Content, meta, cover, readingMinutes, headings }, { older, newer }] = await Promise.all([
    getPost(slug),
    getAdjacentPosts(slug),
  ]);
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
    <article>
      <header className={styles.header}>
        <p className={styles.crumb}>
          <Link href="/blog">← blog</Link> <span>/ {slug}</span>
        </p>
        <h1>{meta.title}</h1>
        <div className={styles.meta}>
          <time dateTime={meta.date} className="pill">
            {formatDate(meta.date, "long")}
          </time>
          <span className="pill">{readingMinutes} min čitanja</span>
          <TagList tags={meta.tags} />
        </div>
      </header>

      <Image
        src={cover}
        alt=""
        placeholder="blur"
        sizes="(max-width: 70rem) 100vw, 70rem"
        preload
        className={styles.cover}
      />

      <div className={styles.layout}>
        <div className={styles.content}>
          <Content />
        </div>
        {(headings.length > 0 || meta.tags.length > 0) && (
          <aside className={styles.aside}>
            {headings.length > 0 && (
              <>
                <h2>na ovoj strani</h2>
                <ol>
                  {headings.map(({ id, text }) => (
                    <li key={id}>
                      <a href={`#${id}`}>{text}</a>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {meta.tags.length > 0 && (
              <>
                <h2>oznake</h2>
                <TagList tags={meta.tags} />
              </>
            )}
          </aside>
        )}
      </div>

      <nav aria-label="Susedni zapisi" className={styles.adjacent}>
        {older ? (
          <Link href={`/blog/${older.slug}`}>
            <span>← starije</span>
            {older.title}
          </Link>
        ) : (
          <div>
            <span>← starije</span>
            Ovo je prvi zapis.
          </div>
        )}
        {newer ? (
          <Link href={`/blog/${newer.slug}`}>
            <span>novije →</span>
            {newer.title}
          </Link>
        ) : (
          <div>
            <span>novije →</span>
            Ovo je najnovije. Navrati kasnije.
          </div>
        )}
      </nav>

      <script
        type="application/ld+json"
        // Escape "<" so post content can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </article>
  );
}
