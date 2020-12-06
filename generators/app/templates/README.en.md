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

## Benefits

<% if (documentclass == 'lncs') { -%>
- Example to have an image being placed right to a text.
<% } -%>

## FAQs

##### Q: I get `Package csquotes Error: Unbalanced groups or invalid nesting.` What can I do?

A: You have activated `\MakeOuterQuote{"}` and used some special babel command to allow hyphenation at other places as a dash. One example is writing `application"=specific`.
Now, you have to decide whether you want keep using plain quotes to enquote a word or use the special hyphenation command.
In other words: Do you want `"quote"` and `application\diviswithhiphenation specific` or `\enquote{quote} and  application"=specific`?

<!-- disable markdown-lint rules contradicting our writing of FAQs -->
<!-- markdownlint-disable-file MD001 MD013 MD026 -->
