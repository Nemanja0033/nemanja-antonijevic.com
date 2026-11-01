import type { Metadata } from "next";
import Image from "next/image";
import avatar from "@/assets/avatar.jpg";
import { LatestPosts } from "@/components/blog/latest-posts";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button, IconBubble } from "@/components/ui";
import { alternates, getDictionary, localePath, toLocale } from "@/i18n";
import { getAllPosts } from "@/lib/posts";
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
      <div className={`container ${styles.top}`}>
        <SiteHeader lang={lang} brand={false} />
      </div>

      <main id="main" tabIndex={-1}>
        {/* First screen: headline on the left, photo blob and decorative dots around it */}
        <section className={styles.intro}>
          <div className={styles.portrait}>
            <div className={styles.blob}>
              <div className={styles.photo}>
                <Image src={avatar} alt={site.author} sizes="(max-width: 700px) 130px, 300px" preload />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className={styles.dotYellow} />
          <div aria-hidden="true" className={styles.dotAccent} />
          <div className={`container ${styles.hero}`}>
            <p className={styles.eyebrow}>{site.author}</p>
            <h1>
              {before} <em>&amp;</em> {after}
            </h1>
            <div className={styles.actions}>
              <Button href={localePath(lang, "/blog")} size="lg" className={styles.cta}>
                {dict.home.cta}
              </Button>
              <ul className={styles.contact}>
                <li>
                  <IconBubble href={site.contact.linkedin} label={`${dict.home.linkedin} (${dict.site.newTab})`} external>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                      <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
                    </svg>
                  </IconBubble>
                </li>
                <li>
                  <IconBubble
                    href={`mailto:${site.contact.email}`}
                    label={`${dict.home.email} (${dict.site.newTab})`}
                    tone="highlight"
                    external
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </IconBubble>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="container">
          <LatestPosts lang={lang} posts={(await getAllPosts(lang)).slice(0, 3)} />
        </div>
      </main>

      <div className="container">
        <SiteFooter lang={lang} />
      </div>
    </div>
  );
}
