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

## Writing posts

Each post is a folder in `content/blog/<slug>/` with an `index.mdx` and a cover image (`cover.jpg`, `cover.png` or `cover.webp`). The folder name is the URL slug. `index.mdx` must export `meta`:

```mdx
export const meta = {
  title: "Post title",
  description: "Optional summary for the list, SEO and social cards.",
  date: "2026-10-29",
  tags: ["nextjs", "css"], // optional; lowercase letters, digits and dashes
};

Post body. The title is rendered from `meta`, so start with `##` headings.
```

Each tag gets its own page at `/blog/tags/<tag>`, generated at build time. Lists show 10 posts per page (`/blog/page/2`, `/blog/tags/<tag>/page/2`, …), also generated at build time. A post folder can't be named `tags` or `page`.

The cover is shown in the post list and at the top of the post, optimized by `next/image`. The build fails with a clear error if a post folder is missing `index.mdx` or a cover.

Every page, the sitemap, `robots.txt` and the Open Graph images are prerendered at build time, so new content goes live with a rebuild. Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to the production URL before building.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
