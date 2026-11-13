---
name: insert-change-auto
description: Add new content to a blog post in this project (content/blog/<slug>/index.sr.mdx and index.en.mdx) from a loose description — an idea, a motive, an argument, an example, a tone, a resource or link — by choosing where it fits and writing it in the post's own voice and style. Use this whenever the user describes what they want added rather than giving exact text and location, e.g. "dodaj deo o…", "ubaci primer za…", "dodaj link ka…", "hoću da post pomene…", "proširi post sa…", "add a bit about…", even if they don't name a section.
---

# Insert a change: auto

The user says *what* to add; you decide *where* and *how*. The result should read as if the author wrote it in the first draft: same voice, same rhythm, same terminology, no seams.

## 1. Understand the request

Pull out of the user's description:
- **Motive** — the idea, argument, example or story to add, and why it belongs in the post.
- **Tone** — if the user names one ("malo duhovitije", "ozbiljno"), it applies to the new part only; otherwise match the surrounding text.
- **Resource** — a link, tool, book, code snippet or image. Use only URLs the user gave or that already exist in the project; never invent a link, quote, number or source. If a fact is needed and you're not sure of it, ask.

If the request could mean two quite different additions, ask one short question before writing.

## 2. Read the post first

Find it (`./dev.sh posts` lists posts; a title → grep `title:` in `content/blog/*/index.*.mdx`) and read every language file whole. Note:
- the voice: person (`ti`/"you" or "we"), sentence length, humor, how opinions are stated;
- the structure: which `##`/`###` sections exist and what each one argues;
- conventions: how lists, code blocks, quotes, bold and links are used; how anglicisms are written in Serbian (`commit-ovati`, `build-a`).

## 3. Choose the place and the form

- Put it where the argument needs it: inside the section it supports, or as a new `###` subsection there; a new `##` section only when it's a separate topic. Don't bolt it onto the end unless it's a conclusion.
- Match the form to the neighbors: a sentence or a paragraph in prose, a list item in a list, a fenced code block with a language for code.
- Keep the flow: adjust a transition sentence before or after the insert if needed, but don't rewrite existing content beyond that.
- Keep the size proportional — an addition shouldn't outweigh the section it lives in unless the user asked for depth.

## 4. Write it

- Same voice and terminology as the post. Serbian: latinica, ekavica, correct diacritics. English: sentence-case headings.
- Links: internal ones include the language (`/sr/...`, `/en/...`); external ones are plain markdown links (the site adds the new-tab handling).
- **Both languages:** if the post has both `index.sr.mdx` and `index.en.mdx`, add the matching part to both, written naturally in each language, not translated word for word. Exception: if one file is still a placeholder (untranslated), only touch the real one and say so. If the user names one language, only touch that one.
- Don't change `meta.date`, `meta.tags` or the slug. Update `meta.description` only if the addition changes what the post is about, and say so.
- A new heading gets an `#id` from github-slugger; the sidebar picks it up automatically.

## 5. Check and report

1. Run `node .claude/skills/check-post/scripts/check-post.mjs <slug>` and fix anything you broke.
2. Reply in the user's language: where you put it (section, and why there), the added text (or its first lines if long), any transition you touched, and anything you decided or assumed. Mention that `git diff content/blog/<slug>` shows the change and `git restore` undoes it.

The post is the author's: add their idea, not yours. Don't sneak in extra opinions, and don't "improve" untouched parts.
