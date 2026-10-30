# Use lua-ul for highlighting text

## Context and Problem Statement

`\textcomment{text}{comment}` highlights a passage and attaches a PDF comment.
The highlighting used `\colorbox`, which is an unbreakable box, so a highlighted passage of more than a few words ran into the margin ([lncs-enhanced#15](https://github.com/latextemplates/lncs-enhanced/issues/15)).
How to highlight text so that it breaks across lines?

## Considered Options

* [lua-ul](https://ctan.org/pkg/lua-ul) (`\highLight`, with luacolor) for LuaLaTeX, `\colorbox` for pdfLaTeX
* [soul](https://ctan.org/pkg/soul) (`\hl`) for both engines
* keep `\colorbox`

## Decision Outcome

Chosen option: "lua-ul for LuaLaTeX, `\colorbox` for pdfLaTeX", because lua-ul highlights at the node level after line breaking, so the passage may contain anything (`\cite`, `\url`, `\emph`, `\texttt`) and breaks like ordinary text.
soul re-scans the passage syllable by syllable and fails on `\cite` and other fragile content unless it is braced, which made it unusable for the templates before.
pdfLaTeX documents keep `\colorbox` (unchanged behavior), as LuaLaTeX is the default engine.

### Consequences

* Good, because a highlighted passage of any length is fine with LuaLaTeX.
* Neutral, because luacolor changes how LuaTeX produces colors: it tags glyphs and rules with an attribute instead of writing color-stack specials. A package that drives the color stack itself could disagree with that; in the compiled lncs example, hyperref, minted, pgfplots, tcolorbox and pdfcomment rendered as before.

## More Information

The options and their pros and cons in general: [How to highlight text](https://github.com/latextemplates/gadr-latex-packages/blob/main/text-highlighting.md).
