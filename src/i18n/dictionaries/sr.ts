// Serbian UI text; en.ts must provide the same keys (enforced by the Dictionary type)
const sr = {
  htmlLang: "sr-Latn",
  dateLocale: "sr-Latn-RS",
  ogLocale: "sr_RS",
  languageName: "Srpski",

  site: {
    description: "Razvijam frontend & pišem detaljne tech artikle za ne baš obične developere.",
    madeBy: "razvio", // footer: "© 2026 · razvio <name>"
    languageSwitch: "Jezik",
  },

  home: {
    heading: ["Razvijam frontend", "pišem detaljne tech artikle za ne baš obične developere"], // joined by an accent "&"
    cta: "Blog →",
    linkedin: "LinkedIn profil",
    email: "Pošalji mejl",
  },

  blog: {
    title: "Blog",
    description: "Zapisi o softveru, alatima i praksi.",
    postCount: (n: number) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "zapis" : "zapisa"}`,
    pageTitle: (page: string) => `Blog – strana ${page}`,
    tagDescription: (tag: string) => `Zapisi sa oznakom #${tag}`,
    tagPageTitle: (tag: string, page: string) => `#${tag} – strana ${page}`,
    filterLabel: "Filter po oznakama",
    all: "sve",
  },

  pagination: {
    label: "Stranice",
    newer: "← novije",
    older: "starije →",
    page: (page: number, total: number) => `strana ${page} / ${total}`,
  },

  post: {
    back: "← blog",
    readingTime: (minutes: number) => `${minutes} min čitanja`,
    onThisPage: "na ovoj strani",
    tags: "oznake",
    adjacentLabel: "Susedni zapisi",
    older: "← starije",
    newer: "novije →",
    firstPost: "Ovo je prvi zapis.",
    latestPost: "Ovo je najnovije. Navrati kasnije.",
  },

  about: { title: "O meni" },
  contact: { title: "Kontakt" },

  notFound: {
    title: "Stranica ne postoji",
    text: "Ovde nema ničega.",
    link: "Pogledaj blog",
  },
};

export type Dictionary = typeof sr;
export default sr;
