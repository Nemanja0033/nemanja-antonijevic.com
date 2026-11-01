"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, locales, type Locale } from "@/i18n/config";
import styles from "./site.module.css";

/** Props for {@link LanguageSwitch}. */
type Props = {
  /** Language of the current page; its link is marked with `aria-current`. */
  lang: Locale;
  /** Accessible name of the navigation, e.g. "Jezik" / "Language". */
  label: string;
  /**
   * Every page that exists in each language, without the `/<lang>` prefix
   * (from `getSitePaths`), so the switch never links to a page that would 404.
   */
  paths: Record<Locale, string[]>;
};

/**
 * "SR | EN" switch that opens the current page in the other language.
 *
 * @remarks
 * A post may exist in only one language, and tag or pagination pages differ between
 * languages. The switch therefore checks `paths`: if the same page exists in the other
 * language it links there, otherwise to that language's blog (inside the blog) or home
 * page. It is the only client component on the site, because it needs the current URL
 * (`usePathname`) while living in a shared layout.
 *
 * @example
 * ```tsx
 * // Rendered by SiteHeader, which computes `paths` at build time
 * <LanguageSwitch lang={lang} label={dict.site.languageSwitch} paths={paths} />
 * ```
 */
export function LanguageSwitch({ lang, label, paths }: Props) {
  const rest = usePathname().replace(/^\/[^/]+/, "");

  return (
    <nav aria-label={label}>
      <ul className={styles.languages}>
        {locales.map((locale) => {
          const fallback = rest.startsWith("/blog") ? "/blog" : "";
          const path = paths[locale].includes(rest) ? rest : fallback;
          return (
            <li key={locale}>
              <Link
                href={localePath(locale, path)}
                hrefLang={locale}
                aria-current={locale === lang ? "true" : undefined}
              >
                {locale.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
