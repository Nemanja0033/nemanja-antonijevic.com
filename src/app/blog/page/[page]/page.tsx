import type { Metadata } from "next";
import { extraPageNumbers, getAllPosts } from "@/lib/posts";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";

// Pages 2..N only; /blog/page/1 and pages past the end are a 404
export const dynamicParams = false;

export async function generateStaticParams() {
  return extraPageNumbers(await getAllPosts()).map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Blog – Page ${page}`,
    alternates: { canonical: `/blog/page/${page}` },
  };
}

export default async function BlogListPage({ params }: PageProps<"/blog/page/[page]">) {
  const { page } = await params;
  return (
    <PaginatedPostList
      title="Blog"
      posts={await getAllPosts()}
      page={Number(page)}
      basePath="/blog"
    />
  );
}
