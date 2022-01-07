# generator-latex-template ![Tests](https://github.com/latextemplates/generator-latex-template/workflows/Tests/badge.svg) [![npm version](http://img.shields.io/npm/v/generator-latex-template.svg?style=flat)](https://npmjs.org/package/generator-latex-template "View this project on npm")

> Generates latextemplates (e.g., for thesis, workshops, conferences, IEEEtran, LNCS, ...) out of "micro-templates"

See the **[talk about the generator](https://github.com/dante-ev/Vortraege_Tagungen/blob/master/2019-Herbst/Oliver%20Kopp%20-%20The%20LaTeX%20Template%20Generator%20-%20dante2019-herbst.pdf)** for an overview on the aims and the general concept.

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

## Talks

- [Oliver Kopp - The LaTeX Template Generator](https://github.com/dante-ev/Vortraege_Tagungen/blob/master/2019-Herbst/Oliver%20Kopp%20-%20The%20LaTeX%20Template%20Generator%20-%20dante2019-herbst.pdf) - a talk on the motivation, user experience, and the contribution

## Usage

One has to install [Node.js](https://nodejs.org/en/) version 14 to get this generator running.
On Windows, one can just run `choco install nodejs-lts` to get the right version of Node.js.

On Linux, one can start using the generator directly using the node execution wrapper [npx](https://www.npmjs.com/package/npx):

```bash
npx -p yo -p generator-latex-template -c 'yo latex-template'
```

### Installing `generator-latex-template`

In case one wants to have the generator installed permanently or `npx` does work as exepcted, one can install `generator-latex-template` using following command:

```bash
npm install -g generator-latex-template
```

### Using the generator

One can run the generator by invoking this command on a command prompt:

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
  - E.g,. [Question](https://github.com/SBoudrias/Inquirer.js#question)
- Add a new question
  - Also adapt `__tests__/app.js`
  - Execute tests with `npx jest`
- Test locally
  - Create empty directory ("target directory")
  - Change to the target directory
  - Run `npx yo <path-to-git-repository>`
    - Windows: `npx yo c:\git-repositories\latextemplates\generator-latex-template`
  - Parameters can be set using command line
    - Windows: `npx yo c:\git-repositories\latextemplates\generator-latex-template --documentclass=scientific-thesis --texlive=2021 ---latexcompiler=pdflatex --bibtextool=bibtex --docker=no --language=en --font=default --listings=listings --cleveref=true --enquotes=csquotes --tweak_outerquote=babel --todo=pdfcomment  --howtotext=true --examples=true`
    - Windows automatic generation of a LNCS template (with pdflatex and bibtex): `npx yo c:\git-repositories\latextemplates\generator-latex-template --documentclass=lncs --texlive=2021 --latexcompiler=pdflatex --bibtextool=bibtex --language=en --font=default --listings=listings --cleveref=true --enquotes=csquotes --tweak_outerquote=babel --todo=pdfcomment --howtotext=true --examples=true`
  - Run `latexmk` to build the PDF
- Update npm dependencies
  - `npx npm-update-all`. See [FreeCodeCamp](https://www.freecodecamp.org/news/10-npm-tricks-that-will-make-you-a-pro-a945982afb25/) for more details.
  - `npx npm-check-updates -u`. [[Source](https://www.carlrippon.com/upgrading-npm-dependencies/)]
  - See <https://github.com/yeoman/generator/releases> for changes in the generator.
- When one encounters `Cannot find module 'yeoman-generator'`, please update the npm dependencies.
  That error ocurred when using version `4.13.0` and `5.4.2` was available.
- Check GitHub actions
  - Use [actionlint](https://github.com/rhysd/actionlint#readme)
  - Use [vs.code GitHub actions plugin](https://marketplace.visualstudio.com/items?itemName=cschleiden.vscode-github-actions)

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

```ejs
<% if (cleveref) { %>\cref<% } else if (documentclass == 'lncs') { %>Sect.~<% } else { %>Section~<% } %>{sec:relatedwork}
```

### Debugging

A `launch.json` configured for Windows and Visual Studio Code is included.
Just press <kbd>F5</kbd> and the generator should run in debug mode.

```terminal
ejslint.cmd c:\git-repositories\latextemplates\generator-latex-template\generators\app\templates\main.en.tex
```

### Releasing a new version

1. Update `CHANGELOG.md`
2. Update `package.json`, publish to [npmjs](https://www.npmjs.com/package/generator-latex-template), create GitHub release.
   Use [release-it](https://www.npmjs.com/package/release-it) (do not create a release on GitHub) and [github-release-from-changelog](https://www.npmjs.com/package/github-release-from-changelog).

   - `npx release-it`
   - `npx github-release-from-changelog`

## License

The code is licensed [0BSD](https://choosealicense.com/licenses/0bsd/#), the snippets (both LaTeX and text) 0BSD, too.
See [benbalter/talks#15](https://github.com/benbalter/talks/issues/15#issuecomment-599704662), for a reasoning, why [CC0](https://creativecommons.org/share-your-work/public-domain/cc0/) cannot be used.

[hyperref]: https://ctan.org/pkg/hyperref
[listings]: https://ctan.org/pkg/listings
[minted]: https://ctan.org/pkg/minted

<!-- markdownlint-disable-file MD013 MD033 -->
