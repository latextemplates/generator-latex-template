# LaTeX Dokument
<% if (documentclass == "mwe") { -%>

Ein **minimaler Markdown-Schnellstart**: Schreibe deinen Inhalt als reines Markdown in `<%= filenames.manuscript %>.md`. Der schlanke Rahmen `<%= filenames.main %>.tex` bindet ihn per `\markdownInput` ein, LaTeX macht daraus ein PDF.
<% } -%>

Die in dieser Vorlage verwendeten LaTeX-Snippets können unter <https://latextemplates.github.io/latex-snippets/> eingesehen werden.

Kompiliere es mittels
<% if (latexcompiler == "pdflatex")  { %>
    pdflatex <%= filenames.main %>
<%
} else {
%>
    lualatex <%= filenames.main %>
<%
}
%>

## Features

- Gute Worttrennung und Mikrotypographie für deutsche Texte.
