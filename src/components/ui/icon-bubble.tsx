import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./icon-bubble.module.css";

/** Props for {@link IconBubble}. */
type Props = {
  /** Destination: a URL or a `mailto:` / `tel:` link. */
  href: string;
  /** Accessible name read by screen readers, since the bubble shows only an icon. */
  label: string;
  /** An inline `<svg>` drawn with strokes; it inherits the bubble's text color. */
  children: ReactNode;
  /**
   * Background color.
   * - `"tint"`: soft blue with an accent icon (default)
   * - `"highlight"`: soft yellow with a dark icon
   */
  tone?: "tint" | "highlight";
  /** Opens the link in a new tab, with `rel="noopener noreferrer"`. */
  external?: boolean;
  /** Extra classes from the caller, for placement only. */
  className?: string;
};

/**
 * Icon-only link in the soft "blob" shape used on the home page.
 *
 * @remarks
 * Shows the LinkedIn and e-mail links under the home page photo, in the same organic
 * shape as the photo blob. It renders a plain `<a>` rather than a Next.js `<Link>`,
 * because its targets are external. It shrinks to 44px on phones, which keeps a
 * comfortable touch target.
 *
 * @example
 * ```tsx
 * <IconBubble href={`mailto:${site.contact.email}`} label={dict.home.email} tone="highlight">
 *   <svg viewBox="0 0 24 24" aria-hidden="true">…</svg>
 * </IconBubble>
 * ```
 */
export function IconBubble({ href, label, children, tone = "tint", external, className }: Props) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cx(styles.bubble, styles[tone], className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
