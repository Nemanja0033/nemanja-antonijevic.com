import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import avatar from "@/assets/avatar.jpg";
import { SiteFooter } from "@/components/site/site-footer";
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
      <div className={styles.portrait}>
        <div className={styles.blob}>
          <div className={styles.photo}>
            <Image src={avatar} alt={site.author} sizes="(max-width: 700px) 130px, 300px" preload />
          </div>
        </div>
        <ul className={styles.contact}>
          <li>
            <a
              href={site.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.home.linkedin}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
              </svg>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contact.email}`} aria-label={dict.home.email}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
      <div aria-hidden="true" className={styles.dotYellow} />
      <div aria-hidden="true" className={styles.dotAccent} />

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

        <SiteFooter lang={lang} />
      </div>
    </div>
  );
}
