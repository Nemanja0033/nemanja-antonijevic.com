import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";

// Only tags used by at least one post exist; anything else is a 404
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllTags()).map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tags/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Zapisi sa oznakom #${tag}`,
    alternates: { canonical: `/blog/tags/${tag}` },
  };
}

export default async function TagPage({ params }: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;
  return (
    <PaginatedPostList
      title={`#${tag}`}
      posts={await getPostsByTag(tag)}
      basePath={`/blog/tags/${tag}`}
      activeTag={tag}
    />
  );
}
