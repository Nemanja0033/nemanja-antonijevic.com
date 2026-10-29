import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { alternates, getDictionary, hasLocale, locales } from "@/i18n";
import { site } from "@/lib/site";
import { nunito, plexMono } from "../fonts";
import "../globals.css";

// Only /sr and /en exist; any other first segment is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: dict.site.description,
    authors: [{ name: site.author, url: site.url }],
    alternates: alternates(lang, ""),
    openGraph: { type: "website", siteName: site.name, locale: dict.ogLocale },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={getDictionary(lang).htmlLang}
      className={`${nunito.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
