# Entwicklerdokumentation

## Schnellstart

Voraussetzung ist Node.js 20 oder neuer; die Anwendung selbst benötigt keine
Installation. Lokalen Server starten:

```bash
npm start
```

Danach `http://localhost:4173` öffnen. Qualitätscheck ausführen:

```bash
npm test
```

`file://` wird wegen ES-Modulen und Content-Security-Policy nicht unterstützt.

## Architektur

```text
index.html            Semantik und unveränderter Grundinhalt
css/styles.css        Design-Tokens, Layout und responsive Darstellung
js/config.js          Laufzeitkonfiguration ohne Geheimnisse
js/logger.js          zentrale, strukturierte und bereinigte Logs
js/app.js             einziger Einstiegspunkt und globale Fehlererfassung
scripts/              lokale, abhängigkeitfreie Qualitätsprüfungen
```

Neue Fachbereiche erhalten nur dann ein eigenes Modul, wenn sie eine klar
abgrenzbare Verantwortung besitzen. UI, Zustand und Datenzugriff nicht in einer
großen Funktion vermischen. Externe Bibliotheken erst aufnehmen, wenn Browser-APIs
den belegten Anwendungsfall nicht angemessen lösen.

## Workflow

1. Ziel, aktuelles Verhalten, Risiken und Nicht-Ziele notieren.
2. Kleine Änderung planen und betroffene Dateien begrenzen.
3. Branch mit sprechendem Namen verwenden, Änderung implementieren.
4. `npm test` ausführen; sichtbare Änderungen zusätzlich im Browser prüfen.
5. `git diff --check` und den vollständigen eigenen Diff kontrollieren.
6. Kleinen Commit erstellen und im Pull Request Zweck, Risiko und Checks nennen.

Fehler zuerst als eigener Patch, Bestand, Testannahme, Umgebung oder externe
Ursache klassifizieren. Nach zwei ungeplanten Folgekorrekturen stoppen und den
Plan neu bewerten. Releases benötigen einen grünen Check und eine aktualisierte
Versionsangabe in `package.json`, `manifest.webmanifest` (falls relevant) und UI.

## Logging und Debugging

Alle Logs laufen über `createLogger`. Produktionsstandard ist `warn`; der lokale
Debugmodus wird explizit über `?debug=1` aktiviert. Ein Eintrag enthält Zeit,
Stufe, Nachricht und stabilen Anwendungskontext. Felder mit sensitiven Namen wie
`token`, `password`, `prompt` oder `content` werden automatisch maskiert.

Regeln:

- Keine Nutzereingaben, vollständigen Prompt-Texte, Tokens oder Secrets loggen.
- Erwartbare Validierungsfehler nicht als Laufzeitfehler behandeln.
- `debug` für Diagnose, `info` für relevante Zustandswechsel, `warn` für
  tolerierte Abweichungen und `error` für fehlgeschlagene Abläufe verwenden.
- Fehler reproduzieren, minimalen Fall sichern, Ursache isolieren, gezielt ändern
  und genau die betroffene Ebene erneut prüfen.

## Definition of Done

- Akzeptanzkriterien erfüllt und bestehendes Verhalten erhalten
- Tastaturbedienung, Mobilansicht und verständlicher Leerzustand geprüft
- Keine direkten Konsolenaufrufe außerhalb des Loggers
- Keine Geheimnisse, temporären Dateien oder Abhängigkeiten versehentlich ergänzt
- Dokumentation nur bei geänderter Außenwirkung aktualisiert
- Diff frei von Debugresten und unbeabsichtigter Formatierung
