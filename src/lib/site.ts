// Site-wide settings shared by the layout, sitemap, robots and Open Graph images
export const site = {
  name: "Nemanja Antonijević",
  description: "Pišem kod & beleške o njemu. Ponekad dobro.",
  author: "Nemanja Antonijević",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "sr-Latn-RS",
  // Shown in the home page footer; add { label, href } entries, e.g. GitHub, LinkedIn, e-mail
  links: [] as { label: string; href: string }[],
};

// "21. okt 2026" (short) or "21. oktobar 2026" (long)
export function formatDate(date: string, month: "short" | "long" = "short") {
  return new Date(date)
    .toLocaleDateString(site.locale, { day: "numeric", month, year: "numeric", timeZone: "UTC" })
    .replace(/\.$/, "");
}
