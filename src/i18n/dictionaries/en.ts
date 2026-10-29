import type { Dictionary } from "./sr";

// English UI text; the Dictionary type makes a missing key a build error
const en: Dictionary = {
  htmlLang: "en",
  dateLocale: "en-US",
  ogLocale: "en_US",
  languageName: "English",

  site: {
    description: "Programming and writing nerdy & cool stuff about it.",
    footerNote: "No cookies. No trackers.",
    languageSwitch: "Language",
  },

  home: {
    heading: ["Programming and writing nerdy", "cool stuff about it"],
    cta: "Blog →",
  },

  blog: {
    title: "Blog",
    description: "Notes on software, tools and practice.",
    postCount: (n) => `${n} ${n === 1 ? "post" : "posts"}`,
    pageTitle: (page) => `Blog – page ${page}`,
    tagDescription: (tag) => `Posts tagged #${tag}`,
    tagPageTitle: (tag, page) => `#${tag} – page ${page}`,
    filterLabel: "Filter by tag",
    all: "all",
  },

  pagination: {
    label: "Pages",
    newer: "← newer",
    older: "older →",
    page: (page, total) => `page ${page} / ${total}`,
  },

  post: {
    back: "← blog",
    readingTime: (minutes) => `${minutes} min read`,
    onThisPage: "on this page",
    tags: "tags",
    adjacentLabel: "More posts",
    older: "← older",
    newer: "newer →",
    firstPost: "This is the first post.",
    latestPost: "This is the latest one. Check back later.",
  },

  about: { title: "About" },
  contact: { title: "Contact" },

  notFound: {
    title: "Page not found",
    text: "There's nothing here.",
    link: "Read the blog",
  },
};

export default en;
