// Joins class names, skipping empty ones: cx("a", active && "b") → "a b"
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
