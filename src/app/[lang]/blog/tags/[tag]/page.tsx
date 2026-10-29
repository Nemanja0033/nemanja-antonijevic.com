import type { Metadata } from "next";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";
import { alternates, getDictionary, toLocale } from "@/i18n";
import { availableIn } from "@/lib/paths";
import { getAllTags, getPostsByTag } from "@/lib/posts";

// Only tags used by at least one post in this language exist; anything else is a 404
export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return (await getAllTags(toLocale(params.lang))).map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/tags/[tag]">): Promise<Metadata> {
  const { lang: param, tag } = await params;
  const lang = toLocale(param);
  const path = `/blog/tags/${tag}`;
  return {
    title: `#${tag}`,
    description: getDictionary(lang).blog.tagDescription(tag),
    alternates: alternates(lang, path, await availableIn(path)),
  };
}

export default async function TagPage({ params }: PageProps<"/[lang]/blog/tags/[tag]">) {
  const { lang: param, tag } = await params;
  const lang = toLocale(param);
  return (
    <PaginatedPostList
      lang={lang}
      title={`#${tag}`}
      posts={await getPostsByTag(lang, tag)}
      basePath={`/blog/tags/${tag}`}
      activeTag={tag}
    />
  );
}
