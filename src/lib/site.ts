// Site-wide settings shared by the layout, sitemap, robots and Open Graph images.
// Text that changes per language lives in src/i18n/dictionaries
export const site = {
  name: "Nemanja Antonijević",
  author: "Nemanja Antonijević",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Contact bubbles under the home page photo. TODO: replace these placeholders
  contact: {
    linkedin: "https://www.linkedin.com/in/your-profile",
    email: "hello@example.com",
  },
  // Shown in the home page footer; add { label, href } entries, e.g. GitHub, LinkedIn, e-mail
  links: [] as { label: string; href: string }[],
};
