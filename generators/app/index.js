"use strict";
import { options } from "./options.js";
import Generator from "yeoman-generator";
import optionOrPrompt from "yeoman-option-or-prompt";
import chalk from "chalk";
import yosay from "yosay";

export default class extends Generator {
  _optionOrPrompt = optionOrPrompt;

  async prompting() {
    this.log(yosay(`Welcome to the ${chalk.red("latex-template")} generator!`));

    // See "Development hints" in README.md for help on Inquirer.js
    // yeoman-option-or-prompt mutates the prompts (deletes `when`, replaces `choices`/`default`
    // functions by their result); pass copies so that runs in one process (the tests) stay independent.
    const props = await this._optionOrPrompt(
      options.map((prompt) => ({ ...prompt })),
    );

    // To access props later use this.props.someAnswer;
    this.props = props;

    // Somehow texlive is not routed through
    // special handling
    if (this.options.texlive) {
      this.props.texlive = parseInt(this.options.texlive, 10);
    }

    // Command line argument "--githubpublish" switches the generator to generate a template deployable on a GitHub repository (causing e.g., a refined README.md)
    this.props.githubpublish = this.options.githubpublish;
    this.props.githubpublish =
      this.props.githubpublish === true || this.props.githubpublish === "true";

    // Command line argument "--preparereitzig" switches the generator to generate a template to be used to generate Texlivefile required by https://github.com/reitzig/texlive-docker
    this.props.preparereitzig = this.options.preparereitzig;
    this.props.preparereitzig =
      this.props.preparereitzig === true ||
      this.props.preparereitzig === "true";

    // Ensure all values are set - even if the user was not asked
    if (
      this.props.documentclass === "acmart" ||
      this.props.documentclass === "ieee"
    ) {
      this.props.bibtextool = "bibtex";
      this.props.font = "default";
    }

    if (this.props.documentclass === "scientific-thesis") {
      this.props.bibtextool = "biblatex";
      this.props.font = "times";
    }

    if (this.props.documentclass === "ustutt") {
      this.props.bibtextool = "biblatex";
      this.props.font = "default";
    }

    if (this.props.documentclass === "mwe") {
      // Minimal Markdown quick start: a fixed, self-contained feature set. The
      // matching prompts are hidden in options.js, so pin every value here (this
      // also makes non-interactive `yo --documentclass=mwe` robust regardless of
      // any flags that leak through).
      this.props.bibtextool = "biblatex";
      this.props.font = "default";
      this.props.latexcompiler = "lualatex"; // Markdown + fontspec need LuaLaTeX
      this.props.listings = "listings";
      this.props.enquotes = "csquotes";
      this.props.tweakouterquote = "babel";
      this.props.todo = "none";
      this.props.howtotext = false;
      this.props.examples = false;
    }

    // --language does not work properly, therefore, we used "lang" above. The templates still use "language"
    this.props.language = this.props.lang;

    // IEEE class offers "compsoc"
    // In 2021 this is not used any more, all papers are the "normal" IEEE format
    this.props.ieeecompsoc = false;

    // As of 2021-12-24 the IEEE setup does not work on TeXLive 2021 and lualatex
    //if (this.props.documentclass === "ieee") {
    //this.props.latexcompiler = "pdflatex";
    //}

    this.props.reallatexcompiler =
      this.props.latexcompiler == "both"
        ? "lualatex"
        : this.props.latexcompiler;

    // Convert "String" Boolean command line options
    this.props.acmreview =
      this.props.acmreview === true || this.props.acmreview === "true";
    this.props.examples =
      this.props.examples === true || this.props.examples === "true";
    this.props.howtotext =
      this.props.howtotext === true || this.props.howtotext === "true";
    this.props.overleaf =
      this.props.overleaf === true || this.props.overleaf === "true";

    if (this.props.examples) {
      this.props.useExampleEnvironment = true;
      this.props.bexample = "\\begin{ltgexample}";
      this.props.eexample = "\\end{ltgexample}";
    } else {
      this.props.useExampleEnvironment = false;
      this.props.bexample = "";
      this.props.eexample = "";
    }

    // The Markdown example needs LuaLaTeX: under pdfLaTeX, the markdown package
    // runs texlua via --shell-escape, which the listings variants do not enable.
    this.props.markdown =
      this.props.examples && this.props.latexcompiler !== "pdflatex";

    if (this.props.tweakouterquote === "outerquote") {
      this.props.bquote = '"';
      this.props.equote = '"';
    } else if (this.props.enquotes === "csquotes") {
      this.props.bquote = "\\enquote{";
      this.props.equote = "}";
    } else if (this.props.enquotes === "textcmds") {
      this.props.bquote = "\\qq{";
      this.props.equote = "}";
    } else {
      this.props.bquote = '"`';
      this.props.equote = "\"'";
    }

    isPaperHandling(props);

    if (!this.props.thesisvariant) {
      this.props.thesisvariant = "none";
    }

    // The UML example is thesis-only and opt-in (see options.js). Default it to
    // "none" for every case where it was not asked (papers, examples disabled).
    if (!this.props.uml) {
      this.props.uml = "none";
    }

    // `longtable` is a plain CLI flag (no prompt), so it never blocks
    // non-interactive generation. It toggles the longtable package and its
    // example; default on.
    this.props.longtable =
      this.options.longtable === undefined
        ? true
        : this.options.longtable === true || this.options.longtable === "true";

    // `authoryear` is a plain CLI flag (no prompt): switch citations to
    // author-year globally. Maps to biblatex's authoryear style (theses, lncs)
    // and \citestyle{acmauthoryear} (acmart); the mwe quick start is
    // author-year already. IEEE mandates numeric citations, so it is forced
    // off there.
    this.props.authoryear =
      this.options.authoryear === true || this.options.authoryear === "true";
    if (this.props.documentclass === "ieee") {
      this.props.authoryear = false;
    }
    if (this.props.documentclass === "lncs" && this.props.authoryear) {
      // natbib + splncs04nat is numeric-only; author-year for LNCS goes
      // through biblatex (llncs's own citeauthoryear option needs Springer
      // .bst files that are not in TeX Live)
      this.props.bibtextool = "biblatex";
    }

    // `crossref` is a plain CLI flag (no prompt): zref-clever (default, works
    // with PDF tagging) or the legacy cleveref. Templates write references as
    // <%- cref %>{…} / <%- Cref %>{…} (sentence start) and <%- vref %>/<%- Vref %>.
    this.props.crossref =
      this.options.crossref === "cleveref" ? "cleveref" : "zref-clever";
    if (this.props.crossref === "cleveref") {
      this.props.cref = "\\cref";
      this.props.Cref = "\\Cref";
      this.props.vref = "\\vref";
      this.props.Vref = "\\Vref";
    } else {
      this.props.cref = "\\zcref";
      this.props.Cref = "\\Zcref";
      this.props.vref = "\\zvref";
      this.props.Vref = "\\zvref[S]";
    }

    // The program that processes the bibliography: biber for biblatex, bibtex otherwise.
    this.props.bibrunner =
      this.props.bibtextool === "biblatex" ? "biber" : "bibtex";

    // Only the PlantUML UML example needs shell-escape. minted 3 (TeX Live 2025 and later)
    // runs latexminted, which TeX Live permits in restricted shell escape; minted 2
    // (TeX Live 2024) still needs shell-escape.
    this.props.requiresShellEscape =
      (this.props.listings == "minted" && this.props.texlive < 2025) ||
      this.props.uml == "plantuml" ||
      this.props.uml == "mermaid";

    // Two-column layouts (IEEE, and the ACM conference/journal formats) cannot use
    // `longtable` ("longtable not in 1-column mode"), so the longtable example must
    // be skipped there.
    this.props.twocolumn =
      this.props.documentclass === "ieee" ||
      (this.props.documentclass === "acmart" &&
        ["acmtog", "sigconf", "sigplan"].includes(this.props.acmformat));

    if (this.props.docker == "no") {
      // converts command-line "no" to the boolean equivalent
      this.props.docker = false;
    }

    // The Island of TeX image matching the TeX Live version of the template:
    // the current release is "latest", earlier ones are "TL<year>-historic".
    this.props.iotImage =
      "registry.gitlab.com/islandoftex/images/texlive:" +
      (this.props.texlive >= 2026
        ? "latest"
        : `TL${this.props.texlive}-historic`);

    // The DANTE e.V. image additionally contains PlantUML (and the Mermaid CLI), needed by
    // --uml=plantuml and --uml=mermaid. Its tags: https://hub.docker.com/r/danteev/texlive/tags
    const danteTags = {
      2021: "2021-D",
      2023: "2023-A",
      2024: "2024-B",
      2025: "2026-C",
      2026: "2026-C",
    };
    this.props.danteImage =
      "danteev/texlive:" + (danteTags[this.props.texlive] ?? "edge");

    // The DANTE e.V. image also contains the linters (aspell with English and German
    // dictionaries, TeXtidote); CI and "make spellcheck" run them there.
    // They do not depend on the TeX Live version, so the image is the first release containing aspell.
    this.props.lintImage = "danteev/texlive:2026-C";

    // The image used to compile in Docker (README, Makefile, VS Code settings)
    this.props.dockerImage =
      this.props.docker === "dante"
        ? this.props.danteImage
        : this.props.iotImage;
    this.props.dockerCompile =
      this.props.docker === "iot" || this.props.docker === "dante";

    // The generator options of this template, used in the README to tell how to generate an own
    // copy (e.g., with PlantUML). The options that distinguish the main files of a published
    // template (thesis variant, language, package for source code) are left open, so that the
    // generator asks for them.
    this.props.regenerateOptions = [
      "documentclass",
      "latexcompiler",
      "overleaf",
      "texlive",
      "enquotes",
      "tweakouterquote",
      "todo",
      "examples",
      "howtotext",
    ]
      .filter((name) => this.props[name] !== undefined)
      .map((name) => `--${name}=${this.props[name]}`)
      .join(" ");

    createFeatures(props);
    createHeadingCommands(props);
    createAvailable(props);

    function createFeatures(props) {
      props.feature = {};
      props.feature.abbreviations = props.isThesis;
    }

    function isPaperHandling(props) {
      if (props.documentclass === "mwe") {
        // The mwe quick start is neither a paper nor a thesis. Its wrapper main
        // (mwe-main.<lang>.tex) pulls the prose from an external Markdown file
        // (mwe-manuscript.<lang>.md) via \markdownInput. English keeps the plain
        // names main.tex / manuscript.md; German gets a -de suffix so both
        // languages can coexist in one repo (like scientific-thesis below) with
        // each wrapper referencing its own manuscript -- no rename needed.
        props.isPaper = false;
        props.isThesis = false;
        props.filenames = {
          main: props.language === "en" ? "main" : "main-de",
          manuscript: props.language === "en" ? "manuscript" : "manuscript-de",
          bib: "bibliography",
        };
        return;
      }
      props.isPaper =
        props.documentclass === "acmart" ||
        props.documentclass === "ieee" ||
        props.documentclass === "lncs";
      // else it is a thesis (ustutt or scientific-thesis) (see below)
      props.isThesis = !props.isPaper;

      if (props.isPaper) {
        // This sets filenames.main and filenames.bib
        props.filenames = {
          main: "paper",
          bib: "paper",
        };
      } else {
        // isThesis
        props.filenames = {
          bib: "bibliography",
        };
        if (props.documentclass == "ustutt") {
          // The scientific thesis should be "main-english" and "main-german"
          props.filenames.main = "thesis-example";
        } else if (props.language == "en") {
          props.filenames.main = "main-english";
        } else {
          props.filenames.main = "main-german";
        }
      }
    }

    function createHeadingCommands(props) {
      if (props.isThesis) {
        props.heading1 = "\\chapter";
        props.heading2 = "\\section";
        props.heading3 = "\\subsection";
      } else {
        props.heading1 = "\\section";
        props.heading2 = "\\subsection";
      }
    }

    function createAvailable(props) {
      props.available = {};

      if (
        props.bibtextool === "bibtex" &&
        props.documentclass !== "acmart" &&
        props.documentclass !== "ieee" &&
        props.documentclass !== "lncs"
      ) {
        // Acmart uses natbib
        // in lncs, we patched-in natbib
        props.available.citet = false;
      } else {
        props.available.citet = true;
      }
    }
  }

  // The main templates mark each chapter with "%%LTG-CHAPTER <name>" (Markdown
  // chapters with "%%LTG-CHAPTER-MARKDOWN <name>") and the end of the last one
  // with "%%LTG-CHAPTERS-END". A thesis gets each chapter as its own file
  // chapters-<lang>/<nn> - <name>.tex, included by the main file; a paper keeps
  // its sections in the main file. Template repositories put the main files of
  // all variants of one language next to each other, so the chapter files must
  // not depend on the variant: the source code example (listings or minted) goes
  // into a file of its own, picked by the package that the main file loads.
  _splitChapters(lines) {
    const isMarker = (line) => line.startsWith("%%LTG-");
    const trim = (chapterLines) => {
      const first = chapterLines.findIndex((line) => line.trim() !== "");
      const last = chapterLines.findLastIndex((line) => line.trim() !== "");
      return first < 0 ? [] : chapterLines.slice(first, last + 1);
    };
    const write = (path, chapterLines) =>
      this.fs.write(this.destinationPath(path), chapterLines.join("\n") + "\n");
    const markdownInput = (path) => {
      const input = `\\markdownInput{${path}}`;
      return this.props.latexcompiler === "both"
        ? ["\\ifluatex", "  " + input, "\\fi"]
        : [input];
    };

    if (!this.props.isThesis) {
      // A paper keeps its sections in the main file, except the Markdown one:
      // content-markdown.md (English) or content-markdown.<lang>.md
      const result = [];
      let markdown = null;
      for (const line of lines) {
        if (markdown && isMarker(line)) {
          const path =
            this.props.language === "en"
              ? "content-markdown.md"
              : `content-markdown.${this.props.language}.md`;
          write(path, trim(markdown));
          result.push(...markdownInput(path), "");
          markdown = null;
        }
        if (line.startsWith("%%LTG-CHAPTER-MARKDOWN")) {
          markdown = [];
        } else if (markdown) {
          markdown.push(line);
        } else if (!isMarker(line)) {
          result.push(line);
        }
      }
      return result;
    }

    const start = lines.findIndex((line) => line.startsWith("%%LTG-CHAPTER"));
    const end = lines.indexOf("%%LTG-CHAPTERS-END");
    const chapters = [];
    for (const line of lines.slice(start, end)) {
      const match = line.match(/^%%LTG-CHAPTER(-MARKDOWN)? (.+)$/);
      if (match) {
        chapters.push({
          markdown: Boolean(match[1]),
          name: match[2],
          lines: [],
        });
      } else {
        chapters.at(-1).lines.push(line);
      }
    }

    const language = this.props.language;
    this.fs.copy(
      this.templatePath(`chapters.README.${language}.md`),
      this.destinationPath(`chapters-${language}/README.md`),
    );
    const includes = chapters.flatMap((chapter, index) => {
      // Steps of 10 leave room to insert a chapter without renaming the others
      const base = `chapters-${language}/${(index + 1) * 10} - ${chapter.name}`;
      if (chapter.markdown) {
        write(`${base}.md`, trim(chapter.lines));
        return markdownInput(`${base}.md`);
      }

      const chapterLines = [];
      let sourceCode = null;
      for (const line of chapter.lines) {
        const match = line.match(/^%%LTG-SOURCECODE (\S+)$/);
        if (match) {
          sourceCode = { listings: match[1], lines: [] };
        } else if (line === "%%LTG-SOURCECODE-END") {
          const file = (listings) => `${base} - ${listings}`;
          write(file(sourceCode.listings) + ".tex", trim(sourceCode.lines));
          chapterLines.push(
            "% The main file loads either the minted or the listings package",
            "\\ifdefined\\inputminted",
            `  \\input{${file("minted")}}`,
            "\\else",
            `  \\input{${file("listings")}}`,
            "\\fi",
            "",
          );
          sourceCode = null;
        } else if (sourceCode) {
          sourceCode.lines.push(line);
        } else {
          chapterLines.push(line);
        }
      }
      write(`${base}.tex`, trim(chapterLines));
      return [`\\include{${base}}`];
    });

    return [...lines.slice(0, start), ...includes, ...lines.slice(end + 1)];
  }

  writing() {
    this.props.config = this.props;
    this.fs.copyTpl(
      // .gitignore is not uploaded by npm publish
      // Thus, we prefix it with `dot`.
      this.templatePath("dot.gitignore"),
      this.destinationPath(".gitignore"),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath("dot.editorconfig"),
      this.destinationPath(".editorconfig"),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath("bibliography.bib"),
      this.destinationPath(this.props.filenames.bib + ".bib"),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath("latexmkrc"),
      this.destinationPath(".latexmkrc"),
      this.props,
    );
    this.fs.copyTpl(
      // This is for latexindent
      this.templatePath("localSettings.yaml"),
      this.destinationPath("localSettings.yaml"),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath("LICENSE"),
      this.destinationPath("LICENSE"),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath("Makefile"),
      this.destinationPath("Makefile"),
      this.props,
    );

    this.fs.copy(
      this.templatePath("dot.aspell.conf"),
      this.destinationPath(".aspell.conf"),
    );
    // The mwe quick start lints Markdown with its own (template-managed) config
    if (this.props.documentclass !== "mwe") {
      this.fs.copy(
        this.templatePath("dot.textlintrc.json"),
        this.destinationPath(".textlintrc.json"),
      );
    }
    if (this.props.language == "de" || this.props.githubpublish) {
      this.fs.copy(
        this.templatePath("dot.aspell.de.pws"),
        this.destinationPath(".aspell.de.pws"),
      );
    }
    if (this.props.language == "en" || this.props.githubpublish) {
      this.fs.copy(
        this.templatePath("dot.aspell.en.pws"),
        this.destinationPath(".aspell.en.pws"),
      );
    }

    // TeXtidote (spelling, grammar, and style; CI job "textidote") reads its options from .textidote.
    // Its dictionary contains the words of both aspell word lists (without their header lines).
    // Both files must not depend on the language: some templates publish both languages into one repository.
    if (this.props.documentclass !== "mwe") {
      this.fs.copy(
        this.templatePath("dot.textidote"),
        this.destinationPath(".textidote"),
      );
      this.fs.copy(
        this.templatePath("dot.textidote.replacements"),
        this.destinationPath(".textidote.replacements"),
      );
      const words = [
        ...new Set(
          ["en", "de"].flatMap((lang) =>
            this.fs
              .read(this.templatePath(`dot.aspell.${lang}.pws`))
              .split("\n")
              .slice(1)
              .filter((word) => word !== ""),
          ),
        ),
      ]
        .sort((a, b) => a.localeCompare(b, "en"))
        .join("\n");
      // aspell word lists cannot contain hyphenated words
      const hyphenated =
        "zref-clever\nZref-clever\nzref-vario\nZref-vario\npgf-umlsd\nmarkdown-latex-quickstart\n";
      this.fs.write(
        this.destinationPath(".textidote.dict"),
        words + "\n" + hyphenated,
      );
    }

    // refenums 2.0.0 (based on zref-clever) is not yet in TeX Live
    if (this.props.isThesis) {
      this.fs.copy(
        this.templatePath("refenums.sty"),
        this.destinationPath("refenums.sty"),
      );
    }

    if (this.props.documentclass === "lncs") {
      this.fs.copy(
        this.templatePath("splncs04nat.bst"),
        this.destinationPath("splncs04nat.bst"),
      );
    }

    if (this.props.documentclass === "ieee") {
      this.fs.copy(
        this.templatePath("IEEEtranN-doi.bst"),
        this.destinationPath("IEEEtranN-doi.bst"),
      );
    }

    // Photo for the JPEG example in floats.example.*.tex (CC0, see README)
    if (this.props.examples) {
      this.fs.copy(
        this.templatePath("figures/ulm-minster.jpg"),
        this.destinationPath("figures/ulm-minster.jpg"),
      );
    }

    if (this.props.language === "de" && !this.props.githubpublish) {
      this.fs.copyTpl(
        this.templatePath("README.de.md"),
        this.destinationPath("README.md"),
        this.props,
      );
    } else {
      // We keep the English README.md in case of GitHub publish
      this.fs.copyTpl(
        this.templatePath("README.en.md"),
        this.destinationPath("README.md"),
        this.props,
      );
    }

    // The mwe quick start has its own minimal Markdown main; every other class
    // shares the big main.<lang>.tex.
    const mainTemplate =
      this.props.documentclass === "mwe" ? "mwe-main." : "main.";
    this.fs.copyTpl(
      this.templatePath(mainTemplate + this.props.language + ".tex"),
      this.destinationPath(this.props.filenames.main + ".tex"),
      this.props,
    );

    // The big main's preamble is long, so its header tells readers in which
    // line the content starts. The line numbers are only known after
    // rendering, so the template carries placeholders that are filled here.
    if (this.props.documentclass !== "mwe") {
      const mainPath = this.destinationPath(this.props.filenames.main + ".tex");
      const lines = this._splitChapters(this.fs.read(mainPath).split("\n"));
      const contentIndex = lines.indexOf("\\begin{document}");
      const headingIndex = lines.findIndex(
        (line, index) =>
          index > contentIndex && /^\\(chapter|section|include)\{/.test(line),
      );
      const heading = lines[headingIndex].replace(/\\label\{.*$/, "");
      this.fs.write(
        mainPath,
        lines
          .join("\n")
          .replace("@@CONTENTLINE@@", contentIndex + 1)
          .replace("@@HEADINGLINE@@", headingIndex + 1)
          .replace("@@FIRSTHEADING@@", heading),
      );
    }

    // The mwe wrapper main pulls its prose from an external Markdown file so it
    // can be edited and linted as plain Markdown (see mwe-main.<lang>.tex).
    if (this.props.documentclass === "mwe") {
      this.fs.copyTpl(
        this.templatePath("mwe-manuscript." + this.props.language + ".md"),
        this.destinationPath(this.props.filenames.manuscript + ".md"),
        this.props,
      );
    }

    if (this.props.feature.abbreviations) {
      this.fs.copy(
        this.templatePath("abbreviations." + this.props.language + ".tex"),
        this.destinationPath("abbreviations.tex"),
      );
    }

    // mwe-main does not \input{commands}; keep the quick start minimal.
    if (this.props.documentclass !== "mwe") {
      this.fs.copyTpl(
        this.templatePath("commands.tex"),
        this.destinationPath("commands.tex"),
        this.props,
      );
    }

    if (this.props.documentclass == "scientific-thesis") {
      const logos = {
        "university-of-hamburg": "uhh-logo.pdf",
        thu: "thu-logo.png",
      };
      const logo = logos[this.props.thesisvariant];
      if (logo) {
        this.fs.copy(
          this.templatePath("logos/" + logo),
          this.destinationPath("figures/" + logo),
        );
      }
    }

    if (this.props.documentclass == "ustutt") {
      /*
      this.props.documentclass = "ustutt-include";
      this.fs.copyTpl(
        this.templatePath("main." + this.props.language + ".tex"),
        this.destinationPath("shared/template.tex"),
        this.props,
      );
      */
      this.fs.copy(
        this.templatePath("ustutt-titlepage.sty"),
        this.destinationPath("ustutt-titlepage.sty"),
        this.props,
      );
      this.fs.copy(
        this.templatePath("logos/ustutt-logo.pdf"),
        this.destinationPath("ustutt-logo.pdf"),
        this.props,
      );
    }

    switch (this.props.docker) {
      case false:
        this.fs.copyTpl(
          this.templatePath("Texlivefile"),
          this.destinationPath("Texlivefile"),
          this.props,
        );
        break;
      case "iot":
        this.fs.copyTpl(
          this.templatePath("dot.dockerignore"),
          this.destinationPath(".dockerignore"),
          this.props,
        );
        this.fs.copyTpl(
          this.templatePath("Dockerfile.iot"),
          this.destinationPath("Dockerfile"),
          this.props,
        );
        this.fs.copyTpl(
          this.templatePath("Texlivefile"),
          this.destinationPath("Texlivefile"),
          this.props,
        );
        break;
      case "reitzig":
        this.fs.copyTpl(
          this.templatePath("dot.dockerignore"),
          this.destinationPath(".dockerignore"),
          this.props,
        );
        this.fs.copyTpl(
          this.templatePath("Dockerfile.reitzig"),
          this.destinationPath("Dockerfile"),
          this.props,
        );
        this.fs.copyTpl(
          this.templatePath("Texlivefile"),
          this.destinationPath("Texlivefile"),
          this.props,
        );
        break;
      case "dante":
        this.fs.copyTpl(
          this.templatePath("dot.dockerignore"),
          this.destinationPath(".dockerignore"),
          this.props,
        );
        this.fs.copyTpl(
          this.templatePath("Dockerfile.dante"),
          this.destinationPath("Dockerfile"),
          this.props,
        );
        break;
    }

    if (this.props.isThesis) {
      this.fs.copy(this.templatePath("docs/*"), this.destinationPath("docs/"));
    }

    if (this.props.uml === "mermaid") {
      // lets the headless Chromium of the Mermaid CLI run without sandbox (see uml.mermaid.preamble.en.tex)
      this.fs.copy(
        this.templatePath("puppeteer.json"),
        this.destinationPath("puppeteer.json"),
      );
    }

    this.fs.copy(
      this.templatePath(".github/dependabot.yml"),
      this.destinationPath(".github/dependabot.yml"),
      this.props,
    );

    this.fs.copyTpl(
      this.templatePath(".github/workflows/check.yml"),
      this.destinationPath(".github/workflows/check.yml"),
      this.props,
    );

    this.fs.copy(
      this.templatePath(".vscode/extensions.json"),
      this.destinationPath(".vscode/extensions.json"),
    );
    this.fs.copyTpl(
      this.templatePath("dot.markdownlint.yml"),
      this.destinationPath(".markdownlint.yml"),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath("vscode.settings.json"),
      this.destinationPath("vscode.settings.json"),
      this.props,
    );
  }

  install() {}
}
