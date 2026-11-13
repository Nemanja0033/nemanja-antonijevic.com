---
name: insert-change-manual
description: Make an exact, user-specified edit in a blog post in this project (content/blog/<slug>/index.sr.mdx and index.en.mdx) — a word, a typo, a letter, punctuation, a sentence, a heading, a link or a meta field — at the location the user gives (line, section, quoted text), and change nothing else. Use this whenever the user says precisely what to change and where, e.g. "u drugom pasusu promeni X u Y", "ispravi typo u naslovu", "red 42: …", "zameni reč…", "obriši rečenicu…", "fix the typo in…", "change X to Y in section…".
---

# Insert a change: manual

The user decides both *what* and *where*. Your job is precision: apply exactly that change, in exactly that place, and nothing more. No rewording, no "while I'm here" fixes.

## 1. Locate the target

The user may point to it by:
- line number (`index.sr.mdx:42`, "red 42"),
- section ("u delu *Gde agent i dalje greši*"),
- quoted text ("tamo gde piše …"),
- position ("drugi pasus", "poslednja rečenica", "naslov", "opis").

Find the post (`./dev.sh posts`; a title → grep `title:` in `content/blog/*/index.*.mdx`). "Naslov"/"title" and "opis"/"description" mean `meta.title` / `meta.description` unless the user clearly means a section heading. If no language is named and the text only exists in one file, use that file.

Find the exact spot with grep or by reading around the line. If the target matches **more than one place**, or **nothing**, stop and show the candidates (`file:line` + the line) and ask which one; don't guess.

## 2. Apply exactly the requested change

- Replace only the requested characters/words; keep surrounding whitespace, punctuation, markdown and line breaks as they are.
- "Svuda"/"everywhere" means every occurrence in the named file(s); otherwise one occurrence.
- Inside code blocks, inline code, URLs and JSX attributes, change only what the user explicitly targeted there.
- Grammar follows the change: if a replaced Serbian word needs a different case ending or a matching adjective/verb form right next to it, adjust that and say so. Nothing beyond that.

## 3. Side effects to handle

- **Heading text changed** → its `#id` changes (github-slugger: lowercase, spaces → `-`, punctuation dropped). Update any `](#old-id)` links in that file.
- **Link target changed** → internal links keep the `/sr` or `/en` prefix.
- **meta** → `date` stays `YYYY-MM-DD`, `collection` must be a slug from `content/collections.json`, description under 160 characters.
- **Other language:** don't edit it on your own. If the same fix obviously applies there too (same typo, same wrong fact, same heading), point it out and offer to apply it.

## 4. Check and report

1. Run `node .claude/skills/check-post/scripts/check-post.mjs <slug>` and fix anything the change broke.
2. Reply in the user's language, short: for each change `file:line` and `before → after`, plus any side effect you handled (anchor, grammar agreement) and any suggestion for the other language. `git diff content/blog/<slug>` shows it; `git restore` undoes it.

If you notice other typos while editing, list them at the end as suggestions; don't fix them unasked.
