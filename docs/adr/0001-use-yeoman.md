# Use Yeoman As Template Generator

## Context and Problem Statement

We want to generate the template automatically.

## Considered Options

- [Yeoman](https://yeoman.io/) - proposed by @miwurster. Currently in use in different projects
  - [Andi-Lo/generator-latex](https://github.com/Andi-Lo/generator-latex)
  - [LeoColomb/generator-latex](https://github.com/LeoColomb/generator-latex)
- [Jinja2](http://jinja.pocoo.org/) - recommended by @mfa, also because of http://eosrei.net/articles/2015/11/latex-templates-python-and-jinja2-generate-pdfs
- [Cheetah](http://cheetahtemplate.org/) - recommended at https://tex.stackexchange.com/q/41875/9075
- [Apache Velocity](http://velocity.apache.org/) - recommended by http://tex-talk.net/2012/03/generating-latex-code-with-a-template-engine/
- [lualatex](https://en.wikipedia.org/wiki/LuaTeX) - recommended by @Stefan-Kottwitz at http://tex-talk.net/2012/03/generating-latex-code-with-a-template-engine/#comment-231

## Decision Outcome

Chosen option: "Yeoman", because it seems to be the most easy to use generator.
