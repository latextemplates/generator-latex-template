// Shared definition of the generator's switch matrix.
//
// This mirrors the nested loops and filters that previously lived in
// .github/generate-workflows.py, so the tests exercise exactly the
// combinations the CI matrix used to cover.

export const documentclasses = ["acmart", "ieee", "lncs", "ustutt"];
export const latexcompilers = ["pdflatex", "lualatex", "both"];
export const bibtextools = ["bibtex", "biblatex"];
export const texlives = [2025, 2026];
export const languages = ["en", "de"];
export const fonts = ["default", "times"];
export const listings = ["listings", "minted"];
export const enquotes = ["csquotes", "plainlatex"];
export const tweakouterquotes = ["babel", "outerquote"];
export const todos = ["pdfcomment", "none"];
export const examples = ["true", "false"];
export const howtotexts = ["true", "false"];
export const ieeevariants = ["conference", "journal", "peerreview"];
export const umls = ["none", "tikz-uml", "plantuml"];

// The axes used for pairwise coverage. `ieeevariant` is only meaningful for
// the ieee document class; for every other class the full matrix pins it to
// "conference", so no cross-class pair involving it is ever required. `uml` is
// likewise only meaningful for the ustutt thesis with examples enabled; it is
// pinned to "none" everywhere else.
const PAIR_AXES = [
  "documentclass",
  "latexcompiler",
  "bibtextool",
  "texlive",
  "example",
  "ieeevariant",
  "uml",
  "howtotext",
  "language",
  "font",
  "listing",
  "enquote",
  "tweakouterquote",
  "todo",
];

// Turns one combination into the generator options, adding the
// document-class-specific switches the generator requires (see index.js and
// the `yo` invocation that generate-workflows.py used to emit).
export function toOptions(combo) {
  const options = {
    documentclass: combo.documentclass,
    papersize: "a4",
    latexcompiler: combo.latexcompiler,
    bibtextool: combo.bibtextool,
    texlive: combo.texlive,
    docker: "no",
    overleaf: "no",
    lang: combo.language,
    font: combo.font,
    listings: combo.listing,
    enquotes: combo.enquote,
    tweakouterquote: combo.tweakouterquote,
    todo: combo.todo,
    examples: combo.example,
    howtotext: combo.howtotext,
  };
  if (combo.documentclass === "acmart") {
    options.acmformat = "manuscript";
    options.acmreview = "true";
  }
  if (combo.documentclass === "ieee") {
    options.ieeevariant = combo.ieeevariant;
  }
  if (combo.documentclass === "ustutt") {
    options.thesisvariant = "ustutt";
    options.uml = combo.uml;
  }
  return options;
}

// The primary document file the generator emits for a document class
// (`paper.tex` for the paper classes, `thesis-example.tex` for ustutt).
export function mainFile(documentclass) {
  return documentclass === "ustutt" ? "thesis-example.tex" : "paper.tex";
}

// A short, stable label identifying a combination in test output.
export function label(combo) {
  return [
    combo.documentclass,
    combo.documentclass === "ieee" ? combo.ieeevariant : null,
    combo.uml && combo.uml !== "none" ? `uml-${combo.uml}` : null,
    combo.latexcompiler,
    combo.bibtextool,
    combo.texlive,
    combo.language,
    combo.font,
    combo.listing,
    combo.enquote,
    combo.tweakouterquote,
    combo.todo,
    `ex-${combo.example}`,
    `ht-${combo.howtotext}`,
  ]
    .filter((part) => part !== null)
    .join(" ");
}

// Full cartesian product with the same filters as the CI matrix generator.
export function fullMatrix() {
  const combos = [];
  for (const documentclass of documentclasses) {
    for (const latexcompiler of latexcompilers) {
      for (const bibtextool of bibtextools) {
        if (
          bibtextool === "biblatex" &&
          ["acmart", "ieee", "lncs"].includes(documentclass)
        ) {
          continue;
        }
        for (const texlive of texlives) {
          for (const example of examples) {
            for (const ieeevariant of ieeevariants) {
              if (documentclass !== "ieee" && ieeevariant !== "conference") {
                continue;
              }
              for (const howtotext of howtotexts) {
                for (const language of languages) {
                  for (const font of fonts) {
                    if (
                      (documentclass === "acmart" ||
                        documentclass === "ieee") &&
                      font !== "default"
                    ) {
                      continue;
                    }
                    for (const listing of listings) {
                      for (const enquote of enquotes) {
                        for (const tweakouterquote of tweakouterquotes) {
                          for (const todo of todos) {
                            for (const uml of umls) {
                              // `uml` is only offered for the ustutt thesis with
                              // examples enabled; pin it to "none" otherwise.
                              if (
                                uml !== "none" &&
                                !(
                                  documentclass === "ustutt" &&
                                  example === "true"
                                )
                              ) {
                                continue;
                              }
                              combos.push({
                                documentclass,
                                latexcompiler,
                                bibtextool,
                                texlive,
                                example,
                                ieeevariant,
                                uml,
                                howtotext,
                                language,
                                font,
                                listing,
                                enquote,
                                tweakouterquote,
                                todo,
                              });
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return combos;
}

function pairKeys(combo) {
  const keys = [];
  for (let i = 0; i < PAIR_AXES.length; i++) {
    for (let j = i + 1; j < PAIR_AXES.length; j++) {
      keys.push(
        `${PAIR_AXES[i]}=${combo[PAIR_AXES[i]]}|${PAIR_AXES[j]}=${combo[PAIR_AXES[j]]}`,
      );
    }
  }
  return keys;
}

// Greedy all-pairs (pairwise) selection over the valid full matrix: the
// smallest practical subset of real combinations that still covers every
// value-pair occurring anywhere in the full matrix. Deterministic — it walks
// the full matrix in a fixed order each round.
export function pairwiseMatrix() {
  const all = fullMatrix();
  const needed = new Set();
  for (const combo of all) {
    for (const key of pairKeys(combo)) {
      needed.add(key);
    }
  }
  const covered = new Set();
  const chosen = [];
  while (covered.size < needed.size) {
    let best = null;
    let bestGain = 0;
    for (const combo of all) {
      let gain = 0;
      for (const key of pairKeys(combo)) {
        if (!covered.has(key)) {
          gain++;
        }
      }
      if (gain > bestGain) {
        bestGain = gain;
        best = combo;
      }
    }
    if (best === null) {
      break;
    }
    chosen.push(best);
    for (const key of pairKeys(best)) {
      covered.add(key);
    }
  }
  return chosen;
}
