import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { defaultLocale, getDictionary } from "@/i18n";
import { nunito, plexMono } from "./fonts";
import "./globals.css";

// 404 for URLs outside /sr and /en; it renders without the root layout,
// so it brings its own fonts and styles and shows both languages
export const metadata: Metadata = {
  title: "404",
};

export default function GlobalNotFound() {
  const sr = getDictionary("sr");
  const en = getDictionary("en");

  return (
    <html lang={getDictionary(defaultLocale).htmlLang} className={`${nunito.variable} ${plexMono.variable}`}>
      <body>
        <div className="container">
          <SiteHeader lang={defaultLocale} />
          <main>
            <h1>
              {sr.notFound.title} / <span lang={en.htmlLang}>{en.notFound.title}</span>
            </h1>
            <p>
              <Link href="/sr/blog">{sr.notFound.link}</Link> ·{" "}
              <Link href="/en/blog" lang={en.htmlLang}>
                {en.notFound.link}
              </Link>
            </p>
          </main>
          <SiteFooter lang={defaultLocale} />
        </div>
      </body>
    </html>
  );
}
