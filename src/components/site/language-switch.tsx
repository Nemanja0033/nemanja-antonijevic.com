"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, locales, type Locale } from "@/i18n/config";
import styles from "./site.module.css";

type Props = {
  lang: Locale;
  label: string;
  paths: Record<Locale, string[]>; // pages that exist per language, without the prefix
};

// "SR | EN": the same page in the other language when it exists,
// otherwise that language's blog (or home) page
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
