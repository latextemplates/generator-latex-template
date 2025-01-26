# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).
From 2025-01-13 onwards, versioning is done using [Calendar Versioning](https://calver.org/).
We use dots as date separators, because it is supported in `package.json` (and dashes are not).

## [Unreleased]

### Fixed

- Fixed magic comment `!BIB program` for biblatex.

## [2025.1.24]

### Added

- Added [TeXcount](https://app.uio.no/ifi/texcount/index.html) to GitHub workflow.
- GitHub workflow job summary for `latexmk` generated using [texlogsieve](https://ctan.org/pkg/texlogsieve).

### Changed

- Links in `README.md` to example `.tex` files are now relative.

### Fixed

- "Check make" workflow works again.

## [2025.1.23]

### Added

- Full support to generate University of Stuttgart PhD Thesis template (in English and German)

### Changed

- Updated `.gitignore` and `.dockerignore`

## [2025.1.20]

### Added

- Added `.aspell.en.pws` and `.aspell.conf` to ignore some LaTeX commands at aspell.
- Added `latexindent` to GitHub actions (`check.yml`).
- Added support for [spelling](https://www.ctan.org/pkg/spelling) package (which highlights bad spellings in red - if `.spell.bad` containing misspelled words exists)

### Fixed

- Fixed tag for iot Docker image.

### Changed

- Refined `Makefile`

## [2025.1.14]

### Added

- Added support for TeXLive 2024.
- Added `both` as option, which includes `\ifluatex` to switch between LuaLaTeX and pdflatex.
- Added [hyphenex](https://ctan.org/pkg/hyphenex) to enable more correct English hyphenation.
- Added [autotype](https://ctan.org/pkg/autotype) to enable automatic language-specific typography for German documents. [#223](https://github.com/latextemplates/generator-latex-template/issues/223)
- Added [selnolig](https://ctan.org/pkg/selnolig) to enable automatic language-specific typography for English documents. [#223](https://github.com/latextemplates/generator-latex-template/issues/223)
- Added support for [`todonotes`](https://ctan.org/pkg/todonotes).
- Added many examples and LaTeX configurations from [University of Stuttgart PhD Thesis Template](https://github.com/latextemplates/uni-stuttgart-dissertation-template).
- Added hint on copying `_latexmkrc` to `latexmkrc` to avoid issues that `latexmk` calls `latex` instead of `pdflatex`.

### Changed

- Switched from [pbalance](https://ctan.org/pkg/pbalance) back to [balance](https://ctan.org/pkg/balance) package, because `pbalance` sometimes lead to an endless loop.
- Implementation: No `default` branches any more for `switch`es on `documentclass`
- Dropped support for TeXLive 2022 and 2023.
- `Texlivefile` is now always generated.
- Updated to [yeoman-generator v5.1.0](https://github.com/yeoman/yo/releases/tag/v5.1.0)
- Updated reitzig image to 2024.11
- Use full image of [iot's docker image](https://gitlab.com/islandoftex/images/texlive#tex-live-docker-image).
- Generated GitHub workflow is now using [GitHub action install-texlive](https://github.com/zauguin/install-texlive) instead of Docker-based build.

### Fixed

- `.github/workflows/check.yml` now works for Island of TeX docker image, too.
- There is no space within `e.g.` and `i.e.` (Commands `\eg` and `\ie`).
- `.gitignore` now contains correct PDF ignore for `paper.pdf`.
- Fixed installation of pygments in reitzig Docker image.

### Removed

- `texlogsieve` is not filtering the outputs of `latexmk` anymore.
- Removed support for TeXLive 2022 and TeXLive 2023.
- Removed support for LNCS older than January 2022. See [tex.sx](https://tex.stackexchange.com/a/630060/9075) for details.

## [0.8.0] – 2023-07-24

### Added

- Added support for German on LNCS and IEEE.
- Added support for TeXLive 2023.
- Added support for [Island of TeX's Docker image](https://gitlab.com/islandoftex/images/texlive#tex-live-docker-image).

### Changed

- Modern loading of German hyphenation patterns. Source: [babel-german#6](https://github.com/jspitz/babel-german/issues/6)
- Switched from [pbalance](https://ctan.org/pkg/pbalance) back to [balance](https://ctan.org/pkg/balance) package, because `pbalance` sometimes lead to an endless loop
- `--language=x` is now `--lang=x`
- `ieee_variant` changed to `ieeevariant`
- `acm_...` changed to `acm...`
- `tweak_outerquote` changed to `tweakouterquote`

### Fixed

- Various LaTeX fixes to get compilation running on TeXLive 2023

## [0.7.0] – 2022-06-06

### Added

- Support for setting paper size for all outputs
- Magic comment for [LTeX](https://github.com/valentjn/vscode-ltex#ltex-extension-for-vs-code-grammarspell-checker-using-languagetool-with-support-for-latex-markdown-and-others) (because of [vscode-ltex#632](https://github.com/valentjn/vscode-ltex/issues/632))

### Changed

- Refined description of usage of [llncsconf](https://ctan.org/pkg/llncsconf) package.
- Always rely on [cleveref](https://ctan.org/pkg/cleveref). See [ADR-0003](docs/decisions/0003-use-cleveref.md).

### Fixed

- Fixed line break in introduction
- License statement in `package.json`

## [0.6.0] – 2022-06-03

### Added

- Added generations of GitHub actions
- Switch for `overleaf`. If set, `_latexmkrc` is generated instead of `latexmkrc`. [lncs#40](https://github.com/latextemplates/LNCS/issues/40)

### Changed

- Update `splncsnat` to [splncs04nat](https://github.com/tpavlic/splncs04nat). [lncs#35](https://github.com/latextemplates/LNCS/issues/35)

### Fixed

- Fixed reference to examples in IEEE template
- Fixed run for TeXLive 2021
- Correct `\keywords{}` syntax for LCNS. [lncs#39](https://github.com/latextemplates/LNCS/issues/39)

## [0.5.0] – 2022-02-28

### Fixed

- Examples now also work on overleaf. `\currfile` now correctly returns `main.tex`/`paper.tex` instead of `output.tex`.
  Implementation: Added parameter `realmainfile` to package [currfile](https://ctan.org/pkg/currfile)

### Added

- Included more elements from the "original" scientific-thesis template.
- Added LaTeX package [hyphenex](https://ctan.org/pkg/hyphenex) to ensure that English words are correclty hyphenated.

## [0.4.0] – 2022-02-03

### Added

- Refined support for ACM by adding `acm_format` and `acm_review`
- Added support for generating a `Dockerfile` (`--docker=reitzig` or `--docker=dante`)
- Added support for log filtering using [texlogsieve](https://ctan.org/pkg/texlogsieve) [#87](https://github.com/latextemplates/generator-latex-template/issues/87)

### Fixed

- Filename of ACM articles is `paper.tex` (and not `main.tex`)

### Changed

- LNCS is now based on the offical CTAN package [llncs](https://ctan.org/pkg/llncs)

### Removed

- Drop support for TeXLive 2019 and 2020, because TeXLive 2021 is supported by Overleaf

## [0.3.0] – 2021-09-16

### Added

- Added initial support for [ACM](https://ctan.org/pkg/acmart)
- Added initial support for [mindflow](https://www.ctan.org/pkg/mindflow) (when TeXLive >= 2021 is used)

### Fixed

- Sections "Introduction" and "Related Work" are sections in IEEE when not using "howtotext". Fixes [#70](https://github.com/latextemplates/generator-latex-template/issues/70)
- Fixed support for TeXLive 2019

### Changed

- Changed from `\columnwidth` to `\linewidth`, which is more readable for `.tex` authors.
  Hint by <https://tex.stackexchange.com/a/17085/9075>.

## [0.2.0] – 2021-08-23

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
- Added initial [subfig](https://www.ctan.org/pkg/subfig) configuration

### Changed

- Changed filename pattern to `.preamble.en.tex`, meaning: first comes the category, then the language, then the real file extension.
- Changed from MIT+CC0 licenses to 0BSD. See [benbalter/talks#15](https://github.com/benbalter/talks/issues/15#issuecomment-866607666) for the reasoning regarding templates.
- When generating a conference paper, the main file name is `paper.tex` and the bibliography is named `paper.bib`. The defaults are `main.tex` and `bibliography.bib`.
- Changed from `\textwidth` to `\columnwidth`, which works same in one-column documents, but produces intended results in two-column documents.

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

[2025.1.24]: https://github.com/latextemplates/generator-latex-template/compare/2015.1.23...2015.1.24
[2025.1.23]: https://github.com/latextemplates/generator-latex-template/compare/2015.1.20...2015.1.23
[2025.1.20]: https://github.com/latextemplates/generator-latex-template/compare/2025.1.14...2015.1.20
[2025.1.14]: https://github.com/latextemplates/generator-latex-template/compare/0.8.0...2025.1.14
[0.8.0]: https://github.com/latextemplates/generator-latex-template/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/latextemplates/generator-latex-template/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/latextemplates/generator-latex-template/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/latextemplates/generator-latex-template/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/latextemplates/generator-latex-template/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/latextemplates/generator-latex-template/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/latextemplates/generator-latex-template/compare/0.1.2...0.2.0
[0.1.2]: https://github.com/latextemplates/generator-latex-template/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/latextemplates/generator-latex-template/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/latextemplates/generator-latex-template/releases/tag/0.1.0

<!-- markdownlint-disable-file MD013 MD024 CHANGELOG-RULE-003 -->
