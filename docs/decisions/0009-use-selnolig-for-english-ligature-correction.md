# Use `selnolig` For Ligature Correction

## Context and Problem Statement

Ligatures can be typeset wrongly.

## Considered Options

* [`autotype`](https://ctan.org/pkg/autotype)
* [`ligtype`](https://ctan.org/pkg/ligtype)
* [`selnolig`](https://ctan.org/pkg/selnolig)

## Decision Outcome

Chosen option: "`selnolig`", because only package supporting ligature correction for English texts (without advanced package configuration).
It also supports German texts, so one package serves both languages.

## More Information

The options and their pros and cons in general: [How to avoid wrong ligatures](https://github.com/latextemplates/gadr-latex-packages/blob/main/ligatures.md).
