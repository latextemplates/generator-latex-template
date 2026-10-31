# Use gitver for the document version

## Context and Problem Statement

Drafts circulate as PDFs, and a reviewer's remarks have to be matched to the state of the sources they were made on.
The templates offered no way to stamp the PDF with its version ([uni-stuttgart-dissertation-template#1](https://github.com/latextemplates/uni-stuttgart-dissertation-template/issues/1)).
How to show the git commit the PDF was built from?

## Considered Options

* [gitver](https://ctan.org/pkg/gitver), loaded only when shell escape is enabled
* [gitinfo2](https://ctan.org/pkg/gitinfo2)
* [gitinfo-lua](https://ctan.org/pkg/gitinfo-lua)
* [gitfile-info](https://ctan.org/pkg/gitfile-info)
* [vc](https://ctan.org/pkg/vc)

## Decision Outcome

Chosen option: "gitver, loaded only when shell escape is enabled", because it needs no hooks, no scripts and no particular engine: one `git describe` call per build yields `\gitVer` (the commit, `-dirty` when uncommitted changes exist) and `\versionBox` (commit and build time).
It needs `\write18`, so the preamble loads it only under `--shell-escape` (`\sys_if_shell_unrestricted:T`, as for graphicscache) and provides empty `\gitVer` and `\versionBox` otherwise; a plain run is unchanged.
The option `nopdfinfo` keeps the PDF subject as set by the template, `noheader` keeps gitver from touching the headers (it only knows memoir and fancyhdr anyway).
The `ustutt` thesis is generated with `--shell-escape` (`requiresShellEscape` in the generator) and shows `\versionBox` in the page header (its footer is taken by the chapter and section marks); the other templates carry the block commented out.

### Consequences

* Good, because a `--shell-escape` build stamps every page of the `ustutt` thesis with the commit it was built from, and any template can show `\gitVer` where it suits.
* Good, because on Overleaf (shell escape on, no git) gitver prints "CLSI" instead of failing.
* Bad, because a build without shell escape shows no version at all, and the default builds of the templates other than `ustutt` run without it.
* Bad, because without a git repository (a downloaded zip) gitver reports an error and prints "unknown".
* Bad, because the build time in `\versionBox` makes two builds of the same commit differ.

## More Information

The options and their pros and cons in general: [How to show the document version](https://github.com/latextemplates/gadr-latex-packages/blob/main/document-version.md).
