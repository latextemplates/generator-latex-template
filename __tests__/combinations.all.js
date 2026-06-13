// Opt-in exhaustive variant of combinations.test.js: runs the generator for
// every combination in the full matrix (thousands of runs, several minutes).
//
// Deliberately named *.js (not *.test.js) so `node --test` does NOT pick it up
// during `npm test`. Run it explicitly with `npm run test:all`.
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helpers from "yeoman-test";
import { fullMatrix, toOptions, mainFile, label } from "./matrix.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatorPath = path.join(__dirname, "../generators/app");

const combos = fullMatrix();

describe(`generator runs for the full switch matrix (${combos.length})`, () => {
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
