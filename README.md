# LaTeX Template Generator [![npm version](http://img.shields.io/npm/v/generator-latex-template.svg?style=flat)](https://npmjs.org/package/generator-latex-template "View this project on npm")

> Generates latex templates (e.g., for thesis, workshops, conferences, IEEEtran, LNCS, ...) out of "micro-templates"

## Talks and papers

- Paper: [Oliver Kopp - The LaTeX template generator: How micro-templates reduce template maintenance effort](https://tug.org/TUGboat/tb44-2/tb137kopp-microtemplates.html)
- Talk: [Oliver Kopp - The LaTeX Template Generator - DANTE Herbsttagung 2019](https://github.com/dante-ev/Vortraege_Tagungen/blob/master/2019-Herbst/Oliver%20Kopp%20-%20The%20LaTeX%20Template%20Generator%20-%20dante2019-herbst.pdf) - a talk on the motivation, user experience, and the contribution

## Background information

There are many latex templates out there.
All of them make use of certain packages such as [hyperref], [listings], or [minted].
The packages have to be a) included in the `.tex` file somehow and b) configured.
Moreover, some packages offer interfaces (such as new commands or new environments) to users.
Minimal examples help to understand how a package works.

The aim of the repository is to provide for each common latex package

1. Configuration
2. Usage example

and a generation into templates:

1. Support for [ACM](https://ctan.org/pkg/acmart), [IEEE](https://ctan.org/pkg/ieeetran), LNCS, [KOMA-Script](https://ctan.org/pkg/koma-script)
2. Support for separate documents which require `--shell-escape` and not.
3. Support for integrated pdflatex and lualatex documents

### Precondition for the generator

One has to install [Node.js](https://nodejs.org/en/) version 18 (or later) to get this generator running.
For simple installation, just head to <https://nodejs.org/> and follow the installation instructions.

### Using the generator

One can start using the generator directly using the node execution wrapper [npx](https://www.npmjs.com/package/npx):

```bash
npx -p yo -p generator-latex-template -c 'yo latex-template'
```

### Permanent installation (and simpler command line usage)

In case one wants to have the generator installed permanently (or `npx` does work as expected), one can install `generator-latex-template` using following command:

```bash
npm install -g generator-latex-template
```

Then, one can invoke the generator as follows:

```bash
yo latex-template
```

## How to update the document

⚠️ The template generator overwrites `main.tex` on each run. This will destroy your work. ⚠️

You can use the magic of `git` to prevent that:

1. After repository initialization:

   - `git commit` to save your work
   - `git checkout -b template` - to create a branch with initial template (required for updating)
   - `git checkout main` switch back to your thesis

2. Work on the `main` branch
3. In case an update comes in, update the `template` branch

   - `git checkout template` - switch to the `template` branch
   - `yo latex-template` - generate new template
   - `git commit` - save the new template
   - `git checkout main` - switch to your work
   - `git merge template` - merge in the template changes
   - resolve conflicts ^^ (Hint: IntelliJ Community Edition has a [great conflict resolving tool](https://www.jetbrains.com/help/idea/resolving-conflicts.html#))

## Resources

- [IEEE](https://latextemplates.github.io/IEEE/) - example: [paper-conference-minted.tex](https://github.com/latextemplates/IEEE/blob/main/paper-conference-minted.tex)
- [LNCS](https://latextemplates.github.io/LNCS/) - example: [paper.tex](https://github.com/latextemplates/LNCS/blob/main/paper.tex)
- [scientific-thesis-template](https://latextemplates.github.io/scientific-thesis-template/) - example: [latexhints-english.tex](https://github.com/latextemplates/scientific-thesis-template/blob/main/latexhints-english.tex)
- [alpenwasser/TeX](https://github.com/alpenwasser/TeX)

## Development roadmap

- [x] Create directory structure
- [ ] Sort in examples from the [scientific-thesis-template](http://latextemplates.github.io/scientific-thesis-template/)
- [ ] Have scientific-thesis-template generated completely.
- [x] Have LNCS generated completely.
- [ ] Have [uni-stuttgart-dissertation-template](https://github.com/latextemplates/uni-stuttgart-dissertation-template) generated automatically.

In the long run, the contents of the `paper.tex` (and similar) files in repositories of the [latextemplates](https://latextemplates.github.io/) organization should be generated automatically.

## Development hints

- Templating language: <https://ejs.co/>
- Conditional questions: <https://stackoverflow.com/a/18706640/873282>.
- Types of prompts: <https://github.com/SBoudrias/Inquirer.js#prompt-types>
  - E.g., [Question](https://github.com/SBoudrias/Inquirer.js#question)
- Add a new question
  - Also adapt `__tests__/app.js`
  - Execute tests with `npx jest`
- Update NPM dependencies
  - `npx npm-update-all`. See [FreeCodeCamp](https://www.freecodecamp.org/news/10-npm-tricks-that-will-make-you-a-pro-a945982afb25/) for more details.
  - `npx npm-check-updates -u`. [[Source](https://www.carlrippon.com/upgrading-npm-dependencies/)]
  - See <https://github.com/yeoman/generator/releases> for changes in the generator.
  - Generate `package-lock.json` only: `npm i --package-lock-only`
- When one encounters `Cannot find module 'yeoman-generator'`, please update the npm dependencies.
  That error occurred when using version `4.13.0` and `5.4.2` was available.
- In case of the error "Error: EACCES, permission denied '/root/.config/configstore/insight-yo.json'", one needs to execute `chmod g+rwx /root /root/.config /root/.config/configstore`
- Check GitHub actions
  - Use [actionlint](https://github.com/rhysd/actionlint#readme)
  - Use [vs.code GitHub actions plugin](https://marketplace.visualstudio.com/items?itemName=cschleiden.vscode-github-actions)
  - Use [act](https://github.com/nektos/act) for checking: `act --rm --platform ubuntu-latest=fwilhe2/act-runner:latest -W .github/workflows/check-ieee-conference-a4-pdflatex-bibtex-2023-true.yml`
- When adding a new package use `DEPP` (see above) or execute following steps:
  1. execute `npx` with `--generatereitzig` (in a clean directory)
  2. run `pdflatex`
  3. run `{repository-root}/generate-texlivefile.sh`
  4. copy `Texlivefile` to the root of the `{repository-root}/generators/app/templates`
  5. adapt `Texlivefile` as required
- When issues with the template occur: `npx ejs-lint main.en.tex`
- Cancel workflows:
  - `gh run list -L 100 --json databaseId -s queued -R latextemplates/generator-latex-template | jq -r '.[] | .databaseId' | awk '{gsub(/\\r\\n/,RS)} 1' | while read -r run_id; do gh run cancel "$run_id" || true; done`
  - `gh run list -L 100 --json databaseId -s in_progress -R latextemplates/generator-latex-template | jq -r '.[] | .databaseId' | awk '{gsub(/\\r\\n/,RS)} 1' | while read -r run_id; do gh run cancel "$run_id" || true; done`
- Update submodule of "derived" templates (LNCS, ...): `[ -z "$(git status --porcelain)" ] && cd generator-latex-template/ && git pull && cd .. && git add . && git commit -m"Update LTG" && git pull --rebase && git push`

### Test locally

- Create empty directory ("target directory")
- Change to the target directory
- Run `npx yo <path-to-git-repository>/generators/app/index.js`. Background: Starting from 5.0.0 on, [one needs to specify the full path to index.js](https://github.com/yeoman/yo/issues/797#issuecomment-2541794625).
- Windows: `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js`

#### Linux

Parameters can be set using command line

- lncs: `npx yo /tmp/repo/generators/app/index.js --documentclass=lncs --papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2024 --docker=false --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`

#### Windows

Parameters can be set using command line

- IEEE template (with pdflatex and bibtex): `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=ieee --ieeevariant=conference --papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2024 --docker=reitzig --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`
- LNCS template (with pdflatex and bibtex): `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=lncs ---papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2024 --docker=false --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`
- Scientific Thesis template: `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=scientific-thesis --papersize=a4 --latexcompiler=pdflatex --bibtextool=bibtex --texlive=2024 --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true`
- USTUTT template: `npx yo c:\git-repositories\latextemplates\generator-latex-template\generators\app\index.js --overleaf=false --documentclass=ustutt --papersize=a5 --latexcompiler=lualatex --bibtextool=biblatex --texlive=2024 --lang=en --font=default --listings=listings --enquotes=csquotes --tweakouterquote=babel --todo=todonotes --examples=true --howtotext=true` -- `todonotes` is the preferred TODO package here.

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

A `launch.json` configured for Windows and Visual Studio Code is included.
Just press <kbd>F5</kbd> and the generator should run in debug mode.

```terminal
ejslint.cmd c:\git-repositories\latextemplates\generator-latex-template\generators\app\templates\main.en.tex
```

### Releasing a new version

1. Update `CHANGELOG.md` (change `h2` heading etc.)
2. Update `package.json`, publish to [npmjs](https://www.npmjs.com/package/generator-latex-template), create GitHub release.
   Use [release-it](https://www.npmjs.com/package/release-it) (do not create a release on GitHub) and [github-release-from-changelog](https://www.npmjs.com/package/github-release-from-changelog).

   - `npx release-it`
   - `npx github-release-from-changelog`

## License

The code is licensed [0BSD](https://choosealicense.com/licenses/0bsd/#), the snippets (both LaTeX and text) 0BSD, too.
See [benbalter/talks#15](https://github.com/benbalter/talks/issues/15#issuecomment-599704662), for a reasoning, why [CC0](https://creativecommons.org/share-your-work/public-domain/cc0/) cannot be used.

- `generators/app/templates/splncs04nat.bst` is taken from [tpavlic/splncs04nat](https://github.com/tpavlic/splncs04nat) and is MIT-licensed.
- `generators/app/templates/logos/`: This directory contains logos, which have special licenses.

[hyperref]: https://ctan.org/pkg/hyperref
[listings]: https://ctan.org/pkg/listings
[minted]: https://ctan.org/pkg/minted

<!-- markdownlint-disable-file MD013 MD033 -->
