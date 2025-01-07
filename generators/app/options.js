export const options = [
  {
    type: "list",
    name: "documentclass",
    message: "Which template should be generated?",
    choices: [
      {
        name: "Association for Computing Machinery (ACM)",
        value: "acmart",
      },
      {
        name: "Institute of Electrical and Electronics Engineers (IEEE)",
        value: "ieee",
      },
      {
        name: "Springer's Lecture Notes in Computer Science (LNCS)",
        value: "lncs",
      },
      {
        name: "Scientic Thesis",
        value: "scientific-thesis",
      },
      {
        name: "PhD Thesis Template (University of Stuttgart)",
        value: "ustutt",
      },
    ],
    default: "acmart",
  },
  {
    type: "list",
    name: "acmformat",
    when(response) {
      return response.documentclass === "acmart";
    },
    message: "Which format of ACM?",
    choices: [
      {
        value: "manuscript",
        name: "A manuscript. This is the default.",
      },
      {
        value: "acmsmall",
        name: "Small single-column format. Used for CIE, CSUR, JACM, JDIQ, JEA, JERIC, JETC, PACMCGIT, PACMHCI, PACMPL, TAAS, TACCESS, TACO, TALG, TALLIP (formerly TALIP), TCPS, TDS, TEAC, TECS, TELO, THRI, TIIS, TIOT, TISSEC, TIST, TKDD, TMIS, TOCE, TOCHI, TOCL, TOCS, TOCT, TODAES, TODS, TOIS, TOIT, TOMACS, TOMM (formerly TOMCCAP), TOMPECS, TOMS, TOPC, TOPLAS, TOPS, TOS, TOSEM, TOSN, TQC, TRETS, TSAS, TSC, TSLP and TWEB, including special issues.",
      },
      {
        value: "acmlarge",
        name: "Large single-column format. Used for DTRAP, HEALTH, IMWUT, JOCCH, POMACS and TAP, including special issues.",
      },
      {
        value: "acmtog",
        name: "Large double-column format. Used for TOG, including annual conference Technical Papers.",
      },
      {
        value: "sigconf",
        name: "Proceedings format for most ACM conferences (with the exceptionslisted below) and all ICPS volumes.",
      },
      {
        value: "sigplan",
        name: "Proceedings format for SIGPLAN conferences",
      },
    ],
    default: "sigconf",
  },
  {
    type: "confirm",
    name: "acmreview",
    when(response) {
      return response.documentclass === "acmart";
    },
    message: "Format as document to review?",
    default: true,
  },
  {
    type: "list",
    name: "ieeevariant",
    when(response) {
      return response.documentclass === "ieee";
    },
    message: "Which variant of IEEE paper?",
    choices: [
      {
        name: "conference paper",
        value: "conference",
      },
      {
        name: "journal paper",
        value: "journal",
      },
      {
        name: 'peerreview paper - similar to journal paper, but additional cover page and on first "real" paper page title without authors',
        value: "peerreview",
      },
    ],
    default: "conference",
  },
  {
    type: "list",
    name: "papersize",
    message: "Which paper size to use?",
    choices: [
      {
        name: "A4",
        value: "a4",
      },
      {
        name: "US letter",
        value: "letter",
      },
    ],
    default: "a4",
  },
  {
    type: "list",
    name: "texlive",
    message: "Which TeXLive compatibility?",
    choices(state) {
      const res = [
        {
          name: "TeXLive 2024",
          value: 2024,
        },
      ];
/*      if (!state.overleaf) {
        res.push({
          name: "TeXLive 2023",
          value: 2023,
        });
      }
*/
      return res;
    },
    default(state) {
      if (state.overleaf) {
        return 2024;
      }

      return 2024;
    },
  },
  {
    type: "list",
    name: "latexcompiler",
    message: "Which latex compiler should be used?",
    choices: [
      {
        name: "pdflatex",
        value: "pdflatex",
      },
      {
        name: "lualatex",
        value: "lualatex",
      },
      {
        name: "lualatex and pdflatex (if switches in .tex files; default lualatex)",
        value: "both",
      },
    ],
    default: "both",
    when(response) {
      return !(response.documentclass === "ieee");
    },
  },
  {
    when(response) {
      return (
        response.documentclass !== "acmart" && response.documentclass !== "ieee"
      );
    },
    type: "list",
    name: "bibtextool",
    message: "Which BibTeX tool should be used?",
    choices: [
      {
        name: "BibTeX",
        value: "bibtex",
      },
      {
        name: "BibLaTeX + biber",
        value: "biblatex",
      },
    ],
    default(response) {
      switch (response.documentclass) {
        case "acmart":
        case "ieee":
        case "lncs":
          return "bibtex";
        default:
          return "biblatex";
      }
    },
  },
  {
    type: "list",
    name: "docker",
    message: "Should a Dockerfile be generated?",
    choices: [
      {
        name: "no",
        value: false,
      },
      {
        name: "yes (Island of TeX)",
        value: "iot",
      },
      {
        name: "yes (Reiztig)",
        value: "reitzig",
      },
      {
        name: "yes (DANTE e.V.)",
        value: "dante",
      },
    ],
    default: false,
  },
  {
    type: "list",
    name: "lang",
    message: "Which language should the document be?",
    choices: [
      {
        name: "English",
        value: "en",
      },
      {
        name: "German",
        value: "de",
      },
    ],
    default: "en",
  },
  {
    type: "list",
    name: "font",
    message: "Which font should be used?",
    choices(state) {
      const res = [];
      if (state.documentclass === "acmart") {
        res.push({
          name: "ACM Default",
          value: "default",
        });
      } else if (state.documentclass === "ieee") {
        res.push({
          name: "IEEE Default",
          value: "default",
        });
      } else {
        res.push({
          name: "Computer Modern (Default LaTeX font)",
          value: "default",
        });
        if (state.documentclass === "scientific-thesis") {
          res.push({
            name: "Arial",
            value: "arial",
          });
        }

        res.push({
          name: "Times New Roman",
          value: "times",
        });
      }

      return res;
    },
    default: "default",
    when(response) {
      return response.documentclass !== "ieee";
    },
  },
  {
    type: "list",
    name: "listings",
    message: "Which package to typeset listings?",
    choices: [
      {
        name: "listings",
        value: "listings",
      },
      {
        name: "minted (requires a working Python installation)",
        value: "minted",
      },
    ],
    default: "listings",
  },
  {
    type: "list",
    name: "enquotes",
    message: 'Which package to use to "enquote" text?',
    choices(state) {
      const res = [];
      res.push({
        name: "csquotes (\\enquote{...} command)",
        value: "csquotes",
      });
      if (state.language === "en") {
        res.push({
          name: "textcmds (\\qq{...} command)",
          value: "textcmds",
        });
      }

      if (state.language === "de") {
        res.push({
          name: "Plain LaTeX (\\glqq{}text\\grqq{} - not recommended)",
          value: "plainlatex",
        });
      } else {
        res.push({
          name: "Plain LaTeX (``text'' - not recommended)",
          value: "plainlatex",
        });
      }

      return res;
    },
    default: "csquotes",
  },
  {
    type: "list",
    name: "tweakouterquote",
    message:
      'Enable hyphenation tweak (e.g., application"=specific for app-lication-specific at a linebreak) or enable easy quotation (e.g., "application"; not common in default latex setups)?',
    choices: [
      {
        name: "Hyphenation tweak",
        value: "babel",
      },
      {
        name: "Easy quotation",
        value: "outerquote",
      },
    ],
    default: "babel",
  },
  {
    type: "list",
    name: "todo",
    message: "Which package to mark TODOs?",
    choices: [
      {
        name: "pdfcomment",
        value: "pdfcomment",
      } /*
      {
        name: "Plain LaTeX (simple \\commentontext and \\commentatside are defined)",
        value: "plainlatex"
      }, */,
      {
        name: "None (no support)",
        value: "none",
      },
    ],
    default: "pdfcomment",
  },
  {
    type: "confirm",
    name: "howtotext",
    message: "Include hints on text (e.g., how to write an abstract)?",
    default: true,
  },
  {
    type: "confirm",
    name: "examples",
    message: "Include minimal LaTeX examples?",
    default: true,
  },
];
