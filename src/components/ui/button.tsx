import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./button.module.css";

type Props = {
  children: ReactNode;
  href?: string; // without it the button is an inert placeholder (a disabled step)
  variant?: "primary" | "muted";
  size?: "md" | "lg";
  rel?: string;
  className?: string;
};

// Pill-shaped action link; this site has no form buttons, so it always navigates
export function Button({ children, href, variant = "primary", size = "md", rel, className }: Props) {
  const classes = cx(styles.button, styles[variant], styles[size], className);
  if (!href) {
    return (
      <span className={classes} aria-disabled="true">
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
