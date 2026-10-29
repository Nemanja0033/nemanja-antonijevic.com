#!/usr/bin/env bash
# Project helper. Run ./dev.sh help for the list of commands.
set -euo pipefail

cd "$(dirname "$0")"

CONTENT_DIR="content/blog"
RESERVED_SLUGS=("tags" "page") # collide with /blog/tags and /blog/page routes
SLUG_PATTERN='^[a-z0-9]+(-[a-z0-9]+)*$'
TAG_PATTERN='^[a-z0-9]+(-[a-z0-9]+)*$'
DATE_PATTERN='^[0-9]{4}-[0-9]{2}-[0-9]{2}$'

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
info() { printf '\033[36m%s\033[0m\n' "$*"; }
warn() { printf '\033[33m%s\033[0m\n' "$*" >&2; }
fail() { printf '\033[31m%s\033[0m\n' "$*" >&2; exit 1; }

# ask "Question" [default] → prints the answer (the default on empty input)
ask() {
  local prompt="$1" default="${2:-}" answer
  if [[ -n "$default" ]]; then
    read -r -p "$prompt [$default]: " answer
    printf '%s' "${answer:-$default}"
  else
    read -r -p "$prompt: " answer
    printf '%s' "$answer"
  fi
}

# confirm "Question" [Y|n] → exit status 0 for yes
confirm() {
  local prompt="$1" default="${2:-Y}" answer hint="[Y/n]"
  [[ "$default" == "n" ]] && hint="[y/N]"
  read -r -p "$prompt $hint: " answer
  answer="${answer:-$default}"
  [[ "$answer" =~ ^[YyDd] ]] # y/yes or d/da
}

# Text → URL slug: "Đak čita Šekspira" → "djak-cita-sekspira"
slugify() {
  node -e '
    const s = process.argv[1].replace(/đ/g, "dj").replace(/Đ/g, "Dj");
    console.log(s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  ' "$1"
}

# A JavaScript string literal for the meta block (handles quotes and backslashes)
js_string() {
  node -e 'console.log(JSON.stringify(process.argv[1]))' "$1"
}

# Placeholder cover in the site palette, 1600×900
placeholder_cover() {
  node -e '
    const sharp = require("sharp");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
      <rect width="1600" height="900" fill="#e3e7fb"/>
      <circle cx="1200" cy="300" r="260" fill="#2236c9" fill-opacity="0.85"/>
      <circle cx="420" cy="660" r="180" fill="#ffe9a8"/>
    </svg>`;
    sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(process.argv[1]);
  ' "$1"
}

# Starting text for a new post, per language
body_sr() {
  cat <<'EOF'
Uvodni pasus: o čemu je ovaj zapis i zašto bi nekome bio koristan.

## Prvi naslov

Tekst prvog dela.

## Drugi naslov

Tekst drugog dela, sa primerom koda:

```ts
const zdravo = "svete";
```
EOF
}

body_en() {
  cat <<'EOF'
Lead paragraph: what this post is about and why it is useful.

## First heading

Text of the first part.

## Second heading

Text of the second part, with a code sample:

```ts
const hello = "world";
```
EOF
}

cmd_new() {
  bold "Novi zapis"
  echo

  # 1. Languages
  info "1/6 Jezici"
  local langs=()
  confirm "Srpska verzija (index.sr.mdx)?" Y && langs+=("sr")
  confirm "Engleska verzija (index.en.mdx)?" Y && langs+=("en")
  [[ ${#langs[@]} -gt 0 ]] || fail "Potreban je bar jedan jezik."
  echo

  # 2. Title and description per language
  info "2/6 Naslov i opis"
  declare -A titles descriptions
  local lang
  for lang in "${langs[@]}"; do
    local title=""
    while [[ -z "$title" ]]; do
      title="$(ask "Naslov ($lang)")"
      [[ -n "$title" ]] || warn "Naslov je obavezan."
    done
    titles[$lang]="$title"
    descriptions[$lang]="$(ask "Kratak opis ($lang, Enter za preskakanje)")"
  done
  echo

  # 3. Slug, suggested from the English title when there is one
  info "3/6 Slug (deo URL-a: /<jezik>/blog/<slug>)"
  local source_title="${titles[en]:-${titles[${langs[0]}]}}"
  local slug
  while true; do
    slug="$(ask "Slug" "$(slugify "$source_title")")"
    if [[ ! "$slug" =~ $SLUG_PATTERN ]]; then
      warn "Samo mala slova, brojevi i crtice (npr. moj-prvi-zapis)."
    elif [[ " ${RESERVED_SLUGS[*]} " == *" $slug "* ]]; then
      warn "\"$slug\" je rezervisano ime: ${RESERVED_SLUGS[*]}."
    elif [[ -e "$CONTENT_DIR/$slug" ]]; then
      warn "$CONTENT_DIR/$slug već postoji."
    else
      break
    fi
  done
  echo

  # 4. Date
  info "4/6 Datum"
  local date
  while true; do
    date="$(ask "Datum (YYYY-MM-DD)" "$(date +%F)")"
    [[ "$date" =~ $DATE_PATTERN ]] && break
    warn "Format je YYYY-MM-DD, npr. 2026-10-29."
  done
  echo

  # 5. Tags, shared by both languages
  info "5/6 Tagovi"
  local tags_input tag tags=()
  while true; do
    tags_input="$(ask "Tagovi odvojeni zarezom (npr. nextjs, css; Enter za bez tagova)")"
    tags=()
    local valid=true
    IFS=',' read -ra parts <<<"$tags_input"
    for tag in "${parts[@]}"; do
      tag="$(echo "$tag" | xargs)" # trim
      [[ -z "$tag" ]] && continue
      if [[ "$tag" =~ $TAG_PATTERN ]]; then
        tags+=("$tag")
      else
        warn "\"$tag\": samo mala slova, brojevi i crtice."
        valid=false
      fi
    done
    $valid && break
  done
  echo

  # 6. Cover
  info "6/6 Cover slika"
  local cover_src cover_dest
  while true; do
    cover_src="$(ask "Putanja do slike (jpg/png/webp; Enter za privremenu)")"
    cover_src="${cover_src/#\~/$HOME}"
    if [[ -z "$cover_src" ]]; then
      break
    elif [[ ! -f "$cover_src" ]]; then
      warn "Fajl ne postoji: $cover_src"
    elif [[ ! "${cover_src,,}" =~ \.(jpg|jpeg|png|webp)$ ]]; then
      warn "Podržani formati: jpg, png, webp."
    else
      break
    fi
  done
  echo

  # Summary before writing anything
  bold "Pregled"
  echo "  folder:  $CONTENT_DIR/$slug/"
  for lang in "${langs[@]}"; do
    echo "  $lang:      \"${titles[$lang]}\" → /$lang/blog/$slug"
  done
  echo "  datum:   $date"
  echo "  tagovi:  ${tags[*]:-(bez)}"
  echo "  cover:   ${cover_src:-privremena slika}"
  echo
  confirm "Napravi zapis?" Y || fail "Prekinuto, ništa nije napravljeno."

  # Write the files
  mkdir -p "$CONTENT_DIR/$slug"

  if [[ -n "$cover_src" ]]; then
    local ext="${cover_src##*.}"
    ext="${ext,,}"
    [[ "$ext" == "jpeg" ]] && ext="jpg"
    cover_dest="$CONTENT_DIR/$slug/cover.$ext"
    cp "$cover_src" "$cover_dest"
  else
    cover_dest="$CONTENT_DIR/$slug/cover.jpg"
    placeholder_cover "$cover_dest"
  fi

  local tags_js="[]"
  if [[ ${#tags[@]} -gt 0 ]]; then
    tags_js="[$(printf '"%s", ' "${tags[@]}" | sed 's/, $//')]"
  fi

  for lang in "${langs[@]}"; do
    local file="$CONTENT_DIR/$slug/index.$lang.mdx"
    {
      echo "export const meta = {"
      echo "  title: $(js_string "${titles[$lang]}"),"
      [[ -n "${descriptions[$lang]}" ]] && echo "  description: $(js_string "${descriptions[$lang]}"),"
      echo "  date: \"$date\","
      echo "  tags: $tags_js,"
      echo "};"
      echo
      "body_$lang"
    } >"$file"
    echo "  + $file"
  done
  echo "  + $cover_dest"
  echo
  bold "Gotovo."
  echo "Pokreni ./dev.sh dev i otvori:"
  for lang in "${langs[@]}"; do
    echo "  http://localhost:3000/$lang/blog/$slug"
  done
}

# New "## v<version> – <date>" entry at the top of CHANGELOG.md, listing the commit
# messages since CHANGELOG.md last changed (i.e. since the previous release commit)
write_changelog() {
  local version="$1" since range entries
  since="$(git log -1 --format=%H -- CHANGELOG.md 2>/dev/null || true)"
  range="${since:+$since..}HEAD"
  entries="$(git log --reverse --no-merges --format='- %s' "$range")"
  [[ -n "$entries" ]] || entries="- (no changes since the previous version)"

  node -e '
    const fs = require("fs");
    const [version, date, entries] = process.argv.slice(1);
    const file = "CHANGELOG.md";
    const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "# Changelog\n\n";
    const entry = `## v${version} – ${date}\n\n${entries}\n\n`;
    const at = text.indexOf("\n## ");
    fs.writeFileSync(file, at === -1 ? text.trimEnd() + "\n\n" + entry : text.slice(0, at + 1) + entry + text.slice(at + 1));
  ' "$version" "$(date +%F)" "$entries"
}

# Bump the version in package.json (+ lock file) and add a CHANGELOG.md entry;
# the footer shows the new version after a build
cmd_version() {
  local current type="${1:-}"
  current="$(node -p 'require("./package.json").version')"

  if [[ -z "$type" ]]; then
    # Show what each choice would become: 0.1.0 → patch 0.1.1 · minor 0.2.0 · major 1.0.0
    local preview
    preview="$(node -e '
      const [ma, mi, pa] = process.argv[1].split(".").map(Number);
      console.log(`patch → ${ma}.${mi}.${pa + 1}   (ispravke)\nminor → ${ma}.${mi + 1}.0   (nove mogućnosti)\nmajor → ${ma + 1}.0.0   (velike promene)`);
    ' "$current")"
    bold "Trenutna verzija: $current"
    echo "$preview"
    type="$(ask "Tip" "patch")"
  fi

  [[ "$type" =~ ^(patch|minor|major)$ ]] || fail "Tip mora biti patch, minor ili major."
  npm version "$type" --no-git-tag-version >/dev/null
  local next
  next="$(node -p 'require("./package.json").version')"
  write_changelog "$next"
  bold "Verzija: $current → $next"
  echo "Izmenjeni su package.json, package-lock.json i CHANGELOG.md (proveri i doteraj unos)."
  echo "Footer prikazuje v$next posle sledećeg build-a."
  echo "Commit i tag su na tebi, npr.:"
  echo "  git commit -am \"Release v$next\" && git tag v$next"
}

# Every post with its languages and date
cmd_posts() {
  local dir slug langs date
  for dir in "$CONTENT_DIR"/*/; do
    slug="$(basename "$dir")"
    langs="$(find "$dir" -maxdepth 1 -name 'index.*.mdx' -printf '%f\n' | sed 's/index\.\(.*\)\.mdx/\1/' | sort | tr '\n' ' ')"
    date="$(grep -m1 -oE 'date: "[^"]+"' "$dir"/index.*.mdx 2>/dev/null | head -1 | cut -d'"' -f2)"
    printf '%-12s %-30s %s\n' "${date:-?}" "$slug" "$langs"
  done | sort -r
}

# Everything CI would check: lint, types and a production build
cmd_check() {
  info "lint"
  npm run lint
  info "typescript"
  npx tsc --noEmit
  info "build"
  npx next build
}

cmd_help() {
  cat <<EOF
Upotreba: ./dev.sh <komanda>

  new     Novi blog zapis, korak po korak (jezici, naslov, slug, datum, tagovi, cover)
  posts   Lista zapisa sa datumom i jezicima
  version [patch|minor|major]
          Podigni verziju (bez argumenta pita), dopiši CHANGELOG.md;
          verzija se prikazuje u footeru
  dev     Razvojni server sa osvežavanjem (http://localhost:3000)
  build   Produkcioni build
  start   Build pa produkcioni server
  lint    ESLint
  check   Lint + TypeScript + build (sve što treba da prođe pre commit-a)
  help    Ova poruka
EOF
}

case "${1:-help}" in
  new) cmd_new ;;
  posts) cmd_posts ;;
  version) cmd_version "${2:-}" ;;
  dev) npm run dev ;;
  build) npx next build ;;
  start) npx next build && npx next start ;;
  lint) npm run lint ;;
  check) cmd_check ;;
  help | -h | --help) cmd_help ;;
  *)
    warn "Nepoznata komanda: $1"
    cmd_help
    exit 1
    ;;
esac
