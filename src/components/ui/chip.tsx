import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./chip.module.css";

/** Props for {@link Chip}. */
type Props = {
  /** Destination, already including the language prefix (see `localePath`). */
  href: string;
  /** The chip's text, usually a tag name. */
  children: ReactNode;
  /**
   * Look and size.
   * - `"tag"`: small yellow label for tags in cards and the post header (default)
   * - `"filter"`: larger white chip with a 44px touch target, for the tag filter row
   */
  variant?: "filter" | "tag";
  /** Marks the chip as the current page: accent color and `aria-current="page"`. */
  active?: boolean;
  /** Extra classes from the caller, for placement only. */
  className?: string;
};

/**
 * Rounded link chip for tags and tag filters.
 *
 * @remarks
 * Tags are links to static tag pages (`/<lang>/blog/tags/<tag>`), not client-side
 * filters, so search engines can index them. This component gives every tag link the
 * same pill shape, hover state and current-page styling. For a label that is not a
 * link, use {@link Pill}.
 *
 * @example
 * ```tsx
 * <Chip href={localePath(lang, `/blog/tags/${tag}`)}>{tag}</Chip>
 * <Chip href={localePath(lang, "/blog")} variant="filter" active={!activeTag}>
 *   {dict.blog.all}
 * </Chip>
 * ```
 */
export function Chip({ href, children, variant = "tag", active, className }: Props) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(styles.chip, styles[variant], className)}
    >
      {children}
    </Link>
  );
}
