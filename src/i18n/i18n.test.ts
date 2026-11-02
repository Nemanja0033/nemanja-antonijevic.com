// @vitest-environment node
import { describe, expect, it } from "vitest";
import en from "./dictionaries/en";
import sr from "./dictionaries/sr";
import {
  alternates,
  defaultLocale,
  formatDate,
  getDictionary,
  hasLocale,
  localePath,
  locales,
  toLocale,
} from "./index";

// Every key path in a dictionary, e.g. "blog.postCount" (values are not compared)
function keyPaths(value: object, prefix = ""): string[] {
  return Object.entries(value).flatMap(([key, child]) =>
    child && typeof child === "object" && !Array.isArray(child)
      ? keyPaths(child, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe("config", () => {
  it("supports sr and en, with sr as the default", () => {
    expect(locales).toEqual(["sr", "en"]);
    expect(defaultLocale).toBe("sr");
  });

  it("recognizes only supported locales", () => {
    expect(hasLocale("sr")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("de")).toBe(false);
    expect(hasLocale("")).toBe(false);
  });

  it("prefixes paths with the language", () => {
    expect(localePath("sr")).toBe("/sr");
    expect(localePath("en", "/blog")).toBe("/en/blog");
  });

  it("toLocale returns a supported locale and 404s on anything else", () => {
    expect(toLocale("en")).toBe("en");
    expect(() => toLocale("de")).toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
  });
});

describe("alternates", () => {
  it("links every language and points x-default at the default language", () => {
    expect(alternates("en", "/blog")).toEqual({
      canonical: "/en/blog",
      languages: { sr: "/sr/blog", en: "/en/blog", "x-default": "/sr/blog" },
    });
  });

  it("lists only the languages a page exists in", () => {
    expect(alternates("en", "/blog/only-en", ["en"])).toEqual({
      canonical: "/en/blog/only-en",
      languages: { en: "/en/blog/only-en" },
    });
  });
});

describe("dictionaries", () => {
  it("have exactly the same keys in both languages", () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(sr).sort());
  });

  it("getDictionary returns the dictionary of each language", () => {
    expect(getDictionary("sr")).toBe(sr);
    expect(getDictionary("en")).toBe(en);
  });

  it.each([
    [1, "1 zapis"],
    [2, "2 zapisa"],
    [5, "5 zapisa"],
    [11, "11 zapisa"],
    [21, "21 zapis"],
    [101, "101 zapis"],
  ])("Serbian post count: %i → %s", (n, label) => {
    expect(sr.blog.postCount(n)).toBe(label);
  });

  it.each([
    [1, "1 post"],
    [2, "2 posts"],
    [21, "21 posts"],
  ])("English post count: %i → %s", (n, label) => {
    expect(en.blog.postCount(n)).toBe(label);
  });

  it("formats reading time and page labels", () => {
    expect(sr.post.readingTime(3)).toBe("3 min čitanja");
    expect(en.post.readingTime(3)).toBe("3 min read");
    expect(sr.pagination.page(2, 5)).toBe("strana 2 / 5");
    expect(en.pagination.page(2, 5)).toBe("page 2 / 5");
  });
});

describe("formatDate", () => {
  it("formats short and long dates per language, without a trailing period", () => {
    expect(formatDate("sr", "2026-10-21")).toBe("21. okt 2026");
    expect(formatDate("sr", "2026-10-21", "long")).toBe("21. oktobar 2026");
    expect(formatDate("en", "2026-10-21")).toBe("Oct 21, 2026");
    expect(formatDate("en", "2026-10-21", "long")).toBe("October 21, 2026");
  });

  it("ignores the visitor's time zone (dates are calendar days)", () => {
    expect(formatDate("en", "2026-01-01")).toBe("Jan 1, 2026");
  });
});
