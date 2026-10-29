import type { Metadata } from "next";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";
import { alternates, getDictionary, toLocale } from "@/i18n";
import { availableIn } from "@/lib/paths";
import { extraPageNumbers, getPostsByTag } from "@/lib/posts";

// Pages 2..N of each tag only; anything else is a 404
export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string; tag: string } }) {
  const posts = await getPostsByTag(toLocale(params.lang), params.tag);
  return extraPageNumbers(posts).map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/tags/[tag]/page/[page]">): Promise<Metadata> {
  const { lang: param, tag, page } = await params;
  const lang = toLocale(param);
  const dict = getDictionary(lang);
  const path = `/blog/tags/${tag}/page/${page}`;
  return {
    title: dict.blog.tagPageTitle(tag, page),
    description: dict.blog.tagDescription(tag),
    alternates: alternates(lang, path, await availableIn(path)),
  };
}

export default async function TagListPage({
  params,
}: PageProps<"/[lang]/blog/tags/[tag]/page/[page]">) {
  const { lang: param, tag, page } = await params;
  const lang = toLocale(param);
  return (
    <PaginatedPostList
      lang={lang}
      title={`#${tag}`}
      posts={await getPostsByTag(lang, tag)}
      page={Number(page)}
      basePath={`/blog/tags/${tag}`}
      activeTag={tag}
    />
  );
}
