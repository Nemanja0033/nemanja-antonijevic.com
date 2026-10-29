import type { MetadataRoute } from "next";
import { extraPageNumbers, getAllPosts, getAllTags, getPostsByTag } from "@/lib/posts";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const tagLists = await Promise.all(
    tags.map(async ({ tag }) => ({ tag, posts: await getPostsByTag(tag) })),
  );
  const pages = ["", "/about", "/contact", "/blog"].map((route) => ({
    url: `${site.url}${route}`,
  }));

  return [
    ...pages,
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
    })),
    ...extraPageNumbers(posts).map((page) => ({ url: `${site.url}/blog/page/${page}` })),
    ...tagLists.flatMap(({ tag, posts }) => [
      { url: `${site.url}/blog/tags/${tag}` },
      ...extraPageNumbers(posts).map((page) => ({
        url: `${site.url}/blog/tags/${tag}/page/${page}`,
      })),
    ]),
  ];
}
