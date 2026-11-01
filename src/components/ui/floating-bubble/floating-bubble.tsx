import type { CSSProperties, ReactNode } from "react";
import { cx } from "../cx";
import styles from "./floating-bubble.module.css";

/** Props for {@link FloatingBubble}. */
type Props = {
  /**
   * Palette color, which also sets a matching icon color.
   * - `"primary"`: accent blue with a white icon
   * - `"tint"`: soft blue with a blue icon (default)
   * - `"highlight"`: soft yellow with a dark icon
   */
  tone?: "primary" | "tint" | "highlight";
  /** Any CSS color, e.g. `"#ff7a59"` or `"var(--color-muted)"`; overrides the tone's background. */
  color?: string;
  /** Diameter as any CSS length, e.g. `48` (px), `"4rem"` or `"clamp(36px, 5vw, 64px)"`. Default 48px. */
  size?: number | string;
  /** `"circle"` (default) or `"blob"`, the soft organic shape of the home page photo. */
  shape?: "circle" | "blob";
  /**
   * How the bubble moves; nothing moves for visitors who prefer reduced motion.
   * - `"up-right"`: wanders up and right and back (16s loop)
   * - `"down-left"`: wanders down and left and back (12s loop)
   * - `"bob"`: gently rises and falls in place (6s loop)
   * - `"none"`: stays still (default)
   */
  drift?: "up-right" | "down-left" | "bob" | "none";
  /** Loop length in seconds, to keep several bubbles out of sync. Defaults per `drift`. */
  duration?: number;
  /** 0–1, default `0.6`, so the bubble stays in the background. */
  opacity?: number;
  /** Optional content in the middle: an icon, an inline `<svg>` (stroked in the tone's color) or an `<img>`. */
  children?: ReactNode;
  /**
   * Accessible name when the content means something (e.g. a logo). Without it the
   * bubble is decoration and hidden from screen readers.
   */
  label?: string;
  /** Placement from the caller: `position`, `top`/`left`, `z-index`. The bubble sets none. */
  className?: string;
};

/**
 * Decorative round bubble that can slowly drift, optionally with an icon or image inside.
 *
 * @remarks
 * Gives the zine-style background shapes one reusable source: the home page's yellow and
 * blue dots are two of them. It owns the look (color, size, shape, opacity) and the
 * motion; where it sits on the page is up to the caller, usually an absolutely
 * positioned class. It never takes clicks (`pointer-events` is left to the caller) and
 * is hidden from screen readers unless `label` is given. For a clickable round icon
 * use {@link IconBubble} instead.
 *
 * @example
 * ```tsx
 * // Background dot that wanders up and to the right
 * <FloatingBubble tone="highlight" size="clamp(36px, 5vw, 64px)" drift="up-right" className={styles.dot} />
 *
 * // Bubble with an icon, in a custom color, bobbing in place
 * <FloatingBubble color="#ff7a59" size={72} shape="blob" drift="bob" opacity={1}>
 *   <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18" /></svg>
 * </FloatingBubble>
 * ```
 */
export function FloatingBubble({
  tone = "tint",
  color,
  size = 48,
  shape = "circle",
  drift = "none",
  duration,
  opacity,
  children,
  label,
  className,
}: Props) {
  const style = {
    "--bubble-size": typeof size === "number" ? `${size}px` : size,
    ...(color && { "--bubble-color": color }),
    ...(opacity !== undefined && { "--bubble-opacity": opacity }),
    ...(duration !== undefined && { "--bubble-duration": `${duration}s` }),
  } as CSSProperties;

  return (
    <div
      className={cx(styles.bubble, styles[tone], styles[shape], drift !== "none" && styles[drift], className)}
      style={style}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {children}
    </div>
  );
}
