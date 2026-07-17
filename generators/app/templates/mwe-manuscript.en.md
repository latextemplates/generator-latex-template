# Introduction {#cha:introduction}

You write this entire book in **Markdown**. Top-level headings (`#`)
automatically become chapters, `##` become sections, matching the `scrbook`
document class. This heading carries the Markdown identifier `{#cha:introduction}`,
from which the package generates a `\label`.

A citation looks like this [@mwe], and here is a footnote.^[This is an inline
footnote.] Referenced footnotes work as well[^detail].

[^detail]: This is a more detailed footnote at the end of the section.

## Motivation

- first point
- second point
  - sub-point
1) firstly
2) secondly

Task lists (`taskLists`) are possible too:

- [ ] a still-open item
- [x] an already-completed item

As \zcref{fig:example} shows, you can reference images directly from
Markdown. The plain Markdown reference `<#fig:example>` yields the bare
number (<#fig:example>), without the type name Figure.

![An example image](example-image "An example image"){#fig:example}

## A Table

\zcref{tbl:example} shows the four alignment variants of `pipeTables`.

| Right | Left | Default | Centred |
|------:|:-----|---------|:-------:|
|    12 | 12   | 12      |   12    |
|   123 | 123  | 123     |   123   |

: Example table with alignments {#tbl:example}

## Acronyms

Acronyms defined once in the wrapper `.tex` file are recognized automatically
in the running text: the first use of HTML is expanded, later uses of HTML
stay short, and every use lands in the acronym list at the end. YAML works
the same way. Explicit markup is also possible: [JSON]{.acronym} is typeset
as an acronym although it has not been defined anywhere.

# Another Chapter

Text referring to the previous chapter: \zcref{cha:introduction}. Because the
heading carries the Markdown identifier `{#cha:introduction}` and every `\label`
also becomes a `\zlabel`, `\zcref` works here without any raw \LaTeX{}
to set the mark -- e.g. also on \zcref{tbl:example}.
