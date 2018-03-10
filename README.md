# latex-template-generator

> Generates latextemplates (e.g., for thesis, workshops, conferences, IEEEtran, LNCS, ...)

There are many latex templates out there.
All of them make use of certain packages such as [hyperref], [listings], or [minted].
The packages have to be a) included in the `.tex` file somehow and b) configured.
Moreover, some packages offer interfaces to users.
Minimal examples help to understand how a package works.

The aim of the repository is to provide for each common latex package

1. Configuration
2. Usage example

and a generation into templates.

In the long run, the contens of the `paper.tex` (and similar) files in repositories of the [latextemplates](https://latextemplates.github.io/) organization should be generated automatically.

  
  [hyperref]: https://ctan.org/pkg/hyperref
  [listings]: https://ctan.org/pkg/listings
  [minted]: https://ctan.org/pkg/minted
