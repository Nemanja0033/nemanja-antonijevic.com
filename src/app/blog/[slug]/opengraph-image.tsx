import { ImageResponse } from "next/og";
import { getPost, getPostSlugs } from "@/lib/posts";
import { formatDate, site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta } = await getPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0b1120 0%, #1e1b4b 100%)",
          color: "#e2e8f0",
        }}
      >
        <div style={{ fontSize: 28, color: "#818cf8" }}>{site.name}</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {meta.title}
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8" }}>
          {formatDate(meta.date)}
        </div>
      </div>
    ),
    size,
  );
}
