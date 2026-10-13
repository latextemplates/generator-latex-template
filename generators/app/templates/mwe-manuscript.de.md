# Einleitung {#cha:einleitung}

Dieser gesamte Buchinhalt ist in **Markdown** geschrieben. Überschriften
der obersten Ebene (`#`) werden automatisch zu Kapiteln, `##` zu
Abschnitten, passend zur `scrbook`-Dokumentklasse. Diese Überschrift trägt
die Markdown-Id `{#cha:einleitung}`, aus der das Paket ein `\label` erzeugt.

Ein Zitat sieht so aus [@mwe], und hier eine Fußnote.^[Dies
ist eine Inline-Fußnote.] Referenzierte Fußnoten funktionieren
ebenfalls[^detail].

[^detail]: Dies ist eine ausführlichere Fußnote am Ende des Abschnitts.

## Motivation

- erster Punkt
- zweiter Punkt
  - Unterpunkt
1) erstens
2) zweitens

Auch Aufgabenlisten (`taskLists`) sind möglich:

- [ ] noch offener Punkt
- [x] bereits erledigter Punkt

Wie in <#fig:example> gezeigt, lassen sich Bilder direkt in Markdown
referenzieren: Die Referenz `<#fig:example>` liefert den Typnamen und die Nummer.

![Ein Beispielbild](example-image "Ein Beispielbild"){#fig:example}

## Eine Tabelle

<#tbl:beispiel> zeigt die vier Ausrichtungsvarianten von `pipeTables`.

| Rechts | Links | Standard | Zentriert |
|-------:|:------|----------|:---------:|
|     12 | 12    | 12       |    12     |
|    123 | 123   | 123      |    123    |

: Beispieltabelle mit Ausrichtungen {#tbl:beispiel}

## Akronyme

Einmal in der `.tex`-Hülle definierte Akronyme werden im laufenden Text
automatisch erkannt und als Akronyme gesetzt -- wie HTML und YAML genau hier --
und jede Verwendung landet im Abkürzungsverzeichnis am Ende, wo die Langform
ausgeschrieben ist. Explizite Auszeichnung geht auch: [JSON]{.acronym} wird
als Akronym gesetzt, obwohl es nirgends definiert ist.

# Ein weiteres Kapitel

Text mit Verweis auf das vorige Kapitel: <#cha:einleitung>. Weil die
Überschrift die Markdown-Id `{#cha:einleitung}` trägt, braucht der Verweis kein
rohes \LaTeX{}. Rohes \LaTeX{} geht aber auch: \zcref{tbl:beispiel} ist
dasselbe wie `<#tbl:beispiel>`.
