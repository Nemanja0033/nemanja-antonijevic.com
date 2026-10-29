import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import en from "./dictionaries/en";
import sr, { type Dictionary } from "./dictionaries/sr";

export * from "./config";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { sr, en };

// The [lang] route param as a Locale; anything else is a 404
export function toLocale(value: string): Locale {
  if (!hasLocale(value)) notFound();
  return value;
}

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

// "21. okt 2026" / "Oct 21, 2026" (short) or "21. oktobar 2026" / "October 21, 2026" (long)
export function formatDate(lang: Locale, date: string, month: "short" | "long" = "short") {
  return new Date(date)
    .toLocaleDateString(dictionaries[lang].dateLocale, {
      day: "numeric",
      month,
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(/\.$/, "");
}
