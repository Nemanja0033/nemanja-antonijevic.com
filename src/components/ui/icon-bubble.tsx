import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./icon-bubble.module.css";

type Props = {
  href: string;
  label: string; // read by screen readers, since the bubble only shows an icon
  children: ReactNode; // an inline <svg> drawn with strokes
  tone?: "tint" | "highlight";
  external?: boolean; // opens in a new tab
  className?: string;
};

// Round icon link in the soft blob shape: contact links on the home page
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
