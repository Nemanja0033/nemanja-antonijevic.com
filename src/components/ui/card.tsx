import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./card.module.css";

/** Props for {@link Card}. */
type Props = {
  /** Card content. */
  children: ReactNode;
  /**
   * HTML element to render, chosen for meaning: `"article"` for a post card,
   * `"aside"` for a sidebar, `"div"` otherwise (default). Ignored when `href` is set.
   */
  as?: "div" | "article" | "aside" | "section";
  /** Makes the whole card a link (rendered as a Next.js `<Link>`). */
  href?: string;
  /**
   * Background color.
   * - `"surface"`: white, for content (default)
   * - `"tint"`: soft blue, for a quiet placeholder such as "this is the latest post"
   */
  tone?: "surface" | "tint";
  /** Layout from the caller: flex, gaps, widths. The card itself sets no layout. */
  className?: string;
};

/**
 * Rounded content surface with the site's padding and corner radius.
 *
 * @remarks
 * Used for post cards in lists, the "on this page" sidebar and the older/newer links
 * under a post. It exists so all cards share one background, radius, padding and
 * hover outline. It deliberately has no layout of its own: the caller decides how the
 * content inside is arranged.
 *
 * @example
 * ```tsx
 * <Card as="article" className={styles.card}>…</Card>
 * <Card href={localePath(lang, `/blog/${older.slug}`)}>{older.title}</Card>
 * <Card tone="tint">{dict.post.latestPost}</Card>
 * ```
 */
export function Card({ children, as: Tag = "div", href, tone = "surface", className }: Props) {
  const classes = cx(styles.card, styles[tone], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <Tag className={classes}>{children}</Tag>;
}
