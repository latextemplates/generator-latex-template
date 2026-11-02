# Silent regressions: what to look at when the PDF diff turns red

A TeX Live update, a package update, or a change in the generator can change the output without an error.
The weekly `Check` run of each template diffs the built PDF against the published one page by page (artifact `pdf-diff`).
This list maps the constructs that have regressed silently before to the issue that reported it and to the place in the example document where it shows, so a red page can be read.
Add a row when such an issue is closed; remove nothing (the construct stays in the example document for this reason).

| Construct | What goes wrong | Where in the example document | Issue |
| -- | -- | -- | -- |
| `\mathrm{d}x`, `\mathrm{e}^x` | Set in Computer Modern instead of the text font | "Formulas and Equations" | [scientific-thesis-template#112](https://github.com/latextemplates/scientific-thesis-template/issues/112) |
| `\num`, `\SI`, digits in formulas | Under LuaLaTeX in Latin Modern Math instead of the math font matching the text (Termes Math, XCharter Math) | "Typesetting Units" | [scientific-thesis-template#36](https://github.com/latextemplates/scientific-thesis-template/issues/36) |
| Umlauts in `lstlisting` and `\lstinline` | Under pdfLaTeX dropped with "Invalid UTF-8 byte sequence (\lst@EC)" | "Source Code" | [scientific-thesis-template#9](https://github.com/latextemplates/scientific-thesis-template/issues/9) |
| "Line 2" reference into a listing | Not a hyperlink, or the wrong line number | "Source Code" | [scientific-thesis-template#64](https://github.com/latextemplates/scientific-thesis-template/issues/64) |
| `application"=specific`, `\allowbreak` | Hyphenation only at the dash, or not at all | "Hyphenation" | - |
| `"workflow"` copied from the PDF | The ligature `fl` is lost when copying (`glyphtounicode`, selnolig) | "Hyphenation" and any text with `fl`/`fi` | ADR-0009, ADR-0010 |
| Entries of the table of contents | Section entries in the text font instead of the heading font | Table of contents | [scientific-thesis-template#150](https://github.com/latextemplates/scientific-thesis-template/issues/150) |
| One-letter word at the end of a line | A line ending with "a" or "I" (LuaLaTeX, chickenize) | Any text page | [scientific-thesis-template#84](https://github.com/latextemplates/scientific-thesis-template/issues/84) |
| Sideways table (`rotating`, `ctable`) | "Package rotating loaded after tablefootnote", table placed wrongly | "Tables" (packages added by users) | [scientific-thesis-template#101](https://github.com/latextemplates/scientific-thesis-template/issues/101) |
| Wide table | Runs into the margin instead of being scaled | "Tables", the twelve-column table | [scientific-thesis-template#80](https://github.com/latextemplates/scientific-thesis-template/issues/80) |
| `\glsunset`, `\gls` after first use | Long form shown again, or the short form on first use | "Abbreviations" | [scientific-thesis-template#121](https://github.com/latextemplates/scientific-thesis-template/issues/121) |
| Kurzfassung of the English thesis | Missing in the appendix | Appendix C | [scientific-thesis-template#105](https://github.com/latextemplates/scientific-thesis-template/issues/105) |
| Reference list of the IEEE paper | A date such as "(2015/08/26)" before the first entry (banner of `IEEEtranN-doi.bst` longer than 79 characters) | References | - |
| Fonts of the IEEE paper under LuaLaTeX | Latin Modern instead of Times, Helvetica, Courier (fontspec replaces the class fonts) | Every page; see the comparison images in the README | - |
| Title page and declaration of the thesis | Multi-line institute not centered, declaration text fixed | Title page, last page (`affirmation.tex`) | [scientific-thesis-template#145](https://github.com/latextemplates/scientific-thesis-template/issues/145), [scientific-thesis-template#119](https://github.com/latextemplates/scientific-thesis-template/issues/119) |

Everything above is also in the comparison and `pdf-diff` artifacts of the `Check` workflow, so the first step on a red page is the diff image; this list says which issue to reopen.
