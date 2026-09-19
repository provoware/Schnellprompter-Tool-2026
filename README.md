# Schnellprompter Tool 2026

> **Status:** 🟢 Grundsystem stabil · Entwicklung **35 %** · Qualität **60 %** · Dokumentation **80 %**

Schlankes Grundsystem für einen übersichtlichen Prompt-Arbeitsbereich. Die
aktuelle Version liefert bewusst ein geprüftes Leer-Dashboard, auf dem die
fachlichen Funktionen schrittweise aufgebaut werden können.

Das Dashboard kann kurze Entwicklerinfos und Ideen direkt an
`entwicklerinfo_und_ideen_menge-inhalt.md` im ausgewählten Projektordner
anhängen. Jeder Eintrag erhält einen ISO-Zeitstempel. Die Ordnerfreigabe nutzt
die File System Access API (Chrome/Edge); ungesendete Eingaben werden abhängig
von der gewählten Einstellung lokal im Browser zwischengespeichert.

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

## Hauptnavigation

| Bezeichnung | Inhalt |
|---|---|
| [Projektstatus](docs/PROJECT_STATUS.md) | Fortschritt, Hauptliste, Iterationen, Pflege-Trigger und Empfehlungen |
| [Entwicklungsleitfaden](docs/DEVELOPMENT.md) | Architektur, Workflow, Debugging und Definition of Done |
| [Masterprompt](docs/MASTER_PROMPT.md) | Textbasierter, direkt prüf- und druckbarer Ablauf mit verbindlichem Ausgabeformat |
| [Arbeitsregeln](AGENTS.md) | Verbindliche Regeln für Änderungen im Repository |
| [Offene Punkte](todo.txt) | Priorisierte technische und fachliche Folgepunkte |
