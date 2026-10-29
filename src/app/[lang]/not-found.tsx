import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { defaultLocale, getDictionary, hasLocale, localePath } from "@/i18n";

// 404 inside a language (e.g. /sr/blog/nema), in that language.
// not-found.tsx gets no params, so the language comes from next/root-params
export default async function NotFound() {
  const param = await rootLang();
  const lang = hasLocale(param) ? param : defaultLocale;
  const dict = getDictionary(lang);

  return (
    <div className="container">
      <SiteHeader lang={lang} />
      <main>
        <h1>{dict.notFound.title}</h1>
        <p>
          {dict.notFound.text} <Link href={localePath(lang, "/blog")}>{dict.notFound.link}</Link>.
        </p>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
