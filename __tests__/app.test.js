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

// The "Update files" workflows of lncs-enhanced, scientific-thesis-template, and
// uni-stuttgart-dissertation-template generate both languages into one repository.
// A shared file that differs between the languages makes the bot commit in a loop.
// (scientific-thesis-template keeps the README of the English variant only.)
const textidoteFiles = [
  ".textidote",
  ".textidote.dict",
  ".textidote.replacements",
];
describe("published shared files are the same for English and German", () => {
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
  for (const [name, options, sharedFiles] of [
    [
      "lncs",
      {
        documentclass: "lncs",
        papersize: "a4",
        bibtextool: "bibtex",
        font: "default",
        howtotext: false,
      },
      ["README.md", ...textidoteFiles],
    ],
    [
      "ustutt",
      { documentclass: "ustutt", howtotext: true, uml: "none" },
      ["README.md", ...textidoteFiles],
    ],
    [
      "scientific-thesis",
      { documentclass: "scientific-thesis", howtotext: true, uml: "none" },
      textidoteFiles,
    ],
  ]) {
    it(name, async () => {
      const generate = async (lang) => {
        const runResult = await helpers
          .run(generatorPath)
          .withOptions({ ...common, ...options, lang });
        return sharedFiles.map((file) =>
          fs.readFileSync(path.join(runResult.cwd, file), "utf8"),
        );
      };
      const de = await generate("de");
      const en = await generate("en");
      sharedFiles.forEach((file, i) => assert.strictEqual(de[i], en[i], file));
    });
  }
});

// A template repository puts the main files of all variants of one language
// next to each other, so they share the directory "chapters-<lang>". Only the source
// code example depends on the listings switch; it has a file of its own.
describe("thesis chapters are the same for all variants of a language", () => {
  const common = {
    githubpublish: true,
    docker: "iot",
    documentclass: "scientific-thesis",
    papersize: "a4",
    latexcompiler: "both",
    bibtextool: "biblatex",
    overleaf: true,
    texlive: 2026,
    font: "default",
    cleveref: true,
    enquotes: "csquotes",
    tweakouterquote: "babel",
    todo: "pdfcomment",
    examples: true,
    howtotext: true,
    uml: "none",
  };
  for (const lang of ["en", "de"]) {
    it(lang, async () => {
      const chapters = async (options) => {
        const runResult = await helpers
          .run(generatorPath)
          .withOptions({ ...common, ...options, lang });
        const dir = path.join(runResult.cwd, `chapters-${lang}`);
        return Object.fromEntries(
          fs
            .readdirSync(dir)
            .filter((file) => !/ - (listings|minted)\.tex$/.test(file))
            .map((file) => [
              file,
              fs.readFileSync(path.join(dir, file), "utf8"),
            ]),
        );
      };
      const reference = await chapters({
        thesisvariant: "ustutt",
        listings: "minted",
      });
      assert.ok(Object.keys(reference).length > 5);
      for (const options of [
        { thesisvariant: "ustutt", listings: "listings" },
        { thesisvariant: "university-of-hamburg", listings: "minted" },
      ]) {
        assert.deepStrictEqual(
          await chapters(options),
          reference,
          JSON.stringify(options),
        );
      }
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
      runResult.assertFileContent(
        "README.md",
        "danteev/texlive:2026-C latexmk",
      );
      runResult.assertFileContent("Dockerfile", "FROM danteev/texlive:2026-C");
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

// The README of a published thesis tells how to generate an own copy with PlantUML or Mermaid;
// the options that distinguish its main files are left open.
describe("README hint on PlantUML and Mermaid", () => {
  it("contains the generator call without thesis variant, language, and listings", async () => {
    const runResult = await helpers.run(generatorPath).withOptions({
      githubpublish: true,
      documentclass: "scientific-thesis",
      thesisvariant: "ustutt",
      latexcompiler: "both",
      overleaf: true,
      texlive: 2026,
      lang: "en",
      listings: "minted",
      enquotes: "csquotes",
      tweakouterquote: "babel",
      todo: "pdfcomment",
      examples: true,
      howtotext: true,
      uml: "none",
      docker: "iot",
    });
    runResult.assertFileContent(
      "README.md",
      "yo latex-template --documentclass=scientific-thesis --latexcompiler=both --overleaf=true --texlive=2026 --enquotes=csquotes --tweakouterquote=babel --todo=pdfcomment --examples=true --howtotext=true --uml=plantuml --docker=dante",
    );
  });
});
