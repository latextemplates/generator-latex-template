# Use subfiles to compile single chapters

## Context and Problem Statement

A thesis build takes minutes, while an author rewriting one chapter wants to see that chapter.
The thesis templates keep one file per chapter, included by the main file, but offered no way to compile a chapter on its own ([uni-stuttgart-dissertation-template#11](https://github.com/latextemplates/uni-stuttgart-dissertation-template/issues/11)).
How to compile a single chapter with the preamble of the thesis?

See the [general ADR on compiling parts of a document](https://github.com/latextemplates/gadr-latex-packages/blob/main/compiling-single-chapters.md) for the options and their pros and cons.

## Considered Options

* [subfiles](https://ctan.org/pkg/subfiles)
* `\includeonly` in the main file
* [standalone](https://ctan.org/pkg/standalone)
* [docmute](https://ctan.org/pkg/docmute)

## Decision Outcome

Chosen option: "subfiles", because a chapter file needs only three boilerplate lines (`\documentclass[../<main file>]{subfiles}`, `\begin{document}`, `\end{document}`) and then compiles alone with the preamble of the main file, while the main file includes it as before (`\subfileinclude` behaves like `\include`).
A `.latexmkrc` in `chapters-<lang>/` reuses the settings of the main directory, adds the parent directory to `TEXINPUTS` and `BIBINPUTS` (packages shipped with the template, figures, the bibliography), and strips the spaces from the job name, which the ifplatform package (loaded by graphicscache) cannot handle.
The `ltgexample` environment passes `\currfilename` instead of `\currfilepath` to minted: subfiles reads a chapter through the import path, which minted prepends once more.

### Consequences

* Good, because `latexmk "10 - introduction"` in the chapter directory yields that chapter in seconds, with figures, listings and citations.
* Good, because the full build is unchanged; `\includeonly` is not needed.
* Bad, because every chapter file carries three lines that only matter when it is compiled alone, and names one main file (the others are commented out in the template repositories).
* Bad, because a chapter compiled alone shows `??` for references to other chapters and prints no bibliography.
