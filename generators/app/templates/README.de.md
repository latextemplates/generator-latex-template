# LaTeX Dokument

Kompiliere es mittels
<% if (latexcompiler == "pdflatex")  { %>
    pdflatex main
<%
} else {
%>
    lualatex main
<%
}
%>
