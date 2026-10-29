import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const pages = ["", "/about", "/contact", "/blog"].map((route) => ({
    url: `${site.url}${route}`,
  }));

  return [
    ...pages,
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
