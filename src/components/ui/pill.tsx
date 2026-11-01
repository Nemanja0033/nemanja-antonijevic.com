import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./pill.module.css";

/** Props for {@link Pill}. */
type Props = {
  /** Label text, or an element such as `<time>` when the value is a date. */
  children: ReactNode;
  /**
   * Background color from the palette.
   * - `"tint"`: soft blue, for neutral metadata (default)
   * - `"highlight"`: soft yellow, to make a label stand out
   */
  tone?: "tint" | "highlight";
  /** Extra classes from the caller, for placement only (margins, alignment). */
  className?: string;
};

/**
 * Small rounded, non-interactive label for metadata.
 *
 * @remarks
 * Used for the post date, reading time and the post count next to a list title.
 * It exists so every metadata label has the same shape, size and colors; before it,
 * the same look was a global `.pill` class repeated on spans. For clickable labels
 * use {@link Chip} instead.
 *
 * @example
 * ```tsx
 * <Pill>{dict.post.readingTime(3)}</Pill>
 * <Pill>
 *   <time dateTime={post.date}>{formatDate(lang, post.date)}</time>
 * </Pill>
 * ```
 */
export function Pill({ children, tone = "tint", className }: Props) {
  return <span className={cx(styles.pill, styles[tone], className)}>{children}</span>;
}
