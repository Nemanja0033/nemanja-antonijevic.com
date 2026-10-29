---
name: tone-cool
description: Rewrite a blog post in this project (content/blog/<slug>/index.sr.mdx and index.en.mdx) in a cool, witty, punchy tone that matches the site's "nerdy & cool" zine style — confident, playful, memorable — while keeping the topic, facts, structure, code and links exactly as they are. Use this whenever the user wants a post to have more personality, be funnier, catchier, more fun to read, "kul", "zanimljivije", "sa više stava", "da ima fazon", "nerdy", even if they don't say the word "tone".
---

# Tone: cool

Rewrite how the post says things, not what it says. The reader should learn exactly the same facts, in the same order, from the rewritten post.

## The tone

The site's headline is "Building frontends & writing deep tech blogs for not-so-regular developers", and the design is a playful zine. Write for that reader: a developer who knows their stuff and enjoys a bit of attitude.

- Punchy rhythm: mix short sentences with longer ones; a one-line paragraph or a sentence fragment for emphasis is fine. Lead each section with a hook.
- Wit and opinions: dry humor, nerdy references, a bold take ("Comments lie. Function names don't get the chance."). One good joke per section beats five forced ones.
- Vivid, concrete metaphors that make the tech easier to picture, never ones that make it less accurate.
- Still a deep tech blog: the explanation is the star, the style is the delivery. Every fact, number and caveat stays.
- No emoji (the design avoids them), no internet-meme spelling, nothing mean-spirited.
- English: contractions fine; headings in sentence case, and they may get a little wordplay.
- Serbian: živ, duhovit jezik u latinici, ekavica, "ti" for the reader; slang and dev anglicisms are welcome (`fazon`, `bug`, `deploy-ovati`) but grammar and diacritics stay correct. A joke can be different from the English one; it should land in Serbian, not be a literal translation.

Example — before: "Rebase premešta commit-ove na novu osnovu; sadržaj izmena ostaje isti." After: "Rebase je selidba za commit-ove: isti nameštaj, nova adresa."

## What stays exactly the same

These are what make the post the same post, and several of them break the site if they change:

- Topic, every fact, number, claim and the order of sections.
- `meta.date`, `meta.tags`, the folder name (the URL slug).
- Code blocks and inline code, character for character.
- Link targets, image URLs, JSX/HTML tags and their attributes; only the visible link text may be reworded.
- The number and order of headings and their levels. Heading text may be reworded, but it changes the heading's `#id`, so update any `](#old-id)` links in the post to the new id (github-slugger rules: lowercase, spaces → `-`, punctuation dropped).
- Tables keep their rows, columns and data; only wording inside text cells changes.

`meta.title` and `meta.description` are rewritten in the new tone too (readers see them first); keep the description under 160 characters.

## Steps

1. Find the post (`./dev.sh posts` lists them; a title → grep `title:` in `content/blog/*/index.*.mdx`). If the user named one language, rewrite only that file; otherwise rewrite every `index.<lang>.mdx` in the folder so both versions match in tone.
2. Read the whole file first, so the voice and running jokes stay consistent from start to end, then rewrite it in place.
3. Run `node .claude/skills/check-post/scripts/check-post.mjs <slug>` and fix anything you broke (it reports links, headings, meta and code blocks).
4. Reply in the user's language with a short summary: which files changed, 2–3 representative before → after sentences, and anything you had to decide. Mention that `git diff content/blog/<slug>` shows the full change and `git restore` undoes it.

The post is the author's writing: keep their opinions and claims; if a joke would bend a fact, drop the joke.
