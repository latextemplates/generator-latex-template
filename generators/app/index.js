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
            name: "Springer's Lecture Notes in Computer Science (LNCS)",
            value: "lncs"
          },
          {
            name: "Institute of Electrical and Electronics Engineers (IEEE)",
            value: "ieee"
          }
        ],
        default: "scientific-thesis"
      },
      {
        type: 'list',
        name: 'texlive',
        message: 'Which texlive compatiblity?',
        choices: [
          {
            name: "TeXLive 2020 or later",
            value: "tl2020"
          },
          {
            name: "TeXLive 2019",
            value: "tl2019"
          }
        ],
        default: "tl2020"
      },
      {
        type: 'list',
        name: 'latexcompiler',
        message: 'Which latex compiler should be used?',
        choices: ["pdflatex", "lualatex"],
        default: "pdflatex"
      },
      {
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
        default: "biblatex"
      },
      {
        type: 'list',
        name: 'language',
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
          res.push({
            name: "Computer Modern (Default LaTeX font)",
            value: "default"
          });
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
          return res;
        },
        default: "default"
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
        default: "pdfcomment"
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
          if (state.langauge === "en") {
            res.push({
              name: "textcmds (\\qq{...} command)",
              value: "textcmds"
            })
          }
          if (state.langauge === "de") {
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

      this.props.requiresShellEscape = (this.props.lsitings === 'minted');

      if (props.documentclass === 'scientific-thesis') {
        this.props.heading1 = '\\chapter';
        this.props.heading2 = '\\section';
      } else {
        this.props.heading1 = '\\section';
        this.props.heading2 = '\\subsection';
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
    promise.then(function() {
      global.fs.copy(
        // .gitignore is not uploaded by npm publish
        // Thus, we prefix it with `dot`.
        global.templatePath('dot.gitignore'),
        global.destinationPath('.gitignore')
      );
      global.fs.copyTpl(
        global.templatePath('dot.latexmkrc'),
        global.destinationPath('.latexmkrc'),
        global.props
      );
      global.fs.copyTpl(
        global.templatePath('bibliography.bib'),
        global.destinationPath('bibliography.bib'),
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
          global.destinationPath('main.tex'),
          global.props
        );
        global.fs.copyTpl(
          global.templatePath('README.de.md'),
          global.destinationPath('README.md'),
          global.props
        );
      } else {
        global.fs.copyTpl(
          global.templatePath('main.en.tex'),
          global.destinationPath('main.tex'),
          global.props
        );
        global.fs.copyTpl(
          global.templatePath('README.en.md'),
          global.destinationPath('README.md'),
          global.props
        );
      }
    });
  }

  install() {
  }
};
