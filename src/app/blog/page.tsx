import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PaginatedPostList } from "@/components/blog/paginated-post-list";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  return <PaginatedPostList title="Blog" posts={await getAllPosts()} basePath="/blog" />;
}
