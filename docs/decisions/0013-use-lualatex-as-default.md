# Use lualatex as default

## Context and Problem Statement

Which LaTeX compiler to use?

## Considered Options

* pdflatex
* xelatex
* lualatex

## Decision Outcome

Chosen option: "lualatex", because well-maintained and better typography (see also [ADR-0010](0010-use-lualatex-for-correct-ligatures.md)).
We accept that compilation will take longer.
Users can switch to pdflatex if they want and are aware of the consequences.

## More Information

This decision was originally recorded in the scientific-thesis-template.
