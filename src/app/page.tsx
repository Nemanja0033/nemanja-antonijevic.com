import Image from "next/image";
import Link from "next/link";
import avatar from "@/assets/avatar.jpg";
import { site } from "@/lib/site";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <div className={styles.home}>
      <div aria-hidden="true" className={styles.blob} />
      <div aria-hidden="true" className={styles.dotYellow} />
      <div aria-hidden="true" className={styles.dotAccent} />
      <Image
        src={avatar}
        alt=""
        sizes="(max-width: 700px) 160px, 320px"
        preload
        className={styles.avatar}
      />

      <div className={`container ${styles.inner}`}>
        <main className={styles.hero}>
          <h1>
            Ja sam
            <br />
            {site.author}.
          </h1>
          <p>
            Pišem kod <em>&amp;</em> beleške o njemu. Ponekad dobro.
          </p>
          <Link href="/blog" className={styles.cta}>
            Blog →
          </Link>
        </main>

        <footer className={styles.footer}>
          {site.links.map(({ label, href }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
