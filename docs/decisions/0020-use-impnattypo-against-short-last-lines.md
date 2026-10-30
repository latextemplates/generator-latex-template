# Use impnattypo against short last lines

## Context and Problem Statement

A paragraph whose last line holds only a short word or a hyphenated fragment looks bad.
The templates once loaded [impnattypo](https://ctan.org/pkg/impnattypo) for that and reverted it, because its pdfLaTeX variant widened the interword spacing in every paragraph ([lncs-enhanced#16](https://github.com/latextemplates/lncs-enhanced/issues/16)).
How to avoid short last lines?

## Considered Options

* [impnattypo](https://ctan.org/pkg/impnattypo) with option `lastparline`, LuaLaTeX only
* impnattypo for both engines
* limit the stretch of `\parfillskip` by hand
* leave it to the author (`\looseness`, ties)

## Decision Outcome

Chosen option: "impnattypo with option `lastparline`, LuaLaTeX only", because with LuaLaTeX the package vetoes only the offending line break of an affected paragraph, so all other paragraphs stay as they are.
With pdfLaTeX it is not loaded (`\ifdefined\directlua`): its fallback there is the global `\parfillskip` stretch that caused the revert.
The LaTeX hints of the papers explain `\looseness` for the remaining cases.

### Consequences

* Good, because LuaLaTeX documents get the fix without any action by the author.
* Bad, because pdfLaTeX documents are unchanged.

## More Information

The options and their pros and cons in general: [How to avoid a short last line of a paragraph](https://github.com/latextemplates/gadr-latex-packages/blob/main/short-last-lines.md).
