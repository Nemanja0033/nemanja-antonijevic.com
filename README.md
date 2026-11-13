This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project commands

`./dev.sh` collects the everyday commands (`./dev.sh help` lists them):

```bash
./dev.sh new     # new post, step by step: languages, titles, slug, date, collection, cover
./dev.sh posts   # every post with its date and languages
./dev.sh check-post <slug>  # structural check of a post (meta, links, headings, translations)
./dev.sh version # bump patch/minor/major, add a CHANGELOG.md entry; the footer shows it
./dev.sh dev     # dev server on http://localhost:3000
./dev.sh test    # unit and component tests (Vitest)
./dev.sh test e2e  # end-to-end tests in a real browser (Playwright)
./dev.sh check   # lint + TypeScript + unit tests + production build
```

## Tests

- **Unit and component tests** (Vitest + Testing Library) sit next to the code as `*.test.ts(x)`: i18n, the post helpers (pagination, meta validation, reading time, sidebar headings), every UI, blog and site component, and the `check-post` script against every post on disk. They run in seconds: `npm test`, or `npm run test:watch` while working.
- **End-to-end tests** (Playwright) live in `e2e/` and run against a production build, on desktop and mobile Chrome: routing and 404s, the language switch, blog lists, collection pages and posts, SEO tags, JSON-LD, the sitemap, and an accessibility audit (headings, names, contrast, target sizes, skip link, reduced motion). `npm run test:e2e` builds the site first; the first run needs `npx playwright install chromium`.
- Async Server Components (page layouts, `SiteHeader`) can't be rendered by Vitest, so the e2e tests cover them, as the Next.js testing guide recommends.

To proofread a post (grammar in both languages plus the structural check), ask Claude Code to "check the post <slug>": the project skill in `.claude/skills/check-post/` handles it.

To change how a post sounds without changing what it says, ask for a tone: `tone-professional` (clear, neutral), `tone-casual` (conversational) or `tone-cool` (witty, zine style), e.g. "make the post <slug> cooler". They rewrite both languages and keep facts, code, links, date, collection and the slug; `git diff` shows the change.

To add or change content, there are two skills: `insert-change-auto` takes a description (an idea, an example, a tone, a link) and writes it into the right place in the post's own voice, e.g. "add a section about code review to <slug>"; `insert-change-manual` makes an exact edit where you point (a word, a typo, a heading), e.g. "in <slug>, line 42: change X to Y", and nothing else.

## Writing posts

The site is in Serbian (`/sr`, the default; `/` redirects there) and English (`/en`).

Each post is a folder in `content/blog/<slug>/`. The folder name is the URL slug in both languages (`/sr/blog/<slug>`, `/en/blog/<slug>`):

```
content/blog/<slug>/
  index.sr.mdx   ← Serbian version (optional)
  index.en.mdx   ← English version (optional)
  cover.jpg      ← required, shared by both (or cover.png / cover.webp)
```

At least one language file is required. A post that exists in only one language has no page in the other; the language switch then goes to that language's blog. Every `index.<lang>.mdx` exports its own `meta`:

```mdx
export const meta = {
  title: "Post title",
  description: "Optional summary for the list, SEO and social cards.",
  date: "2026-10-29",
  collection: "ai-renaissance", // required; a slug from content/collections.json
};

Post body. The title is rendered from `meta`, so start with `##` headings.
```

Links to other pages inside a post include the language: `[blog](/sr/blog)`.

## Collections

Every post belongs to exactly one collection: a topic with its own name and description in each language. Collections are defined in `content/collections.json`:

```json
{
  "ai-renaissance": {
    "sr": { "name": "AI Renesansa", "description": "…" },
    "en": { "name": "AI Renaissance", "description": "…" }
  }
}
```

The key is the slug, shared by both languages; order in the file is the order on the site. A new collection needs a name and description in both languages. A post that names a collection missing from the file fails the build.

The collections section has a translated URL: `/sr/blog/kolekcije` and `/en/blog/collections` list every collection, and each one has its own page (`/sr/blog/kolekcije/<slug>`, `/en/blog/collections/<slug>`). A collection only appears in a language once it has a post in that language. The language switch, hreflang links and the sitemap translate the segment.

## Lists

Lists show 5 posts per page (`/<lang>/blog/page/2`, `/<lang>/blog/kolekcije/<slug>/page/2`, …). A post folder can't be named `page`, `kolekcije` or `collections`. Reading time and the "on this page" sidebar are computed from the post at build time.

Interface text lives in `src/i18n/dictionaries/` (`sr.ts`, `en.ts`); the build fails if a key is missing in one of them.

Every page, the sitemap, `robots.txt` and the Open Graph images are prerendered at build time, so new content goes live with a rebuild. Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to the production URL before building.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
