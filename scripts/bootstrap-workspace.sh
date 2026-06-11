#!/bin/bash
# Bootstrap the full latextemplates workspace on a blank machine.
#
# Entry point: clone THIS repo, then run this script from it:
#   git clone git@github.com:latextemplates/generator-latex-template.git
#   ./generator-latex-template/scripts/bootstrap-workspace.sh
#
# It clones every org repo as a FLAT SIBLING of this repo (the layout the cycle
# scripts require), initializes submodules, installs npm deps, and drops a
# workspace-root CLAUDE.md that imports this repo's CLAUDE.md so any session
# launched at the workspace root picks up the operating model.
#
# Prerequisites (verified below):
#   - git
#   - gh (GitHub CLI) authenticated with access to the latextemplates org:
#       gh auth login          # choose SSH; register/generate a key
#   - An SSH key registered on GitHub (clones use git@github.com:)
#   - Node.js >= 18 and npm
set -euo pipefail

# Resolve this repo's dir, then operate in its PARENT (the workspace root).
repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
workspace="$(dirname "$repo_dir")"
cd "$workspace"
echo "==> Workspace: $workspace"

echo "==> Checking prerequisites"
for bin in git gh node npm; do
  command -v "$bin" >/dev/null || { echo "Missing: $bin"; exit 1; }
done
gh auth status >/dev/null || { echo "Run: gh auth login"; exit 1; }

echo "==> Cloning all latextemplates repos via SSH (flat siblings)"
gh repo list latextemplates --limit 200 --json sshUrl -q '.[].sshUrl' \
  | while read -r url; do
      name=$(basename "$url" .git)
      if [ -d "$name/.git" ]; then
        echo "   exists: $name (pulling)"; git -C "$name" pull --ff-only --prune || true
      else
        git clone "$url"
      fi
    done

echo "==> Initializing the generator submodule in the consuming templates"
for t in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template; do
  [ -d "$t" ] || continue
  echo "   $t"
  git -C "$t" submodule update --init --recursive
done

echo "==> Installing generator npm dependencies"
( cd generator-latex-template && npm ci )

echo "==> Writing workspace-root CLAUDE.md (imports the generator's)"
printf '@generator-latex-template/CLAUDE.md\n' > CLAUDE.md

echo "==> Done. See generator-latex-template/CLAUDE.md for the cycle / dependabot workflow."
