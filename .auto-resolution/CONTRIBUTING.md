# Contributing

We love seeing people contribute patches to the this project and the process is simple.
In general, we follow [GitHub's fork & pull request model](https://help.github.com/articles/fork-a-repo/).
The code is licensed under `MIT` the examples using `CC0`.
This is nothing special, but important for users of the genereator and the snippets.

## Adding a new package

In case you found an interesting or [new LaTeX package on CTAN](https://ctan.org/ctan-ann), you might want to add it to the generator.

You need to craft two files and include a reference to them in `main.*.tex`.
The detailed steps are as follows:

1. `[package].premable.en.tex` - for the LaTeX commands to be added to the preamble.
2. `[package].example.en.tex` - put examples in there
3. Add both `.tex` files to the appropriate place in `main.en.tex`
4. Find a similar place in `main.de.tex`. You don't need to provide a translation; just include a reference to the English file.

## Contributing a translation

1. Find a `.en.tex` file without a corresponding `.de.tex` file.
2. Copy the `.en.tex` to a correspinding `.de.tex` file.
3. Translate the content of the `.de.tex` file.
4. Change the file reference in `main.de.tex`.
