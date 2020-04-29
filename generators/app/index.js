'use strict';
const Generator = require('yeoman-generator');
const optionOrPrompt = require('yeoman-option-or-prompt');
const chalk = require('chalk');
const yosay = require('yosay');

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
        choices: [
          {
            name: "Arial",
            value: "arial"
          },
          {
            name: "Times New Roman",
            value: "times"
          },
          {
            name: "Computer Modern (Default LaTeX font)",
            value: "default"
          }
        ],
        default: "latex default"
      },
      {
        type: 'confirm',
        name: 'cleveref',
        message: 'Use cleveref?',
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
      if (props.documentclass === 'scientific-thesis') {
        this.props.heading1 = '\\chapter';
        this.props.heading2 = '\\section';
      } else {
        this.props.heading1 = '\\section';
        this.props.heading2 = '\\subsection';
      }
      this.props.requiresShellEscape = false;
    });
  }

  writing() {
    this.fs.copy(
      // .gitignore is not uploaded by npm publish
      // Thus, we prefix it with `dot`.
      this.templatePath('dot.gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copyTpl(
      this.templatePath('dot.latexmkrc'),
      this.destinationPath('.latexmkrc'),
      this.props
    );
    if (this.props.language === 'de') {
      this.fs.copyTpl(
        this.templatePath('main.de.tex'),
        this.destinationPath('main.tex'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('README.de.md'),
        this.destinationPath('README.md'),
        this.props
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('main.en.tex'),
        this.destinationPath('main.tex'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('README.en.md'),
        this.destinationPath('README.md'),
        this.props
      );
    }
  }

  install() {
  }
};
