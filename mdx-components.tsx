import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import type { ReactNode } from "react";
import { defaultLocale, getDictionary, hasLocale } from "@/i18n";

// UI text in the post's language; MDX components get no params, so the language
// comes from the [lang] root segment
async function pageDictionary() {
  const lang = await rootLang();
  return getDictionary(hasLocale(lang) ? lang : defaultLocale);
}

// Tells screen reader users that a link opens a new tab (WCAG 3.2.5 advisory)
async function NewTabNotice() {
  const dict = await pageDictionary();
  return <span className="sr-only"> ({dict.site.newTab})</span>;
}

// A focusable scroll container needs a name, or screen readers announce just "region"
async function TableRegion({ children }: { children: ReactNode }) {
  const dict = await pageDictionary();
  return (
    <div data-table-wrapper="" role="region" aria-label={dict.post.table} tabIndex={0}>
      {children}
    </div>
  );
}

const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    // Only web links open in a new tab; mailto:, tel: etc. keep default behavior
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      >
        {children}
        {external && <NewTabNotice />}
      </a>
    );
  },
  // Inline images have unknown dimensions, so they stay plain <img> but load lazily
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props) => <img loading="lazy" decoding="async" {...props} />,
  // The inner span carries the yellow highlight, so it follows the text when it wraps
  h2: ({ children, ...props }) => (
    <h2 {...props}>
      <span>{children}</span>
    </h2>
  ),
  // Wide tables scroll inside a named, keyboard-focusable region, so the table itself
  // can stay full width
  table: (props) => (
    <TableRegion>
      <table {...props} />
    </TableRegion>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
