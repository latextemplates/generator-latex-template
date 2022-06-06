"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("general tests", () => {
  it("en--scientific-thesis--all-packages", async function () {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        documentclass: "scientific-thesis",
        latexcompiler: "pdflatex",
        bibtextool: "bibtex",
        language: "english",
        font: "arial"
      })
      .then(function(dir) {
        assert.file([
          path.join(dir, "README.md"),
          path.join(dir, "main.tex")
        ]);
      });
  });
  it("de--scientific-thesis--all-packages", () => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        documentclass: "scientific-thesis",
        latexcompiler: "pdflatex",
        bibtextool: "bibtex",
        language: "german",
        font: "arial"
      })
      .then(function(dir) {
        assert.file([
          path.join(dir, "README.md"),
          path.join(dir, "main.tex")
        ]);
      });
  });
});
