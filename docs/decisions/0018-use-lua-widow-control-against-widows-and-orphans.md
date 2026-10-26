# Use lua-widow-control against widows and orphans

## Context and Problem Statement

`nowidow` avoids widows and orphans by penalties, so a page then ends a line early ([#92](https://github.com/latextemplates/generator-latex-template/issues/92)).
How to avoid widows and orphans?

## Considered Options

* [lua-widow-control](https://ctan.org/pkg/lua-widow-control) with LuaLaTeX, [nowidow](https://ctan.org/pkg/nowidow) with pdfLaTeX
* [nowidow](https://ctan.org/pkg/nowidow) for both engines

## Decision Outcome

Chosen option: "lua-widow-control with LuaLaTeX, nowidow with pdfLaTeX", because lua-widow-control keeps the pages full by lengthening or shortening a paragraph by one line.
The preamble chooses by engine (`\ifdefined\directlua`), so `--latexcompiler=both` works.

## More Information

The options and their pros and cons in general: [How to avoid widows and orphans](https://github.com/latextemplates/gadr-latex-packages/blob/main/widows-and-orphans.md).
