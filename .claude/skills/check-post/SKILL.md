---
name: check-post
description: Proofread and validate a blog post in this project (content/blog/<slug>/index.sr.mdx and index.en.mdx) — grammar and spelling in Serbian (Latin script) and English, plus structural correctness (meta, date, tags, links with the language prefix, headings, code blocks, cover, and whether the two translations match). Use this whenever the user asks to check, proofread, review, lektorisati or "proveri" a post, before publishing one, after ./dev.sh new, or when they mention grammar, typos or "da li je post ok", even if they only give the post's title or slug.
---

# Check a blog post

A post is a folder `content/blog/<slug>/` with `index.sr.mdx` and/or `index.en.mdx` and a shared `cover.{jpg,png,webp}`. Each file starts with `export const meta = { title, description?, date, tags? }`; the page renders the title itself, so the body starts with `##` headings. The rules the site enforces live in `src/lib/posts.ts`.

The check has two halves: a script for everything mechanical, and your own reading for language. Do both, then report together.

## 1. Find the post

The user may give a slug, a title, or just "the new post". Map it to a folder:
- `./dev.sh posts` lists every post with its date and languages (newest first).
- A title → grep `title:` in `content/blog/*/index.*.mdx`.
- "The latest / new post" → the first line of `./dev.sh posts`.

If two posts fit, ask which one.

## 2. Run the structural check

```bash
node .claude/skills/check-post/scripts/check-post.mjs <slug>
```

It reports errors (`✗`, the build would fail or the page is broken) and warnings (`!`, worth fixing), each with `file:line`. It covers: slug and reserved names, cover, `meta` (valid JS, title, ISO date, tags format, description length, unknown fields), `#` headings in the body, skipped heading levels, missing `##` headings, unclosed or language-less code blocks, internal links without `/sr` or `/en`, links to posts that don't exist, images without alt text, and whether the translations agree (date, tags, number of headings and code blocks). Trust its findings rather than re-deriving them by eye; add `--json` if you want to process the output.

## 3. Proofread the language

Read each language file yourself. Check prose only: skip the `meta` keys, code blocks, inline code, URLs and JSX attributes, but do proofread `title` and `description`, since readers see them first.

**Serbian (Latin script)** — the site's Serbian is written in latinica; flag any Cyrillic. Common problems:
- missing diacritics: `cita` → `čita`, `sto` → `što`, `dje`/`dj` where `đ` is meant
- negation written together or apart wrongly: `neznam` → `ne znam`, `nebi` → `ne bi`, `nemogu` → `ne mogu` (but `nemam`, `neću`, `nisam`, `nije` are correct)
- past participle spelled as spoken: `razvijo` → `razvio`, `reko` → `rekao`
- `ije/je` (`vreme`, `dete` in ekavian; keep one dialect throughout)
- capitalization: months, days and nationalities-as-adjectives are lowercase (`oktobar`, `srpski`)
- comma before `ali`, `nego`, `već`; no comma before `da` in `mislim da`
- English terms are fine in a tech blog, but inflect them consistently (`commit-ovati`, `build-a`) and don't mix two spellings of the same word in one post

**English** — grammar, spelling, articles, subject–verb agreement, consistent US or UK spelling, and headings in a consistent case (the site uses sentence case: "Text formatting", not "Text Formatting").

**Both** — the two versions should say the same thing. Flag a section, list item or example that exists in only one language, or a meaning that changed in translation. Don't flag natural rewording.

Report only real problems. Style preferences (a word you'd choose differently) go in a separate, short "suggestions" list or not at all, because the author's voice is deliberately casual.

## 4. Report

Write the report in the language the user is speaking (usually Serbian):

```
## check-post: <slug> (sr, en)

**Struktura** — <n> grešaka, <n> upozorenja
- ✗ index.sr.mdx:12 — <script message>
- ! index.en.mdx:1 — <script message>

**Jezik — srpski**
| Red | Piše | Treba | Zašto |
|---|---|---|---|
| 8 | neznam | ne znam | odrična rečca se piše odvojeno |

**Jezik — engleski**
| Line | Text | Fix | Why |
|---|---|---|---|

**Prevod** — <differences between the versions, or "verzije se poklapaju">

**Predlozi** (optional, style only)
```

Leave out a section that has nothing in it, except Struktura; say "nema problema" there so the user knows the check ran. End with one line: ready to publish, or what has to be fixed first.

## 5. Fixing

Don't edit the post unless the user asks: it's their writing, and some "errors" are intentional voice. When asked, fix exactly what was reported (meaning stays the same), then rerun the script and `./dev.sh check` if the meta or links changed, so the build is proven to pass.
