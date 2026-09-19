# Schnellprompter Tool 2026

Schlankes Grundsystem für einen übersichtlichen Prompt-Arbeitsbereich. Die
aktuelle Version liefert bewusst ein geprüftes Leer-Dashboard, auf dem die
fachlichen Funktionen schrittweise aufgebaut werden können.

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

Architektur, Entwicklungsworkflow, Debugging und Definition of Done stehen in
[`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md). Verbindliche Repository-Regeln sind
in [`AGENTS.md`](AGENTS.md) dokumentiert; offene Produktentscheidungen stehen in
[`todo.txt`](todo.txt).
