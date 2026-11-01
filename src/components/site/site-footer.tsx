import { getDictionary, type Locale } from "@/i18n";
import { site } from "@/lib/site";
import styles from "./site.module.css";

/** Props for {@link SiteFooter}. */
type Props = {
  /** Language of the page; picks the "project by" / "razvio" text. */
  lang: Locale;
};

/**
 * Footer for every page: "© 2026 · project by Nemanja Antonijević · v0.1.0".
 *
 * @remarks
 * The name links to LinkedIn (`site.contact.linkedin`) and the version comes from
 * `package.json`, so `./dev.sh version` updates it on the next build. The year is
 * the build year; the site is rebuilt on every change, so it stays current.
 *
 * @example
 * ```tsx
 * <SiteFooter lang={lang} />
 * ```
 */
export function SiteFooter({ lang }: Props) {
  const dict = getDictionary(lang).site;

  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} · {dict.madeBy && `${dict.madeBy} `}
      <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">
        {site.author}
        <span className="sr-only"> ({dict.newTab})</span>
      </a>{" "}
      · v{site.version}
    </footer>
  );
}
