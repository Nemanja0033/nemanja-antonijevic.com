import { getDictionary, type Locale } from "@/i18n";
import { site } from "@/lib/site";
import styles from "./site.module.css";

// "© 2026 · project by <name>", the name linking to LinkedIn
export function SiteFooter({ lang }: { lang: Locale }) {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} · {getDictionary(lang).site.madeBy}{" "}
      <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">
        {site.author}
      </a>
    </footer>
  );
}
