# Contributing

We love seeing people contribute patches to this project and the process is simple.
In general, we follow [GitHub's fork & pull request model](https://help.github.com/articles/fork-a-repo/).
The code is licensed under [BSD Zero Clause (`0BSD`)](LICENSE), the examples using `CC0`.
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

Each template repository embeds this repository as a git submodule at `generator-latex-template/`
and runs the generator in its `.github/workflows/update-files.yml` workflow.
Whenever the submodule pointer is bumped, that workflow regenerates all variants of the template
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

1. `[package].premable.en.tex` - for the LaTeX commands to be added to the preamble.
2. `[package].example.en.tex` - put examples in there
3. Add both `.tex` files to the appropriate place in `main.en.tex`
4. Find a similar place in `main.de.tex`. You don't need to provide a translation; just include a reference to the English file.

## Contributing a translation

1. Find a `.en.tex` file without a corresponding `.de.tex` file.
2. Copy the `.en.tex` to a correspinding `.de.tex` file.
3. Translate the content of the `.de.tex` file.
4. Change the file reference in `main.de.tex`.
