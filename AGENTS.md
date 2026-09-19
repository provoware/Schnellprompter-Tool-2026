# Arbeitsregeln für dieses Repository

## Ziel und Geltungsbereich

Diese Regeln gelten für das gesamte Repository. Das Projekt bleibt eine schlanke,
browsernative Anwendung aus HTML, CSS und JavaScript ohne Build-Zwang.

## Verbindlicher Ablauf

1. **Verstehen:** Ziel, Ist-Zustand, Abhängigkeiten und Risiken benennen.
2. **Planen:** Änderungsbudget und überprüfbare Erfolgskriterien festlegen.
3. **Patchen:** Nur die kleinste ausreichende Änderung durchführen.
4. **Validieren:** `npm test` und bei sichtbaren Änderungen einen Browsercheck ausführen.
5. **Abschließen:** Diff prüfen, offene Nebenbefunde in `todo.txt` dokumentieren.

Subagenten nur für klar abgegrenzte, unabhängige Aufgaben einsetzen. Kontext und
erwartetes Ergebnis müssen in der Delegation stehen. Mehrere Agenten dürfen nie
dieselbe Datei gleichzeitig bearbeiten.

## Architektur und Code

- Keine Runtime-Abhängigkeit ohne dokumentierte Notwendigkeit.
- ES-Module verwenden; Seiteneffekte auf den Einstiegspunkt `js/app.js` begrenzen.
- DOM-Abfragen zentralisieren und fehlende Elemente defensiv behandeln.
- Keine direkten `console`-Aufrufe außerhalb von `js/logger.js`.
- Keine Geheimnisse, Prompts oder personenbezogenen Inhalte protokollieren.
- Nutzertexte auf Deutsch; Bezeichner und Commit-Nachrichten eindeutig halten.
- Semantisches HTML, sichtbare Fokuszustände und reduzierte Animation respektieren.
- CSS-Werte über Custom Properties wiederverwenden; keine Inline-Styles.

## Wartbarkeitsgrenzen

Die Werte sind Prüfschwellen, keine Aufforderung zu vorsorglichem Refactoring:

- Hilfsdateien möglichst höchstens 150 Zeilen
- normale Module möglichst höchstens 300 Zeilen
- Kernmodule möglichst höchstens 500 Zeilen
- Funktionen möglichst höchstens 40 Zeilen; ab 60 Zeilen Teilbarkeit prüfen
- Eine Datei hat eine erkennbare Verantwortung.

Überschreitungen im Pull Request begründen oder die Datei sinnvoll teilen.

## Qualität und Git

- Fremde Änderungen nicht zurücksetzen oder umformatieren.
- Generierte Dateien, Abhängigkeiten und lokale Einstellungen nicht committen.
- Vor dem Commit `git diff --check`, `npm test` und `git status --short` prüfen.
- Commits sind klein, lauffähig und beschreiben den fachlichen Effekt.
- TODO-Format: `[PRIORITÄT] Bereich – Befund – Auswirkung – nächster Schritt`.
