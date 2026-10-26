# Use xurl to break long URLs

## Context and Problem Statement

Long URLs ran into the margin, because `url` breaks only at a few symbols ([#133](https://github.com/latextemplates/generator-latex-template/issues/133)).
How to break long URLs?

## Considered Options

* [xurl](https://ctan.org/pkg/xurl)
* [url](https://ctan.org/pkg/url) with additional break points (`\UrlOrds`), as before

## Decision Outcome

Chosen option: "xurl", because it allows breaks after any character, so no URL runs into the margin.
It is loaded before biblatex, so that the templates' own biblatex URL penalties stay.

## More Information

The options and their pros and cons in general: [How to break long URLs](https://github.com/latextemplates/gadr-latex-packages/blob/main/url-line-breaks.md).
