# Use footmisc para for paragraph footnotes

## Context and Problem Statement

Each footnote of a page takes a line of its own, even when it is just a short URL.
In a paper with a page limit, setting all footnotes of a page side by side in one paragraph saves space ([lncs-enhanced#20](https://github.com/latextemplates/lncs-enhanced/issues/20)).
Which package should the templates offer for that, and how?

## Considered Options

* [footmisc](https://ctan.org/pkg/footmisc) with option `para`
* [manyfoot](https://ctan.org/pkg/manyfoot) with option `para`
* [bigfoot](https://ctan.org/pkg/bigfoot) with `\DeclareNewFootnote[para]{default}`
* [fnpara](https://ctan.org/pkg/fnpara)
* Keep one footnote per line

## Decision Outcome

Chosen option: "footmisc with option `para`", offered as a commented-out block in the `lncs` template only, because it keeps `\footnote` unchanged, is maintained by the LaTeX team, and is the package the theses already load.
bigfoot does not compile with TeX Live 2026 and hyperref (`Undefined control sequence \FN@colorstack`), manyfoot needs its own footnote commands, and fnpara is superseded by footmisc.

All paragraph-footnote packages collect each footnote in a box.
TeX inserts no break points into math inside a box, and `\url` typesets its argument in math mode, so URLs cannot break inside such footnotes and run into the margin (with xurl's stretchable glue, they are letter-spaced across the line instead).
LuaTeX's `\mathpenaltiesmode=1` inserts the break points also inside boxes, so the block is for LuaLaTeX only; pdfLaTeX has no such switch.
The block stays commented out, because it changes the look of the footnotes and the LNCS guidelines do not ask for it.
It is not offered for the two-column classes (`acm`, `ieee`), where the narrow column leaves no room for footnotes side by side.

### Consequences

* Good, because uncommenting two lines saves one line per additional footnote on a page.
* Bad, because the block works with LuaLaTeX only.

## More Information

The options and their pros and cons in general: [How to set footnotes side by side in one paragraph](https://github.com/latextemplates/gadr-latex-packages/blob/main/paragraph-footnotes.md).
