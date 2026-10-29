import { getDictionary, type Locale } from "@/i18n";
import { site } from "@/lib/site";
import styles from "./site.module.css";

export function SiteFooter({ lang }: { lang: Locale }) {
  return (
    <footer className={styles.footer}>
      <span>
        © {new Date().getFullYear()} {site.author}
      </span>
      <span className={`pill ${styles.note}`}>{getDictionary(lang).site.footerNote}</span>
    </footer>
  );
}
