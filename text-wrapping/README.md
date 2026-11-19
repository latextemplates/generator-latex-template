# Text wrapping comparison

Same paragraph, 340px column, set three ways: browser default, `text-wrap: pretty` + `hyphens: auto`, and Knuth–Plass via [bramstein/typeset](https://github.com/bramstein/typeset) (`48ebb55`).

To rerun `index.html`, copy `src/linked-list.js`, `src/linebreak.js`, `src/formatter.js`, `lib/hypher.js` and `lib/en-us.js` from typeset next to it.
Remove the penalty branch from `computeSum` in `linebreak.js` first: it adds the hyphen width to the totals after a hyphenated break, so the following line overflows by one hyphen width.

Headless Chromium on Linux ships no hyphenation dictionaries, so its middle column shows `text-wrap: pretty` alone.
