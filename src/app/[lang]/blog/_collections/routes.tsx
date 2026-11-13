// The collections section lives at a translated URL (/sr/blog/kolekcije, /en/blog/collections),
// so it has one route folder per language. Both folders use these factories; each one
// only serves its own language, the other language gets a 404.
//
// generateStaticParams returns the same params for both values of [lang]: if it returns
// [] for one of them, Next 16 skips the route for the other one too. The page in the
// wrong language then calls notFound() and is prerendered as a 404.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";
import { Card, Pill } from "@/components/ui";
import { alternates, collectionPath, getDictionary, localePath, toLocale, type Locale } from "@/i18n";
import { availableIn } from "@/lib/paths";
import { extraPageNumbers, getCollections, getPostsByCollection } from "@/lib/posts";
import styles from "./collections.module.css";

type Params<T = object> = { params: Promise<{ lang: string } & T> };

// The [lang] param as a Locale, or a 404 if this folder belongs to another language
async function ownLocale(segmentLang: Locale, params: Promise<{ lang: string }>) {
  const lang = toLocale((await params).lang);
  if (lang !== segmentLang) notFound();
  return lang;
}

async function findCollection(lang: Locale, slug: string) {
  const collection = (await getCollections(lang)).find((c) => c.slug === slug);
  if (!collection) notFound();
  return collection;
}

// /<lang>/blog/<segment>: every collection with its description and post count
export function collectionsIndex(segmentLang: Locale) {
  return {
    async generateMetadata({ params }: Params): Promise<Metadata> {
      const lang = await ownLocale(segmentLang, params);
      const dict = getDictionary(lang);
      const path = collectionPath(lang);
      return {
        title: dict.collections.title,
        description: dict.collections.description,
        alternates: alternates(lang, path, await availableIn(lang, path)),
      };
    },

    async Page({ params }: Params) {
      const lang = await ownLocale(segmentLang, params);
      const dict = getDictionary(lang);
      const collections = await getCollections(lang);
      if (!collections.length) notFound();

      return (
        <>
          <div className={styles.titleRow}>
            <h1>{dict.collections.title}</h1>
          </div>
          <p className={styles.intro}>{dict.collections.description}</p>
          <ul className={styles.grid}>
            {collections.map(({ slug, name, description, count }) => (
              <li key={slug}>
                <Card as="article" className={styles.card}>
                  <h2>
                    <Link href={localePath(lang, collectionPath(lang, slug))}>{name}</Link>
                  </h2>
                  <p>{description}</p>
                  <Pill>{dict.blog.postCount(count)}</Pill>
                </Card>
              </li>
            ))}
          </ul>
        </>
      );
    },
  };
}

// /<lang>/blog/<segment>/<collection>: page 1 of a collection's posts
export function collectionPage(segmentLang: Locale) {
  type P = Params<{ collection: string }>;
  return {
    async generateStaticParams() {
      return (await getCollections(segmentLang)).map(({ slug }) => ({ collection: slug }));
    },

    async generateMetadata({ params }: P): Promise<Metadata> {
      const lang = await ownLocale(segmentLang, params);
      const collection = await findCollection(lang, (await params).collection);
      const path = collectionPath(lang, collection.slug);
      return {
        title: collection.name,
        description: collection.description,
        alternates: alternates(lang, path, await availableIn(lang, path)),
      };
    },

    async Page({ params }: P) {
      const lang = await ownLocale(segmentLang, params);
      const collection = await findCollection(lang, (await params).collection);
      return (
        <PaginatedPostList
          lang={lang}
          title={collection.name}
          posts={await getPostsByCollection(lang, collection.slug)}
          basePath={collectionPath(lang, collection.slug)}
          collection={collection}
        />
      );
    },
  };
}

// /<lang>/blog/<segment>/<collection>/page/<n>: pages 2..N of a collection
export function collectionListPage(segmentLang: Locale) {
  type P = Params<{ collection: string; page: string }>;
  return {
    async generateStaticParams({ params }: { params: { collection: string } }) {
      const posts = await getPostsByCollection(segmentLang, params.collection);
      return extraPageNumbers(posts).map((page) => ({ page }));
    },

    async generateMetadata({ params }: P): Promise<Metadata> {
      const lang = await ownLocale(segmentLang, params);
      const { collection: slug, page } = await params;
      const collection = await findCollection(lang, slug);
      const path = `${collectionPath(lang, slug)}/page/${page}`;
      return {
        title: getDictionary(lang).blog.collectionPageTitle(collection.name, page),
        description: collection.description,
        alternates: alternates(lang, path, await availableIn(lang, path)),
      };
    },

    async Page({ params }: P) {
      const lang = await ownLocale(segmentLang, params);
      const { collection: slug, page } = await params;
      const collection = await findCollection(lang, slug);
      return (
        <PaginatedPostList
          lang={lang}
          title={collection.name}
          posts={await getPostsByCollection(lang, slug)}
          page={Number(page)}
          basePath={collectionPath(lang, slug)}
          collection={collection}
        />
      );
    },
  };
}
