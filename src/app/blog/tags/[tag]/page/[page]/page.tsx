import type { Metadata } from "next";
import { extraPageNumbers, getAllTags, getPostsByTag } from "@/lib/posts";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";

// Pages 2..N of each tag only; anything else is a 404
export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  const params = await Promise.all(
    tags.map(async ({ tag }) =>
      extraPageNumbers(await getPostsByTag(tag)).map((page) => ({ tag, page })),
    ),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tags/[tag]/page/[page]">): Promise<Metadata> {
  const { tag, page } = await params;
  return {
    title: `#${tag} – strana ${page}`,
    description: `Zapisi sa oznakom #${tag}`,
    alternates: { canonical: `/blog/tags/${tag}/page/${page}` },
  };
}

export default async function TagListPage({
  params,
}: PageProps<"/blog/tags/[tag]/page/[page]">) {
  const { tag, page } = await params;
  return (
    <PaginatedPostList
      title={`#${tag}`}
      posts={await getPostsByTag(tag)}
      page={Number(page)}
      basePath={`/blog/tags/${tag}`}
      activeTag={tag}
    />
  );
}
