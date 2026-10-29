import type { MDXComponents } from "mdx/types";
import Link from "next/link";

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
  // Wide tables scroll inside this wrapper, so the table itself can stay full width
  table: (props) => (
    <div data-table-wrapper="" tabIndex={0}>
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
