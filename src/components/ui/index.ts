/**
 * Small, reusable UI building blocks.
 *
 * @remarks
 * Each component owns how one element looks (colors, shape, padding, hover), built on
 * the design tokens in `src/app/globals.css`. Where it sits on the page (flex, widths,
 * margins) stays with the page or component that uses it, passed in as `className`.
 *
 * @example
 * ```tsx
 * import { Button, Card, Chip, Pill } from "@/components/ui";
 * ```
 *
 * @packageDocumentation
 */
export { Button } from "./button";
export { Card } from "./card";
export { Chip } from "./chip";
export { cx } from "./cx";
export { IconBubble } from "./icon-bubble";
export { Pill } from "./pill";
