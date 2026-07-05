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

Wie in \zcref{fig:example} gezeigt, lassen sich Bilder direkt in Markdown
referenzieren. Die reine Markdown-Referenz `<#fig:example>` liefert dagegen
nur die nackte Nummer (<#fig:example>), ohne den Typnamen Abbildung.

![Ein Beispielbild](example-image "Ein Beispielbild"){#fig:example}

## Eine Tabelle

\zcref{tbl:beispiel} zeigt die vier Ausrichtungsvarianten von `pipeTables`.

| Rechts | Links | Standard | Zentriert |
|-------:|:------|----------|:---------:|
|     12 | 12    | 12       |    12     |
|    123 | 123   | 123      |    123    |

: Beispieltabelle mit Ausrichtungen {#tbl:beispiel}

# Ein weiteres Kapitel

Text mit Verweis auf das vorige Kapitel: \zcref{cha:einleitung}. Weil die
Überschrift die Markdown-Id `{#cha:einleitung}` trägt und jede `\label`
zusätzlich ein `\zlabel` erzeugt, funktioniert `\zcref` hier ganz ohne rohes
\LaTeX{} zum Setzen der Marke -- z.\,B. auch auf \zcref{tbl:beispiel}.
