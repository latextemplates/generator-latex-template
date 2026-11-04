#!/usr/bin/env python3
# Compares every example of the IEEE Reference Guide with the IEEEtranN-doi.bst output in a built
# comparison-reference-guide.pdf (see generators/app/CLAUDE.md): prints the differing examples
# ("G:" guide, "O:" our .bst) and the counts. Whitespace is ignored (URLs wrap differently).
# Usage: scripts/ieee-reference-guide-diff.py <dir with comparison-reference-guide.pdf and .aux>
# Needs pdftotext (poppler).
import pathlib, re, subprocess, sys

d = pathlib.Path(sys.argv[1])
txt = subprocess.run(["pdftotext", "-raw", d / "comparison-reference-guide.pdf", "-"], check=True, capture_output=True, text=True).stdout
num2key = {n: k for k, n in re.findall(r"\\bibcite\{([^}]+)\}\{\{(\d+)\}", (d / "comparison-reference-guide.aux").read_text())}
lines = [l for l in txt.replace("\f", "\n").split("\n") if not re.fullmatch(r"\s*\d+\s*", l)]  # page numbers
pairs = re.findall(r"\[(\d+)\] Guide: (.*?)\nIEEEtranN-doi:\n(.*?)(?=\n\[\d+\] Guide: |\n\d{1,2}(?:\.\d+)? [A-Z][a-z]|\Z)", "\n".join(lines), re.S)


def norm(s):
    s = re.sub(r"\s+", " ", s).strip()
    return s.replace("“", '"').replace("”", '"').replace("’", "'").replace("‘", "'")


same = 0
for n, g, o in pairs:
    g, o = norm(g), norm(o)
    if re.sub(r"\s", "", g) == re.sub(r"\s", "", o):
        same += 1
    else:
        print(f"[{n}] {num2key.get(n, '?')}\n  G: {g}\n  O: {o}")
print(f"\n{len(pairs)} examples, {same} identical, {len(pairs) - same} differ")
