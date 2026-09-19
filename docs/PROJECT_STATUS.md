# Projektstatus

> **Kurzstatus:** 🟢 Grundsystem stabil · Entwicklung **35 %** · Qualität **60 %** · Dokumentation **80 %**

## Hauptliste: Arbeitsbereiche

| Nr. | Bereich | Status | Betroffene Dateien | Nächster belegter Schritt |
|---:|---|---|---|---|
| 01 | Prompt-Arbeitsbereich | 🔴 Offen | `index.html`, künftiges Fachmodul | Anforderungen und Akzeptanzkriterien festlegen |
| 02 | Entwicklerinfos und Ideen | 🟢 Bereit | `js/quick-notes.js`, `js/app.js` | Browser-Fallback nach Browser-Matrix bewerten |
| 03 | Qualitätssicherung | 🟡 Aktiv | `scripts/check-project.js` | Zielbrowser festlegen, danach E2E-Check wählen |
| 04 | Projektdokumentation | 🟢 Bereit | `README.md`, `docs/` | Bei fachlicher Außenwirkung gezielt pflegen |

## Prozessanzeigen

| Prozess | Fortschritt | Nachweis |
|---|---:|---|
| Entwicklung | 35 % | Grundlayout und lokale Schnellspeicherung vorhanden |
| Automatische Projektchecks | 60 % | Strukturcheck über `npm test`; kein E2E-Test |
| Dokumentation | 80 % | Einstieg, Entwicklung, Status und Masterprompt vorhanden |
| Releasefähigkeit | 30 % | Kernablauf und Browser-Matrix noch offen |

Die Prozentwerte sind eine manuell gepflegte Orientierung, keine automatisch
ermittelte Metrik. Sie werden nur bei einem nachweisbaren Meilenstein geändert.

## Iterationen

### 2026-09-19 · Struktur und Sprache

- **Ziel:** Projektinformationen benennen, priorisieren und vom Einstieg bis zu
  Detailinformationen nachvollziehbar machen.
- **Betroffen:** Dashboard, README, Entwicklungsdokumentation, Projektstatus und
  Masterprompt.
- **Ergebnis:** kompakte Fortschrittsanzeige, benannte Hauptliste, zentrale
  Pflege-Matrix und informative Links zum textbasierten Masterprompt.
- **Validierung:** `npm test`, `git diff --check` und Browsercheck.

## Pflege-Trigger

| Trigger | Immer prüfen | Nur bei Auswirkung aktualisieren |
|---|---|---|
| UI oder Nutzerablauf geändert | `README.md`, `docs/PROJECT_STATUS.md` | Screenshot, `docs/DEVELOPMENT.md` |
| Architektur oder Workflow geändert | `docs/DEVELOPMENT.md` | `README.md`, `AGENTS.md` |
| Meilenstein abgeschlossen | `docs/PROJECT_STATUS.md` | Fortschrittswerte, Screenshot |
| Relevanter Folgepunkt entdeckt | `todo.txt` | keine weitere Datei |
| Release erstellt | `package.json`, `manifest.webmanifest`, UI-Version | README und Status |

Ein „Superagent“ ist nicht dauerhaft nötig. Sinnvoll ist ein **triggerbasierter
Dokumentations-Review nach abgeschlossenem Patch**: Diff einlesen, Außenwirkung
klassifizieren, nur betroffene Dokumente aktualisieren und danach dieselben Checks
ausführen. So bleibt die Pflege reproduzierbar, ohne Parallelkonflikte oder
unnötige Textänderungen zu erzeugen.

## Empfehlungen

1. **Kernablauf spezifizieren:** Vor zusätzlicher UI die Prompt-Erstellung mit
   Eingaben, Ergebnis, Speicherung und Abbruchfällen als Akzeptanzkriterien klären.
2. **Browserziel festlegen:** Erst danach eine kleine End-to-End-Prüfung auswählen;
   vorher würde ein Tooling-Wechsel unnötige Architektur erzeugen.

## Links

- [Projektübersicht](../README.md)
- [Entwicklungsleitfaden](DEVELOPMENT.md)
- [Professioneller Masterprompt – druckbare Quellfassung](MASTER_PROMPT.md)
- [Verbindliche Arbeitsregeln](../AGENTS.md)
- [Offene technische Folgepunkte](../todo.txt)
- [MDN: File System API](https://developer.mozilla.org/docs/Web/API/File_System_API)
- [WAI: ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
