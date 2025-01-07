# LaTeX Dokument

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
