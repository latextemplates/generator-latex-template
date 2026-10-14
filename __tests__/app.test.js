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

  for (const [thesisvariant, logo] of [
    ["university-of-hamburg", "figures/uhh-logo.pdf"],
    ["thu", "figures/thu-logo.png"],
  ]) {
    it(`generates the ${thesisvariant} title page with its logo`, async () => {
      const runResult = await helpers.run(generatorPath).withAnswers({
        documentclass: "scientific-thesis",
        thesisvariant,
        lang: "en",
        latexcompiler: "pdflatex",
        texlive: 2025,
      });
      runResult.assertFile(["main-english.tex", logo]);
      runResult.assertFileContent("main-english.tex", logo);
      // The title page starts with \frontmatter, so the text needs \mainmatter.
      runResult.assertFileContent("main-english.tex", "\\mainmatter");
    });
  }
});

describe("ustutt dissertation", () => {
  // The flags of the template's update-files.yml: no --thesisvariant, so it is "none".
  it("does not emit \\mainmatter", async () => {
    const runResult = await helpers.run(generatorPath).withOptions({
      documentclass: "ustutt",
      latexcompiler: "both",
      texlive: 2026,
      lang: "en",
      listings: "minted",
      enquotes: "csquotes",
      tweakouterquote: "babel",
      todo: "pdfcomment",
      examples: true,
      howtotext: true,
      uml: "none",
    });
    runResult.assertFile("thesis-example.tex");
    // The template keeps a commented-out "%\\mainmatter"; only an active one is wrong.
    runResult.assertNoFileContent("thesis-example.tex", /^\\mainmatter/m);
  });
});
