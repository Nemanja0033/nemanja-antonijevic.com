import type { Metadata } from "next";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";
import { alternates, getDictionary, toLocale } from "@/i18n";
import { availableIn } from "@/lib/paths";
import { getAllPosts } from "@/lib/posts";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const dict = getDictionary(lang);
  return {
    title: dict.blog.title,
    description: dict.blog.description,
    alternates: alternates(lang, "/blog", await availableIn("/blog")),
  };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const lang = toLocale((await params).lang);
  return (
    <PaginatedPostList
      lang={lang}
      title={getDictionary(lang).blog.title}
      posts={await getAllPosts(lang)}
      basePath="/blog"
    />
  );
}
