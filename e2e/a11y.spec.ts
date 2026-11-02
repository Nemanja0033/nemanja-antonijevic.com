import { expect, type Page, test } from "@playwright/test";

const pages = ["/sr", "/en", "/sr/blog", "/en/blog/tags/ai", "/sr/blog/does-not-exist"];

// Checks that run in the page: landmarks, headings, names, targets and contrast (WCAG 2.2 AA)
async function audit(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];
    const lum = (c: number[]) => {
      const [r, g, b] = c.map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const rgb = (s: string) => {
      const m = s.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { c: p.slice(0, 3), a: p[3] ?? 1 };
    };
    const background = (el: Element | null): number[] => {
      for (let e = el; e; e = e.parentElement) {
        const c = rgb(getComputedStyle(e).backgroundColor);
        if (c && c.a > 0.5) return c.c;
      }
      return [244, 241, 234];
    };
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && !el.closest('[aria-hidden="true"], .sr-only');
    };

    if (document.querySelectorAll("main").length !== 1) issues.push("exactly one <main>");
    const h1s = [...document.querySelectorAll("h1")].filter(visible);
    if (h1s.length !== 1) issues.push(`one visible h1 (found ${h1s.length})`);
    const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(visible).map((h) => +h.tagName[1]);
    levels.forEach((l, i) => i && l > levels[i - 1] + 1 && issues.push(`heading jump h${levels[i - 1]} → h${l}`));
    document.querySelectorAll("img:not([alt])").forEach((img) => issues.push(`img without alt: ${(img as HTMLImageElement).src}`));
    document.querySelectorAll("nav:not([aria-label])").forEach(() => issues.push("nav without a label"));
    document.querySelectorAll("a[href]").forEach((a) => {
      const r = a.getBoundingClientRect();
      const inText = getComputedStyle(a).display === "inline" && a.closest("p, li, footer, sup, td");
      if (visible(a) && !a.classList.contains("skip-link") && !inText && (r.width < 24 || r.height < 24)) {
        issues.push(`target under 24px: ${a.textContent?.trim()}`);
      }
    });
    const seen = new Set<string>();
    document.querySelectorAll("body *").forEach((el) => {
      if (!visible(el) || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())) return;
      if (el.closest("pre") && el.tagName !== "PRE") return;
      const s = getComputedStyle(el);
      const fg = rgb(s.color);
      if (!fg) return;
      const [l1, l2] = [lum(fg.c), lum(background(el))].sort((a, b) => b - a);
      const ratio = (l1 + 0.05) / (l2 + 0.05);
      const size = parseFloat(s.fontSize);
      const needed = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700) ? 3 : 4.5;
      const key = `${s.color}|${background(el)}`;
      if (ratio < needed && !seen.has(key)) {
        seen.add(key);
        issues.push(`contrast ${ratio.toFixed(2)} < ${needed}: "${el.textContent?.trim().slice(0, 30)}"`);
      }
    });
    return issues;
  });
}

test.describe("accessibility", () => {
  for (const url of pages) {
    test(`${url} passes the audit`, async ({ page }) => {
      await page.goto(url);
      expect(await audit(page)).toEqual([]);
    });
  }

  test("a post page passes the audit", async ({ page }) => {
    await page.goto("/en/blog");
    const link = page.getByRole("article").first().getByRole("heading").getByRole("link");
    const href = (await link.getAttribute("href"))!;
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    expect(await audit(page)).toEqual([]);
  });

  test("the skip link is the first stop and jumps to the content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard navigation");
    await page.goto("/sr/blog");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Preskoči na sadržaj" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("links that open a new tab say so", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("link", { name: "LinkedIn profile (opens in a new tab)" })).toHaveAttribute(
      "target",
      "_blank",
    );
    await expect(page.getByRole("contentinfo").getByRole("link")).toHaveAccessibleName(
      /\(opens in a new tab\)$/,
    );
  });

  test("the language switch names the languages", async ({ page }) => {
    await page.goto("/sr");
    const nav = page.getByRole("navigation", { name: "Jezik" });
    await expect(nav.getByRole("link", { name: "Srpski" })).toHaveAttribute("aria-current", "true");
    await expect(nav.getByRole("link", { name: "English" })).toHaveAttribute("lang", "en");
  });

  test("nothing moves for visitors who prefer reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/sr");
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    expect(running).toBe(0);
  });
});
