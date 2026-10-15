import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
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

// The "Update files" workflows of lncs-enhanced and uni-stuttgart-dissertation-template
// generate both languages into one repository. A README that differs between the
// languages makes the bot commit in a loop.
describe("published README is the same for English and German", () => {
  const common = {
    githubpublish: true,
    docker: "iot",
    latexcompiler: "both",
    overleaf: true,
    texlive: 2026,
    listings: "minted",
    enquotes: "csquotes",
    tweakouterquote: "babel",
    todo: "pdfcomment",
    examples: true,
  };
  for (const [name, options] of [
    [
      "lncs",
      {
        documentclass: "lncs",
        papersize: "a4",
        bibtextool: "bibtex",
        font: "default",
        howtotext: false,
      },
    ],
    ["ustutt", { documentclass: "ustutt", howtotext: true, uml: "none" }],
  ]) {
    it(name, async () => {
      const readme = async (lang) => {
        const runResult = await helpers
          .run(generatorPath)
          .withOptions({ ...common, ...options, lang });
        return fs.readFileSync(path.join(runResult.cwd, "README.md"), "utf8");
      };
      assert.strictEqual(await readme("de"), await readme("en"));
    });
  }
});

// PlantUML and the Mermaid CLI are contained only in the Docker image by DANTE e.V.
describe("Docker image for UML tools", () => {
  for (const uml of ["plantuml", "mermaid"]) {
    it(`uses the DANTE image by default for uml=${uml}`, async () => {
      const runResult = await helpers.run(generatorPath).withAnswers({
        documentclass: "scientific-thesis",
        lang: "en",
        latexcompiler: "lualatex",
        texlive: 2026,
        examples: true,
        uml,
      });
      assert.strictEqual(runResult.generator.props.docker, "dante");
      runResult.assertFileContent("README.md", "danteev/texlive:edge latexmk");
      runResult.assertFileContent("Dockerfile", "FROM danteev/texlive:edge");
    });
  }
  it("keeps the Island of TeX image without UML tools", async () => {
    const runResult = await helpers.run(generatorPath).withAnswers({
      documentclass: "scientific-thesis",
      lang: "en",
      latexcompiler: "lualatex",
      texlive: 2026,
      examples: true,
      uml: "none",
      docker: "iot",
    });
    runResult.assertFileContent(
      "README.md",
      "registry.gitlab.com/islandoftex/images/texlive:latest latexmk",
    );
  });
});
