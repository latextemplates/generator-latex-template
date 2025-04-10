<% if (githubpublish) {
  switch (documentclass) {
    case "lncs": -%>
# Enhanced LNCS Template

> Quick start for modern LaTeXing with [LNCS](http://www.springer.com/computer/lncs).
<% if (texlive > 2024) { -%>

Please be aware that this template is optimized for overleaf, which is based on TeXLive 2024.
In case you are running a later TeXLive version (or use MiKTeX), please regenerate the template with the help of the [latex template generator].
<% } -%>
<% break; case "ieee": -%>
# Enhanced IEEE Template

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
In case you need other configurations, please adapt `paper.tex` or run the [latex template generator].
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
In case you need other configurations, please adapt `paper.tex` or run the [latex template generator].
<% break; case "ustutt": -%>
# University of Stuttgart PhD Thesis Template

> Unofficial LaTeX template for PhD theses at the University of Stuttgart, Germany.

## Example PDFs

- Thesis 🇩🇪: [thesis-example.pdf](http://latextemplates.github.io/uni-stuttgart-dissertation-template/thesis-example.pdf)
- Thesis 🇺🇸: [thesis-example-listings-en.pdf](http://latextemplates.github.io/uni-stuttgart-dissertation-template/thesis-example-listings-en.pdf)
- Thesis (minted) 🇩🇪: [thesis-example-minted-de.pdf](http://latextemplates.github.io/uni-stuttgart-dissertation-template/thesis-example-minted-de.pdf)
- Thesis (minted) 🇺🇸: [thesis-example-example-minted-en.pdf](http://latextemplates.github.io/uni-stuttgart-dissertation-template/thesis-example-example-minted-en.pdf)
- Book cover: [cover.pdf](http://latextemplates.github.io/uni-stuttgart-dissertation-template/cover.pdf)
- Spine of the book cover: [spine.pdf](http://latextemplates.github.io/uni-stuttgart-dissertation-template/spine.pdf)
<% break; case "scientific-thesis": -%>
# LaTeX Template for a Scientific Thesis

This template is a general template for scientific theses.
Currently, it is the unofficial LaTeX template for Master, Bachelor, Diploma, and Student Theses at following institutions:

- University of Stuttgart, Computer Science
  - 🇺🇸 [English example](https://latextemplates.github.io/scientific-thesis-template/main-english.pdf)
  - 🇺🇸 [English example with minted and PlantUML](https://latextemplates.github.io/scientific-thesis-template/main-minted-english.pdf)
  - 🇩🇪 [German example](https://latextemplates.github.io/scientific-thesis-template/main-german.pdf)
  - 🇩🇪 [German example with minted and PlantUML](https://latextemplates.github.io/scientific-thesis-template/main-minted-german.pdf)

The template will be extended to support theses from different institutions.

For [architectural decision records](https://adr.github.io) see [docs/adr](docs/adr/).

## Quick start

1. Download
    1. Go to the development version at <https://github.com/latextemplates/scientific-thesis-template/archive/main.zip>. Reason: LaTeX packages change so fast over time and we cannot do a release on each change.
    2. Extract `scientific-thesis-template-main.zip` to the directory you want to work. E.g., `c:\users\user\documents\thesis`.
2. Start texing
    - University of Stuttgart:
        - English: `main-english.tex`
        - German: `main-german.tex`
        - German advanced usage: `main-minted-german.tex` (see below)

### Usage at overleaf

See [overleaf](overleaf/).
<%  break; default: -%>
# LaTeX Document
<% break; }
} else { -%>
# LaTeX Document
<% } -%>

## Usage

- `<%= filenames.main %>.tex` is the main document
- Use "<%= reallatexcompiler %> + <%= bibtextool %>" in your TeX editor or `latexmk <%= filenames.main %>` / `make` in the command line

### Using `latexmk`

[latexmk] is a very smart tool for latex compilation.
It executes the latex tools as often as needed to get the final PDF.
(More information about why `latexmk` is great can be found at <https://tex.stackexchange.com/a/249243/9075>.)

To build the whole document, execute following command.
Note that this requires a working perl installation.

```bash
latexmk <%= filenames.main %>
```

<% if (overleaf || githubpublish) { -%>
To enable latexmk, please move `_latexmkrc` to `latexmkrc`.
<% } -%>

If you want automatic compilation use following command:

```bash
latexmk -pvc <%= filenames.main %>
```

This will also open a [Sumatra PDF] and only works with the supplied configuration.

#### latexmk configuration

This repository ships a `.latexmkrc` which is read by latexmk.
In case there is a `_latexmkrc` file, you need to rename it to `.latexmkrc`.
It is configured for Windows and especially sets Sumatra PDF as default PDF viewer.
You can make this local configuration a global configuration, when you put it at [the right place](http://tex.stackexchange.com/a/41149/9075).

If you want to add more packages, configure it there.
For instance, for support of makeglossaries see <http://tex.stackexchange.com/questions/1226/how-to-make-latexmk-use-makeglossaries>.

### Debugging LaTeX errors

In case something goes wrong, you can instruct the LaTeX compiler to stop at the first error:

```bash
<%= reallatexcompiler %> --synctex=1 --shell-escape <%= filenames.main %>
```

Run `<% if (bibtextool == "biblatex") { %>biber<% } else { %>bibtex<% } %> <%= filenames.main %>` to get the bibliography rendered (execute `lualatex` afterwards).

### Advanced usage

On the command line, there are additional features:

- `latexmk -C` or `make clean` for cleaning up
- `make format` to reformat the `.tex` files (one sentence per line and indent)
- `make aspell` for interactive spell checking
- `make stand`: Creates a new PDF with the current status of the thesis.
- `make view`: Opens the configured viewer
- `make mrproper`: Cleans up and removes also editor backup files.

## Benefits

Following features are enabled in this template:

<% if (documentclass == 'ustutt') { -%>
- Output format is A5
- Title page
- Nice chapter headings
- Most recent LaTeX packages and package configuration based on long-time experience.
<% } -%>
<% if (documentclass == 'ieee') { -%>
- Provides a skeletal [<%= filenames.main %>.tex](<%= filenames.main %>.tex) file
- Shows how IEEE copyright notice can be added.
<% } -%>
<% if (documentclass == 'lncs') { -%>
- Provides a skeletal [<%= filenames.main %>.tex](<%= filenames.main %>.tex) file
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
  `minted` provides better output than [listings], but requires [pygments] to be installed.
<% } -%>
<% if (latexcompiler == "pdflatex" || githubpublish) { -%>
- Generated PDF allows for copy and paste of text without getting words with [ligatures](https://en.wikipedia.org/wiki/Typographic_ligature) such as "workflow" destroyed.
  This is enabled by `glyphtounicode`, which encodes ligatures (such as fl) using unicode characters.
<% } -%>
<% if ((reallatexcompiler.startsWith("lualatex")) || githubpublish) { -%>
- Ligatures are removed if they are typeset at the wrong place.
  This is enabled by the [selnolig](https://tex.meta.stackexchange.com/questions/2884/new-package-selnolig-that-automates-suppression-of-typographic-ligatures) package.
<% } -%>
- Support of hyperlinked references without extra color thanx to [hyperref].
- Better breaking of long URLs.
- Support for `\powerset` command.
<% if (todo == "pdfcomment" || githubpublish) { -%>
- <% if (githubpublish && !isThesis) { -%>(Optional) <% } %>Support todos as pdf annotations. This is enabled by the [pdfcomment] package.
<% } -%>
- [microtypographic extensions](https://www.ctan.org/pkg/microtype) for a better look of the paper.
- Modern packages such as [microtype], [cleveref]<% if (enquotes == "csquotes" || githubpublish) { %>, [csquotes]<% } %><% if (documentclass != 'lncs') { %>, [paralist]<% } %>, [hyperref], [hypcap], [upquote]<% if (documentclass == 'lncs') { %>, [natbib]<% } %>, [booktabs].
<% if ((reallatexcompiler.startsWith("lualatex")) || githubpublish) { -%>
- <% if (githubpublish && !isThesis) { -%>(Optional) <% } %>LaTeX compilation using the modern [lualatex] compiler.
  For older systems, [pdflatex](https://en.wikipedia.org/wiki/PdfTeX) is still supported.
<% } -%>
<% if (bibtextool == "biblatex") { -%>
- [biblatex]+[biber] instead of plain [bibtex] to have a more intuitive `.bib` file:
  Unicode (UTF-8) is fully supported and commands such as `\citeauthor{...}` work out of the box. See also <https://tex.stackexchange.com/q/8411/9075>.
<% } -%>
- [latexmk] for easy compilation of the LaTeX document.
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
<% if (!reallatexcompiler.startsWith("lualatex")) { -%>
- LaTeX compilation using the modern [lualatex] compiler.
<% } -%>
<% } -%>
<% if (!missingFeatures) { -%>
Congratulations. You chose to use all available features.
<% } -%>

<% switch (documentclass) { case "lncs": -%>
There is currently no official biblatex support.
A first step towards that is done at [biblatex-lncs](https://ctan.org/pkg/biblatex-lncs).

<% break; case "ieee": -%>
There is currently no official biblatex support.
A first step towards that is done at the [biblatex-ieee package](https://ctan.org/pkg/biblatex-ieee).

<% break; default: -%>
<% break; } -%>
<% if (githubpublish) {
  switch (documentclass) {
    case "lncs": -%>
## Examples

- [paper.pdf](https://latextemplates.github.io/lncs-enhanced/paper.pdf) - normal paper.
- [paper-minted.pdf](https://latextemplates.github.io/lncs-enhanced/paper-minted.pdf) - paper showing minted in action.
- [paper-newtx.pdf](http://latextemplates.github.io/lncs-enhanced/paper-newtx.pdf) - paper typeset in Times Roman to save some space.
- [paper-minted-newtx.pdf](http://latextemplates.github.io/lncs-enhanced/paper-minted-newtx.pdf) - paper typeset in Times Roman to save some space.

## Background

The official template is available at <https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines> --> "Templates, samples files & useful links" --> "LaTeX2e Proceedings Templates (zip)"

## Quick start

- Click on `Download ZIP` or [here](https://github.com/latextemplates/lncs-enhanced/archive/main.zip).
- Extract `LNCS-main.zip` in the folder where you want to write your paper.
- Edit [paper.tex](paper.tex).
- `latexmk paper`.

When using on overleaf, you have to switch Overleaf to use TeXLive 2024 (or later).

As you see on GitHub actions, the paper compiles out of the box.
There is no need to adjust the packages or to remove some of them.
This might lead to undesired results such as hyperlinks not working any more or no good microtypographic features.
In case you think, a package needs to be altered or added, feel free to open an issue.

<% break; case "ieee": -%>
## Examples

- [paper.pdf](https://latextemplates.github.io/ieee-enhanced/paper.pdf) - regular conference paper.
- [paper-minted.pdf](https://latextemplates.github.io/ieee-enhanced/paper-minted.pdf) - conference paper showing minted in action.

## Quick start

- Click on `Download ZIP` or [here](https://github.com/latextemplates/IEEE/archive/main.zip).
- Extract `main.zip` in the folder where you want to write your paper.
- Edit [paper.tex](paper.tex).
- `latexmk paper`.

## Attention regarding `compsocconf`

Some conferences distribute a `IEEEtran.cls` V1.7a dated 2007 and a parameter `compsocconf`.
**The parameter `compsocconf` was NEVER included in Michael Shell's `IEEEtran.cls` file. It is unclear, who did this patch and why it is around in the wild.**

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

### Prerequisites

- Windows: Recent [MiKTeX](http://miktex.org/). MiKTeX installation hints are given at <http://latextemplates.github.io/scientific-thesis-template/#installation-hints-for-windows>.
- Mac OS X: Recent [TeX Live](https://www.tug.org/texlive/) (e.g. through [MacTeX](https://tug.org/mactex/)) - Try `sudo tlmgr update --all` if you encounter issues with biblatex
- Linux: Recent TeX Live distribution
<% if (isThesis) { -%>

See [docs/latex-setup](docs/latex-setup) for refined installation instructions.
<% } else { -%>
- Grammar and spell checking is available at [TeXstudio].
  Please download [LanguageTool] (Windows: `choco install languagetool`) and [configure TeXstudio to use it](http://wiki.languagetool.org/checking-la-tex-with-languagetool#toc4).
  Note that it is enough to point to `languagetool.jar`.
  **If TeXstudio doesn't fit your need, check [the list of all available LaTeX Editors](http://tex.stackexchange.com/questions/339/latex-editors-ides).**
- Use [JabRef] to manage your bibliography (Windows: `choco install jabref`).
<% } -%>
<% if (listings == "minted" || githubpublish) { -%>

### Usage of `minted`

To have minted running properly, you have to do following steps on Windows:

1. Install python: `choco install python` - that uses [chocolatey](https://chocolatey.org/) to install Python
2. Install [pygments]: `pip instal pygments` - that uses the Pyhton package manager to install the pygments library
3. When latexing, use `-shell-escape`: `pdflatex -shell-escape <%= filenames.main %>`.
   You can also just execute `latexmk <%= filenames.main %>`.
<% } -%>

### VSCode configuration

Currently, following extensions are recommended:

- [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) to support LaTeX in VSCode and
- [LaTeX Utilities](https://marketplace.visualstudio.com/items?itemName=tecosaur.latex-utilities) to enhance LaTeX Workshop
- [LTeX+] to have a nice spell checker that also identifies grammar issues

Then, change the setting of LaTeX Workshop to use biber:

Press <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>P</kbd> to open the command palette.
Then type "JSON" and select "Preferences: Open Settings (JSON)" to open `settings.json`.

Update the following lines in VSCode's `settings.json` to contain:

```javascript
    "latex-workshop.latex.recipes": [
        {
            "name": "<%= reallatexcompiler %> ➞ <%= bibtextool %> ➞ <%= reallatexcompiler %> × 2 🔃",
            "tools": [
                "<%= reallatexcompiler %>",
                "<%= bibtextool %>",
                "<%= reallatexcompiler %>",
                "<%= reallatexcompiler %>"
            ]
        },
    ],
    "latex-workshop.latex.tools": [
        // ...
        {
            "name": "<%= bibtextool %>",
            "command": "<%= bibtextool %>",
            "args": [
                "%DOCFILE%"
            ],
            "env": {}
        },
        // ...
    ],
```
<%#

  {
    "name": "pdflatex",
    "command": "pdflatex",
    "args": [
      "-synctex=1",
      "-interaction=nonstopmode",
      "-file-line-error",
      "%DOC%"
    ],
    "env": {}
  },
-%>

The following settings are additionally recommended:

```javascript
{
    "editor.wordWrap": "on",                              // enable soft line breaks
    "latex-workshop.view.pdf.viewer": "tab",              // display the generaded PDF in a separate tab
    "latex-workshop.view.pdf.backgroundColor": "#cccccc", // use a darker background in de PDF viewer to lift of the pages from it
    "latex-workshop.latex.autoBuild.run": "never",        // never automatically build; alternative: "onSave" (on saving .tex files)
    "editor.renderWhitespace": "all",                     // display all whitespaces
}
```

Alternatively, just copy and paste the contents of the [vscode.settings.json](vscode.settings.json) file to your VSCode settings file.

You can manually trigger compilation by hitting the green button in the extension or using other methods provided by LaTeX Workshop.

Please remove the magic comments (`% !TeX program ...`) at the top of the `main-....tex` file.
Although [LaTeX-Workshop supports magic comments](https://github.com/James-Yu/LaTeX-Workshop/blob/master/README.md#magic-comments), it currently does not work reliably.
Without the magic comments, compilation works.

### LTeX+ tips and tricks

[LTeX+] is an offline grammar and spell checker with support for LaTeX and Markdown.

Add a magic comment to your files to tell LTeX+ which language to use:

```latex
% LTeX: language=de-DE
```

If you want to use different languages in the text, use the `\foreignlanguage{language}{text}` command.
LTeX+ will detect these elements and automatically switch the spell checker's language.
For example:

```latex
\foreignlanguage{english}{Therefore, our proposed approach will change the world.}
```
<% switch (docker) { case "reitzig": -%>

## Usage with docker

The generated `Dockerfile` is based on the [Dockerfile by reitzig](https://github.com/reitzig/texlive-docker).
The idea of that system is to host the document sources in a directory separated from the output directory.

```cmd
docker run --rm -v "c:\users\example\latex-document:/work/src" -v "c:\users\example\latex-document\out:/work/out" ltg work latexmk
```

Following one-time setup is required:

```cmd
docker build -t ltg .
```

<% break; case "iot": -%>

## Usage with docker

The generated `Dockerfile` is based on the [Dockerfile by the Island of TeX](https://gitlab.com/islandoftex/images/texlive#tex-live-docker-image).

```cmd
docker run --rm -v "c:\users\example\latex-document:/workdir" ltg latexmk
```

Following one-time setup is required:

```cmd
docker build -t ltg .
```

<% break; default: -%>
<% break; } -%>
## Contained Directories and Files

### Directories

- [figures](graphics/) Directory containing the figures.
  By using LuaLaTex/PDFLaTeX it is possible to use PDFs, JPGs, PNGs, ... We recommend to use PDFs to enable smooth scaling.

### Files

- `<%= filenames.main %>.tex` - The main `.tex` file loading all LaTeX packages and their configurations.
  - Add text here
  - Adjust title etc. here
- [bibliography.bib](bibliography.bib) - Bibliography. [biblatex] format. Manage it with [JabRef].
- [abbreviations.tex](abbreviations.tex) - Acronyms and abbreviations.
- [commands.tex](commands.tex) - Example LaTeX macros.

Following additional files are included, which do not need to be adapted:

- [localSettings.yaml](localSettings.yaml) - Settings for [latexindent](https://ctan.org/pkg/latexindent)
- [Makefile](Makefile) - The Makefile. Builds on latexmk.
- [Texlivefile](Texlivefile) - List of packages required for a minimal TeXLive installation.

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

### Q: How to rename `thesis-example.tex`?

You probably don't want your document to be named `example`. In order to change this,
replace the term `thesis-example` by e.g., `thesis-topic-name` in the following locations:

| location                         | occurrence                                |
|----------------------------------|-------------------------------------------|
| `print-version--cover/cover.tex` | `\includegraphics{../thesis-example.pdf}` |
| `.gitignore`                     | `thesis-example.pdf`                      |
| `.gitignore`                     | `thesis-example*.png`                     |
| `Makefile`                       | `MASTER_TEX = thesis-example.tex`         |

### Q: I get the error `Reload initiated (formats: otf,ttf,ttc); reason: Font "Inconsolatazi4" not found.`

Install package `inconsolata`
<% break; default: -%>
<% break; } -%>
<% if (githubpublish) { -%>

### Q: How can I synchronize updates from the template to my repository?

1. Initialize your git repository as usual
2. Add this repository as git remote: `git remote add template https://github.com/latextemplates/{template}.git`
3. Merge the branch `template/main` into your `main` branch: `git merge template/main`.

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

Execute `latexindent -l -s -sl -w <%= filenames.main %>.tex`

Alternatively, execute `make format`.

### Q: How I want to obey the one-sentence-per-line rule. How to do?

See "How can I reformat my `.tex` files?"

### Q: I want to use minted, because I think its syntax highlighting seems to be better.

You can re-generate the template and choose `minted` as listings environment.
Moreover, ensure that python and [pygments](https://pygments.org/) are installed properly:

- `choco install python`
- `pip install pygments`

### Q: I have troubles with minted on Windows.

Try out following command to update `latexminted`.
See [minted#425](https://github.com/gpoore/minted/issues/425) for details.

```shell
py -m pip install --force-reinstall latexminted
```

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

<% if (isThesis) { -%>
### Q: I was recommended the Harvard style

This template uses the alphabetic style.
That style is explained at the [biblatex documentation](http://texdoc.net/texmf-dist/doc/latex/biblatex/biblatex.pdf) on page 60:

> The alphabetic labels resemble a compact author-year
> style to some extent, but the way they are employed is similar to a numeric citation
> scheme. For example, instead of “Jones 1995” this style would use the label “[Jon95]”.
> “Jones and Williams 1986” would be rendered as “[JW86]”.

We are aware that the University of Stuttgart [recommends to use the Hardvard style](https://ilias3.uni-stuttgart.de/ilias.php?ref_id=12257&from_page=11895&obj_id=11896&cmd=layout&cmdClass=illmpresentationgui&cmdNode=dn&baseClass=ilLMPresentationGUI).
However, this style is not common in natural sciences and information science.

<% } -%>
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
### Q: I get `Font "LatinModernMath-Regular" not found.`. What can I do?

Error message:

```text
luaotfload | db : Reload initiated (formats: otf,ttf,ttc); reason: Font "LatinModernMath-Regular" not found.
luaotfload | resolve : sequence of 3 lookups yielded nothing appropriate.

! Package fontspec Error: The font "LatinModernMath-Regular" cannot be found.
```

Install the package `lm-math` manually.

<% if (isThesis) { -%>
### Q: I get `! Package fontspec Error: The font "LinuxLibertineO" cannot be found.`. What can I do?

Install the package `libertine` manually.

<% } -%>
### Q: I get `! Package fontspec Error: The font "TeXGyreTermes" cannot be found.`. What can I do?

Install the package `tex-gyre` and `tex-gyre-math` manually.

### Q: I get `! error:  (type 1): cannot find encoding file 'ntx-ot1-tlf.enc' for reading`. What can I do?

See <https://tex.stackexchange.com/a/240850/9075>: Install the packages `newpx` and `newtxsf` manually.

### Q: I get `! TeX capacity exceeded, sorry [main memory size=3000000].`. What can I do?

Follow the steps at <https://tex.stackexchange.com/a/548335/9075>

Try with following command

```bash
<%= reallatexcompiler %> -shell-escape --extra-mem-top=10000000 --synctex=1 <%= filenames.main %>.tex
```

See <https://tex.stackexchange.com/a/124206/9075> for details.

### Q: There is an output that biber/biblatex too old

See installation hints of how to update them at different systems.

### Q: MiKTeX complains about missing `.sty` files.

Use the [MiKTeX console](https://miktex.org/howto/miktex-console) to refresh the package index.
Then, automatic installation should work again.

### Q: I cannot get minted to run. There is this `-shell-escape` warning.

Please ensure that your compilation command includes `-shell-escape`.
E.g., `lualatex -shell-escape -synctex=1 main-minted-german.tex`.
When compiling `main-minted-german.tex` with TeXStudio, you will see a dialog warning about overriding the compilation command.
Just answer "(a) allow for this document" and it will work.

### Q: How to include Excel charts properly?

1. Select the Excel chart you want to use.
2. Print to PDF with the option "Print Selected Chart".
3. Remove empty space of the created PDF page with `pdfcrop chart.pdf chart_cropped.pdf` (install via MikTeX first, if not available; check via `pdfcrop --version`).
4. Use [pdfscissors](https://sites.google.com/site/pdfscissors) to crop the borders and title (maybe you have to allow <https://sites.google.com> in the Java security center in the control panel).
5. Include the PDF in LaTeX via `\includegraphics{chart_cropped.pdf}`.

<%#
### Q: Overleaf complains about missing `.sty` files.

Google for the name of the `sty` and upload it to overleaf.
As of 2018-02-17, these are:

- `lccaps.sty` - can be downloaded from <https://latextemplates.github.io/stys-for-overleaf/>.
- `scientific-thesis-cover.sty` - can be downloaded from <https://raw.githubusercontent.com/latextemplates/scientific-thesis-cover/master/scientific-thesis-cover.sty>.

### Q: My Paderborn title page is strange. The boxes seem to be located arbitrarily.

Just run pdflatex again.
-%>
<% if (isThesis) { -%>
### Q: How do I change the appearance of chapter headings?

Look for `% Code for my fancy chapters.` in your main `.tex` file and play around with parameters.

### Q: Aren't there other templates?

Sure. The [Hagenberg Thesis Document Collection](https://github.com/Digital-Media/HagenbergThesis) seems to be the most promising.
However, they currently do not support microtype and not the cover of the University of Stuttgart.

We are collecting alternatives at the issue [#25](https://github.com/latextemplates/scientific-thesis-template/issues/25) and plan to add a comparison to each other template.

### Q: Do I have to do something special for the final version?

- If you included some version control statements, please remove them. Currently, the template does not support any, but it used to support SVN.
- By using `\largepage` and `\shortpage`, single lines at the bottom or at the top of the page can be manually fixed.
- Search the PDF for "TODO" or similar things. Remove `\usepackage{todonotes}` in your main `.tex` file.
- Ensure that you run `lualatex` at least three times and that there are no "undefined references".
- The margins are intended for good screen reading. **Do not change them** (or do exactly know what you are doing).
<% } -%>
<% if (documentclass == "scientific-thesis") { -%>
### Q: `main-minted-german.tex` does not compile: ``File `main-minted-german-plantuml.latex' not found. \end{plantuml}``. What can I do?

You did not setup the [plantuml package](https://www.ctan.org/pkg/plantuml) correctly.
Please head to <https://koppor.github.io/plantuml/> for installation instructions.

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
- For German users, go to <https://texfragen.de/>.
- Frank Mittelbach with Ulrike Fischer: [The LaTeX Companion](https://www.latex-project.org/news/2023/03/17/TLC3/) is the ultimate guide for LaTeX: The authors went through all packages offered by [CTAN](https://ctan.org/), selected the most promising ones, described them, and provide minimal working example for each of it.
- Lutz Hering, Heike Hering: [How to Write Technial Reports](https://doi.org/10.1007/978-3-540-69929-3), Springer, 2010; also available in German [Technische Berichte - verständlich gliedern, gut gestalten, überzeugend vortragen](https://doi.org/10.1007/978-3-8348-8317-9). - Highly recommended, because it guides through all aspects of a report (such as a Master Thesis).
- Marcus Deininger et al.: [Studienarbeiten - Ein Leitfaden zur Erstellung, Durchführung und Präsentation wissenschaftlicher Abschlussarbeiten am Beispiel Informatik](https://vdf.ch/studienarbeiten.html?author_id=2877), vdf. - Recommended as guideline for planning and working on the whole thesis.
- Charles Lipson, [Cite Right, Second Edition: A Quick Guide to Citation Styles--MLA, APA, Chicago, the Sciences, Professions, and More](http://www.press.uchicago.edu/ucp/books/book/chicago/C/bo10702043.html), Chicago Guides to Writing, Editing, and Publishing, 2011. - Recommended in case you are unsure about how to correctly cite something.

## License

The license of this work is [0BSD](https://spdx.org/licenses/0BSD.html) which corresponds to "public domain".
Any derived work can freely be relicensed and can omit original copyright and license information.
<% if (documentclass == "ustutt") { -%>

### Exceptions

- `ustutt-logo.pdf` is restricted. See section "Verwendung des Logos bei Abschlussarbeiten wie Dissertationen, Bachelor- und Masterarbeiten sowie Hausarbeiten" at <https://www.beschaeftigte.uni-stuttgart.de/uni-services/oeffentlichkeitsarbeit/corporate-design/logo-und-schrift/> for details.
<% } -%>

[biber]: https://www.ctan.org/pkg/biber
[biblatex]: http://tex.stackexchange.com/tags/biblatex/info
[bibtex]: https://www.ctan.org/pkg/bibtex
[booktabs]: https://ctan.org/pkg/booktabs
[cleveref]: https://ctan.org/pkg/cleveref
[csquotes]: https://www.ctan.org/pkg/csquotes
[hypcap]: https://www.ctan.org/pkg/hypcap
[hyperref]: https://ctan.org/pkg/hyperref
[latexindent]: https://ctan.org/pkg/latexindent
[latexmk]: http://tex.stackexchange.com/tags/latexmk/info
[listings]: https://ctan.org/pkg/listings
[lualatex]: http://www.luatex.org/
[microtype]: https://ctan.org/pkg/microtype
[minted]: https://ctan.org/pkg/minted
[natbib]: https://ctan.org/pkg/natbib
[paralist]: https://www.ctan.org/pkg/paralist
[pdfcomment]: https://www.ctan.org/pkg/pdfcomment
[upquote]: https://www.ctan.org/pkg/upquote

[JabRef]: https://www.jabref.org
[LanguageTool]: https://languagetool.org/
[latex template generator]: https://www.npmjs.com/package/generator-latex-template
[LTeX+]: https://marketplace.visualstudio.com/items?itemName=ltex-plus.vscode-ltex-plus
[pygments]: https://pygments.org/
[Sumatra PDF]: https://www.sumatrapdfreader.org/free-pdf-reader
<% if (documentclass == 'lncs') { -%>

[llncs2e.zip]: ftp://ftp.springernature.com/cs-proceeding/llncs/llncs2e.zip
<% } -%>

<!-- disable markdown-lint rules contradicting our writing of FAQs -->
<!-- markdownlint-disable-file MD001 MD013 MD026 -->
