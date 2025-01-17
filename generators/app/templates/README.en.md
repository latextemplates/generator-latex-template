<% if (githubpublish) {
  switch (documentclass) {
    case "lncs": -%>
# Simplified LNCS Template

> Quick start for modern LaTeXing with [LNCS](http://www.springer.com/computer/lncs).
<% if (texlive > 2024) { -%>

Please be aware that this template is optimized for overleaf, which is based on TeXLive 2024.
In case you are running a later TeXLive version (or use MiKTeX), please regenerate the template with the help of the [latex template generator].
<% } -%>
<% break; case "ieee": -%>
# Simplified IEEE Template

> Quick start for modern LaTeXing for an IEEE conference, based on the [Manuscript Template for Conference Proceedings](https://www.ieee.org/conferences_events/conferences/publishing/templates.html).

<% if (texlive > 2024) { -%>
Please be aware that this template is optimized for overleaf, which is based on TeXLive 2024.
In case you are running a later TeXLive version (or use MiKTeX), please regenerate the template with the help of the [latex template generator].

<% } -%>
The official template is distributed via CTAN as the [IEEEtran package](https://ctan.org/pkg/ieeetran), which is actively maintained.
However, de-facto configurations (hyperref) and modern features of latex (microtype) are not configured.
This template does it.

This template is for the conferences.
It is based on the `bare_conf_compsoc.tex` distributed by IEEE.
In case you need other configurations, please adapt `paper-conference.tex` or run the [latex template generator].
<% break; case "acmart": -%>
# ACM

> Quick start for modern LaTeXing for an ACM conference.

<% if (texlive > 2024) { -%>
Please be aware that this template is optimized for overleaf, which is based on TeXLive 2024.
In case you are running a later TeXLive version (or use MiKTeX), please regenerate the template with the help of the [latex template generator].

<% } -%>
The official template is distributed via CTAN as the [acmart package](https://ctan.org/pkg/acmart), which is actively maintained.
However, de-facto configurations (hyperref) and modern features of latex (microtype) are not configured.
This template does it.

This template is for the conferences.
In case you need other configurations, please adapt `paper-conference.tex` or run the [latex template generator].
<% break; case "scientific-thesis": -%>
# LaTeX Template for a Scientific Thesis

This template is a general template for scientific theses.
Currently, it is the unofficial LaTeX template for Master, Bachelor, Diploma, and Student Theses at following institutions:

- University of Stuttgart, Computer Science
  - [English example](https://latextemplates.github.io/scientific-thesis-template/main-english.pdf)
  - [German example](https://latextemplates.github.io/scientific-thesis-template/main-german.pdf)
  - [German example with minted and PlantUML](https://latextemplates.github.io/scientific-thesis-template/main-minted-german.pdf)
<!--
- Paderborn University, Computer Science - to be confirmed.
  - [English example](https://latextemplates.github.io/scientific-thesis-template/main-paderborn-english.pdf)
  - [German example](https://latextemplates.github.io/scientific-thesis-template/main-paderborn-german.pdf)
-->

The template will be extended to support theses from different institutions.

For [architectural decision records](https://adr.github.io) see [docs/adr](https://latextemplates.github.io/scientific-thesis-template/adr/).
<%  break; default: -%>
# LaTeX Document
<% break; }
} else { -%>
# LaTeX Document
<% } -%>

To build the whole document, execute following command.
Note that this requires a working perl installation.

    latexmk <%= filenames.main %>

To enable this, please move `_latexmkrc` to `latexmkrc`.

In case something goes wrong, you can instruct the LaTeX compiler to stop at the first error:

<% if (latexcompiler == "pdflatex") { -%>
    pdflatex <%= filenames.main %>
<% } else { -%>
    lualatex <%= filenames.main %>
<% } -%>

## Benefits

Following features are enabled in this template:

<% if (documentclass == 'ieee') { -%>
- Provides a skeletal [<%= filenames.main %>.tex](<% if (githubpublish) { %>https://latextemplates.github.io/IEEE/<% } %><%= filenames.main %>.tex) file
- Shows how IEEE copyright notice can be added.
<% } -%>
<% if (documentclass == 'lncs') { -%>
- Provides a skeletal [<%= filenames.main %>.tex](<% if (githubpublish) { %>https://latextemplates.github.io/LNCS/<% } %><%= filenames.main %>.tex) file
- Example to have an image being placed right to a text
<% if (githubpublish || (language == 'de')) { -%>
- Support for German documents (without broken headers):
  Contains a fix to increase compatibility with Babel.
  See <https://tex.stackexchange.com/a/441701/9075> for details.
<% } -%>
- Automatic setting of "Fig." and "Section"/"Sect." according to the LNCS style.
  Just use `\Cref{sec:xy}` at the beginning of a sentence and `\cref{sec:xy}` in the middle of a sentence.
  Thanx to [cleveref].
<% if (font == "default" || githubpublish) { -%>
- Sharper font (still compatible with Springer's requirements).
<% } -%>
<% } -%>
<% if (listings == "minted" || githubpublish) { -%>
- <% if (githubpublish) { -%>(Optional) <% } %>Typesetting of listings using advanced highlighting powered by the [minted] package.
<% } -%>
<% if (latexcompiler == "pdflatex" || githubpublish) { -%>
- Generated PDF allows for copy and paste of text without getting words with ligatures such as "workflow" destroyed.
  This is enabled by `glyphtounicode`, which encodes ligatures (such as fl) using unicode characters.
<% } -%>
- Support of hyperlinked references without extra color thanx to [hyperref].
- Better breaking of long URLs.
- Support for `\powerset` command.
<% if (todo == "pdfcomment" || githubpublish) { -%>
- <% if (githubpublish) { -%>(Optional) <% } %>Support todos as pdf annotations. This is enabled by the [pdfcomment] package.
<% } -%>
- [microtypographic extensions](https://www.ctan.org/pkg/microtype) for a better look of the paper.
- Modern packages such as [microtype], [cleveref]<% if (enquotes == "csquotes" || githubpublish) { %>, [csquotes]<% } %><% if (documentclass != 'lncs') { %>, [paralist]<% } %>, [hyperref], [hypcap], [upquote]<% if (documentclass == 'lncs') { %>, [natbib]<% } %>, [booktabs].
<% if (latexcompiler == "lualatex" || githubpublish) { -%>
- <% if (githubpublish) { -%>(Optional) <% } %>LaTeX compilation using the modern lualatex compiler.
<% } -%>
- Ready-to-go configuration for [latexindent].
- Proper hyphenation and microtype for English texts.
<% if (howtotext) { -%>
- Hints on writing an abstract and thesis by Dirk Fahland.
<% } -%>

## Disabled features

Following features were not activated for this template.
You can <% if (!githubpublish) { %>re<% } %>run the [latex template generator] to enable the features.

<% var missingFeatures = false -%>
<% if (!howtotext) { missingFeatures = true; -%>
<% if (!githubpublish) { %>- <% } %>Hints on writing an abstract and thesis by Dirk Fahland.
<% } -%>
<% if (!githubpublish) { -%>
<% if (documentclass == 'lncs') { -%>
<% if (language != 'de') { missingFeatures = true; -%>
- Support for German documents (without broken headers):
  Contains a fix to increase compatibility with Babel.
  See <https://tex.stackexchange.com/a/441701/9075> for details.
<% } -%>
<% } -%>
<% if (listings != "minted") { missingFeatures = true; -%>
- Typesetting of listings using advanced highlighting powered by the [minted] package.
<% } -%>
<% if (todo == "none") { missingFeatures = true; -%>
- Support todos as pdf annotations. This is enabled by the [pdfcomment] package.
<% } -%>
<% if (enquotes == "plainlatex") { -%>
- Modern packages such as <% if (enquotes == "plainlatex") { missingFeatures = true; %>[csquotes]<% } %>.
<% } -%>
<% if (latexcompiler != "lualatex") { -%>
- LaTeX compilation using the modern lualatex compiler.
<% } -%>
<% } -%>
<% if (!missingFeatures) { -%>
Congratulations. You chose to use all available features.
<% } -%>
<% if (githubpublish) {
  switch (documentclass) {
    case "lncs": -%>

## Examples

- [paper.pdf](https://latextemplates.github.io/LNCS/paper.pdf) - normal paper.
- [paper-minted.pdf](https://latextemplates.github.io/LNCS/paper-minted.pdf) - paper showing minted in action.
- [paper-newtx.pdf](http://latextemplates.github.io/LNCS/paper-newtx.pdf) - paper typeset in Times Roman to save some space.
- [paper-minted-newtx.pdf](http://latextemplates.github.io/LNCS/paper-minted-newtx.pdf) - paper typeset in Times Roman to save some space.

## Background

The official template is available at <https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines> --> "Templates, samples files & useful links" --> "LaTeX2e Proceedings Templates (zip)"

## Quick start

- Click on `Download ZIP` or [here](https://github.com/latextemplates/LNCS/archive/main.zip).
- Extract `LNCS-main.zip` in the folder where you want to write your paper.
- Edit [paper.tex](paper.tex).
- `latexmk paper`.

When using on overleaf, you have to switch Overleaf to use TeXLive 2022 (or later).

As you see on GitHub actions, the paper compiles out of the box.
There is no need to adjust the packages or to remove some of them.
This might lead to undesiered results such as hyperlinks not working any more or no good microtypographic features.
In case you think, a package needs to be altered or added, feel free to open an issue.
<% break; case "ieee": -%>

## Examples

- [paper-conference.pdf](https://latextemplates.github.io/IEEE/paper-conference.pdf) - regular conference paper.
- [paper-conference-minted.pdf](https://latextemplates.github.io/IEEE/paper-conference-minted.pdf) - conference paper showing minted in action.

## Quick start

- Click on `Download ZIP` or [here](https://github.com/latextemplates/IEEE/archive/main.zip).
- Extract `main.zip` in the folder where you want to write your paper.
- Edit [paper-conference.tex](paper-conference.tex).
- `latexmk paper-conference`.

## Attention regarding `compsocconf`

Some conferences distribute a `IEEEtran.cls` V1.7a dated 2007 and a parameter `compsocconf`.
**The parameter `compsocconf` was NEVER included in Michael Shell's IEEEtran.cls file. It is unclear, who did this patch and why it is around in the wild.**

The most recent version is V1.8b and automatically distributed over CTAN, because it is actively maintained by Michael Shell at <http://www.michaelshell.org/tex/ieeetran/>.
A full changelog is available at <http://mirror.ctan.org/tex-archive/macros/latex/contrib/IEEEtran/changelog.txt>.

```text
 2014/09/17 V1.8a (MDS) changes:

 1) Extensive rework of the compsoc mode to comply with the latest standards
    of the IEEE Computer Society.
```

The class parameter `compsocconf` never existed officially.
One has to use `conference, compsoc`, because the parameters are "orthogonal": Either "conference" or "journal", either "compsoc" or not.
With a modern IEEEtran.cls, you'll get

```text
LaTeX Warning: Unused global option(s):
    [compsocconf].
```

## `compsoc` option is not needed any more

When using the 2007 version or the most recent version with (the unhandled) `compsocconf`, you'll get [paper-conference.pdf](https://latextemplates.github.io/IEEE/paper-conference.pdf) instead of `paper-conference-compsoc.pdf`.
That differs significantly in the style used for section headings.
`paper-conference-compsoc.pdf` was removed from the build since August 2021, because `compsoc` option was not used by computer science conferences in 2021.

IEEE distributes their templates at <https://www.ieee.org/conferences_events/conferences/publishing/templates.html>.
With the update of July 2017, the archive <https://www.ieee.org/documents/ieee-latex-conference-template.zip> contains both `bare_conf.tex` and `bare_conf_compsoc.tex`.
Thus, the conference should state which option to use.

All in all, the distributions of IEEEtran from 2007 are roughly equivalent to `\documentclass[conference]{IEEEtran}` (and version V1.8b), which **does not comply** with IEEE's rules for computer science conferences, because the `compsoc` option is missing.

Hence, **double check with your conference whether you have to use `compsoc` or not.**

Statement from IEEE:

> Please note that, as stated on the webpage <https://www.ieee.org/conferences_events/conferences/publishing/templates.html>. "IEEE does not require a specific format for their conference articles". Thus, we dot not purport that the "compsoc" is a requirement for publishing conference papers with us.
<% break; default: -%>
<% break; }
} else { -%>
<% } -%>

## Tool hints
<% switch (documentclass) { case "lncs": -%>

There is currently no official biblatex support.
A first step towards that is done at [biblatex-lncs](https://ctan.org/pkg/biblatex-lncs).
<% break; case "ieee": -%>

There is currently no official biblatex support.
A first step towards that is done at the [biblatex-ieee package](https://ctan.org/pkg/biblatex-ieee).
<% break; default: -%>
<% break; } -%>

MiKTeX installation hints are given at <http://latextemplates.github.io/scientific-thesis-template/#installation-hints-for-windows>.

- Grammar and spell checking is available at [TeXstudio].
  Please download [LanguageTool] (Windows: `choco install languagetool`) and [configure TeXstudio to use it](http://wiki.languagetool.org/checking-la-tex-with-languagetool#toc4).
  Note that it is enough to point to `languagetool.jar`.
  **If TeXstudio doesn't fit your need, check [the list of all available LaTeX Editors](http://tex.stackexchange.com/questions/339/latex-editors-ides).**
- Use [JabRef] to manage your bibliography (Windows: `choco install jabref`).
<% if (listings == "minted" || githubpublish) { -%>

To have minted running properly, you have to do following steps on Windows:

1. Install python: `choco install python` - that uses [chocolatey](https://chocolatey.org/) to install Python
2. Install [pygments]: `pip instal pygments` - that uses the Pyhton package manager to install the pygments library
3. When latexing, use `-shell-escape`: `pdflatex -shell-escape <%= filenames.main %>`.
   You can also just execute `latexmk <%= filenames.main %>`.
<% } -%>
<% switch (docker) { case "reitzig": -%>

## Usage with docker

The generated `Dockerfile` is based on the [Dockerfile by reitzig](https://github.com/reitzig/texlive-docker).
The idea of that system is to host the document sources in a directory separated from the output directory.

    docker run --rm -v "c:\users\example\latex-document:/work/src" -v "c:\users\example\latex-document\out:/work/out" ltg work latexmk

Following one-time setup is required:

    docker build -t ltg .

<% break; case "iot": -%>

## Usage with docker

The generated `Dockerfile` is based on the [Dockerfile by the Island of TeX](https://gitlab.com/islandoftex/images/texlive#tex-live-docker-image).

    docker run --rm -v "c:\users\example\latex-document:/workdir" ltg latexmk

Following one-time setup is required:

    docker build -t ltg .

<% break; default: -%>
<% break; } -%>
## FAQs
<% switch (documentclass) { case "lncs": -%>

### Q: Overleaf outputs a warning regarding the llncs class

Overleaf might output following warning:

> LaTeX Warning: You have requested, on input line 8, version
> 2018/03/10' of document class llncs, but only version 2004/08/17 v2.14
> LaTeX document class for Lecture Notes in Computer Science'
> is available.

The reason is that you did not use `llncs.cls` (included in your LaTeX distribution).
Please remove the file and update your LaTeX distribution.
<% break; case "ieee": -%>

### Q: I have questions on the IEEEtran class itself.

The author of the class offers a large FAQ at <http://www.michaelshell.org/tex/ieeetran/>.
Please read on there.
The other possibility is to execute `texdoc ieeetran` and read in the documentation.
For example, there is an explanation of how to typeset the affiliation information with four or more authors properly.
<% break; case "ustutt": -%>

### Q: I get the error `Reload initiated (formats: otf,ttf,ttc); reason: Font "Inconsolatazi4" not found.`

Install package `inconsolata`
<% break; default: -%>
<% break; } -%>
<% if (githubpublish) { -%>

### Q: How can I synchronize updates from the template to my repository?

1. Initialize your git repository as usual
2. Add this repository as upstream: `git remote add upstream https://github.com/latextemplates/LNCS.git`
3. Merge the branch `upstream/main` into your `main` branch: `git merge upstream/main`.

After that you can use and push the `main` branch as usual.
Notes on syncing with the upstream repository [are available from GitHub](https://help.github.com/articles/syncing-a-fork/).
<% } -%>

### Q: I get the error `! pdfTeX error (font expansion): auto expansion is only possible with scalable fonts.`

Install the `cm-super` package using the MiKTeX package manager. Then, run `initexmf --mkmaps` on the command line. (Long description: <https://tex.stackexchange.com/a/324972/9075>)

### Q: I get `Package csquotes Error: Unbalanced groups or invalid nesting.` What can I do?

A: You have activated `\MakeOuterQuote{"}` and used some special babel command to allow hyphenation at other places as a dash. One example is writing `application"=specific`.
Now, you have to decide whether you want keep using plain quotes to enquote a word or use the special hyphenation command.
In other words: Do you want `"quote"` and `app\-lication\-specific` or `\enquote{quote} and  application"=specific`?

Note that this should not happen when the template is generated as the setting `tweakouterquote` ensures that these two options are mutually exclusive.

### Q: I need more space. What can I do?

The most simple solution to get more space is to exchange the font.

### Q: How can I reformat my `.tex` files?

Execute following command:

    latexindent -l -s -sl -w <%= filenames.main %>.tex

### Q: I want to obey the one-sentence-per-line rule. How can I do that?

Execute following command:

    latexindent -m -l -s -sl -w <%= filenames.main %>.tex

Attention! This is work in progress and does not always produce best results.
<% if (documentclass == 'lncs') { -%>

### Q: Is it possible to have a footer indicating that the paper is intended to be submitted/submitted/published?

Activate the `llncsconf` package.
The possible options are listed in `<%= filenames.main %>.tex`.
<% } -%>
<% if ((documentclass == 'acm') || (documentclass == 'ieee')) { -%>

### Q: Is it possible produce a self-archiving version?

Use the [`authorarchive` package](https://ctan.org/pkg/authorarchive).
<% } -%>

### Q: Can I also write in German?

Yes. You can regenerate the template and choose "German" as language.

<% if (githubpublish || (language == 'de')) { -%>
### Q: `ngerman-x-latest` is reported missing

Install the package `dehyph-exptl`.

<% } -%>
<% if (githubpublish) { -%>
### Q: I get ``! I can't find file `clmr28t10+20'.``

You seem to use `latexmk` locally.
Please move `_latexmkrc` to `latexmkrc` to get `latexmk` working.
If you don't do this, `latexmk` tries to execute `latex`, which tries to produce a DVI file (and not a PDF file).

<% } -%>
## Further information

<% if (documentclass == 'lncs') { -%>
- tex.stackexchange.com questions regarding LNCS: <https://tex.stackexchange.com/questions/tagged/lncs>
<% if (githubpublish) { -%>
- Original LNCS demonstration (without the improvements): [llncs-dem.pdf](llncs-dem.pdf)
- Original LNCS documentation (without the improvements): [llncs-doc.pdf](llncs-doc.pdf)
<% } -%>
<% } -%>
- Other templates: <https://latextemplates.github.io/>

[booktabs]: https://ctan.org/pkg/booktabs
[cleveref]: https://ctan.org/pkg/cleveref
[csquotes]: https://www.ctan.org/pkg/csquotes
[hypcap]: https://www.ctan.org/pkg/hypcap
[hyperref]: https://ctan.org/pkg/hyperref
[latexindent]: https://ctan.org/pkg/latexindent
[microtype]: https://ctan.org/pkg/microtype
[minted]: https://ctan.org/pkg/minted
[natbib]: https://ctan.org/pkg/natbib
[paralist]: https://www.ctan.org/pkg/paralist
[pdfcomment]: https://www.ctan.org/pkg/pdfcomment
[upquote]: https://www.ctan.org/pkg/upquote

[JabRef]: https://www.jabref.org
[LanguageTool]: https://languagetool.org/
[latex template generator]: https://www.npmjs.com/package/generator-latex-template
[pygments]: http://pygments.org/
[TeXstudio]: http://texstudio.sourceforge.net/
<% if (documentclass == 'lncs') { -%>

[llncs2e.zip]: ftp://ftp.springernature.com/cs-proceeding/llncs/llncs2e.zip
<% } -%>

<!-- disable markdown-lint rules contradicting our writing of FAQs -->
<!-- markdownlint-disable-file MD001 MD013 MD026 -->
