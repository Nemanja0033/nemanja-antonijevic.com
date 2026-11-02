import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";
import { LanguageSwitch } from "./language-switch";
import { SiteFooter } from "./site-footer";

const pathname = vi.hoisted(() => ({ current: "/en/blog/test" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

const languages = {
  sr: { name: "Srpski", htmlLang: "sr-Latn" },
  en: { name: "English", htmlLang: "en" },
};
const paths = {
  sr: ["", "/blog", "/blog/test"],
  en: ["", "/blog", "/blog/test", "/blog/only-en"],
};

describe("LanguageSwitch", () => {
  const renderSwitch = (url: string) => {
    pathname.current = url;
    render(<LanguageSwitch lang="en" label="Language" paths={paths} languages={languages} />);
    return screen.getByRole("navigation", { name: "Language" });
  };

  it("links to the same page in the other language when it exists", () => {
    const nav = renderSwitch("/en/blog/test");
    expect(within(nav).getByRole("link", { name: "Srpski" })).toHaveAttribute("href", "/sr/blog/test");
  });

  it("falls back to the other language's blog when the page doesn't exist there", () => {
    const nav = renderSwitch("/en/blog/only-en");
    expect(within(nav).getByRole("link", { name: "Srpski" })).toHaveAttribute("href", "/sr/blog");
  });

  it("falls back to the home page outside the blog", () => {
    const nav = renderSwitch("/en/about");
    expect(within(nav).getByRole("link", { name: "Srpski" })).toHaveAttribute("href", "/sr");
  });

  it("names each language and marks the current one", () => {
    const nav = renderSwitch("/en/blog");
    const english = within(nav).getByRole("link", { name: "English" });
    expect(english).toHaveAttribute("aria-current", "true");
    expect(english).toHaveAttribute("lang", "en");
    expect(english).toHaveTextContent("EN");
    expect(within(nav).getByRole("link", { name: "Srpski" })).toHaveAttribute("lang", "sr-Latn");
  });
});

describe("SiteFooter", () => {
  it("credits the author with a LinkedIn link and shows the version", () => {
    render(<SiteFooter lang="en" />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent(`© ${new Date().getFullYear()} · project by ${site.author}`);
    expect(footer).toHaveTextContent(`v${site.version}`);
    const link = within(footer).getByRole("link");
    expect(link).toHaveAttribute("href", site.contact.linkedin);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("announces that the link opens a new tab", () => {
    render(<SiteFooter lang="sr" />);
    // jsdom drops the leading space of the hidden span; e2e/ checks the exact name in Chromium
    expect(screen.getByRole("link")).toHaveAccessibleName(/^Nemanja Antonijević ?\(otvara se u novom tabu\)$/);
  });

  it("leaves no double space when the credit text is empty", () => {
    render(<SiteFooter lang="sr" />);
    expect(screen.getByRole("contentinfo").textContent).not.toMatch(/ {2}/);
  });
});
