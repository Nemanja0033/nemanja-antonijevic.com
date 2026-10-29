---
name: tone-casual
description: Rewrite a blog post in this project (content/blog/<slug>/index.sr.mdx and index.en.mdx) in a casual, conversational tone — like explaining it to a colleague over coffee — while keeping the topic, facts, structure, code and links exactly as they are. Use this whenever the user wants a post to sound more relaxed, friendly, approachable, less stiff or less like documentation, "opuštenije", "ležernije", "manje ukočeno", "kao da pričam sa drugarom", even if they don't say the word "tone".
---

# Tone: casual

Rewrite how the post says things, not what it says. The reader should learn exactly the same facts, in the same order, from the rewritten post.

## The tone

Sound like a friendly senior colleague explaining something at their desk: relaxed, warm, clear.

- First person ("I", "ja") and addressing the reader directly ("you", "ti").
- Short sentences, everyday words, the occasional rhetorical question ("So why does this break?") or light aside. Humor is welcome when it's gentle, but it never replaces the explanation.
- Keep it clear rather than sloppy: casual is not vague. Every fact and number stays.
- English: contractions are fine ("it's", "don't"); headings in sentence case.
- Serbian: razgovorni ali ispravan jezik u latinici, ekavica; "ti" for the reader. Everyday dev anglicisms are natural here (`setup`, `bug`, `deploy-ovati`), inflected consistently. Grammar and diacritics still matter.

Example — before: "Rebase premešta commit-ove na novu osnovu; sadržaj izmena ostaje isti." After: "Rebase ti samo prebaci commit-ove na novu osnovu. Izmene su iste, samo stoje na novom mestu."

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
2. Read the whole file first, so the rewrite is consistent from start to end, then rewrite it in place.
3. Run `node .claude/skills/check-post/scripts/check-post.mjs <slug>` and fix anything you broke (it reports links, headings, meta and code blocks).
4. Reply in the user's language with a short summary: which files changed, 2–3 representative before → after sentences, and anything you had to decide. Mention that `git diff content/blog/<slug>` shows the full change and `git restore` undoes it.

The post is the author's writing: keep their opinions and claims as they are, only the way they're said changes.
