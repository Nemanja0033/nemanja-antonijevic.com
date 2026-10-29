import { site } from "@/lib/site";
import styles from "./site.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>
        © {new Date().getFullYear()} {site.author}
      </span>
      <span className={`pill ${styles.note}`}>Bez kolačića. Bez trekera.</span>
    </footer>
  );
}
