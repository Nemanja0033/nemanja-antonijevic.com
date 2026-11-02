import { expect, test } from "@playwright/test";

test.describe("SEO", () => {
  test("a post has canonical, hreflang, Open Graph and BlogPosting JSON-LD", async ({ page, request }) => {
    await page.goto("/en/blog");
    const href = (await page.getByRole("article").first().getByRole("heading").getByRole("link").getAttribute("href"))!;
    await page.goto(href);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${href}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    const image = await request.get(new URL(ogImage!).pathname + new URL(ogImage!).search);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toBe("image/png");

    const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(jsonLd).toMatchObject({
      "@type": "BlogPosting",
      headline: await page.getByRole("heading", { level: 1 }).textContent(),
      inLanguage: "en",
      author: { "@type": "Person" },
    });
  });

  test("the sitemap lists both languages and every URL in it works", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(urls.some((u) => u.startsWith("/sr"))).toBe(true);
    expect(urls.some((u) => u.startsWith("/en"))).toBe(true);
    for (const url of urls) {
      expect((await request.get(url)).status(), url).toBe(200);
    }
  });

  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Allow: \//);
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });
});
