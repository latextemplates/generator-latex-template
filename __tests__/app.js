"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("en--scientific-thesis--all-packages", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        documentclass: "scientific-thesis",
        latexcompiler: "pdflatex",
        bibtextool: "bibtex",
        language: "english",
        cleveref: true
      });
  });

  it("creates files", () => {
    assert.file(["README.md"]);
    assert.file(["main.tex"]);
  });
});

describe("de--scientific-thesis--all-packages", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        documentclass: "scientific-thesis",
        latexcompiler: "pdflatex",
        bibtextool: "bibtex",
        language: "german",
        cleveref: true
      });
  });

  it("creates files", () => {
    assert.file(["README.md"]);
    assert.file(["main.tex"]);
  });
});
