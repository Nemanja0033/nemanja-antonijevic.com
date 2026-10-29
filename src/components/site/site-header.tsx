import Link from "next/link";
import { getDictionary, localePath, locales, type Locale } from "@/i18n";
import { getSitePaths } from "@/lib/paths";
import { site } from "@/lib/site";
import { LanguageSwitch } from "./language-switch";
import styles from "./site.module.css";

export async function SiteHeader({ lang, brand = true }: { lang: Locale; brand?: boolean }) {
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
