# Use graphicscache to shrink images

## Context and Problem Statement

Photos and screenshots included with `\includegraphics` are embedded as they are, so a thesis with many high-resolution images easily grows to tens of megabytes ([generator-latex-template#609](https://github.com/latextemplates/generator-latex-template/issues/609)).
How to keep the PDF small without asking authors to prepare their images?

## Considered Options

* [graphicscache](https://ctan.org/pkg/graphicscache), loaded only when shell escape is enabled
* graphicscache always, with a generator switch
* downsample the images before including them (ImageMagick, Ghostscript)
* post-process the finished PDF with Ghostscript

## Decision Outcome

Chosen option: "graphicscache, loaded only when shell escape is enabled", because it works on the unchanged sources and needs no knob: it re-encodes each image once through Ghostscript (lossless `compress=flat`, at most 300 dpi) and caches the result in `graphicscache/`, so later runs are as fast as before.
The package needs `\write18` for Ghostscript and an external `pdflatex`, so the preamble loads it only under `--shell-escape` (`\sys_if_shell_unrestricted:T`); a plain run embeds the images as before.
Its `compress=flat` option spells the Ghostscript filter "FlatEncode", which Ghostscript rejects; the preamble corrects it to `FlateEncode` after loading (reported as [xqms/graphicscache#30](https://github.com/xqms/graphicscache/issues/30)).
It also does not know graphicx's `alt` key, which the markdown package sets; the preamble forwards it ([xqms/graphicscache#29](https://github.com/xqms/graphicscache/issues/29)).

### Consequences

* Good, because a `--shell-escape` build (PlantUML, minted up to TeX Live 2024, or by choice) gets smaller PDFs with no further configuration.
* Bad, because the first `--shell-escape` run is slower: one `pdflatex` and one Ghostscript call per image.
* Bad, because a build without shell escape is unchanged, so the gain is invisible to most authors unless they enable it.

## More Information

The options and their pros and cons in general: [How to shrink images in the PDF](https://github.com/latextemplates/gadr-latex-packages/blob/main/image-compression.md).
