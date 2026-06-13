import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helpers from "yeoman-test";
import { pairwiseMatrix, toOptions, mainFile, label } from "./matrix.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatorPath = path.join(__dirname, "../generators/app");

const combos = pairwiseMatrix();

// Pairwise coverage of every switch combination: assert the generator runs to
// completion (any EJS/template error rejects the run) and emits its primary
// files. This does NOT compile the result — the LaTeX build matrix does that.
describe(`generator runs for all switch combinations (pairwise, ${combos.length})`, () => {
  for (const combo of combos) {
    it(label(combo), async () => {
      const runResult = await helpers
        .run(generatorPath)
        .withOptions(toOptions(combo));
      runResult.assertFile(["README.md", mainFile(combo.documentclass)]);
      runResult.cleanup();
    });
  }
});
