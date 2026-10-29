import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./card.module.css";

type Props = {
  children: ReactNode;
  as?: "div" | "article" | "aside" | "section";
  href?: string; // makes the whole card a link
  tone?: "surface" | "tint";
  className?: string;
};

// Rounded content surface: post cards, the post sidebar, older/newer links.
// Layout (flex, sizes) comes from the caller's className
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
