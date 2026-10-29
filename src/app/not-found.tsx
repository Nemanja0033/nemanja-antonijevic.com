import Link from "next/link";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function NotFound() {
  return (
    <div className="container">
      <SiteHeader />
      <main>
        <h1>Stranica ne postoji</h1>
        <p>
          Ovde nema ničega. <Link href="/blog">Pogledaj blog</Link>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
