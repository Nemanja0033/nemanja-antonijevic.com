import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

// Every /blog page shares the header and footer
export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <div className="container">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
