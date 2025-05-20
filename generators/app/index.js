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
    const props = await this._optionOrPrompt(options);

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

    // --language does not work properly, therefore, we used "lang" above. The templates still use "language"
    this.props.language = this.props.lang;

    // IEEE class offers "compsoc"
    // In 2021 this is not used any more, all papers are the "normal" IEEE format
    this.props.ieeecompsoc = false;

    // As of 2021-12-24 the IEEE setup does not work on TeXLive 2021 and lualatex
    //if (this.props.documentclass === "ieee") {
      //this.props.latexcompiler = "pdflatex";
    //}

    this.props.reallatexcompiler = (this.props.latexcompiler == "both") ? "lualatex" : this.props.latexcompiler;

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

    this.props.requiresShellEscape = this.props.isThesis || this.props.listings == "minted";

    if (this.props.docker == "no") {
      // converts command-line "no" to the boolean equivalent
      this.props.docker = false;
    }

    createFeatures(props);
    createHeadingCommands(props);
    createAvailable(props);

    function createFeatures(props) {
      props.feature = {};
      props.feature.abbreviations = props.isThesis;
    }

    function isPaperHandling(props) {
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
          "bib": "bibliography"
        }
        if (props.documentclass == "ustutt") {
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

  writing() {
    this.props.config = this.props;
    this.fs.copyTpl(
      // .gitignore is not uploaded by npm publish
      // Thus, we prefix it with `dot`.
      this.templatePath("dot.gitignore"),
      this.destinationPath(".gitignore"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("dot.editorconfig"),
      this.destinationPath(".editorconfig"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("bibliography.bib"),
      this.destinationPath(this.props.filenames.bib + ".bib"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("latexmkrc"),
      this.destinationPath(this.props.overleaf ? "_latexmkrc" : "latexmkrc"),
      this.props
    );
    this.fs.copyTpl(
      // This is for latexindent
      this.templatePath("localSettings.yaml"),
      this.destinationPath("localSettings.yaml"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("LICENSE"),
      this.destinationPath("LICENSE"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("Makefile"),
      this.destinationPath("Makefile"),
      this.props
    );

    this.fs.copy(
      this.templatePath("dot.aspell.conf"),
      this.destinationPath(".aspell.conf")
    );
    if ((this.props.language == "de") || (this.props.githubpublish)) {
      this.fs.copy(
        this.templatePath("dot.aspell.de.pws"),
        this.destinationPath(".aspell.de.pws"));
    }
    if ((this.props.language == "en") || (this.props.githubpublish)) {
      this.fs.copy(
        this.templatePath("dot.aspell.en.pws"),
        this.destinationPath(".aspell.en.pws"));
    }

    if (this.props.documentclass === "lncs") {
      this.fs.copy(
        this.templatePath("splncs04nat.bst"),
        this.destinationPath("splncs04nat.bst")
      );
    }

    if ((this.props.language === "de") && (!this.props.githubpublish)) {
      this.fs.copyTpl(
        this.templatePath("README.de.md"),
        this.destinationPath("README.md"),
        this.props
      );
    } else {
      // We keep the English README.md in case of GitHub publish
      this.fs.copyTpl(
        this.templatePath("README.en.md"),
        this.destinationPath("README.md"),
        this.props
      );
    }

    this.fs.copyTpl(
      this.templatePath('main.' + this.props.language + '.tex'),
      this.destinationPath(this.props.filenames.main + ".tex"),
      this.props
    );

    if (this.props.feature.abbreviations) {
      this.fs.copy(
        this.templatePath("abbreviations." + this.props.language + ".tex"),
        this.destinationPath("abbreviations.tex"),
      );
    }

    this.fs.copyTpl(
      this.templatePath("commands.tex"),
      this.destinationPath("commands.tex"),
      this.props
    );

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

    // eslint-disable-next-line default-case
    switch (this.props.docker) {
      case false:
        this.fs.copyTpl(
          this.templatePath("Texlivefile"),
          this.destinationPath("Texlivefile"),
          this.props
        );
        break;
      case "iot":
        this.fs.copyTpl(
          this.templatePath("dot.dockerignore"),
          this.destinationPath(".dockerignore"),
          this.props
        );
        this.fs.copyTpl(
          this.templatePath("Dockerfile.iot"),
          this.destinationPath("Dockerfile"),
          this.props
        );
        this.fs.copyTpl(
          this.templatePath("Texlivefile"),
          this.destinationPath("Texlivefile"),
          this.props
        );
        break;
      case "reitzig":
        this.fs.copyTpl(
          this.templatePath("dot.dockerignore"),
          this.destinationPath(".dockerignore"),
          this.props
        );
        this.fs.copyTpl(
          this.templatePath("Dockerfile.reitzig"),
          this.destinationPath("Dockerfile"),
          this.props
        );
        this.fs.copyTpl(
          this.templatePath("Texlivefile"),
          this.destinationPath("Texlivefile"),
          this.props
        );
        break;
      case "dante":
        this.fs.copyTpl(
          this.templatePath("dot.dockerignore"),
          this.destinationPath(".dockerignore"),
          this.props
        );
        this.fs.copyTpl(
          this.templatePath("Dockerfile.dante"),
          this.destinationPath("Dockerfile"),
          this.props
        );
        break;
    }

    if (this.props.isThesis) {
      this.fs.copy(
        this.templatePath("docs/*"),
        this.destinationPath("docs/")
      );
    }

    this.fs.copy(
      this.templatePath(".github/dependabot.yml"),
      this.destinationPath(".github/dependabot.yml"),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath(".github/workflows/check.yml"),
      this.destinationPath(".github/workflows/check.yml"),
      this.props
    );

    this.fs.copy(
      this.templatePath(".vscode/extensions.json"),
      this.destinationPath(".vscode/extensions.json")
    );
    this.fs.copyTpl(
      this.templatePath("vscode.settings.json"),
      this.destinationPath("vscode.settings.json"),
      this.props
    );
  }

  install() {}
}
