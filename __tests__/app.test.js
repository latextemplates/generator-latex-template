import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helpers from "yeoman-test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatorPath = path.join(__dirname, "../generators/app");

describe("scientific-thesis", () => {
  it("generates the English thesis files", async () => {
    const runResult = await helpers.run(generatorPath).withAnswers({
      documentclass: "scientific-thesis",
      lang: "en",
      latexcompiler: "pdflatex",
      texlive: 2025,
    });
    runResult.assertFile(["README.md", "main-english.tex"]);
  });

  it("generates the German thesis files", async () => {
    const runResult = await helpers.run(generatorPath).withAnswers({
      documentclass: "scientific-thesis",
      lang: "de",
      latexcompiler: "pdflatex",
      texlive: 2025,
    });
    runResult.assertFile(["README.md", "main-german.tex"]);
  });
});
