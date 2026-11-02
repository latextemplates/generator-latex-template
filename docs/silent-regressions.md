# Silent regressions: what to look at when the PDF diff turns red

A TeX Live update, a package update, or a change in the generator can change the output without an error.
The weekly `Check` run of each template diffs the built PDF against the published one page by page (artifact `pdf-diff`).
This file lists the constructs that have regressed silently before, each with the issue that reported it and the place in the example document where it shows, so a red page can be read.

Each entry is an [OpenFastTrace](https://github.com/itsallcode/openfasttrace) requirement (`req~<name>~1`, `Needs: impl`).
The code that fulfills it carries the tag `[impl->req~<name>~1]` in an EJS comment (`<%# ... -%>`), which the generator strips, so no tag reaches a template.
`scripts/oft-tags.sh` collects these tags and the `OpenFastTrace` workflow fails when a requirement has no tag or a tag names no requirement.
Add an entry when such an issue is closed, with the tag at the fix; remove nothing, since the construct stays in the example document for this reason.

## Content of the document

### Math in the text font

`req~mathrm-text-font~1`

`\mathrm{d}x`, `\mathrm{e}^x`, and units are set in the text font, not in Computer Modern.
Shows in "Formulas and Equations" and "Typesetting Units".
[scientific-thesis-template#112](https://github.com/latextemplates/scientific-thesis-template/issues/112)

Needs: impl

### Math font matching the text font under LuaLaTeX

`req~math-font-matches-text~1`

Digits in formulas and in `\num`/`\SI` are in TeX Gyre Termes Math (Times) or XCharter Math, not in Latin Modern Math, which unicode-math takes when no math font is set.
Shows in "Typesetting Units": the numbers in the text and in `\SI{100}{\km\per\hour}` have the same weight.
[scientific-thesis-template#36](https://github.com/latextemplates/scientific-thesis-template/issues/36)

Needs: impl

### Umlauts in listings under pdfLaTeX

`req~listings-utf8-pdflatex~1`

A UTF-8 character in `lstlisting` or `\lstinline` is set, not dropped with "Invalid UTF-8 byte sequence (\lst@EC)"; the `literate` table maps it.
Shows in "Source Code" (the German listing).
[scientific-thesis-template#9](https://github.com/latextemplates/scientific-thesis-template/issues/9)

Needs: impl

### Hyperlinked line numbers of listings

`req~listing-line-links~1`

"Line 2" in the text is a hyperlink to that line of the listing, with the right number; with minted, each line is a unique target.
Shows in "Source Code".
[scientific-thesis-template#64](https://github.com/latextemplates/scientific-thesis-template/issues/64)

Needs: impl

### Hyphenation of compound words

`req~hyphenation-shorthand~1`

`application"=specific` is hyphenated at other places than the dash, and `\allowbreak` works; the `"` shorthand is active in English text.
Shows in "Hyphenation".

Needs: impl

### Ligatures copyable from the PDF

`req~ligatures-copyable~1`

"workflow" copied from the PDF gives "workflow", not "work?ow": pdfLaTeX through `glyphtounicode`, LuaLaTeX through selnolig and OpenType fonts.
Shows in every text with `fl` or `fi`; copy a word from "Hyphenation".
ADR-0009, ADR-0010.

Needs: impl

### Table of contents in the heading font

`req~toc-heading-font~1`

Section and subsection entries of the table of contents are in the sans-serif heading font, like the chapter entries.
Shows in the table of contents.
[scientific-thesis-template#150](https://github.com/latextemplates/scientific-thesis-template/issues/150)

Needs: impl

### No line ends with a one-letter word

`req~no-one-letter-line-end~1`

Under LuaLaTeX, no line ends with "a" or "I" (chickenize).
Shows on any text page.
[scientific-thesis-template#84](https://github.com/latextemplates/scientific-thesis-template/issues/84)

Needs: impl

### rotating before tablefootnote

`req~rotating-before-tablefootnote~1`

A sideways table from a package the user adds (`ctable`, `sidewaystable`) compiles and is placed correctly: `rotating` is loaded before `tablefootnote`.
Shows only when such a package is added.
[scientific-thesis-template#101](https://github.com/latextemplates/scientific-thesis-template/issues/101)

Needs: impl

### Wide table scaled to the text width

`req~wide-table-scaled~1`

A table wider than the text is scaled down (adjustbox), not run into the margin.
Shows in "Tables", the twelve-column table.
[scientific-thesis-template#80](https://github.com/latextemplates/scientific-thesis-template/issues/80)

Needs: impl

### Abbreviations: long form on first use only

`req~abbreviation-first-use~1`

The first `\gls` gives the long form, later ones the short form; `\glsunset` and `\glsreset` change this for the next use, as the example explains.
Shows in "Abbreviations".
[scientific-thesis-template#121](https://github.com/latextemplates/scientific-thesis-template/issues/121)

Needs: impl

### Kurzfassung of the English thesis in the appendix

`req~kurzfassung-appendix~1`

The English thesis has the German summary as an appendix, as the examination regulations require.
Shows as appendix C.
[scientific-thesis-template#105](https://github.com/latextemplates/scientific-thesis-template/issues/105)

Needs: impl

### Declaration as an editable file

`req~affirmation-editable~1`

The declaration at the end of the thesis comes from `affirmation.tex` (German: `affirmation-de.tex`), so its text can be adapted; it includes the paragraph on AI tools.
Shows on the last page.
[scientific-thesis-template#119](https://github.com/latextemplates/scientific-thesis-template/issues/119)

Needs: impl

### IEEE paper fonts under LuaLaTeX

`req~ieee-fonts-lualatex~1`

The IEEE paper is in Times, Helvetica, and Courier (TeX Gyre) under LuaLaTeX, not in Latin Modern, which fontspec would take.
Shows on every page; the comparison images in the README show the class as distributed next to the template.

Needs: impl

## Build and CI

### No stray text before the reference list of the IEEE paper

`req~ieee-bst-banner~1`

No date such as "(2015/08/26)" appears before the first reference: the banner that `IEEEtranN-doi.bst` writes into the `.bbl` stays below BibTeX's line limit of 79 characters.
Shows at the top of the references.

Needs: impl

### Weekly PDF diff

`req~pdf-diff-weekly~1`

The scheduled `Check` run compares the built PDF with the published one page by page and uploads the differences as artifact `pdf-diff`.

Needs: impl

### Comparison with the publisher's class

`req~publisher-comparison~1`

The `Check` workflow of a paper renders the same text with the class as distributed and with the template, first, middle, and last page, for the README.

Needs: impl

### One chapter compiles on its own

`req~chapter-standalone~1`

A thesis chapter compiles on its own with subfiles; the `Check` workflow builds the first chapter alone.
[uni-stuttgart-dissertation-template#11](https://github.com/latextemplates/uni-stuttgart-dissertation-template/issues/11)

Needs: impl

### Generated sources pass ChkTeX

`req~chktex-clean~1`

The `chktex` job passes on the generated files without options; `.chktexrc` carries the configuration.
[scientific-thesis-template#108](https://github.com/latextemplates/scientific-thesis-template/issues/108)

Needs: impl
