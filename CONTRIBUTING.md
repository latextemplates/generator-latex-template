# Contributing

We love seeing people contribute patches to this project and the process is simple.
In general, we follow [GitHub's fork & pull request model](https://help.github.com/articles/fork-a-repo/).
The code has the license [BSD Zero Clause (`0BSD`)](LICENSE), the examples `CC0`.
This is nothing special, but important for users of the generator and the snippets.

**This repository is the place to contribute improvements to any of the [latextemplates](https://github.com/latextemplates) templates** — see [How the templates are generated](#how-the-templates-are-generated) below.

## How the templates are generated

The template repositories of the [latextemplates](https://github.com/latextemplates) organization —
[acm-enhanced](https://github.com/latextemplates/acm-enhanced),
[ieee-enhanced](https://github.com/latextemplates/ieee-enhanced),
[lncs-enhanced](https://github.com/latextemplates/lncs-enhanced),
[scientific-thesis-template](https://github.com/latextemplates/scientific-thesis-template),
[uni-stuttgart-dissertation-template](https://github.com/latextemplates/uni-stuttgart-dissertation-template), and
[markdown-latex-quickstart](https://github.com/latextemplates/markdown-latex-quickstart) —
do **not** contain hand-written LaTeX.
Their content is *generated* from the micro-templates in `generators/app/templates/` of this repository.

```text
generator-latex-template          <- you are here: the single source of truth
  generators/app/templates/*.tex  <- micro-templates (one file per package: preamble + example)
            |
            |  yo latex-template --documentclass=... --lang=... ...
            v
  acm-enhanced, ieee-enhanced, lncs-enhanced, scientific-thesis-template,
  uni-stuttgart-dissertation-template, markdown-latex-quickstart
```

Each template repository embeds this repository as a Git submodule at `generator-latex-template/`
and runs the generator in its `.github/workflows/update-files.yml` workflow.
Whenever someone bumps the submodule pointer, that workflow regenerates all variants of the template
(both languages, `listings`/`minted`, …) and commits the result.

**Consequence: a change made directly in a template repository is overwritten on the next regeneration.**
Therefore, improvements to the templates belong here:

| What you want to change | Where |
| --- | --- |
| LaTeX sources: packages, preamble configuration, examples, translations | **here** (`generators/app/templates/`) |
| `Makefile`, `Texlivefile`, `Dockerfile`, `_latexmkrc`, `README.md`, `.github/workflows/check.yml` of a template | **here** |
| `CHANGELOG.md`, `.github/workflows/update-files.yml`, `CONTRIBUTING.md` of a template | in that template repository |
| Bug reports and questions about one template | in that template repository (we move them here if needed) |

Background reading: [Oliver Kopp - The LaTeX template generator: How micro-templates reduce template maintenance effort](https://tug.org/TUGboat/tb44-2/tb137kopp-microtemplates.html) (TUGboat 44:2).

Repositories such as [svjour](https://github.com/latextemplates/svjour), [LNI](https://github.com/latextemplates/LNI),
[SAGP](https://github.com/latextemplates/SAGP), [scientific-thesis-cover](https://github.com/latextemplates/scientific-thesis-cover), or
[stys-for-overleaf](https://github.com/latextemplates/stys-for-overleaf) are **not** generated —
contribute to those directly in their own repository.

## Adding a new package

In case you found an interesting or [new LaTeX package on CTAN](https://ctan.org/ctan-ann), you might want to add it to the generator.

You need to craft two files and include a reference to them in `main.*.tex`.
The detailed steps are as follows:

1. `[package].premable.en.tex` - for the LaTeX commands of the preamble.
2. `[package].example.en.tex` - put examples in there
3. Add both `.tex` files to the appropriate place in `main.en.tex`
4. Find a similar place in `main.de.tex`. You don't need to provide a translation; include a reference to the English file.

## Updating `IEEEtranN-doi.bst`

`generators/app/templates/IEEEtranN-doi.bst` is `IEEEtranN.bst` from the [IEEEtran package](https://ctan.org/pkg/ieeetran) (version 1.14) with DOI output.
The changes are in `IEEEtranN-doi.bst.patch` next to it.
When the IEEEtran package ships a new `IEEEtranN.bst`, apply the patch to it:

```terminal
cp "$(kpsewhich IEEEtranN.bst)" generators/app/templates/IEEEtranN-doi.bst
patch generators/app/templates/IEEEtranN-doi.bst < generators/app/templates/IEEEtranN-doi.bst.patch
```

## Contributing a translation

1. Find a `.en.tex` file without a corresponding `.de.tex` file.
2. Copy the `.en.tex` to a correspinding `.de.tex` file.
3. Translate the content of the `.de.tex` file.
4. Change the file reference in `main.de.tex`.

## Development hints

- Templating language: <https://ejs.co/>
- Conditional questions: <https://stackoverflow.com/a/18706640/873282>.
- Types of prompts: <https://github.com/SBoudrias/Inquirer.js#prompt-types>
  - E.g., [Question](https://github.com/SBoudrias/Inquirer.js#question)
- Add a new question
  - Also adapt `__tests__/app.js`
  - Execute tests with `npm test` (runs ESLint, then the tests via Node's built-in test runner). A bare run is `node --test`.
- Update npm dependencies
  - `npx npm-update-all`. See [FreeCodeCamp](https://www.freecodecamp.org/news/10-npm-tricks-that-will-make-you-a-pro-a945982afb25/) for more details.
  - `npx npm-check-updates -u`. [[Source](https://www.carlrippon.com/upgrading-npm-dependencies/)]
  - See <https://github.com/yeoman/generator/releases> for changes in the generator.
  - Generate `package-lock.json` only: `npm i --package-lock-only`
- When one encounters `Cannot find module 'yeoman-generator'`, please update the npm dependencies.
  That error occurred when using version `4.13.0` and `5.4.2` was available.
- In case of the error "Error: EACCES, permission denied '/root/.config/configstore/insight-yo.json'", one needs to execute `chmod g+rwx /root /root/.config /root/.config/configstore`
- Check GitHub Actions
  - Use [actionlint](https://github.com/rhysd/actionlint#readme)
  - Use [Visual Studio Code GitHub Actions extension](https://marketplace.visualstudio.com/items?itemName=cschleiden.vscode-github-actions)
  - Use [act](https://github.com/nektos/act) for checking: `act --rm --platform ubuntu-latest=fwilhe2/act-runner:latest -W .github/workflows/check-ieee-conference-a4-pdflatex-bibtex-2023-true.yml`
- When adding a new package use `DEPP` (see above) or execute following steps:
  1. execute `npx` with `--generatereitzig` (in a clean directory)
  2. run `pdflatex`
  3. run `{repository-root}/generate-texlivefile.sh`
  4. copy `Texlivefile` to the root of the `{repository-root}/generators/app/templates`
  5. adapt `Texlivefile` as required
- When issues with the template occur: `npx ejs-lint main.en.tex`
- Cancel workflows:
  - `gh run list -L 100 --json databaseId -s queued -R latextemplates/generator-latex-template | jq -r '.[] | .databaseId' | awk '{gsub(/\\r\\n/,RS)} 1' | while read -r run_id; do gh run cancel "$run_id" -R latextemplates/generator-latex-template || true; done`
  - `gh run list -L 100 --json databaseId -s in_progress -R latextemplates/generator-latex-template | jq -r '.[] | .databaseId' | awk '{gsub(/\\r\\n/,RS)} 1' | while read -r run_id; do gh run cancel "$run_id" -R latextemplates/generator-latex-template || true; done`
- Update submodule of "derived" templates (LNCS, ...): `scripts/spread-updates.sh`. It also links the generator's `refine-ltg` PR in the description of each template's "Update LTG" PR.
- Keep the `refine-ltg` PR description current: it links every issue the cycle fixes (the same `[repo#N]` links as the CHANGELOG).
- Sort `dot.aspell.en.pws`: `cat dot.aspell.en.pws | (sed -u 1q; sort) | sponge dot.aspell.en.pws` <!-- hint by https://stackoverflow.com/a/56151840/873282 -->

### Testing

- All workflows test `overleaf=no` - and (nearly) all possible combinations.
- All `*-refined` repositories test with `overleaf=true` - and only the typical settings for the template.
- `refine-ltg` is the development branch for the template generator; only a small set of workflows enabled there due to load during testing.
- `update-ltg` is the development branch at each `*-refined` template.

### Test locally

- Create empty directory ("target directory")
- Change to the target directory
- Run `npx yo <path-to-git-repository>/generators/app/index.js`. Background: Starting from 5.0.0 on, [one needs to specify the full path to index.js](https://github.com/yeoman/yo/issues/797#issuecomment-2541794625).
- Windows: `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js`

#### Linux

Set the parameters on the command line

- LNCS: `npx yo /tmp/repo/generators/app/index.js --documentclass=lncs --papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2026 --docker=false --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`

#### Windows

Set the parameters on the command line

- IEEE template (with pdflatex and bibtex): `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=ieee --ieeevariant=conference --papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2026 --docker=reitzig --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`
- LNCS template (with pdflatex and bibtex): `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=lncs ---papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2026 --docker=false --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`
- Scientific Thesis template: `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=scientific-thesis --papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2026 --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`
- USTUTT template: `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=ustutt --papersize=a5 --latexcompiler=lualatex --bibtextool=biblatex --texlive=2026 --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=todonotes --examples=true --howtotext=true` -- `todonotes` is the preferred TODO package here.

<!-- markdownlint-disable-next-line MD004 -->
* Run `latexmk` to build the PDF

##### Using DEPP

To fire up a TeX Live installation and use the [Dependency Printer for TeX Live](https://gitlab.com/islandoftex/texmf/depp) to refine `Texlivefile`, execute following steps:

```cmd
docker run -it --rm -v c:\temp\ltg:/ltg registry.gitlab.com/islandoftex/images/texlive:latest
```

```bash
cd /tmp
git clone https://gitlab.com/islandoftex/texmf/depp.git
cd depp
l3build install
cd /ltg
# edit paper.tex and add `\RequirePackage[dependency-file=Texlivefile]{depp}`
lualatex/pdflatex paper
```

##### Running reitzig

1. `docker build --progress=plain -t reitzig -f Dockerfile .`
2. `docker run -it --rm -v c:\temp\ltg:/work/src -v c:\temp\ltg-out:/work/out reitzig work latexmk`

### Useful snippets

```ejs
<% if (howtotext) { -%>
<% } else { -%>
<% } -%>
```

```ejs
<% switch (documentclass) { case "lncs": -%>
<% break; case "ieee": -%>
<% break; default: -%>
<% break; } -%>
```

### Debugging

The repository contains a `launch.json` for Windows and Visual Studio Code.
Press <kbd>F5</kbd> and the generator should run in debug mode.

```terminal
ejslint.cmd c:\git-repositories\latextemplates\generator-latex-template\generators\app\templates\main.en.tex
```

### Releasing a new version

> **Cut the release from `main`, never from `refine-ltg`.**
> Releasing from the dev branch publishes an unmerged tree with a not-yet-finalized CHANGELOG — that is what broke the 2026.6.26 release (a stale `## [2026.6.25]` heading, a missing `[2026.6.26]:` compare link, and an `[Unreleased]:` link that was never bumped).
> So after the squash-merge, `git switch main && git pull` and confirm `git branch --show-current` prints `main` before doing anything below.

1. Once the `refine-ltg` PR is green, **squash-merge** it into `main`, then `git switch main && git pull` (confirm you are on `main`).
2. Update `CHANGELOG.md`: rename the top `## [Unreleased]` heading to `## [<version>]`, add the matching `[<version>]: …/compare/<prev>...<version>` link definition, and bump `[Unreleased]: …/compare/<version>...main`.
3. **Verify the CHANGELOG before publishing:**
   - Run heylogs (the same check as CI's `check-changelog.yml`) and get **0 problems**:
     `jbang com.github.nbbrd.heylogs:heylogs-cli:0.18.1:bin check CHANGELOG.md`
   - heylogs **cannot** validate the version links here: our CalVer headings omit the date, so `linkable`/`date-displayed`/`all-h2-contain-a-version` are off in `heylogs.properties` and heylogs skips link-checking a dateless heading. So **also check the links by hand** — the top `## [<version>]` must equal the version `release-it` will publish, and both the `[<version>]:` and the bumped `[Unreleased]:` definitions must be present and point at the right tags. Quick grep:
     `grep -nE '^## \[|^\[Unreleased\]:|^\[<version>\]:' CHANGELOG.md`
4. Update `package.json`, publish to [npmjs](https://www.npmjs.com/package/generator-latex-template), create GitHub release.
   Use [release-it](https://www.npmjs.com/package/release-it) (do not create a release on GitHub) and [github-release-from-changelog](https://www.npmjs.com/package/github-release-from-changelog).

   - `npx release-it`
   - Confirm the publish: `npm view generator-latex-template version` must print the new version (2026.10.1 got a tag and a GitHub release but never reached npm).
   - `GITHUB_TOKEN=$(gh auth token) npx github-release-from-changelog` (Git Bash; it needs a GitHub token, which the logged-in `gh` CLI provides)
5. On `main`, run `scripts/end-new-cycle.sh`, then **squash-merge** each template's "Update LTG" PR once it is green.
6. Release the templates: `scripts/release-templates.sh <YYYY-MM-DD>` (try `--dry-run` first) finalizes the CHANGELOG of every template with unreleased entries, commits `Release <date>`, tags, pushes, and creates the GitHub release with the CHANGELOG section as notes.
