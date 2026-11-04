#!/usr/bin/env python3
# Vendors the IEEE Reference Guide comparison from a checkout of biblatex-ieee
# (https://github.com/koppor/biblatex-ieee, directory ieee-reference-guide/):
#   generators/app/templates/comparison-reference-guide.ieee.bib  (its .bib with BibTeX fields)
#   generators/app/templates/comparison-reference-guide.ieee.tex  (every guide example next to IEEEtranN-doi.bst)
# Usage: scripts/ieee-reference-guide.py <path to biblatex-ieee checkout>
import re, sys, pathlib

src_dir = pathlib.Path(sys.argv[1]) / "ieee-reference-guide"
out_dir = pathlib.Path(__file__).resolve().parent.parent / "generators" / "app" / "templates"
MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split()


def split_date(val):
    m = re.match(r"(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?", val)
    return (m.group(1), m.group(2), m.group(3)) if m else (val, None, None)


def convert(etype, fields):
    """biblatex entry type and fields -> what IEEEtranN-doi.bst knows."""
    f = dict(fields)
    out = {}
    t = etype.lower()
    sub = f.pop("entrysubtype", "")
    for k in ("date", "eventdate"):
        if k in f:
            span = f.pop(k).split("/")  # "2010-10-05/2010-10-08" is a range: day "5--8"
            y, mo, d = split_date(span[0])
            if k == "eventdate" and "year" in out:
                continue
            out["year"] = y
            if mo:
                out["month"] = MONTHS[int(mo) - 1]  # BibTeX month macro, so the .bst abbreviates it ("Sep.")
            if d:
                out["day"] = str(int(d))
                d2 = split_date(span[1])[2] if len(span) > 1 else None
                if d2:
                    out["day"] += "--" + str(int(d2))
    if "year" in f:
        out["year"] = f.pop("year")
    if "eventtitle" in f:
        ev = f.pop("eventtitle")
        if t == "inproceedings" and "booktitle" not in f:
            f["intype"] = "presented at the"
            f["booktitle"] = ev
            if "number" in f:
                f["paper"] = f.pop("number")
        else:
            f["note"] = (f["note"] + ". " if f.get("note") else "") + "Presented at " + ev + (", " + f.pop("venue") if "venue" in f else "")
    for a, b in {"journaltitle": "journal", "location": "address", "venue": "address"}.items():
        if a in f and b not in f:
            f[b] = f.pop(a)
    if "pubstate" in f:
        f["note"] = (f["note"] + ", " if f.get("note") else "") + {
            "forthcoming": "to be published", "inpress": "to be published", "submitted": "submitted for publication",
            "early access": "early access", "prepublished": "early access"}.get(f.pop("pubstate"), "to be published")
    if "eprint" in f:
        f["note"] = (f["note"] + ", " if f.get("note") else "") + ("arXiv:" if f.get("eprinttype", "").lower() == "arxiv" else "") + f.pop("eprint")
    ty = f.get("type", "")
    if t == "online":  # a dated document: "Author. (Date). Title."; a web page: "Author. "Title." Site. Accessed: ..."
        t = "misc" if "url" not in f else "electronic" if "year" in out else "online"
    elif t == "standard" and f.get("number", "").startswith("Rec. "):
        f["type"], f["number"] = f["number"].split(" ", 1)
    elif t == "thesis":
        t = "phdthesis" if ty.lower() in ("phdthesis", "phd") or any(w in ty.lower() for w in ("doctor", "dissertation")) and ty.lower() != "mathesis" else "mastersthesis"
        if ty.lower() in ("phdthesis", "mathesis"):
            f.pop("type")
        if "institution" in f:
            f["school"] = f.pop("institution")
    elif t == "report":
        t = "techreport"
        if ty:
            f["type"] = {"techreport": "Tech. Rep.", "resreport": "Res. Rep."}.get(ty.lower(), ty)
    elif t == "patent":
        if ty.lower().startswith("patent") or ty.lower().startswith("patreq"):
            country = ty[6:].upper()
            f["nationality"] = {"US": "U.S."}.get(country, country)
            f["type"] = "Patent Appl." if ty.lower().startswith("patreq") else "Patent"
    elif t == "software":
        pass
    elif t == "unpublished":
        pass
    elif t == "inbook" and "booktitle" in f:
        t = "incollection"
    elif t == "incollection" and "booktitle" not in f:
        t = "book"
    elif t == "periodical" and "issuetitle" in f:
        f["journal"] = f.pop("title")
        f["title"] = "{" + f.pop("issuetitle") + "}"
    if t == "misc" and "number" in f:
        f["paper"] = re.sub(r"^Paper\s+", "", f.pop("number"))
    if t == "misc" and "author" not in f and "title" in f:  # legal citations: the title is not quoted
        f["howpublished"] = f.pop("title") + (", " + f["howpublished"] if "howpublished" in f else "")
    if "institution" in f and "organization" not in f and t != "techreport":
        f["organization"] = f.pop("institution")
    for k in ("issuetitle", "maintitle", "addendum", "eprinttype"):
        f.pop(k, None)
    if "url" in f:
        f["url"] = f["url"].replace("#", "\\#")  # a bare # breaks the \gdef that bibentry stores the entry with
    out.update(f)
    return t, out


bib = (src_dir / "ieee-reference-guide.bib").read_text()
entries = []
for m in re.finditer(r"^@(\w+)\{([^,]+),\n(.*?)^\}", bib, re.S | re.M):
    fields = re.findall(r"^\s*(\w+)\s*=\s*\{(.*)\},\s*$", m.group(3), re.M)
    entries.append((m.group(2),) + convert(m.group(1), fields))
with open(out_dir / "comparison-reference-guide.ieee.bib", "w") as w:
    w.write("% The examples of the IEEE Reference Guide (V 3.28.2025), converted to BibTeX fields\n"
            "% by scripts/ieee-reference-guide.py from biblatex-ieee's ieee-reference-guide.bib. Do not edit.\n\n")
    for key, t, out in entries:
        w.write("@%s{%s,\n" % (t, key))
        for k, v in out.items():
            w.write("  %s = %s,\n" % (k, v if k == "month" else "{" + v + "}"))
        w.write("}\n\n")

tex = (src_dir / "ieee-reference-guide.tex").read_text()
body = tex[tex.index("\\section"):tex.index("\\end{document}")]
body = re.sub(r"\\(begin|end)\{examples\}\n", "", body)
body = re.sub(r"\\printbibliography.*\n", "", body)
doc = r"""% Every example of the IEEE Reference Guide (V 3.28.2025) next to the output of IEEEtranN-doi.bst,
% so that differences can be spotted by eye. Text and examples come from biblatex-ieee's
% ieee-reference-guide.tex (https://github.com/koppor/biblatex-ieee), vendored by
% scripts/ieee-reference-guide.py of generator-latex-template. Do not edit.
% Built by comparison/build.sh: pdflatex + bibtex, from the directory of paper.tex.
\documentclass{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{newtxtext}
\usepackage[english]{babel}
\usepackage{xurl}
\usepackage[hidelinks]{hyperref}
\usepackage[numbers,sort]{natbib}
\usepackage{bibentry}
% bibentry captures each entry up to " \par"; IEEEtran's entries end with a control word, which
% swallows that space, so capture up to "\par". The .bbl's \providecommands are local to
% \nobibliography's group, so they are repeated here.
\makeatletter
\def\BR@c@bibitem#1 #2\par{{\let\protect\@unexpandable@protect
      \expandafter \gdef\csname BR@r@#1\@extra@b@citeb\endcsname
      {\BR@nodot#2\relax.\relax\relax}}}
\makeatother
\providecommand{\BIBdoi}[1]{\href{https://doi.org/#1}{\nolinkurl{#1}}}
\providecommand{\BIBentrySTDinterwordspacing}{\spaceskip=0pt\relax}
\providecommand{\BIBentryALTinterwordstretchfactor}{4}
\providecommand{\BIBentryALTinterwordspacing}{\spaceskip=\fontdimen2\font plus
  \BIBentryALTinterwordstretchfactor\fontdimen3\font minus \fontdimen4\font\relax}
\providecommand{\BIBforeignlanguage}[2]{#2}

\newlength{\guidenumwidth}
\newlength{\guidelabelwidth}
\settowidth{\guidenumwidth}{[000]\quad}
\settowidth{\guidelabelwidth}{\textbf{IEEEtranN-doi:}\quad}
\newcommand{\guiderow}[3]{%
  \par\noindent
  \makebox[\guidenumwidth][l]{#1}%
  \makebox[\guidelabelwidth][l]{\textbf{#2}}%
  \begin{minipage}[t]{\dimexpr\linewidth-\guidenumwidth-\guidelabelwidth\relax}
    \raggedright #3%
  \end{minipage}\par
  \smallskip
}
% \guide{<key>}{<text of the guide>}: one unbreakable box per example
\newcommand{\guide}[2]{%
  \par\noindent
  \begin{minipage}{\linewidth}
    \guiderow{\cite{#1}}{Guide:}{#2}%
    \guiderow{}{IEEEtranN-doi:}{\bibentry{#1}}%
  \end{minipage}\par
  \medskip
}

\title{IEEE Reference Guide examples typeset with IEEEtranN-doi.bst}
\date{\today}

\begin{document}
\maketitle
\nobibliography{comparison/reference-guide}
\bibliographystyle{IEEEtranN-doi}

Each example of the
\href{https://journals.ieeeauthorcenter.ieee.org/wp-content/uploads/sites/7/IEEE_Reference_Guide.pdf}{IEEE Reference Guide, V 3.28.2025}
is shown twice: as given in the guide (``Guide''; plain text, the guide's italics are not reproduced),
and as typeset by IEEEtranN-doi.bst (``IEEEtranN-doi'') from the matching entry of comparison/reference-guide.bib.
The entries were written for biblatex-ieee and converted to BibTeX fields; types without an IEEEtran driver are entered as \texttt{@misc}.

""" + body + "\n\\end{document}\n"
(out_dir / "comparison-reference-guide.ieee.tex").write_text(doc)
print(len(entries), "entries;", body.count("\\guide{"), "examples")
