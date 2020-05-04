# Use xxx for example presentation

## Context and Problem Statement

We want to present LaTeX examples.
They should be shown as LaTeX source and rendered output.

## Decision Drives

* Write once - have two outputs (source and rendered)
* Good interaction with all pacakges

## Considered Options

* [examplep](https://ctan.org/pkg/examplep)
* [tcolorbox](https://www.ctan.org/pkg/tcolorbox)
* [showexpl](https://ctan.org/pkg/showexpl)
* [latexdemo](https://ctan.org/pkg/latexdemo)
* [gincltex](https://ctan.org/pkg/gincltex)
* [minted](https://ctan.org/pkg/minted)

## Decision Outcome

Chosen option: "examplep", because comes out best (see below).

* examplep: allows for minipages automatically set to correctly render the LaTeX source. Bad, because it is GPL-licensed and thus requires all tex files to be GPL-licensed, too.
* gincltex: Includes .tex as graphics; rendering as source and rendered has to be done "on top".
* minted has the `example` environment in its source (taken from <http://blog.karssen.org/2009/11/15/a-latex-example-environment/>): https://github.com/gpoore/minted/blob/5d72859d714a6f2f6a42eec524476994d954b960/source/minted.dtx#L134.
  Does not deal with protection.
