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
   This repo's own committed workflows are already lean (`check-make.yml`,
   `check-changelog.yml`, `test.yml`, `automerge.yml`) — the per-variant LaTeX `check-*.yml`
   matrix is **no longer committed** (see "CI & testing in this repo" below), so there is
   nothing heavy to prune here.
2. **Develop + propagate** — make the change on `refine-ltg` (e.g. bump the `--texlive`
   default, edit `generators/app/templates/...`, the workflows, or `Texlivefile`). After
   each meaningful change run `scripts/spread-updates.sh` (on `refine-ltg`): pushes
   `refine-ltg` and resets every template's submodule to `origin/refine-ltg`, commits
   "Update LTG", pushes. The draft "Update LTG" PRs then show regenerated output and run
   CI (the lean committed workflows). Iterate until CI is green.
3. **Verify generation** — the switch-combination coverage is the `npm test` generation
   check (pairwise) and `npm run test:all` (full matrix); confirm these are green for the
   change. The full per-variant **LaTeX compile** matrix is no longer committed — if you
   want a real compile pass over all variants for this cycle, regenerate it on demand
   (`cd .github && python3 generate-workflows.py`, see "CI & testing in this repo") and
   delete it again before merging unless you intend to ship it on `main`.
4. **End** — merge `refine-ltg` → `main`, cut the release (README → "Releasing a new
   version": `release-it`, publish to npm). Then, on `main`: run
   `scripts/end-new-cycle.sh` — repoints every template's submodule to `origin/main` and
   commits/pushes. The templates' "Update LTG" PRs are now merge-ready; merge them.

The list of variants (documentclasses, `texlives`, fonts, …) is defined in **two places
that must be kept in sync**: the top of `.github/generate-workflows.py` (drives the LaTeX
matrix) and `__tests__/matrix.js` (drives the `npm test` generation check). Adding e.g. a
TeX Live year means adding it to `texlives` in **both** (already `[2025, 2026]`).

**Identifying mid-cycle state:** if this repo has an open `refine-ltg` PR and the templates
have open `update-ltg` "Update LTG" PRs, a cycle is in progress — continue on `refine-ltg`,
propagate with `spread-updates.sh`, then release + `end-new-cycle.sh`. (The committed
workflow set is lean in normal state too, so it is no longer a cycle signal.)

## CI & testing in this repo

The committed workflows are lean: `test.yml` (two jobs — `npm test` = ESLint + the
`node --test` pairwise suite, and `npm run test:all` = full matrix), `check-make.yml` (one
LaTeX **compile** smoke build), `check-changelog.yml`, `automerge.yml`. There is **no
per-variant LaTeX/MiKTeX matrix committed** — it was removed in favour of a fast,
LaTeX-free generation check:

- **`npm test`** runs the generator across a **pairwise** subset of the switch matrix and
  asserts it produces output (any EJS/template error fails). Fast (~seconds). Runs as the
  `ESLint + Tests` CI job.
- **`npm run test:all`** runs the **full** matrix (`__tests__/combinations.all.js`, 7680
  runs, ~1.5 min). Not part of `npm test` (named so `node --test` skips it locally), but it
  **does** run in CI as the `Full matrix` job on every push/PR.
- Both share `__tests__/matrix.js` (the matrix definition + a greedy all-pairs selector).

This proves the generator *generates* for every combination; it does **not** prove the
output *compiles* — only LaTeX does that, and `check-make.yml` is the lone compile build.
The full LaTeX compile matrix can be regenerated on demand from
`.github/generate-workflows.py` (kept in place): `cd .github && python3 generate-workflows.py`
writes `workflows/check-*.yml` (tracked) and `workflows/miktex-check-*.yml` (gitignored,
never committed). Re-running it brings the heavy matrix back; delete the `check-*.yml`
again to return to the lean state.

## Adding a package or example (wire every place, or a variant silently drops it)

The generated document is assembled from micro-templates; a new LaTeX package or
example section has to be wired in **lockstep** across several files. Miss one and
the feature vanishes for some switch combination without any error.

1. **Content** — add/extend `generators/app/templates/<name>.example.<lang>.tex`
   (the demo body) and/or `<name>.preamble.<lang>.tex` (the `\usepackage`). Example
   bodies use the `<%- bexample %> … <%- eexample %>` convention (=
   `\begin{ltgexample}…\end{ltgexample}`), which **runs the body in place and echoes
   its own source lines** — it is *not* the old `latexdemo`/`\PrintDemo`. Most examples
   are a single shared `.en` file included from both mains. Give each feature its **own**
   `<feature>.preamble.<lang>.tex` (one concern per file — e.g. `tikz.preamble`,
   `longtable.preamble`, `uml.plantuml.preamble`), **not** a catch-all "examples" preamble.
   **Config vs. demo:** a package a feature needs to *work* belongs in that feature's
   config preamble and is loaded wherever the feature is on; a package that only *renders
   a demo* is the example's own concern. So `\mathbb` (a real feature) is provided by
   `math.preamble.en.tex` — `\@ifundefined{mathbb}{\usepackage{amssymb}}{}`, guarded
   because `amssymb` clashes with `mathdesign`/`newtxmath`/`unicode-math` — and the math
   *example* is then gated to where `math.preamble` is included (`isThesis ||
   feature.abbreviations`), so LNCS etc. don't reference an undefined `\mathbb`.
2. **Wire the includes into `main.en.tex` AND `main.de.tex`.** Example includes go in
   the `LaTeX Hints` chapter (the whole chapter is already guarded by
   `<% if (examples) %>`); package loads go in the preamble area. Guard each with the
   right condition (`isThesis`, a switch value, …) — and gate an example to where the
   config that makes it compile is present.
3. **`Texlivefile`** — add the TeX Live package name, guarded (usually
   `githubpublish || <condition>`; `githubpublish` deliberately bundles everything).
4. **Shell-escape is derived, never hardcoded.** It is the boolean
   `requiresShellEscape` in `index.js` (`listings == "minted" || uml == "plantuml"`).
   Extend that expression if the new package needs `\write18`; the `latexmkrc` and the
   `main.*.tex` editor hints read the flag.
5. **New user switch?** Decide **prompt vs. plain flag** first:
   - A **prompt** in `options.js` (scope with `when()`, give a `default`) is interactive
     and nice for discovery — but **every** template's `update-files.yml` that satisfies
     its `when()` must pass the flag (like `--todo`), or the non-interactive `yo` run in CI
     blocks on the prompt and fails. So a thesis-only prompt (e.g. `uml`) means
     `scientific-thesis-template` *and* `uni-stuttgart-dissertation-template` need
     `--uml=…` added to their (template-managed) `update-files.yml`.
   - A **plain CLI flag** read from `this.options` in `index.js` with a default (e.g.
     `longtable`) never prompts, so it never breaks CI and needs no `update-files.yml`
     change — at the cost of interactive discovery.
   Either way default it in `index.js` (prompt: `if (!this.props.x) this.props.x = "none";`
   / flag: read `this.options.x` with a fallback), and if it's a prompt add the axis to
   `__tests__/matrix.js` **and** the list in `.github/generate-workflows.py` (kept in
   sync). Model on the `todo` / `uml` (prompt) and `longtable` (flag) options.
6. **Not in TeX Live** (e.g. `tikz-uml`) — guard usage with
   `\IfFileExists{<pkg>.sty}{…}{…}` so a plain `npx`/submodule-less generation still
   compiles (it just skips the demo). Provide the package via a git submodule +
   `TEXINPUTS` (in `latexmkrc`) and a recursive checkout in the generated `check.yml`,
   and document the setup in `README.en.md`. External-tool packages (PlantUML needs
   Java) also need the tool installed in `check.yml` and `--shell-escape`.

**Verify (LaTeX-free first, then compile):** `npx ejs-lint <file>` on every changed
EJS template; run **`npm test`**, not `node --test` directly — `npm test`'s `pretest`
runs `eslint .` (incl. `prettier`), which `node --test` skips, so a prettier-only nit
in `index.js`/`options.js` passes locally but fails CI (run `npx eslint --fix .` to
match the formatter). `npm test` is the pairwise suite; `npm run test:all` is the full
matrix. Then generate locally with the **exact** `update-files.yml` flags (a missing
required option such as `acmformat` or `todo` drops you into an interactive prompt,
which reads as a hang) and grep the output. Sanity-compile new `.tex` in a *minimal
standalone* document (the full thesis pulls in packages a local TeX Live may lack);
`perl -c` the generated `latexmkrc`; validate the generated `check.yml` as YAML. The
`check-make.yml` build also runs `make format` (latexindent) + `git diff --exit-code`,
so generated output must already be latexindent-clean — column-aligned tables in
particular (see `lookForAlignDelims` in `localSettings.yaml`).

### EJS whitespace: `-%>` eats the trailing newline

Almost every control tag ends with `-%>` (the EJS "newline slurp"): `<% if (…) { -%>`,
`<% } -%>`, `<% switch/case/break … -%>`, and `<%- include('…', this); -%>`. That slurp
is deliberate — it keeps the control flow (and the include statements themselves) from
emitting stray blank lines into the generated `.tex`. A plain `<% } %>` (no dash) leaves
its newline and can inject an unwanted blank line, so the convention is the dashed form;
only use plain `%>` when you actually want that newline.

The consequence (and a real footgun): **the blank-line layout of the output is not the
layout of the source.** Because `-%>` eats one trailing newline, two adjacent
`-%>`-terminated blocks/includes render with **no** blank line between them. To get a
blank line between blocks you need one of:
- the first block's file to **end with a trailing blank line** (how most
  `*.preamble.*.tex` separate themselves — e.g. `font.preamble` ends with a blank line
  then `<% } -%>`), **or**
- an **explicit blank line in the source** between the two `-%>` tags (the `-%>` eats one
  newline, the remaining one + the content's own trailing newline = a blank line).

This is exactly the `nowidow` bug: it followed `microtype.preamble`, which does *not* end
with a trailing blank, and the include `-%>` ate the source newline — so the block butted
against microtype until an explicit blank line was added between the two includes. When a
generated block is missing/extra a blank line, this slurp interaction is the first thing
to check.

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

**Exception — `update-files.yml`:** this workflow is template-managed (NOT generated).
Apply Dependabot bumps that touch it directly on each template's `main`; Dependabot then
auto-closes. `check.yml` IS generated → handle it here in the generator.

## CHANGELOG discipline — mirror generator-sourced changes

When a template's `update-ltg` PR shows a bot regeneration, decide CHANGELOG entries
**semantically** — the bot can't tell which regenerated lines are user-facing (this is a
Claude step, not a mechanical copy). Then **mirror where appropriate**:

- A change that originates **here** (in `generators/app/templates/…`) but surfaces in a
  template (e.g. the example author name on the scientific-thesis title page) gets an entry
  in **both** this generator's `CHANGELOG.md` (source of truth) **and** the affected
  template's `CHANGELOG.md` (its users). Phrase each for that audience.
- Template-only changes (template-managed files like `update-files.yml`, vendored `.sty`)
  → only the template's CHANGELOG.
- Generator changes not surfaced in any one template → only this CHANGELOG.

Format is enforced org-wide by `check-changelog.yml` (heylogs); each repo's
`heylogs.properties` turns off the rules that don't fit our CalVer-with-history CHANGELOGs.

## CI: the generated `check.yml` needs a PAT to be pushed

The `Update Files` bot in each template regenerates `check.yml` and pushes it. The default
`GITHUB_TOKEN` **cannot** push `.github/workflows/**` ("refusing to allow a GitHub App to
create or update workflow … without `workflows` permission"), so the `generatetex`
checkout must use a PAT: `token: ${{ secrets.GH_TOKEN_WRITE }}` (org secret). All five
templates now have this on their `generatetex` checkout. If a template ever lacks it, its
`update-ltg` PR fails on "Push changes" — fix the token on that template's `main`, or as a
one-off port `check.yml` to `update-ltg` by hand (human/SSH push is allowed); the exact
diff is printed in the failing run's "Prepare files" step, canonical variant **en + minted**.

## Runbook — commands

- **Bootstrap a blank machine:** `generator-latex-template/scripts/bootstrap-workspace.sh`
  (clones the org flat, **inits submodules**, `npm ci`). Node via nvm: `nvm install --lts`.
- **Init submodules** (required before `spread-updates.sh` on fresh clones):
  `for t in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template; do git -C "$t" submodule update --init; done`
- **Propagate generator → templates:** from this repo on `refine-ltg`, `scripts/spread-updates.sh`
  (pushes `refine-ltg`, repoints each template's submodule to `origin/refine-ltg`, opens/updates
  the `update-ltg` "Update LTG" commits). Each template's working tree must be clean first
  (`git -C <t> submodule update` to clear a dirty submodule pointer after a branch switch).
- **Run the generation tests:** `npm test` (ESLint + pairwise combination check) and, for
  the full matrix, `npm run test:all`. Keep `__tests__/matrix.js` in sync with
  `generate-workflows.py`.
- **Regenerate the LaTeX matrix** (optional/on demand — not committed by default):
  `cd .github && python3 generate-workflows.py`.
- **Generate one template locally** (e.g. to inspect/port `check.yml`), from an empty dir —
  use the *exact* flags from that template's `update-files.yml` (incl. `--texlive` and any
  `--thesisvariant`/`--ieeevariant`): `yeoman_test=true yo <repo>/generators/app/index.js --documentclass=… --texlive=… --lang=en --listings=minted …`.
- **Lint an EJS template:** `npx ejs-lint generators/app/templates/<file>`.

## Local LaTeX testing

See README → "Test locally" / DEPP / reitzig. Quick form, from an empty target dir:
`npx yo <path-to-this-repo>/generators/app/index.js --documentclass=... --texlive=... ...`.

[Yeoman]: https://yeoman.io/
