// Site-wide settings shared by the layout, sitemap, robots and Open Graph images
export const site = {
  name: "Personal Website",
  description: "Personal website and blog",
  author: "Nemanja Antonijević",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-US",
};

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(site.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
