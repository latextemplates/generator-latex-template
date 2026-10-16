# LaTeX Template Generator [![npm version](http://img.shields.io/npm/v/generator-latex-template.svg?style=flat)](https://npmjs.org/package/generator-latex-template "View this project on npm")

> Generates latex templates (e.g., for thesis, workshops, conferences, IEEEtran, LNCS, ...) out of "micro-templates"

## Background information

LaTeX templates abound.
All of them make use of certain packages such as [hyperref], [listings], or [minted].
The packages have to be a) included in the `.tex` file somehow and b) configured.
Moreover, some packages offer interfaces (such as new commands or new environments) to users.
Minimal examples help to understand how a package works.

The aim of the repository is to provide for each common LaTeX package

1. Configuration
2. Usage example

and a generation into templates:

1. Support for [ACM](https://ctan.org/pkg/acmart), [IEEE](https://ctan.org/pkg/ieeetran), LNCS, [KOMA-Script](https://ctan.org/pkg/koma-script)
2. Support for separate documents which require `--shell-escape` and not.
3. Support for integrated pdflatex and lualatex documents

### Markdown quick start (`mwe`)

Besides the paper and thesis document classes, the generator offers a **minimal Markdown quick start**, selectable as the `mwe` document class — for people who want a fast start with writing rather than a full thesis with all the tricks.

- You write the content in **Markdown** inside a `\begin{markdown} … \end{markdown}` block in `main.tex` (via the [`markdown`](https://ctan.org/pkg/markdown) package): `#` becomes a chapter, `##` a section; citations (`[@key]`), footnotes, task lists, pipe tables, and images work out of the box.
- It compiles with **LuaLaTeX + biber** (the `markdown` package needs Lua; the bibliography uses biblatex).
- [`zref-clever`](https://ctan.org/pkg/zref-clever) turns the Markdown `{#id}` identifiers into smart `\zcref` cross-references that print the type name (e.g. "Figure 1.1" / "Abbildung 1.1").
- It generates a single minimal `main.tex` — no thesis scaffolding, abbreviations, or `commands.tex` — hides the paper/thesis-only prompts, and ships a trimmed, quick-start README.

Generate it non-interactively with:

```bash
yo latex-template --documentclass=mwe --lang=en
```

### Precondition for the generator

One has to install [Node.js](https://nodejs.org/en/) version 18 (or later) to get this generator running.
For a simple installation, head to <https://nodejs.org/> and follow the installation instructions.

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

- Paper: [Oliver Kopp - The LaTeX template generator: How micro-templates reduce template maintenance effort](https://tug.org/TUGboat/tb44-2/tb137kopp-microtemplates.html)
- Talk: [Oliver Kopp - The LaTeX Template Generator - DANTE Herbsttagung 2019](https://github.com/dante-ev/Vortraege_Tagungen/blob/master/2019-Herbst/Oliver%20Kopp%20-%20The%20LaTeX%20Template%20Generator%20-%20dante2019-herbst.pdf) - a talk on the motivation, user experience, and the contribution
- [IEEE](https://latextemplates.github.io/ieee-enhanced/) - example: [paper-conference-minted.tex](https://github.com/latextemplates/ieee-enhanced/blob/main/paper-conference-minted.tex)
- [LNCS](https://latextemplates.github.io/lncs-enhanced/) - example: [paper.tex](https://github.com/latextemplates/lncs-enhanced/blob/main/paper.tex)
- [scientific-thesis-template](https://latextemplates.github.io/scientific-thesis-template/) - example: [latexhints-english.tex](https://github.com/latextemplates/scientific-thesis-template/blob/main/latexhints-english.tex)
- [alpenwasser/TeX](https://github.com/alpenwasser/TeX)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute and for development hints, including testing and releasing.

## License

The code has the license [0BSD](https://choosealicense.com/licenses/0bsd/#), the snippets (both LaTeX and text) 0BSD, too.
See [benbalter/talks#15](https://github.com/benbalter/talks/issues/15#issuecomment-599704662), for the reasoning why we cannot use [CC0](https://creativecommons.org/share-your-work/public-domain/cc0/).

- `generators/app/templates/IEEEtranN-doi.bst` is `IEEEtranN.bst` from the [IEEEtran package](https://ctan.org/pkg/ieeetran), modified to output DOIs, and is LPPL-licensed.
- `generators/app/templates/splncs04nat.bst` comes from [tpavlic/splncs04nat](https://github.com/tpavlic/splncs04nat) and is MIT-licensed.
- `generators/app/templates/logos/`: This directory contains logos, which have special licenses (see [`logos/README.md`](generators/app/templates/logos/README.md)).
- `generators/app/templates/figures/ulm-minster.jpg` is [Landappbw 79389 1820 Ulmer Münster Ulm.jpg](https://commons.wikimedia.org/w/index.php?curid=131463041) by wkrauth, dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

[hyperref]: https://ctan.org/pkg/hyperref
[listings]: https://ctan.org/pkg/listings
[minted]: https://ctan.org/pkg/minted
