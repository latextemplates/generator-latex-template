---
status: accepted
date: 2026-10-25
---

# Do not offer HINT output yet

## Context and Problem Statement

[HINT](https://hint.userweb.mwn.de/) is a reflowable output format for reading TeX documents on screens of any size; [HiTeX](https://hint.userweb.mwn.de/hint/hitex.html) (`hitex`, `hilatex`) has been part of TeX Live since 2022 and writes `.hnt` files instead of PDF.
[#174](https://github.com/latextemplates/generator-latex-template/issues/174) asks to include it, e.g., as a `make hint` target next to `make pdf`.
Can the generated templates be compiled with `hilatex`?

## Decision Drivers

* Every generated template has to compile with the TeX Live versions the generator supports (2025 and 2026), in the Docker image and in CI.
* A target that fails for every template is worse than no target.

## Considered Options

* Add a `make hint` target (`hilatex`) and `\ifhint` guards for the packages HiTeX does not support
* Wait for HiTeX and revisit
* Close the issue

## Decision Outcome

Chosen option: "Wait for HiTeX and revisit", because HiTeX cannot process the templates today (see "More Information"); the blockers are in the engine and in TeX Live, not in the templates.

### Consequences

* Good, because the templates stay free of engine-specific guards for an output format nobody can produce yet.
* Bad, because readers on small screens stay with PDF until HiTeX catches up.

Revisit when all of the following hold:

* HiTeX's hash table takes at least ~120,000 control sequences (today fixed at 45,000; the `scientific-thesis` template needs 111,616).
* TeX Live builds `hilatex.fmt` out of the box (TeX Live 2026 does not list `hilatex` in `fmtutil.cnf`, and building it by hand fails, see below).
* The `hitex.def` driver for `graphics`/`color` is in TeX Live (today only in the [HINT repository](https://github.com/ruckertm/HINT/tree/main/hilatex/base)).

## More Information

Measured on 2026-10-25 with the `texlive/texlive:latest` (TeX Live 2026) and `islandoftex/images/texlive:TL2025-historic` images:

* HiTeX's hash table is a compile-time constant (`hash_size 45000` in the HiTeX source, no `hash_extra` as in web2c). `hilatex` aborts on the `scientific-thesis` template while loading `listings`: `TeX capacity exceeded, sorry [hash size=45000]`.
  Control sequences in use (`pdflatex`, TeX Live 2025): `article` alone 29,415; with `hyperref` 36,674; with `graphicx`, `xcolor`, `csquotes`, `listings`, `booktabs`, `amsmath`, `cleveref` 42,209; with `biblatex` 49,224; with `tcolorbox` and `pgfplots` 73,889; the `scientific-thesis` template 111,616.
  Any template with `biblatex` or `tcolorbox` is over the limit.
* TeX Live 2026 (HiTeX 2.0): `hitex -ini -etex -ltx -jobname=hilatex hilatex.ini` fails with 100 errors.
  HiTeX defines `\Umathcode`, so expl3 takes its Unicode-engine path, but `\c_max_char_int` stays 255: `Charcode requested out of engine range` while reading `UnicodeData.txt`.
  With `\Umathcode` hidden, `fontmath.ltx` fails next: this HiTeX build evaluates `\if\relax\noexpand\alpha` as false (pdfTeX and HiTeX in TeX Live 2025 and 2022: true), which breaks `\DeclareMathSymbol`.
* TeX Live 2025 (HiTeX 2.1): the same command builds `hilatex.fmt` without errors. A minimal `article` with `hyperref`, `xcolor`, and `graphicx` (PNG) compiles to `.hnt`; `hyperref` picks its `hhitex.def` driver itself, `graphics`/`color` need `hitex.def`, `graphics.cfg`, and `color.cfg` copied from the HINT repository.
* Not supported by HiTeX or without a driver: `microtype`, `pdfcomment`, `pdflscape`, `pgf` (falls back to `dvips` specials), floats (per the [upstream test notes](https://github.com/ruckertm/HINT/blob/main/hilatex/tests/README.md)), external links.
* Reading `.hnt` files needs the HintView app (Windows, macOS, Linux, Android, iOS); no browser or PDF viewer opens them.

To repeat the format build in the TeX Live 2025 image:

```shell
hitex -ini -etex -ltx -interaction=nonstopmode -jobname=hilatex hilatex.ini
hitex -fmt=hilatex main.tex
```
