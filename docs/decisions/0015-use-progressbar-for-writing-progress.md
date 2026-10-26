# Use progressbar to show the writing progress

## Context and Problem Statement

Students and advisors want to see how far each chapter of a thesis is written ([#359](https://github.com/latextemplates/generator-latex-template/issues/359)).
A bar below the heading shows it; it has to be removable for the submitted version.
How to show the writing progress?

## Considered Options

* [progressbar](https://ctan.org/pkg/progressbar), wrapped in a `\progress{<percent>}` macro
* [progress](https://ctan.org/pkg/progress)

## Decision Outcome

Chosen option: "progressbar", because it only draws the bar and leaves the headings alone.
`progress` redefines `\chapter` and fails in the appendix ("Missing number", it compares the chapter letter with a number).
`\progress{60}` draws a bar filled to 60 % across the text width; `\showprogressfalse` hides all bars.
Theses enable it, papers contain it as commented-out lines.

### Consequences

* Good, because it works with KOMA-Script, hyperref, and appendices.
* Bad, because there is no HTML progress report as `progress` writes one.

## More Information

The options and their pros and cons in general: [How to show the writing progress of chapters](https://github.com/latextemplates/gadr-latex-packages/blob/main/progress-bars.md).
