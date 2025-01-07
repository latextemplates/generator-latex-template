# Use single quote (") to enquote text

## Context and Problem Statement

In a document, some words have to be put in quotes. How to direct latex to enquote a word?

## Decision Drivers

* Automatic correct typographical layout
* Less effort for the user
* Supported by prominent LaTeX editors (overleaf, vs.code, ...)
* Supported by standard LaTeX environments

## Considered Options

* Use single quote (") to enquote text
* Force the user to use `\enquote{word}`
* Force the user to use `\qq{word}`
* Force the user to use `\glqq{}word\grqq{}`

## Decision Outcome

Chosen option: "Use single quote (") to enquote text", because resolves all forces.
We accept that special hyphenation instructions such as `application"=specific` do not work anymore.

<!-- markdownlint-disable-file MD013 -->
