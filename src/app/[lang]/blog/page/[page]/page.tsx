import type { Metadata } from "next";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";
import { alternates, getDictionary, toLocale } from "@/i18n";
import { availableIn } from "@/lib/paths";
import { extraPageNumbers, getAllPosts } from "@/lib/posts";

// Pages 2..N only; /blog/page/1 and pages past the end are a 404
export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return extraPageNumbers(await getAllPosts(toLocale(params.lang))).map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/page/[page]">): Promise<Metadata> {
  const { lang: param, page } = await params;
  const lang = toLocale(param);
  const path = `/blog/page/${page}`;
  return {
    title: getDictionary(lang).blog.pageTitle(page),
    alternates: alternates(lang, path, await availableIn(path)),
  };
}

export default async function BlogListPage({ params }: PageProps<"/[lang]/blog/page/[page]">) {
  const { lang: param, page } = await params;
  const lang = toLocale(param);
  return (
    <PaginatedPostList
      lang={lang}
      title={getDictionary(lang).blog.title}
      posts={await getAllPosts(lang)}
      page={Number(page)}
      basePath="/blog"
    />
  );
}
