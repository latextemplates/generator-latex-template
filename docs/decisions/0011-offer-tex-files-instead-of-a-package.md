# Offer tex files instead of a package

## Context and Problem Statement

How are the templates distributed?

## Considered Options

* Distribute using a ZIP file downloadable via GitHub
* Offer as LaTeX package (`.sty`) distributed using CTAN
* Offer as a class file (`.cls`) distributed using CTAN

## Decision Outcome

Chosen option: "Distribute using a ZIP file downloadable via GitHub", because it should be easy for users to

1. start using the template and
2. apply hints from tex.stackexchange or other LaTeX help platforms.

When distributing as package (`.cls` and `.sty` files) (such as [hagenberg-thesis](https://ctan.org/pkg/hagenberg-thesis)), it is difficult for users to adapt the packages.
The main reason is that there will be never as much help as for basic classes such as [KOMA-Script](https://www.komascript.de/).

### Consequences

* Bad, because users have more effort to pick up updates of the template: by advanced use of Git or by copying the patches manually.

## More Information

This decision was originally recorded in the scientific-thesis-template.
