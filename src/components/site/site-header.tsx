import Link from "next/link";
import { getDictionary, localePath, locales, type Locale } from "@/i18n";
import { getSitePaths } from "@/lib/paths";
import { site } from "@/lib/site";
import { LanguageSwitch } from "./language-switch";
import styles from "./site.module.css";

/** Props for {@link SiteHeader}. */
type Props = {
  /** Language of the page; picks link prefixes and the switch label. */
  lang: Locale;
  /**
   * Shows the name with the accent dot, linking home (default `true`). The home page
   * passes `false`, since its hero already shows the name.
   */
  brand?: boolean;
};

/**
 * Header with the site name and the language switch.
 *
 * @remarks
 * A server component that runs at build time: it collects every page that exists in
 * each language (`getSitePaths`) and hands the list to the client-side
 * {@link LanguageSwitch}, which then links only to pages that exist. Used by the blog
 * layout, the home page and the 404 pages.
 *
 * @example
 * ```tsx
 * <SiteHeader lang={lang} />               // blog pages
 * <SiteHeader lang={lang} brand={false} /> // home page
 * ```
 */
export async function SiteHeader({ lang, brand = true }: Props) {
  const entries = await Promise.all(
    locales.map(async (locale) => [locale, (await getSitePaths(locale)).map((p) => p.path)]),
  );
  const paths = Object.fromEntries(entries) as Record<Locale, string[]>;

  return (
    <header className={styles.header}>
      {brand && (
        <Link href={localePath(lang)} className={styles.brand}>
          {site.author}
        </Link>
      )}
      <LanguageSwitch lang={lang} label={getDictionary(lang).site.languageSwitch} paths={paths} />
    </header>
  );
}
