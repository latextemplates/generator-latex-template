'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.red('latex-template')} generator!`)
    );

    const prompts = [
      {
        type: 'list',
        name: 'documentclass',
        message: 'Which template should be generated?',
        choices: ["scientific-thesis", "lncs", "ieee"],
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
        choices: ["bibtex", "biblatex"],
        default: "biblatex"
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language should the document be?',
        choices: ["english", "german"],
        default: "english"
      },
      {
        type: 'confirm',
        name: 'cleveref',
        message: 'Use cleveref?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      if (props.documentclass === 'scientific-thesis') {
        this.props.heading1 = 'chapter';
        this.props.heading2 = 'section';
      } else {
        this.props.heading1 = 'section';
        this.props.heading2 = 'subsection';
      }
      this.props.lang = props.language === 'german' ? 'de' : 'en';
      this.props.requiresShellEscape = false;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copyTpl(
      this.templatePath('.latexmkrc'),
      this.destinationPath('.latexmkrc'),
      this.props
    );
    if (this.props.lang === 'de') {
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
