'use strict';
const Generator = require('yeoman-generator');
const optionOrPrompt = require('yeoman-option-or-prompt');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');

// unzipper instead of extract-zip, because we want to excact a subset of the archive
const unzipper = require('unzipper');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.red('latex-template')} generator!`)
    );

    var params = {
      // alternative libraries: https://stackoverflow.com/a/34782300/873282
      // this here was the quickest to integrate to yeoman-option-or-prompt
      // we accept that we currently cannot offer --help
      // for that, command-line-args lib (https://github.com/75lb/command-line-args/) seems to be best: because, it supports multiple values for a key (which might be required at choices below)
      // https://github.com/tj/commander.js could also be OK, but requires comma separated list for muliple values (is uncommon for command line lists, isn't it?)
      // yargs supports choices: http://yargs.js.org/docs/
      // stdio (https://github.com/sgmonda/stdio) does not support choices
      options: require('minimist')(process.argv.slice(2)),
      filteredProps: {},
      prompt: function(filteredProps) {
        this.filteredProps = filteredProps
        return {
          then: function(f) {
            return f;
          }
        }
      }
    }

    // see "Development hints" in README.md for help on Inquirer.js
    var mapper = optionOrPrompt.call(params, [
      {
        type: 'list',
        name: 'documentclass',
        message: 'Which template should be generated?',
        choices: [
          {
            name: "Scientic Thesis",
            value: "scientific-thesis"
          },
          {
            name: "Association for Computing Machinery (ACM)",
            value: "acmart"
          },
          {
            name: "Institute of Electrical and Electronics Engineers (IEEE)",
            value: "ieee"
          },
          {
            name: "Springer's Lecture Notes in Computer Science (LNCS)",
            value: "lncs"
          }
        ],
        default: "scientific-thesis"
      },
      {
        type: 'list',
        name: 'acm_format',
        when: function(response) {
          return response.documentclass === 'acm';
        },
        message: 'Which format of ACM?',
        choices: [
          {
            value: "manuscript",
            name: "A manuscript. This is the default.",
          },
          {
            value: "acmsmall",
            name: "Small single-column format. Used for CIE, CSUR, JACM, JDIQ, JEA, JERIC, JETC, PACMCGIT, PACMHCI, PACMPL, TAAS, TACCESS, TACO, TALG, TALLIP (formerly TALIP), TCPS, TDS, TEAC, TECS, TELO, THRI, TIIS, TIOT, TISSEC, TIST, TKDD, TMIS, TOCE, TOCHI, TOCL, TOCS, TOCT, TODAES, TODS, TOIS, TOIT, TOMACS, TOMM (formerly TOMCCAP), TOMPECS, TOMS, TOPC, TOPLAS, TOPS, TOS, TOSEM, TOSN, TQC, TRETS, TSAS, TSC, TSLP and TWEB, including special issues.",
          },
          {
            value: "acmlarge",
            name: "Large single-column format. Used for DTRAP, HEALTH, IMWUT, JOCCH, POMACS and TAP, including special issues.",
          },
          {
            value: "acmtog",
            name: "Large double-column format. Used for TOG, including annual conference Technical Papers.",
          },
          {
            value: "sigconf",
            name: "Proceedings format for most ACM conferences (with the exceptionslisted below) and all ICPS volumes.",
          },
          {
            value: "sigplan",
            name: "Proceedings format for SIGPLAN conferences",
          }
        ],
        default: "sigconf"
      },
      {
        type: 'confirm',
        name: 'acm_review',
        when: function(response) {
          return response.documentclass === 'acm';
        },
        message: 'Format as document to review?',
        default: true
      },
      {
        type: 'list',
        name: 'ieee_variant',
        when: function(response) {
          return response.documentclass === 'ieee';
        },
        message: 'Which variant of IEEE paper?',
        choices: [
          {
            name: "conference paper",
            value: "conference"
          },
          {
            name: "journal paper",
            value: "journal"
          },
          {
            name: "peerreview paper - similar to journal paper, but additional cover page and on first \"real\" paper page title without authors",
            value: "peerreview"
          }
        ],
        default: "conference"
      },
      {
        type: 'list',
        name: 'papersize',
        when: function(response) {
          return response.documentclass === 'ieee';
        },
        message: 'Which paper size to use?',
        choices: [
          {
            name: "A4",
            value: "a4"
          },
          {
            name: "US letter",
            value: "letter"
          }
        ],
        default: "a4paper"
      },
      {
        type: 'list',
        name: 'texlive',
        message: 'Which TeXLive compatiblity?',
        choices: [
          {
            name: "TeXLive 2021",
            value: 2021
          },
          {
            name: "TeXLive 2020",
            value: 2020
          },
          {
            name: "TeXLive 2019",
            value: 2019
          }
        ],
        default: 2021
      },
      {
        type: 'list',
        name: 'latexcompiler',
        message: 'Which latex compiler should be used?',
        choices: ["pdflatex", "lualatex"],
        default: "pdflatex",
        when: function(response) {
          return !((response.documentclass === 'ieee') && (response.texlive == 2021));
        }
      },
      {
        when: function(response) {
          return ((response.documentclass !== 'acmart') && (response.documentclass !== 'ieee'));
        },
        type: 'list',
        name: 'bibtextool',
        message: 'Which BibTeX tool should be used?',
        choices: [
          {
            name: "BibTeX",
            value: "bibtex"
          },
          {
            name: "BibLaTeX + biber",
            value: "biblatex"
          }
        ],
        default: function(response) {
          switch (response.documentclass) {
            case 'acmart':
            case 'ieee':
            case 'lncs':
              return 'bibtex'
            default:
              return 'biblatex'
          }
        },
      },
      {
        type: 'list',
        name: 'docker',
        message: 'Should a Dockerfile be generated?',
        choices: [
          {
            name: "no",
            value: false
          },
          {
            name: "yes (Reiztig)",
            value: "reitzig"
          },
          {
            name: "yes (DANTE e.V.)",
            value: "dante"
          }
        ],
        default: "pdflatex",
        when: function(response) {
          return !((response.documentclass === 'ieee') && (response.texlive == 2021));
        }
      },
      {
        type: 'list',
        name: 'language',
        when: function(response) {
          return ((response.documentclass !== 'acmart') && (response.documentclass !== 'ieee'));
        },
        message: 'Which language should the document be?',
        choices: [
          {
            name: "English",
            value: "en"
          },
          {
            name: "German",
            value: "de"
          }
        ],
        default: "en"
      },
      {
        type: 'list',
        name: 'font',
        message: 'Which font should be used?',
        choices: function(state) {
          var res = [];
          if (state.documentclass === "acmart") {
            res.push({
              name: "ACM Default",
              value: "default"
            })
          } else if (state.documentclass === "ieee") {
            res.push({
              name: "IEEE Default",
              value: "default"
            })
          } else {
            res.push({
              name: "Computer Modern (Default LaTeX font)",
              value: "default"
            })
            if (state.documentclass === "scientific-thesis") {
              res.push({
                name: "Arial",
                value: "arial"
              })
            }
            res.push({
              name: "Times New Roman",
              value: "times"
            });
          }
          return res;
        },
        default: "default",
        when: function(response) {
          return response.documentclass !== 'ieee';
        }
      },
      {
        type: 'list',
        name: 'listings',
        message: 'Which package to typeset listings?',
        choices: [
          {
            name: "listings",
            value: "listings"
          },
          {
            name: "minted (requires a working Python installation)",
            value: "minted"
          }
        ],
        default: "listings"
      },
      {
        type: 'confirm',
        name: 'cleveref',
        message: 'Use cleveref?',
        default: true
      },
      {
        type: 'list',
        name: 'enquotes',
        message: 'Which package to use to "enquote" text?',
        choices: function(state) {
          var res = [];
          res.push({
            name: "csquotes (\\enquote{...} command)",
            value: "csquotes"
          });
          if (state.language === "en") {
            res.push({
              name: "textcmds (\\qq{...} command)",
              value: "textcmds"
            })
          }
          if (state.language === "de") {
            res.push({
              name: "Plain LaTeX (\\glqq{}text\\grqq{} - not recommended)",
              value: "plainlatex"
            });
          } else {
            res.push({
              name: "Plain LaTeX (``text'' - not recommended)",
              value: "plainlatex"
            })
          };
          return res;
        },
        default: "csquotes"
      },
      {
        type: 'list',
        name: 'tweak_outerquote',
        message: 'Enable hyphenation tweak (e.g., application"=specific for app-lication-specific at a linebreak) or enable easy quotation (e.g., "application"; not common in default latex setups)?',
        choices: [
          {
            name: "Hyphenation tweak",
            value: "babel"
          },
          {
            name: "Easy quotation",
            value: "outerquote"
          }
        ],
        default: "babel"
      },
      {
        type: 'list',
        name: 'todo',
        message: 'Which package to mark TODOs?',
        choices: [
          {
            name: "pdfcomment",
            value: "pdfcomment"
          },/*
          {
            name: "Plain LaTeX (simple \\commentontext and \\commentatside are defined)",
            value: "plainlatex"
          },*/
          {
            name: "None (no support)",
            value: "none"
          }
        ],
        default: "pdfcomment"
      },
      {
        type: 'confirm',
        name: 'howtotext',
        message: 'Include hints on text (e.g., how to write an abstract)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'examples',
        message: 'Include minimal LaTeX examples?',
        default: true
      }
    ]);

    this.mapper = mapper;
    this.params = params;

    var prompt;

    if (Object.keys(params.filteredProps).length === 0) {
      prompt = new Promise(resolve => {
        resolve(this.params.options)
      })
    } else {
      prompt = this.prompt(params.filteredProps).then(props => this.mapper(props));
    }

    return prompt.then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;

      // somehow texlive is not routed through
      // special handling
      if (this.params.options.texlive) {
        this.props.texlive = parseInt(this.params.options.texlive)
      }

      // Command line argument "--githubpublish" switches the generator to generate a template deployable on a GitHub repository (causing e.g., a refined README.md)
      this.props.githubpublish = this.params.options.githubpublish;
      this.props.githubpublish = (this.props.githubpublish === true) || (this.props.githubpublish === 'true')

      // Command line argument "--preparereitzig" switches the generator to generate a template to be used to generate Texlivefile required by https://github.com/reitzig/texlive-docker
      this.props.preparereitzig = this.params.options.preparereitzig;
      this.props.preparereitzig = (this.props.preparereitzig === true) || (this.props.preparereitzig === 'true')

      // Ensure all values are set - even if the user was not asked
      if ((this.props.documentclass === 'acmart') || (this.props.documentclass === 'ieee')) {
        this.props.bibtextool = 'bibtex';
        this.props.font = 'default';
        this.props.language = 'en';
      }

      // IEEE class offers "compsoc"
      // In 2021 this is not used any more, all papers are the "normal" IEEE format
      this.props.ieee_compsoc = false;

      // As of 2021-12-24 the IEEE setup does not work on TeXLive 2021 and lualatex (TeXLive 2019 and 2020 work)
      if ((this.props.documentclass === 'ieee') && (this.props.texlive == 2021)) {
        this.props.latexcompiler = 'pdflatex';
      }

      // convert "String" Boolean command line options
      this.props.cleveref = (this.props.cleveref === true) || (this.props.cleveref === 'true')
      this.props.examples = (this.props.examples === true) || (this.props.examples === 'true')
      this.props.howtotext = (this.props.howtotext === true) || (this.props.howtotext === 'true')

      if (this.props.examples) {
        this.props.useExampleEnvironment = true;
        this.props.bexample = "\\begin{ltgexample}"
        this.props.eexample = "\\end{ltgexample}"
      } else {
        this.props.useExampleEnvironment = false;
        this.props.bexample = "";
        this.props.eexample = "";
      }

      if (this.props.tweak_outerquote == 'outerquote') {
        this.props.bquote = "\"";
        this.props.equote = "\"";
      } else if (this.props.enquotes == 'csquotes') {
        this.props.bquote = "\\enquote{";
        this.props.equote = "}";
      } else if (this.props.enquotes == 'textcmds') {
        this.props.bquote = "\\qq{";
        this.props.equote = "}";
      } else {
        this.props.bquote = "\"`";
        this.props.equote = "\"'";
      }

      this.props.requiresShellEscape = (this.props.listings === 'minted');

      this.props.isPaper = (this.props.documentclass === 'ieee') || (this.props.documentclass === 'lncs');
      if (this.props.isPaper) {
        this.props.filenames = {
          "main": "paper",
          "bib": "paper"
        };
      } else {
        this.props.filenames = {
          "main": "main",
          "bib": "bibliography"
        };
      }

      if (props.documentclass === 'scientific-thesis') {
        this.props.heading1 = '\\chapter';
        this.props.heading2 = '\\section';
      } else {
        this.props.heading1 = '\\section';
        this.props.heading2 = '\\subsection';
      }

      this.props.available = {};

      if (props.bibtextool == 'bibtex' && props.documentclass !== 'acmart' && props.documentclass !== 'ieee' && props.documentclass !== 'lncs') {
        // acmart uses natbib
        // in lncs, we patched-in natbib
        this.props.available.citet = false;
      } else {
        this.props.available.citet = true;
      }
    });
  }

  writing() {
    var promise = new Promise(function(resolve, reject) {resolve();});
    if ((this.props.documentclass === "lncs") && !fs.existsSync('llncs.cls')) {
      if (!fs.existsSync('llncs2e.zip')) {
        console.log("Need to llncs2e.zip from Springer");
        const ftp = require("basic-ftp");
        const client = new ftp.Client()
        client.ftp.verbose = true
        promise = client.access({
            host: "ftp.springernature.com",
            user: "anonymous",
            password: "anonymous",
            secure: false
        }).then(function() {
          return client.ensureDir("cs-proceeding/llncs")
        }).then(function() {
          return client.downloadTo("llncs2e.zip", "llncs2e.zip")
        }).then(function() {
          return new Promise(function(resolve, reject) {
            console.log("Downloaded");
            client.close();
            resolve();
          });
        });
      } else {
        console.log("llncs2e.zip already exists. Needs to be extracted.");
        promise = new Promise(function(resolve, reject) {resolve();});
      }
      var oldPromise = promise;
      promise = oldPromise.then(function() {
        return fs.createReadStream('llncs2e.zip')
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
          const fileName = entry.path;
          const type = entry.type; // 'Directory' or 'File'
          const size = entry.vars.uncompressedSize; // There is also compressedSize;
          if ((fileName === "llncs.cls") || (fileName === "splncs04.bst")) {
            entry.pipe(fs.createWriteStream(fileName));
          } else {
            entry.autodrain();
          }
        })
      });
    }
    let global = this;
    global.props.config = global.props;
    promise.then(function() {
      global.fs.copy(
        // .gitignore is not uploaded by npm publish
        // Thus, we prefix it with `dot`.
        global.templatePath('dot.gitignore'),
        global.destinationPath('.gitignore')
      );
      global.fs.copyTpl(
        global.templatePath('dot.editorconfig'),
        global.destinationPath('.editorconfig'),
        global.props
      );
      global.fs.copyTpl(
        global.templatePath('dot.latexmkrc'),
        global.destinationPath('.latexmkrc'),
        global.props
      );
      global.fs.copyTpl(
        global.templatePath('bibliography.bib'),
        global.destinationPath(global.props.filenames.bib + ".bib"),
        global.props
      );
      global.fs.copyTpl(
        global.templatePath('localSettings.yaml'),
        global.destinationPath('localSettings.yaml'),
        global.props
      );
      global.fs.copyTpl(
        global.templatePath('LICENSE'),
        global.destinationPath('LICENSE'),
        global.props
      );
      global.fs.copyTpl(
        global.templatePath('Makefile'),
        global.destinationPath('Makefile'),
        global.props
      );
      if (global.props.documentclass === 'lncs') {
        global.fs.copy(
          global.templatePath('splncsnat.bst'),
          global.destinationPath('splncsnat.bst')
        );
      }
      if (global.props.language === 'de') {
        global.fs.copyTpl(
          global.templatePath('main.de.tex'),
          global.destinationPath(global.props.filenames.main + ".tex"),
          global.props
        );
        if (!global.props.githubpublish) {
          // we keep the English README.md in case of GitHub publish
          global.fs.copyTpl(
            global.templatePath('README.de.md'),
            global.destinationPath('README.md'),
            global.props
          );
        }
      } else {
        global.fs.copyTpl(
          global.templatePath('main.en.tex'),
          global.destinationPath(global.props.filenames.main + ".tex"),
          global.props
        );
        global.fs.copyTpl(
          global.templatePath('README.en.md'),
          global.destinationPath('README.md'),
          global.props
        );
      }
      switch (global.props.docker) {
        case "reitzig":
          global.fs.copy(
            global.templatePath('dot.gitignore'),
            global.destinationPath('.dockerignore')
          );
          global.fs.copyTpl(
            global.templatePath('Dockerfile.reitzig'),
            global.destinationPath('Dockerfile'),
            global.props
          );
          global.fs.copy(
            global.templatePath('Texlivefile'),
            global.destinationPath('Texlivefile')
          );
          break;
        case "dante":
          global.fs.copy(
            global.templatePath('dot.gitignore'),
            global.destinationPath('.dockerignore')
          );
          global.fs.copyTpl(
            global.templatePath('Dockerfile.dante'),
            global.destinationPath('Dockerfile'),
            global.props
          );
          break;
      }
    });
  }

  install() {
  }
};
