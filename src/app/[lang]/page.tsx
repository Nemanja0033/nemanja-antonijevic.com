import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import avatar from "@/assets/avatar.jpg";
import { SiteHeader } from "@/components/site/site-header";
import { alternates, getDictionary, localePath, toLocale } from "@/i18n";
import { site } from "@/lib/site";
import styles from "./home.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  return { alternates: alternates(lang, "") };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = toLocale((await params).lang);
  const dict = getDictionary(lang);
  const [before, after] = dict.home.heading;

  return (
    <div className={styles.home}>
      <div aria-hidden="true" className={styles.blob} />
      <div aria-hidden="true" className={styles.dotYellow} />
      <div aria-hidden="true" className={styles.dotAccent} />
      <Image
        src={avatar}
        alt=""
        sizes="(max-width: 700px) 160px, 320px"
        preload
        className={styles.avatar}
      />

      <div className={`container ${styles.inner}`}>
        <SiteHeader lang={lang} brand={false} />

        <main className={styles.hero}>
          <p className={styles.eyebrow}>{site.author}</p>
          <h1>
            {before} <em>&amp;</em> {after}
          </h1>
          <Link href={localePath(lang, "/blog")} className={styles.cta}>
            {dict.home.cta}
          </Link>
        </main>

        <footer className={styles.footer}>
          {site.links.map(({ label, href }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
