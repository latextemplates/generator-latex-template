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

and a generation into templates:

1. Support for LNCS, IEEE, KOMAscript
2. Support for separate documents which require `--shell-eescape` and not.
3. Support for integrated pdflatex and lualatex documents

## Resources

- [IEEE](https://latextemplates.github.io/IEEE/) - example: [paper-conference-minted.tex](https://github.com/latextemplates/IEEE/blob/master/paper-conference-minted.tex)
- [LNCS](https://latextemplates.github.io/LNCS/) - example: [paper.tex](https://github.com/latextemplates/LNCS/blob/master/paper.tex)
- [scientific-thesis-template](https://latextemplates.github.io/scientific-thesis-template/) - example: [latexhints-english.tex](https://github.com/latextemplates/scientific-thesis-template/blob/master/latexhints-english.tex)
- [alpenwasser/TeX](https://github.com/alpenwasser/TeX)


## Development roadmap

1. Create directory structure
2. Sort in examples from the [scientific-thesis-template](http://latextemplates.github.io/scientific-thesis-template/)
3. Have scientific-thesis-template generated completely.
4. Have LNCS generated completely.
5. Have [uni-stuttgart-dissertation-template](https://github.com/latextemplates/uni-stuttgart-dissertation-template) generated automatically.

In the long run, the contens of the `paper.tex` (and similar) files in repositories of the [latextemplates](https://latextemplates.github.io/) organization should be generated automatically.

## License

The code is licenced MIT, the snippets (both latex and text) [CC0](https://creativecommons.org/share-your-work/public-domain/cc0/).
  
  [hyperref]: https://ctan.org/pkg/hyperref
  [listings]: https://ctan.org/pkg/listings
  [minted]: https://ctan.org/pkg/minted
