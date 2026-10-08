import type { Metadata } from "next";
import { getPost, getPostSlugs } from "@/lib/posts";
import styles from "./post.module.css";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getPost(slug);
  return { title: meta.title, description: meta.description };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { Content } = await getPost(slug);

  return (
    <article className={styles.post}>
      <Content />
    </article>
  );
}
