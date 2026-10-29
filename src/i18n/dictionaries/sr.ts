// Serbian UI text; en.ts must provide the same keys (enforced by the Dictionary type)
const sr = {
  htmlLang: "sr-Latn",
  dateLocale: "sr-Latn-RS",
  ogLocale: "sr_RS",
  languageName: "Srpski",

  site: {
    description: "Programiram i pišem štreberske & kul stvari o tome.",
    footerNote: "Bez kolačića. Bez trekera.",
    languageSwitch: "Jezik",
  },

  home: {
    heading: ["Programiram i pišem štreberske", "kul stvari o tome"], // joined by an accent "&"
    cta: "Blog →",
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
