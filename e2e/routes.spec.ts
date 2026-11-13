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

  for (const url of [
    "/xyz",
    "/de/blog",
    "/blog",
    "/sr/blog/does-not-exist",
    "/en/blog/collections/does-not-exist",
    // each language has its own collections segment; the other one doesn't exist
    "/en/blog/kolekcije",
    "/sr/blog/collections",
    "/en/blog/kolekcije/frontend-engineering",
  ]) {
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

  test("a collection page lists only posts in that collection", async ({ page }) => {
    await page.goto("/sr/blog");
    const filter = page.getByRole("navigation", { name: "Filter po kolekcijama" });
    const collection = filter.getByRole("link").nth(1);
    const name = (await collection.textContent())!;
    await collection.click();
    await expect(page).toHaveURL(/\/sr\/blog\/kolekcije\/[a-z0-9-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(filter.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
    for (const card of await page.getByRole("article").all()) {
      await expect(card.getByRole("link", { name, exact: true })).toBeVisible();
    }
  });

  test("the collections page lists every collection and links to each", async ({ page }) => {
    await page.goto("/sr/blog/kolekcije/frontend-engineering");
    await page.getByRole("link", { name: "← kolekcije" }).click();
    await expect(page).toHaveURL(/\/sr\/blog\/kolekcije$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kolekcije");
    const first = page.getByRole("article").first().getByRole("heading", { level: 2 }).getByRole("link");
    await expect(first).toHaveAttribute("href", /^\/sr\/blog\/kolekcije\/[a-z0-9-]+$/);
  });

  test("a post links to its collection", async ({ page }) => {
    await page.goto("/en/blog/frontend-in-ai-era-to-be-or-not-to-be");
    await expect(page.getByRole("link", { name: "Frontend engineering" }).first()).toHaveAttribute(
      "href",
      "/en/blog/collections/frontend-engineering",
    );
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

  test("translates the collections segment", async ({ page }) => {
    await page.goto("/sr/blog/kolekcije/frontend-engineering");
    const switchLink = page.getByRole("navigation", { name: "Jezik" }).getByRole("link", { name: "English" });
    await expect(switchLink).toHaveAttribute("href", "/en/blog/collections/frontend-engineering");
  });

  test("on the blog list links to the other language's blog", async ({ page }) => {
    await page.goto("/en/blog");
    const switchLink = page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "Srpski" });
    await expect(switchLink).toHaveAttribute("href", "/sr/blog");
  });
});
