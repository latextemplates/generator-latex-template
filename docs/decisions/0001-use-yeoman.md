# Use Yeoman As Template Generator

## Context and Problem Statement

We want to generate the template automatically.

## Considered Options

* [Yeoman](https://yeoman.io/)
* [texplate](https://ctan.org/pkg/texplate)
* [Cookiecutter](https://github.com/cookiecutter/cookiecutter)
* [copier](https://github.com/copier-org/copier)
* [Jinja2](http://jinja.pocoo.org/)
* [Cheetah](http://cheetahtemplate.org/)
* [Apache Velocity](http://velocity.apache.org/)
* [lualatex](https://en.wikipedia.org/wiki/LuaTeX)

## Decision Outcome

Chosen option: "Yeoman", because it seems to be the most easy to use generator.

## Pros and Cons of the Options

### [Yeoman](https://yeoman.io/)

Yeoman is a famous template generator. A summary is provided at <https://alternativeto.net/software/yeoman/about/>.

Proposed by @miwurster. Currently in use in different projects:

* [Andi-Lo/generator-latex](https://github.com/Andi-Lo/generator-latex)
* [LeoColomb/generator-latex](https://github.com/LeoColomb/generator-latex)

---

* Good, because very popular.
* Good, because can be used in the usual npm eco system, which makes it very user friendly.
* Bad, because uses JavaScript as language. The templates are hard to maintain.
* Bad, because moves fast (e.g., yeoman-generator switched to TypeScript and [yo 5.0.0 does not work locally any more](https://github.com/yeoman/yo/issues/797))

### [texplate](https://ctan.org/pkg/texplate)

TeXplate is a Kotlin-based framework to generate LaTeX templates.

* Good, because actively maintained by the Island of TeX community
* Neutral, because Kotlin is used
* Neutral, because only basic templates offered (see <https://gitlab.com/islandoftex/texplate/-/tree/master/src/main/resources/org/islandoftex/texplate/templates>)
* Bad, because no concept of "mix and match" implemented.

### [Cookiecutter](https://github.com/cookiecutter/cookiecutter)

* Good, because Very easy command line call. Example: `cookiecutter gh:audreyfeldroy/cookiecutter-pypackage`
* Good, because Builds on Jinja2
* Bad, because Settings need to be configured in a JSON file. Example: <https://cookiecutter.readthedocs.io/en/2.2.3/advanced/choice_variables.html>.

### [copier](https://github.com/copier-org/copier)

* Good, because Uses Python as language.
* Good, because Supports template updates. Example: <https://github.com/pawamoy/copier-poetry/blob/6f5ec9f9c25769be1dec8d2b36e1748634bea8f0/copier.yml#L9>.
* Good, because Prompts are configures in a simple YAML file (and not using some programming language). Example: <https://github.com/pawamoy/copier-poetry/blob/6f5ec9f9c25769be1dec8d2b36e1748634bea8f0/copier.yml#L19>.

### [Jinja2](http://jinja.pocoo.org/)

Recommended by @mfa and @andlaus, also because of <http://eosrei.net/articles/2015/11/latex-templates-python-and-jinja2-generate-pdfs>

* Bad, because Just a templating engine. Prompts are out of scope.

### [Cheetah](http://cheetahtemplate.org/)

Recommended at <https://tex.stackexchange.com/q/41875/9075>

* Bad, because Just a templating engine. Prompts are out of scope.

### [Apache Velocity](http://velocity.apache.org/)

Recommended by <http://tex-talk.net/2012/03/generating-latex-code-with-a-template-engine/>

* Bad, because Just a templating engine. Prompts are out of scope.

### [lualatex](https://en.wikipedia.org/wiki/LuaTeX)

Recommended by @Stefan-Kottwitz at <http://tex-talk.net/2012/03/generating-latex-code-with-a-template-engine/#comment-231>

* Bad, because Just a framework. Not a templating engine and not a prompting engine per se.

## Links

* Copier, Cookiecutter, and Yeoman are compared at: <https://copier.readthedocs.io/en/latest/comparisons/>
