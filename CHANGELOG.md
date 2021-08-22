# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added

- Add option `howtotext` which includes the text of @dfahland's [LaTeX template for Bachelor and Master theses at Eindhoven University of Technology](https://github.com/dfahland/Master-or-Bachelor-thesis-Template-Eindhoven-University-of-Technology)
- Added support for [Springer's LNCS](http://www.springer.com/computer/lncs)
- Added support for [IEEE](https://www.ieee.org/conferences/publishing/templates.html)
- Added support for passing options through the command line
- Added special condition for TeXLive 2021 (which offers more packages)
- Added number example for [situnitx](https://ctan.org/pkg/siunitx)
- Added switch `--githubpublish` to enable generating `README.md` for repositories hosted at <https://github.com/latextemplates>.
- Added support for [minted](https://ctan.org/pkg/minted)
- `.editorconfig` is now generated
- For development, `launch.json` is added

### Changed

- Changed filename pattern to `.preamble.en.tex`, meaning: first comes the category, then the language, then the real file extension.
- Changed from MIT+CC0 licenses to 0BSD. See [benbalter/talks#15](https://github.com/benbalter/talks/issues/15#issuecomment-866607666) for the reasoning regarding templates.
- When generating a conference paper, the main file name is `paper.tex` and the bibliography is named `paper.bib`. The defaults are `main.tex` and `bibliography.bib`.

### Fixed

- siunitx: `Error: Key 'siunitx/group-four-digits' accepts only a fixed set of choices.`
- Development: Fixed GitHub actions to really cover German as check

## [0.1.2] – 2020-04-29

### Changed

- Renamed `.gitignore` to `dot.gignore` to enable uploading at npm publish

## [0.1.1] – 2020-04-29

### Added

- Add support for configuring font

## [0.1.0] – 2019-10-20

First release of Markdown Architectural Decision Records.

[Unreleased]: https://github.com/latextemplates/generator-latex-template/compare/0.1.2...master
[0.1.2]: https://github.com/latextemplates/generator-latex-template/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/latextemplates/generator-latex-template/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/latextemplates/generator-latex-template/releases/tag/0.1.0

<!-- markdownlint-disable-file MD013 MD024 CHANGELOG-RULE-003 -->
