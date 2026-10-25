# Use linebreaker against overfull lines

## Context and Problem Statement

The generated examples had lines running into the margin, e.g., with long inline code ([#92](https://github.com/latextemplates/generator-latex-template/issues/92)).
How to avoid overfull lines?

## Considered Options

* [linebreaker](https://ctan.org/pkg/linebreaker) with LuaLaTeX
* fix each line by hand
* set `\emergencystretch` globally

## Decision Outcome

Chosen option: "linebreaker", because it loosens only the paragraphs that would otherwise be overfull.
In the English scientific thesis, it removed all ten overfull lines without changing the page count.
It is loaded at the end of the preamble, only with LuaLaTeX; pdfLaTeX documents are unchanged.

### Consequences

* Good, because authors do not need to fix overfull lines by hand.
* Bad, because a re-broken paragraph can have wide interword spaces.

## More Information

The options and their pros and cons in general: [How to avoid lines running into the margin](https://github.com/latextemplates/gadr-latex-packages/blob/main/overfull-lines.md).
