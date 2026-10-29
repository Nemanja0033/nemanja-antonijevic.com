---
name: tone-professional
description: Rewrite a blog post in this project (content/blog/<slug>/index.sr.mdx and index.en.mdx) in a professional tone — clear, precise, neutral, no slang or jokes — while keeping the topic, facts, structure, code and links exactly as they are. Use this whenever the user wants a post to sound more professional, formal, serious, polished, "kao dokumentacija", "ozbiljnije", "profesionalnije", or ready for a CV, employer or LinkedIn, even if they don't say the word "tone".
---

# Tone: professional

Rewrite how the post says things, not what it says. The reader should learn exactly the same facts, in the same order, from the rewritten post.

## The tone

Sound like good technical documentation or an engineering blog at a respected company: confident, exact, calm.

- Plain, precise words; one idea per sentence; active voice.
- No slang, jokes, exclamation marks, rhetorical questions or hype ("amazing", "insane", "kul", "brutalno").
- Claims are concrete: "reduces the bundle by 40 KB", not "makes it way smaller". Keep every number the author gave; don't invent new ones.
- English: no contractions; US spelling; headings in sentence case.
- Serbian: standard književni jezik in latinica, ekavica. Address the reader with lowercase "vi" (or avoid direct address). Prefer an established Serbian word where one exists (`podešavanje`, not `setup`), but keep tech terms developers actually use (`commit`, `build`, `deploy`, `frontend`), inflected consistently (`build-a`, `commit-ovati`).

Example — before: "Rebase je samo premeštanje commit-ova, ništa strašno, bukvalno." After: "Rebase premešta commit-ove na novu osnovu; sadržaj izmena ostaje isti."

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
4. Reply in the user's language with a short summary: which files changed, 2–3 representative before → after sentences, and anything you had to decide (e.g. a joke you removed that carried a real point, now said plainly). Mention that `git diff content/blog/<slug>` shows the full change and `git restore` undoes it.

The post is the author's writing: if a passage can't be made professional without changing what it claims, keep the claim and say so in the summary rather than quietly altering it.
