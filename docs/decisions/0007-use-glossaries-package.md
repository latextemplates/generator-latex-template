# Use glossaries-extra package for abbreviations

## Context and Problem Statement

How to manage abbreviations

## Considered Options

* [glossaries-extra](https://ctan.org/pkg/glossaries-extra)
* [glossaries](https://ctan.org/pkg/glossaries)
* [acro](https://ctan.org/pkg/acro)

## Decision Outcome

Chosen option: "glossaries-extra", because seems to be best.

## More information

A discussion on glossaries versus acro: <http://tex.stackexchange.com/questions/309203/glossaries-vs-acro>.
A pull request switching from acro to glossaries: <https://github.com/latextemplates/scientific-thesis-template/pull/35>.

Sorting: the list is sorted by TeX itself (`\makenoidxglossaries` and `\printnoidxglossary`), so no external tool is needed and the list appears with any build, also without latexmk.
The external tools (`makeglossaries`, which needs Perl, or `makeglossaries-lite`) sort faster and by language rules, which matters for large glossaries or accented sort keys, not for a list of abbreviations.
A missing tool run is what broke the template for students in 2016 (<https://github.com/latextemplates/scientific-thesis-template/issues/43>; the hotfix <https://github.com/latextemplates/scientific-thesis-template/pull/45> introduced `\makenoidxglossaries`); the templates returned to it in 2026.

The options and their pros and cons in general: [How to manage acronyms and glossaries](https://github.com/latextemplates/gadr-latex-packages/blob/main/acronyms-and-glossaries.md).

<!-- markdownlint-disable-file MD013 -->
