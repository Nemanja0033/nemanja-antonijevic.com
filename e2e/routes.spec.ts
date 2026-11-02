import { expect, test } from "@playwright/test";

test.describe("routing", () => {
  test("/ redirects to the default language", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/sr$/);
  });

  for (const [lang, htmlLang] of [
    ["sr", "sr-Latn"],
    ["en", "en"],
  ]) {
    test(`/${lang} renders in its language`, async ({ page }) => {
      const response = await page.goto(`/${lang}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", htmlLang);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  for (const url of ["/xyz", "/de/blog", "/blog", "/sr/blog/does-not-exist", "/en/blog/tags/does-not-exist"]) {
    test(`${url} is a 404`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  // dynamicParams = false rejects unknown slugs while routing, so they get the global,
  // bilingual 404 (app/global-not-found.tsx) with a link to each language's blog
  test("an unknown post shows the bilingual 404", async ({ page }) => {
    await page.goto("/en/blog/does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Stranica ne postoji / Page not found");
    await expect(page.getByRole("link", { name: "Pogledaj blog" })).toHaveAttribute("href", "/sr/blog");
    await expect(page.getByRole("link", { name: "Read the blog" })).toHaveAttribute("href", "/en/blog");
  });
});

test.describe("blog", () => {
  test("the list shows as many cards as the post count says, up to a page", async ({ page }) => {
    await page.goto("/en/blog");
    const count = Number((await page.getByText(/^\d+ posts?$/).textContent())?.split(" ")[0]);
    const cards = page.getByRole("article");
    expect(await cards.count()).toBe(Math.min(count, 5));
  });

  test("opening a post shows its title, meta and content", async ({ page }) => {
    await page.goto("/en/blog");
    const firstTitle = page.getByRole("article").first().getByRole("heading", { level: 2 }).getByRole("link");
    const title = await firstTitle.textContent();
    const href = (await firstTitle.getAttribute("href"))!;
    await firstTitle.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title!);
    await expect(page.locator("article time").first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "More posts" })).toBeVisible();
  });

  test("a tag page lists only posts with that tag", async ({ page }) => {
    await page.goto("/en/blog");
    const filter = page.getByRole("navigation", { name: "Filter by tag" });
    const tag = filter.getByRole("link").nth(1);
    const name = (await tag.textContent())!;
    await tag.click();
    await expect(page).toHaveURL(new RegExp(`/en/blog/tags/${name}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`#${name}`);
    for (const card of await page.getByRole("article").all()) {
      await expect(card.getByRole("link", { name, exact: true })).toBeVisible();
    }
  });

  test("the home page lists the latest posts and links to the blog", async ({ page }) => {
    await page.goto("/sr");
    const latest = page.getByRole("region", { name: "Najnoviji zapisi" });
    const titles = latest.getByRole("listitem");
    expect(await titles.count()).toBeGreaterThan(0);
    expect(await titles.count()).toBeLessThanOrEqual(3);
    await latest.getByRole("link", { name: "Svi zapisi →" }).click();
    await expect(page).toHaveURL(/\/sr\/blog$/);
  });
});

test.describe("language switch", () => {
  test("opens the same post in the other language", async ({ page }) => {
    await page.goto("/en/blog");
    const href = await page.getByRole("article").first().getByRole("heading").getByRole("link").getAttribute("href");
    await page.goto(href!);
    await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "Srpski" }).click();
    await expect(page).toHaveURL(href!.replace("/en/", "/sr/"));
    await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
  });

  test("on the blog list links to the other language's blog", async ({ page }) => {
    await page.goto("/en/blog");
    const switchLink = page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "Srpski" });
    await expect(switchLink).toHaveAttribute("href", "/sr/blog");
  });
});
