import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { toLocale } from "@/i18n";

// Every /<lang>/blog page shares the header and footer
export default async function BlogLayout({ children, params }: LayoutProps<"/[lang]/blog">) {
  const lang = toLocale((await params).lang);

  return (
    <div className="container">
      <SiteHeader lang={lang} />
      <main>{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}
