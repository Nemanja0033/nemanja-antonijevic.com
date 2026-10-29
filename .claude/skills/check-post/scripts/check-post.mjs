#!/usr/bin/env node
// Structural checks for a blog post: node check-post.mjs <slug> [--json]
// Mirrors the rules src/lib/posts.ts enforces at build time, plus content checks
// the build does not catch (links, headings, code fences, translations).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../../../..");
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const LOCALES = ["sr", "en"];
const RESERVED_SLUGS = ["tags", "page"];
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TAG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DESCRIPTION_MAX = 160; // longer descriptions get cut off in search results

const [slug, flag] = process.argv.slice(2);
if (!slug) {
  console.error("Usage: check-post.mjs <slug> [--json]");
  process.exit(2);
}

const issues = []; // { level: "error" | "warning", file, line?, message }
let langs = []; // languages the post is written in, filled below
const add = (level, file, message, line) => issues.push({ level, file, line, message });

const dir = path.join(CONTENT_DIR, slug);
const rel = (file) => path.relative(ROOT, file);

if (!SLUG_PATTERN.test(slug)) add("error", `content/blog/${slug}`, "Slug: only lowercase letters, digits and dashes");
if (RESERVED_SLUGS.includes(slug)) add("error", `content/blog/${slug}`, `Slug "${slug}" is reserved (${RESERVED_SLUGS.join(", ")})`);
if (!existsSync(dir)) {
  add("error", `content/blog/${slug}`, "Post folder does not exist");
  report();
}

const files = readdirSync(dir);
if (!files.some((f) => /^cover\.(jpg|png|webp)$/.test(f))) {
  add("error", rel(dir), "Missing cover.jpg, cover.png or cover.webp");
}
langs = LOCALES.filter((lang) => files.includes(`index.${lang}.mdx`));
if (!langs.length) add("error", rel(dir), "Missing index.sr.mdx and index.en.mdx (at least one is required)");
for (const f of files) {
  if (/^index\..*\.mdx?$/.test(f) && !LOCALES.some((l) => f === `index.${l}.mdx`)) {
    add("warning", rel(path.join(dir, f)), `Ignored by the site (expected index.${LOCALES.join(".mdx or index.")}.mdx)`);
  }
}

// Existing slugs per language, to check internal links to other posts
const slugsByLang = Object.fromEntries(
  LOCALES.map((lang) => [
    lang,
    readdirSync(CONTENT_DIR).filter((s) => existsSync(path.join(CONTENT_DIR, s, `index.${lang}.mdx`))),
  ]),
);

const parsed = {};
for (const lang of langs) parsed[lang] = checkFile(lang);

// Translations should describe the same post
if (parsed.sr?.meta && parsed.en?.meta) {
  const [sr, en] = [parsed.sr, parsed.en];
  if (sr.meta.date !== en.meta.date) add("warning", rel(dir), `Different dates: sr ${sr.meta.date}, en ${en.meta.date}`);
  const tagsSr = [...(sr.meta.tags ?? [])].sort().join(",");
  const tagsEn = [...(en.meta.tags ?? [])].sort().join(",");
  if (tagsSr !== tagsEn) add("warning", rel(dir), `Different tags: sr [${tagsSr}], en [${tagsEn}]`);
  if (sr.h2.length !== en.h2.length) {
    add("warning", rel(dir), `Different number of ## headings: sr ${sr.h2.length}, en ${en.h2.length} (missing translation?)`);
  }
  if (sr.codeBlocks !== en.codeBlocks) {
    add("warning", rel(dir), `Different number of code blocks: sr ${sr.codeBlocks}, en ${en.codeBlocks}`);
  }
  if (Boolean(sr.meta.description) !== Boolean(en.meta.description)) {
    add("warning", rel(dir), "Description is set in only one language");
  }
}

report();

function checkFile(lang) {
  const file = path.join(dir, `index.${lang}.mdx`);
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");
  const name = rel(file);

  // meta: a plain object literal; evaluated in isolation, like the bundler would
  const metaMatch = source.match(/^export const meta = (\{[\s\S]*?\n\});?/m);
  let meta;
  if (!metaMatch) {
    add("error", name, "Missing `export const meta = { ... };` at the top", 1);
  } else {
    try {
      meta = new Function(`return (${metaMatch[1]});`)();
    } catch (error) {
      add("error", name, `meta is not valid JavaScript: ${error.message}`, 1);
    }
  }
  if (meta) {
    if (!meta.title || typeof meta.title !== "string") add("error", name, "meta.title is required", 1);
    if (!meta.date || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date))) {
      add("error", name, `meta.date must be a valid YYYY-MM-DD date (got ${JSON.stringify(meta.date)})`, 1);
    }
    if (meta.description === undefined) {
      add("warning", name, "No meta.description (used in the post list, search results and link previews)", 1);
    } else if (meta.description.length > DESCRIPTION_MAX) {
      add("warning", name, `meta.description is ${meta.description.length} characters; keep it under ${DESCRIPTION_MAX}`, 1);
    }
    if (meta.tags !== undefined && !Array.isArray(meta.tags)) add("error", name, "meta.tags must be an array", 1);
    for (const tag of meta.tags ?? []) {
      if (!TAG_PATTERN.test(tag)) add("error", name, `Tag "${tag}": only lowercase letters, digits and dashes`, 1);
    }
    for (const key of Object.keys(meta)) {
      if (!["title", "description", "date", "tags"].includes(key)) add("warning", name, `Unknown meta field "${key}"`, 1);
    }
  }

  // Body: headings, code fences, links, images
  const h2 = [];
  let codeBlocks = 0;
  let fenceLine = 0;
  let previousLevel = 1; // the page renders the title as h1
  lines.forEach((text, i) => {
    const line = i + 1;
    if (/^\s*```/.test(text)) {
      if (!fenceLine) {
        fenceLine = line;
        codeBlocks++;
        if (/^\s*```\s*$/.test(text)) add("warning", name, "Code block without a language (```ts, ```bash, …)", line);
      } else {
        fenceLine = 0;
      }
      return;
    }
    if (fenceLine) return;

    const heading = text.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 1) add("error", name, "# heading in the body; the title comes from meta, start with ##", line);
      else if (level > previousLevel + 1) add("warning", name, `Heading jumps from h${previousLevel} to h${level}`, line);
      if (level === 2) h2.push(heading[2]);
      previousLevel = level;
    }

    for (const [, alt, href] of text.matchAll(/(!?\[[^\]]*\])\(([^)\s]+)[^)]*\)/g)) {
      checkLink(name, line, lang, alt, href);
    }
    for (const [, href] of text.matchAll(/href=["']([^"']+)["']/g)) checkLink(name, line, lang, "", href);
  });
  if (fenceLine) add("error", name, "Code block is never closed (missing ```)", fenceLine);
  if (!h2.length) add("warning", name, 'No ## headings, so the "on this page" sidebar is empty');

  return { meta, h2, codeBlocks };
}

function checkLink(name, line, lang, label, href) {
  if (label.startsWith("!") && label === "![]") add("warning", name, "Image without alt text", line);
  if (!href.startsWith("/")) return; // external, anchors, mailto: are fine
  const first = href.split("/")[1];
  if (!LOCALES.includes(first)) {
    add("error", name, `Internal link "${href}" has no language prefix (use /${lang}${href})`, line);
    return;
  }
  if (first !== lang) add("warning", name, `Link "${href}" points to the other language`, line);
  const post = href.match(/^\/(sr|en)\/blog\/([^/#?]+)\/?(?:[#?].*)?$/);
  if (post && !["tags", "page"].includes(post[2]) && !slugsByLang[post[1]].includes(post[2])) {
    add("error", name, `Link "${href}" points to a post that does not exist in ${post[1]}`, line);
  }
}

function report() {
  const errors = issues.filter((i) => i.level === "error").length;
  if (flag === "--json") {
    console.log(JSON.stringify({ slug, langs, errors, warnings: issues.length - errors, issues }, null, 2));
  } else {
    console.log(`check-post ${slug} (${langs.join(", ") || "no languages"})`);
    for (const { level, file, line, message } of issues) {
      console.log(`  ${level === "error" ? "✗" : "!"} ${file}${line ? `:${line}` : ""}  ${message}`);
    }
    console.log(issues.length ? `${errors} error(s), ${issues.length - errors} warning(s)` : "  ✓ no structural problems");
  }
  process.exit(errors ? 1 : 0);
}
