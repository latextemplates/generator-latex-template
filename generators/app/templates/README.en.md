# LaTeX Document

Compile it using
<% if (latexcompiler == "pdflatex")  { %>
    pdflatex main
<%
} else {
%>
    lualatex main
<%
}
%>
