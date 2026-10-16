# Use zref-clever for cross-references

## Context and Problem Statement

A reference should name what it points at ("Figure 3", "Section 2", "Equations 1 to 3"), the name should be part of the hyperlink, and the reference should stay correct when floats move or change type.
How to write cross-references?

## Considered Options

* [zref-clever](https://ctan.org/pkg/zref-clever)
* [cleveref](https://ctan.org/pkg/cleveref) (see [ADR-0003](0003-use-cleveref.md))

## Decision Outcome

Chosen option: "zref-clever", because it offers the feature set of cleveref (`\zcref`) and works with tagged PDFs.
The names follow the document language (babel).

## More Information

The options and their pros and cons in general: [How to write cross-references](https://github.com/latextemplates/gadr-latex-packages/blob/main/cross-references.md).
