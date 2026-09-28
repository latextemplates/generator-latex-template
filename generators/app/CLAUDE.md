<!-- Loaded automatically when Claude works on files under generators/app/. Moved from the repository root CLAUDE.md. -->

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

### Compile gotchas the single-variant local test misses

`npm test` only checks that the generator *generates*; the **multi-variant template
builds** (each `update-ltg` PR compiles every `main*.tex` for both languages and several
formats) catch things a single local `yo` + compile does not. Two that have bitten:

- **Two-column layouts can't use `longtable`** ("longtable not in 1-column mode"). IEEE and
  the ACM `sigconf`/`sigplan`/`acmtog` formats are two-column, so any `longtable` (or other
  one-column-only) example must be gated on `!twocolumn` (a derived prop in `index.js`:
  `documentclass == "ieee" || (acmart && acmformat ∈ {acmtog,sigconf,sigplan})`). Single-column
  figures (`figure`, not `figure*`) are fine in two columns.
- **A template repo ships ONE shared `abbreviations.tex`** — the `update-files.yml` "Prepare
  files" step keeps only one variant's copy (e.g. the `en`+minted one), and **every** main
  file (English *and* German) does `\input{abbreviations}`. So a glossary entry used by any
  language's example must be defined in **both** `abbreviations.en.tex` and
  `abbreviations.de.tex` (the unused one just never appears in that document's list). Making
  `\gls` entries language-exclusive breaks the other language's variant with
  "Glossary entry `…' has not been defined". The same single-shared-file logic applies to
  other `this.fs.copy`'d siblings (`commands.tex`, …).
