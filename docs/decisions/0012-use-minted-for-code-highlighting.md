# Use minted for code highlighting

## Context and Problem Statement

Source code needs highlighting.

## Considered Options

* [minted](https://www.ctan.org/pkg/minted)
* [listings](https://www.ctan.org/pkg/listings)
* [pygmentex](https://www.ctan.org/pkg/pygmentex)
* [texments](https://www.ctan.org/pkg/texments)

## Decision Outcome

Chosen option: "minted", because

1. listings is inferior because it doesn't utilize a full lexer,
2. minted offers integration with [pygments](http://pygments.org/) and is actively maintained, and
3. the person who took over minted development [evaluated all alternatives](https://tex.stackexchange.com/a/103471/9075) and came to the conclusion that minted is the most promising solution.

### Consequences

* Good, because it highlights source code properly.
* Bad, because users need to install Python and [latexminted](https://ctan.org/pkg/latexminted) and compile with `--shell-escape`.

## More Information

Because of the Python requirement, the generator offers both: `--listings=minted` and `--listings=listings` (default).

The options and their pros and cons in general: [How to typeset source code](https://github.com/latextemplates/gadr-latex-packages/blob/main/source-code-listings.md).

This decision was originally recorded in the scientific-thesis-template.
