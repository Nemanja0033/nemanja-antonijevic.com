import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./chip.module.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "filter" | "tag";
  active?: boolean; // marks the chip as the current page
  className?: string;
};

// Rounded link chip: tag filters and tag labels
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
