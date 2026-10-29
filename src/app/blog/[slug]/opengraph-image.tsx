import { ImageResponse } from "next/og";
import { getPost, getPostSlugs } from "@/lib/posts";
import { formatDate, site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Only slugs from generateStaticParams exist; anything else is a 404
export const dynamicParams = false;

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
          background: "#f4f1ea",
          color: "#1e1e1e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#2236c9" }} />
          {site.name}
        </div>
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
        <div style={{ display: "flex" }}>
          <div style={{ padding: "6px 24px", borderRadius: 999, background: "#e3e7fb", fontSize: 28 }}>
            {formatDate(meta.date, "long")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
