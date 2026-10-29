# Use tablefootnote for footnotes in tables

## Context and Problem Statement

A `\footnote` inside a `tabular` within a floating `table` produces the mark, but the footnote text is lost ([scientific-thesis-template#91](https://github.com/latextemplates/scientific-thesis-template/issues/91)).
How to set footnotes in tables?

## Considered Options

* [tablefootnote](https://ctan.org/pkg/tablefootnote)
* [threeparttable](https://ctan.org/pkg/threeparttable)
* `\footnotemark` in the table and `\footnotetext` after the float

## Decision Outcome

Chosen option: "tablefootnote", because `\tablefootnote` is a drop-in for `\footnote`: the note appears at the bottom of the page like every other footnote, with no extra environment and no manual numbering.
threeparttable sets the notes directly under the table, which is common in journals but rare in theses, and needs its own environment.

### Consequences

* Good, because authors replace `\footnote` by `\tablefootnote` and are done.
* Bad, because a footnote of a float that moves to another page moves with it, so the note can be far from the table in the running text.

## More Information

The options and their pros and cons in general: [How to set footnotes in tables](https://github.com/latextemplates/gadr-latex-packages/blob/main/footnotes-in-tables.md).
