// Opt-in exhaustive variant of combinations.test.js: runs the generator for
// every combination in the full matrix (thousands of runs, several minutes).
//
// Each yeoman-test run keeps memory, so the matrix is split into shards
// (combinations.all.<i>.js), and `node --test` runs each shard file in its own process.
// The file names do not match the default patterns of `node --test`, so `npm test` skips them;
// run them with `npm run test:all`.
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helpers from "yeoman-test";
import { fullMatrix, toOptions, mainFile, label } from "./matrix.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatorPath = path.join(__dirname, "../generators/app");

export const SHARDS = 4;

export function runShard(shard) {
  const combos = fullMatrix().filter((_, k) => k % SHARDS === shard);
  describe(`generator runs for the full switch matrix, shard ${shard + 1}/${SHARDS} (${combos.length})`, () => {
    for (const combo of combos) {
      it(label(combo), async () => {
        const runResult = await helpers
          .run(generatorPath)
          .withOptions(toOptions(combo));
        runResult.assertFile(["README.md", mainFile(combo)]);
        if (combo.documentclass === "mwe") {
          runResult.assertFile(
            combo.language === "en" ? "manuscript.md" : "manuscript-de.md",
          );
        }
        runResult.cleanup();
      });
    }
  });
}
