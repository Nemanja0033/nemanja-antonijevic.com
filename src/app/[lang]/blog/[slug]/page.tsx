import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TagList } from "@/components/blog/tag-list";
import { alternates, formatDate, getDictionary, localePath, toLocale } from "@/i18n";
import { getAdjacentPosts, getPost, getPostLanguages, getPostSlugs } from "@/lib/posts";
import { site } from "@/lib/site";
import styles from "./post.module.css";

// Only posts written in this language exist; anything else is a 404
export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return (await getPostSlugs(toLocale(params.lang))).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang: param, slug } = await params;
  const lang = toLocale(param);
  const { meta } = await getPost(lang, slug);
  const path = `/blog/${slug}`;

  // og:image comes from the colocated opengraph-image.tsx
  return {
    title: meta.title,
    description: meta.description,
    alternates: alternates(lang, path, await getPostLanguages(slug)),
    openGraph: {
      type: "article",
      url: localePath(lang, path),
      locale: getDictionary(lang).ogLocale,
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
}: PageProps<"/[lang]/blog/[slug]">) {
  const { lang: param, slug } = await params;
  const lang = toLocale(param);
  const dict = getDictionary(lang);
  const [{ Content, meta, cover, readingMinutes, headings }, { older, newer }] = await Promise.all([
    getPost(lang, slug),
    getAdjacentPosts(lang, slug),
  ]);
  const url = `${site.url}${localePath(lang, `/blog/${slug}`)}`;

  // Structured data for search engines (https://schema.org/BlogPosting)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    inLanguage: dict.htmlLang,
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
          <Link href={localePath(lang, "/blog")}>{dict.post.back}</Link> <span>/ {slug}</span>
        </p>
        <h1>{meta.title}</h1>
        <div className={styles.meta}>
          <time dateTime={meta.date} className="pill">
            {formatDate(lang, meta.date, "long")}
          </time>
          <span className="pill">{dict.post.readingTime(readingMinutes)}</span>
          <TagList lang={lang} tags={meta.tags} />
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
                <h2>{dict.post.onThisPage}</h2>
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
                <h2>{dict.post.tags}</h2>
                <TagList lang={lang} tags={meta.tags} />
              </>
            )}
          </aside>
        )}
      </div>

      <nav aria-label={dict.post.adjacentLabel} className={styles.adjacent}>
        {older ? (
          <Link href={localePath(lang, `/blog/${older.slug}`)}>
            <span>{dict.post.older}</span>
            {older.title}
          </Link>
        ) : (
          <div>
            <span>{dict.post.older}</span>
            {dict.post.firstPost}
          </div>
        )}
        {newer ? (
          <Link href={localePath(lang, `/blog/${newer.slug}`)}>
            <span>{dict.post.newer}</span>
            {newer.title}
          </Link>
        ) : (
          <div>
            <span>{dict.post.newer}</span>
            {dict.post.latestPost}
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
