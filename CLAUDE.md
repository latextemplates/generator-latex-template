# latextemplates — operating model for Claude

This repo, **`generator-latex-template`**, is the **single source of truth** for the
`latextemplates` GitHub org. The concrete templates do not contain hand-written
`.tex`/workflow content meant to be edited directly — their content is *generated* from
this repo's micro-templates. **Fix things here and propagate; never fix a generated repo
in place.**

Sessions normally run from a **flat workspace** that holds this repo and its sibling
template repos as direct children (canonical path
`.../git-repositories/latextemplates/<repo>`). The cycle scripts below depend on that
layout. To create the workspace on a blank machine, run
`scripts/bootstrap-workspace.sh` (see its header for prerequisites: `gh` auth, SSH key,
Node ≥18).

## Repo roles

- **`generator-latex-template`** — the [Yeoman] generator (Node; npm package
  `generator-latex-template`). Source of truth. Branches: `main` (released, published to
  npm) and `refine-ltg` (development branch for the current cycle).
- **Consuming templates** — embed this repo as a **git submodule** at path
  `generator-latex-template`, and have branches `main` + `update-ltg` (per-template dev
  branch where the submodule pointer is bumped). These are exactly the dirs the scripts
  glob as `*-enhanced scientific-thesis-template uni-stuttgart-dissertation-template`:
  - `acm-enhanced`, `ieee-enhanced`, `lncs-enhanced`
  - `scientific-thesis-template`
  - `uni-stuttgart-dissertation-template`
- **Everything else in the org** (`latextemplates.github.io`, `svjour`, `LNI`,
  `LNI-archive`, `SAGP`, `gadr-latex-packages`, `stys-for-overleaf`,
  `Handin-LaTeX-template`, `scientific-thesis-cover`, `uni-stuttgart-dissertation-cover`)
  is standalone — not part of the generator cycle.

## The update cycle (e.g. "support TeX Live 2026", or any generator change)

All cycle scripts live in `scripts/` and must be run with **this repo as the working
directory** — they `cd ..` to iterate the sibling templates, so the flat workspace
layout is a hard requirement.

1. **Begin** — on `refine-ltg`: run `scripts/begin-new-cycle.sh`. For each template:
   reset to `main`, create `update-ltg`, point its submodule at this repo's `refine-ltg`,
   commit "Begin refinement", push, and open a **draft** PR titled "Update LTG".
   Then **prune CI** to speed it up during the cycle: delete every workflow in
   `.github/workflows/` **except `check-make.yml` and `automerge.yml`** (the generated
   `check-*.yml`/`miktex-check-*.yml` matrix is huge). Work against just those two.
2. **Develop + propagate** — make the change on `refine-ltg` (e.g. bump the `--texlive`
   default, edit `generators/app/templates/...`, the workflows, or `Texlivefile`). After
   each meaningful change run `scripts/spread-updates.sh` (on `refine-ltg`): pushes
   `refine-ltg` and resets every template's submodule to `origin/refine-ltg`, commits
   "Update LTG", pushes. The draft "Update LTG" PRs then show regenerated output and run
   CI (the two kept workflows). Iterate until CI is green.
3. **Regenerate workflows** — once the work is done, restore the full CI matrix:
   `cd .github && python3 generate-workflows.py` (it writes `workflows/check-*.yml` and
   `workflows/miktex-check-*.yml` relative to `.github/`; it does **not** touch
   `check-make.yml`/`automerge.yml`). Commit, push, and confirm the full matrix is green.
4. **End** — merge `refine-ltg` → `main`, cut the release (README → "Releasing a new
   version": `release-it`, publish to npm). Then, on `main`: run
   `scripts/end-new-cycle.sh` — repoints every template's submodule to `origin/main` and
   commits/pushes. The templates' "Update LTG" PRs are now merge-ready; merge them.

The list of generated variants (documentclasses, `texlives`, fonts, …) lives at the top
of `.github/generate-workflows.py` — e.g. adding a TeX Live year means adding it to
`texlives` there (already `[2025, 2026]`).

**Identifying mid-cycle state:** if this repo has an open `refine-ltg` PR, the templates
have open `update-ltg` "Update LTG" PRs, and `.github/workflows/` is pruned to just
`check-make.yml` + `automerge.yml`, a cycle is in progress — continue on `refine-ltg`,
propagate with `spread-updates.sh`, then regenerate workflows + release + `end-new-cycle.sh`.

## Dependabot policy — port, do not merge

Dependabot opens PRs against the **concrete templates** (e.g. a GitHub Action bump in
`acm-enhanced`). **Do not merge these in the template** — the change is wiped on the next
generation. Instead:

1. Identify what the bump touches (workflow action version, npm dep, TeX Live, etc.).
2. Apply the equivalent change **here** on `refine-ltg` — in the relevant template source
   (`generators/app/templates/...`, this repo's own workflows, `package.json`, or
   `Texlivefile`). Use `patch-package` (`patches/`) when a transitive dep needs patching
   rather than a direct edit.
3. Propagate via `spread-updates.sh`; the regenerated templates carry the bump.
4. After `end-new-cycle.sh` + merges, **close the original Dependabot PR** (superseded).

## Local LaTeX testing

See README → "Test locally" / DEPP / reitzig. Quick form, from an empty target dir:
`npx yo <path-to-this-repo>/generators/app/index.js --documentclass=... --texlive=... ...`.

[Yeoman]: https://yeoman.io/
