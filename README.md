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
./dev.sh new     # new post, step by step: languages, titles, slug, date, tags, cover
./dev.sh posts   # every post with its date and languages
./dev.sh dev     # dev server on http://localhost:3000
./dev.sh check   # lint + TypeScript + production build
```

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
  tags: ["nextjs", "css"], // optional; lowercase letters, digits and dashes
};

Post body. The title is rendered from `meta`, so start with `##` headings.
```

Links to other pages inside a post include the language: `[blog](/sr/blog)`.

Each tag gets its own page at `/<lang>/blog/tags/<tag>`. Lists show 10 posts per page (`/<lang>/blog/page/2`, …). A post folder can't be named `tags` or `page`. Reading time and the "on this page" sidebar are computed from the post at build time.

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
