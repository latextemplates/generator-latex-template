# Use `autotype` For Ligature Correction for German Documents

## Context and Problem Statement

Ligatures can be typeset wrongly.

## Considered Options

* [`autotype`](https://ctan.org/pkg/autotype)
* [`ligtype`](https://ctan.org/pkg/ligtype)
* [`selnolig`](https://ctan.org/pkg/selnolig)

## Decision Outcome

Chosen option: "`autotype`", because has more features and seems to be more maintained.

## More Information

As of 2026, `autotype` receives updates (version 0.6 of 2026-04-27), while `selnolig` was last released in 2015 (version 0.302).
English documents use `selnolig`, because `autotype` does not support English (see [ADR-0009](0009-use-selnolig-for-english-ligature-correction.md)).

The options and their pros and cons in general: [How to avoid wrong ligatures](https://github.com/latextemplates/gadr-latex-packages/blob/main/ligatures.md).
