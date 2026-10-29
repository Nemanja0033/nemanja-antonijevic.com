import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./site.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        {site.author}
      </Link>
    </header>
  );
}
