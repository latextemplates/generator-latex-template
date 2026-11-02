# Number the pages continuously from the title page

## Context and Problem Statement

A thesis has a front matter (title page, abstract, table of contents) before the first chapter.
Book classes number it with roman numerals and restart with arabic 1 at the first chapter, while ISO 7144 numbers all pages consecutively with arabic numerals.
The templates did both: the University of Stuttgart variants numbered continuously, the Hamburg and THU variants used `\frontmatter` ([scientific-thesis-template#69](https://github.com/latextemplates/scientific-thesis-template/issues/69)).
How to number the pages of a thesis?

See the [general ADR on page numbering](https://github.com/latextemplates/gadr-latex-packages/blob/main/page-numbering.md) for the options and their pros and cons.

## Considered Options

* Continuous arabic numbers from the title page on (ISO 7144)
* Roman numerals for the front matter, arabic from 1 for the main matter (`\frontmatter`/`\mainmatter`)
* Unnumbered front matter, arabic from 1 for the main matter

## Decision Outcome

Chosen option: "Continuous arabic numbers from the title page on", because ISO 7144 requires it for theses, the doctoral regulations of the University of Stuttgart require it, the page shown by the PDF viewer equals the printed page, and a page reference is unambiguous.
The generator option `--pagenumbering=roman` switches a thesis to roman front matter for institutions that want it; it inserts `\frontmatter` before the title page and `\mainmatter` before the first chapter.

### Consequences

* Good, because all thesis variants number the same way, and the README explains why.
* Good, because `--pagenumbering=roman` gives the book convention without editing the main file.
* Bad, because readers who expect the book convention see the table of contents on page 3, not iii.
