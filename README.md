# Schnellprompter Tool 2026

Browsernative Sammlung für wiederverwendbare Textabschnitte, Vorlagen und
Formulierungen. Ein Druck auf den Titel eines Arbeitsablaufs kopiert dessen Text.
Mehrere Fassungen, Dublettenprüfung, Platzhalter, Sicherungsdateien und gestufte
Hilfen unterstützen dabei auch Menschen ohne technische Vorkenntnisse.

## Start

```bash
npm start
```

Anschließend `http://localhost:4173` öffnen. Es gibt keine Runtime-Abhängigkeiten
und keinen Build-Schritt. Node.js 20 oder neuer wird für die Qualitätschecks
vorausgesetzt.

```bash
npm test
```

## Grundsätze

- Browsernatives HTML, CSS und JavaScript
- Responsives, tastaturfreundliches Grundlayout
- Zentrales strukturiertes Logging mit Maskierung sensitiver Felder
- Debugmodus ausschließlich nach expliziter Aktivierung über `?debug=1`
- Kleine Module und reproduzierbare, abhängigkeitfreie Checks
- Lokale Speicherung im verwendeten Browser; keine Übertragung an einen Dienst
- Maschinenlesbare Prüffälle in [`qualitaetsregeln.json`](qualitaetsregeln.json)

Architektur, Entwicklungsworkflow, Debugging und Definition of Done stehen in
[`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md). Verbindliche Repository-Regeln sind
in [`AGENTS.md`](AGENTS.md) dokumentiert; offene Produktentscheidungen stehen in
[`todo.txt`](todo.txt).
