import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./pill.module.css";

type Props = { children: ReactNode; tone?: "tint" | "highlight"; className?: string };

// Small rounded label for metadata: dates, counts, reading time
export function Pill({ children, tone = "tint", className }: Props) {
  return <span className={cx(styles.pill, styles[tone], className)}>{children}</span>;
}
