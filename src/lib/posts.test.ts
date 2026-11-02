// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";
import {
  extraPageNumbers,
  getHeadings,
  getPostLanguages,
  getPostSlugs,
  paginate,
  parseMeta,
  POSTS_PER_PAGE,
  readingMinutes,
  type PostSummary,
} from "./posts";

// Fake posts for the pagination helpers; only the count matters
const posts = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ slug: `post-${i + 1}` }) as PostSummary);

describe("paginate", () => {
  it("returns one empty page for an empty list", () => {
    expect(paginate([], 1)).toEqual({ posts: [], page: 1, totalPages: 1 });
  });

  it(`slices ${POSTS_PER_PAGE} posts per page`, () => {
    const all = posts(POSTS_PER_PAGE * 2 + 1);
    expect(paginate(all, 1).posts).toHaveLength(POSTS_PER_PAGE);
    expect(paginate(all, 3).posts).toEqual([all.at(-1)]);
    expect(paginate(all, 1).totalPages).toBe(3);
  });
});

describe("extraPageNumbers", () => {
  it("has no extra pages while everything fits on page 1", () => {
    expect(extraPageNumbers(posts(POSTS_PER_PAGE))).toEqual([]);
  });

  it("lists pages 2..N as strings for generateStaticParams", () => {
    expect(extraPageNumbers(posts(POSTS_PER_PAGE * 2 + 1))).toEqual(["2", "3"]);
  });
});

describe("parseMeta", () => {
  const file = "content/blog/x/index.sr.mdx";

  it("accepts a valid meta and defaults tags to []", () => {
    expect(parseMeta(file, { title: "Naslov", date: "2026-11-01" })).toEqual({
      title: "Naslov",
      date: "2026-11-01",
      tags: [],
    });
  });

  it("rejects a missing title or an invalid date, naming the file", () => {
    expect(() => parseMeta(file, { date: "2026-11-01" })).toThrow(file);
    expect(() => parseMeta(file, { title: "T", date: "not a date" })).toThrow(/ISO `date`/);
    expect(() => parseMeta(file, undefined)).toThrow(file);
  });

  it("rejects tags that aren't URL-safe", () => {
    expect(() => parseMeta(file, { title: "T", date: "2026-11-01", tags: ["Next JS"] })).toThrow(
      /invalid tags \(Next JS\)/,
    );
  });
});

describe("readingMinutes", () => {
  it("is at least one minute", () => {
    expect(readingMinutes("export const meta = {\n  title: \"x\",\n};\n\nHello.")).toBe(1);
  });

  it("counts about 200 words per minute and ignores the meta block", () => {
    const meta = `export const meta = {\n  title: "${"word ".repeat(500)}",\n};\n`;
    expect(readingMinutes(`${meta}\n${"word ".repeat(600)}`)).toBe(3);
  });
});

describe("getHeadings", () => {
  it("lists ## headings with slug ids, skipping code blocks", () => {
    const source = [
      "## First heading",
      "### Not listed",
      "```md",
      "## Not a heading, it's code",
      "```",
      "## Second `code` and [link](/x)",
    ].join("\n");
    expect(getHeadings(source)).toEqual([
      { id: "first-heading", text: "First heading" },
      { id: "second-code-and-link", text: "Second code and link" },
    ]);
  });

  it("numbers duplicate ids the way rehype-slug does", () => {
    expect(getHeadings("## Intro\n\n## Intro").map((h) => h.id)).toEqual(["intro", "intro-1"]);
  });
});

// Real content: the sidebar links must match the ids rehype-slug puts on the page
describe("every post on disk", () => {
  const dir = path.join(process.cwd(), "content", "blog");
  const files = readdirSync(dir).flatMap((slug) =>
    readdirSync(path.join(dir, slug))
      .filter((f) => /^index\.(sr|en)\.mdx$/.test(f))
      .map((f) => path.join(dir, slug, f)),
  );

  it("exists", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files.map((f) => [path.relative(process.cwd(), f), f]))(
    "%s: sidebar ids match the rendered heading ids",
    async (_, file) => {
      const source = readFileSync(file, "utf8");
      const ids: string[] = [];
      await compile(source, {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          // Collect the id of every rendered h2, except the hidden "Footnotes" heading GFM adds
          () => (tree) => {
            const walk = (node: { tagName?: string; properties?: { id?: string }; children?: unknown[] }) => {
              const id = node.properties?.id;
              if (node.tagName === "h2" && id && id !== "footnote-label") ids.push(id);
              node.children?.forEach((child) => walk(child as typeof node));
            };
            walk(tree as never);
          },
        ],
      });
      expect(getHeadings(source).map((h) => h.id)).toEqual(ids);
    },
  );
});

describe("post files", () => {
  it("lists slugs per language and the languages of each post", async () => {
    const sr = await getPostSlugs("sr");
    const en = await getPostSlugs("en");
    expect(sr.length + en.length).toBeGreaterThan(0);
    for (const slug of sr) expect(await getPostLanguages(slug)).toContain("sr");
    for (const slug of en) expect(await getPostLanguages(slug)).toContain("en");
    expect(await getPostLanguages("does-not-exist")).toEqual([]);
  });
});
