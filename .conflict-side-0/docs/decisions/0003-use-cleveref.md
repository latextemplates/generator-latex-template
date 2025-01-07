# Use cleveref for references

## Context and Problem Statement

When referencing a figure (e.g., see Figure 5), should the text "Figure" also be a link?
When referencing figures at the beginning of a sentence, should be possible to use a different word?
For instance, Springer demands "Figure" at the beginning of a sentence, but "Fig." in the middle of the sentence?
Should it be possible to summarize multiple figures? For instance, range fig:one, fig:two, fig:three automagically gets 1--3.

## Decision Drivers

* The word before the number of the target should also be a hyperlink to offer a wider clicking space.
  E.g., "Figure 1" should be the hyperlink text, not only the "1".
* Easy to use commands
* Package should be compatible to other packages
* Package should be available on overleaf

## Considered Options

* [cleveref](https://ctan.org/pkg/cleveref)
* `autoref` - part of [hyperref](https://ctan.org/pkg/hyperref)
* [modref](https://ctan.org/pkg/modref)
* [fancyref](https://ctan.org/pkg/fancyref)
* [refstyle](https://ctan.org/pkg/refstyle)
* [fncylab](https://ctan.org/pkg/fncylab)
* [prettyref](https://ctan.org/pkg/prettyref)
* [refstyle](https://ctan.org/pkg/refstyle)
* [typedref](https://ctan.org/pkg/typedref)

## Decision Outcome

Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)].

## Pros and Cons of the Options

### cleveref

* Good, because solves all requirements
* Good, because one referencing command for all kinds of references (figures, tables, listings, ...)
* Good, because cleveref is easy to setup and use
* Good, because cleveref allows for hyperlinked text
* Good, because supports typesetting "Section" and "Sect." (used at the beginning resp. in the middle of a sentence; required by Springer guidelines).
* Bad, because sometimes tweaks have to be applied to get it to work
* Bad, because beginning and middle-of-sentence have to be distinguished by `\Cref` and `\cref`

### autoref

* Bad, because cannot distinguish between beginning of a sentence and middle of a sentence.

### modref

* Neutral, because forces user to provide proper labels
* Bad, because it modifies the `\ref` command

### fancyref

Provides fancy cross-referencing support, based on the package's reference commands (`\fref` and `\Fref`) that recognise what sort of object is being referenced.
So, for example, the label for a `\section` would be expected to be of the form `sec:foo`: the package would recognise the `sec:` part.

* Neutral, because forces user to provide proper labels
* Bad, because beginning and middle-of-sentence have to be distinguished by `\Fref` and `\fref`

### refstyle

* Bad, because hard to configure

### fncylab

This functionality is build-in in the LaTeX kernel.

With `\labelformat{section}{Section~#1}`, one can instruct LaTeX to render `\ref{sec:test}` as `Section 1`.

* Good, because simple to setup
* Bad, because `\ref` behaves differently in other LaTeX documents
* Bad, because it is unclear whether hyperlinks work
* Bad, because no support of "Section" (beginning of a sentence) and "Sect." (in the middle of a sentence) support

### prettyref

> Prettyref provides a command  `\newrefformat`, which specifies the way in which a reference is typeset, according to a label "identification".
> The identification is set in the `\label` command, by using prefixed label names; so instead of `\label{mysection}`, one uses `\label{sec:mysection}`, and prettyref interprets the "sec:" part.

Source: <https://ctan.org/pkg/prettyref>

* Good, because this follows the "intuition" of LaTeX beginners, that labels need to be prefixed by their type
* Bad, because hyperlinked reference name has to be manually crafted
* Bad, because it is not widely known

### refstyle

Refstyle requires to setup `newref` for each reference type.
There are defaults provided such as `tab`, then `\tabref{tab:xy}` can be used.

* Neutral, because provided commands (`\figref`, ...) are short, but make an intuitive impression
* Bad, because no automatic compression of references
* Bad, because the type of the referenced artifact has to be provided (e.g., `\eqref`)

### typedref

* Good, because provided commands (`\figureref`, ...) are intuitive
* Bad, because it is not widely known

## More Information

* The package [crefthe](https://ctan.org/pkg/crefthe) adds support for definite articles (e.g., required in German documents)
* The package [crossreftools](https://ctan.org/pkg/crossreftools) are helper tools for the cleveref package.
* The package [listlbls](https://ctan.org/pkg/listlbls) offers outputting all defined labels.
* The package [fancylabel](https://ctan.org/pkg/fancylabel) removes the burden of requiring to decide between `\label` and `\ref`. Useful in chemistry.
* The package [fancyref](https://ctan.org/pkg/fancyref) makes the impression to be a predecessor to cleveref. It received no updates in this century.
