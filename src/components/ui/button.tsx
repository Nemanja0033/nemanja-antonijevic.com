import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./button.module.css";

/** Props for {@link Button}. */
type Props = {
  /** Button text, e.g. `"Blog →"` or `"← newer"`. */
  children: ReactNode;
  /**
   * Destination. Without it the button renders as an inert, muted `<span>` that
   * screen readers skip (`aria-hidden`), used for steps that don't exist (no newer
   * page on page 1). It only keeps the layout steady; it carries no information.
   */
  href?: string;
  /**
   * - `"primary"`: accent background, for the main action (default)
   * - `"muted"`: grey, for an unavailable step
   */
  variant?: "primary" | "muted";
  /**
   * - `"md"`: compact, e.g. pagination (default)
   * - `"lg"`: prominent call to action, e.g. "Blog →" on the home page
   */
  size?: "md" | "lg";
  /** Link relation, e.g. `"prev"` / `"next"` for pagination. */
  rel?: string;
  /** Extra classes from the caller, for placement only (alignment, margin, tilt). */
  className?: string;
};

/**
 * Pill-shaped action that navigates to another page.
 *
 * @remarks
 * The site is static and has no forms, so every action is navigation; this renders a
 * Next.js `<Link>` styled as a button rather than a `<button>`. It exists so the home
 * page call to action and the pagination steps share one look, hover state and set of
 * sizes. Placement (tilt, margins) stays with the caller's `className`.
 *
 * @example
 * ```tsx
 * <Button href={localePath(lang, "/blog")} size="lg">{dict.home.cta}</Button>
 * <Button href={hasNewer ? href(page - 1) : undefined} variant={hasNewer ? "primary" : "muted"} rel="prev">
 *   {dict.pagination.newer}
 * </Button>
 * ```
 */
export function Button({ children, href, variant = "primary", size = "md", rel, className }: Props) {
  const classes = cx(styles.button, styles[variant], styles[size], className);
  if (!href) {
    return (
      <span className={classes} aria-hidden="true">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} rel={rel} className={classes}>
      {children}
    </Link>
  );
}
