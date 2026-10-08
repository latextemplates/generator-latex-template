#!/bin/bash
# Release every consuming template whose main CHANGELOG has a non-empty "## [Unreleased]" section
# (cycle step 5 in CLAUDE.md / README "Releasing a new version").
# Run from this repo's directory after the templates' "Update LTG" PRs are merged.
#
# Usage: scripts/release-templates.sh <YYYY-MM-DD> [--dry-run]
#   For each template: rename "## [Unreleased]" to "## [<date>]", add the "[<date>]:" compare link,
#   bump the "[Unreleased]:" link, check with heylogs, commit "Release <date>", tag, push, and create
#   the GitHub release with the CHANGELOG section as notes.
#   --dry-run shows the CHANGELOG diff and the notes, then reverts; nothing is committed or pushed.
set -euo pipefail
date="$1"
dry="${2:-}"
notes_dir=$(mktemp -d)
cd ..
for t in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template markdown-latex-quickstart; do
  echo "== $t"
  cd "$t"
  if [ -n "$(git status --porcelain)" ]; then echo "   working tree not clean, skipping" >&2; cd ..; continue; fi
  git checkout -q main && git pull -q && git submodule update -q
  if git rev-parse -q --verify "refs/tags/$date" >/dev/null; then echo "   tag $date exists, skipping"; cd ..; continue; fi
  notes=$(awk '/^## \[Unreleased\]/{f=1;next} /^## \[/{f=0} f' CHANGELOG.md | sed -e '1{/^$/d}' -e '${/^$/d}')
  if ! printf '%s\n' "$notes" | grep -q '[^[:space:]]'; then echo "   nothing unreleased, skipping"; cd ..; continue; fi
  prev=$(grep -m1 '^\[Unreleased\]: ' CHANGELOG.md | awk -F'compare/' '{print $2}' | cut -d. -f1)
  if [ -z "$prev" ]; then echo "   cannot determine the previous tag from the [Unreleased] link, skipping" >&2; cd ..; continue; fi
  echo "   previous release: $prev"
  awk -v d="$date" -v p="$prev" -v r="https://github.com/latextemplates/$t" '
    $0=="## [Unreleased]" {print "## [" d "]"; next}
    index($0,"[Unreleased]: ")==1 {print "[Unreleased]: " r "/compare/" d "...HEAD"; print "[" d "]: " r "/compare/" p "..." d; next}
    {print}' CHANGELOG.md > CHANGELOG.tmp && mv CHANGELOG.tmp CHANGELOG.md
  jbang com.github.nbbrd.heylogs:heylogs-cli:0.18.1:bin check CHANGELOG.md 2>/dev/null | tail -1 | sed 's/^/   heylogs: /'
  printf '%s\n' "$notes" > "$notes_dir/$t.md"
  if [ "$dry" = "--dry-run" ]; then
    git --no-pager diff CHANGELOG.md | grep '^[+-]' | grep -v '^+++\|^---' | sed 's/^/   /'
    echo "   notes: $(wc -l < "$notes_dir/$t.md") lines -> $notes_dir/$t.md"
    git checkout -q CHANGELOG.md
    cd ..
    continue
  fi
  git add CHANGELOG.md
  git commit -q -m "Release $date"
  git tag "$date"
  git push -q && git push -q origin "$date"
  gh release create "$date" --title "$date" --notes-file "$notes_dir/$t.md"
  cd ..
done
