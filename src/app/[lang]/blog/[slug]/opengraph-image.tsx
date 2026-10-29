import { ImageResponse } from "next/og";
import { formatDate, locales, toLocale } from "@/i18n";
import { getPost, getPostSlugs } from "@/lib/posts";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Only posts written in this language exist; anything else is a 404
export const dynamicParams = false;

// A route handler gets no parent params here, so it lists every language + slug pair
export async function generateStaticParams() {
  const pairs = await Promise.all(
    locales.map(async (lang) => (await getPostSlugs(lang)).map((slug) => ({ lang, slug }))),
  );
  return pairs.flat();
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: param, slug } = await params;
  const lang = toLocale(param);
  const { meta } = await getPost(lang, slug);

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
            {formatDate(lang, meta.date, "long")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
