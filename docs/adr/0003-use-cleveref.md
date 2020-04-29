# Use cleveref

## Context and Problem Statement

When referencing a figure (e.g., see Figure 5), should the text "Figure" also be a link?
When referencing figures at the beginning of a sentence, should be possible to use a different word?
For instance, Springer demands "Figure" at the beginning of a sentence, but "Fig." in the middle of the sentence?
Should it be possible to summarize multiple figures? For instance, range fig:one, fig:two, fig:three automaically gets 1--3.

## Considered Options

* [cleveref](https://ctan.org/pkg/cleveref)
* `autoref` - part of [hyperref](https://ctan.org/pkg/hyperref)
* [modref](https://ctan.org/pkg/modref)
* [fancyref](https://ctan.org/pkg/fancyref)
* [refstyle](https://ctan.org/pkg/refstyle)

## Decision Outcome

Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)].

## Pros and Cons of the Options

### cleveref

* Good, because solves all requirements
* Good, because one referencing command for all kinds of references (figures, tables, listings, ...)
* Bad, because sometimes tweaks have to be applied to get it to work
* Bad, because beginning and middle-of-sentence have to be distinguished by `\Cref` and `\cref`

### autoref

* Bad, because cannot distinguish between beginning of a sentence and middle of a sentence.

### modref

* Good/bad, because forces user to provide proper labels
* Bad, because it modifies the `\ref` command

### fancyref

Provides fancy cross-referencing support, based on the package's reference commands (`\fref` and `\Fref`) that recognise what sort of object is being referenced.
So, for example, the label for a `\section` would be expected to be of the form `sec:foo`: the package would recognise the `sec:` part.

* Good/bad, because forces user to provide proper labels
* Bad, because beginning and middle-of-sentence have to be distinguished by `\Fref` and `\fref`

### refstyle

* Bad, because hard to configure

<!-- markdownlint-disable-file MD013 -->
