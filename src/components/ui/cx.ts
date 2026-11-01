/**
 * Joins CSS class names into one `className` string, skipping falsy values.
 *
 * @remarks
 * Every UI component combines its own CSS-module class with variant classes and an
 * optional `className` from the caller. `cx` keeps that readable without pulling in
 * a library such as `clsx` for a one-line job.
 *
 * @param classes - Class names; `false`, `null`, `undefined` and `""` are ignored,
 *   so conditions can be written inline.
 * @returns The non-empty class names separated by spaces.
 *
 * @example
 * ```tsx
 * cx(styles.chip, active && styles.active, className); // → "chip active extra"
 * ```
 */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
