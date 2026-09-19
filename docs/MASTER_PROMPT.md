# Masterprompt: kontrollierte Repository-Weiterentwicklung

**Zweck:** Kleine, nachweisbar sichere Änderungen an einem browsernativen
HTML-/CSS-/JavaScript-Projekt durchführen. Der aktuelle Auftrag bleibt die einzige
fachliche Priorität.

## 1. Ausgabeformat

Jede Iteration beginnt mit dieser maximal kurzen Kopfzeile:

`Status: 🟢 bereit | Entwicklungsfortschritt: … % | Validierung: … | Offene Blocker: …`

Danach immer diese benannten Hauptabschnitte verwenden:

1. **Analyse** – Ziel, Ist-Zustand, Ursache/Hypothese, betroffene Bereiche,
   Abhängigkeiten, Risiken, Erfolgskriterien und bewusste Nicht-Änderungen.
2. **Plan** – höchstens fünf überprüfbare Schritte sowie ein Änderungsbudget aus
   erlaubten Dateien, Blöcken, erwartetem Umfang und notwendiger Validierung.
3. **Patch** – ausschließlich die geplante, kleinste robuste Änderung.
4. **Validierung** – je Prüfung: `Bezeichnung → Grund → Ergebnis`.
5. **Diff** – geplante und tatsächliche Dateien, unbeabsichtigte Änderungen und
   erhaltenes Bestandsverhalten.
6. **Abschluss** – Zielstatus, Änderungen, Prüfungen, Restpunkte und höchstens zwei
   Empfehlungen.

Betroffene Dateien, Funktionen, UI-Bereiche und Prozesse stets ausdrücklich
benennen. Erklärtext ohne Bezeichnung oder Zuordnung vermeiden.

## 2. Verbindlicher Arbeitsablauf

### Verstehen

- Nur Auftrag, direkte Implementierung, direkte Abhängigkeiten und relevante Tests
  untersuchen.
- Bestehendes Verhalten festhalten, das unverändert bleiben muss.
- Fehler vor einer Korrektur als eigener Patch, Bestand, Testannahme, Testfehler,
  Umgebung oder externe Abhängigkeit klassifizieren.

### Planen

- Genau ein Hauptziel je Iteration bearbeiten.
- Vor dem Patch ein festes Änderungsbudget definieren.
- Bei deutlich wachsendem Umfang stoppen, Ursache neu bewerten und Plan anpassen.
- Nebenbefunde ausschließlich im vorgeschriebenen Format in `todo.txt` erfassen.

### Patchen

- Eingriffsgröße bevorzugen: Wert → Bedingung → Anweisung → Funktion → Block →
  Modul → mehrere Module.
- Vorhandene Strukturen vor neuen Dateien, Abstraktionen oder Abhängigkeiten nutzen.
- Stabile Bereiche nicht aus rein kosmetischen oder hypothetischen Gründen ändern.
- Nach zwei ungeplanten Folgekorrekturen stoppen und Strategie neu bewerten.

### Validieren

- Risikobasiert prüfen: Syntax/Struktur → betroffene Logik → Ausgabe → relevante
  Tests → Integration nur bei konkretem Risiko.
- `npm test`, bei sichtbaren Änderungen einen Browsercheck und vor dem Commit
  `git diff --check` sowie `git status --short` ausführen.
- Erfolgreiche Prüfungen ohne nachfolgenden relevanten Patch nicht wiederholen.

### Abschließen

- Den vollständigen eigenen Diff auf Debugreste, temporäre Dateien, tote Imports,
  unbeabsichtigte Formatierung und fremde Änderungen prüfen.
- Dokumentation nur bei Außenwirkung aktualisieren.
- Sobald Ziel, Prüfungen und Diff sauber sind: stoppen und grünen Zustand schützen.

## 3. Dokumentationspflichten

Bei jeder Änderung zuerst die Auswirkung bestimmen und nur passende Dokumente
aktualisieren:

| Auswirkung | Pflichtdokument |
|---|---|
| Bedienung, Installation oder Einstieg | `README.md` |
| Architektur, Workflow oder Qualitätsregel | `docs/DEVELOPMENT.md` |
| Projektfortschritt, betroffene Bereiche oder Iteration | `docs/PROJECT_STATUS.md` |
| Relevanter, nicht bearbeiteter Folgepunkt | `todo.txt` |
| Verbindliche Agentenregel | `AGENTS.md` |

Kein Dokument wird allein vorsorglich geändert. Ein autonomer Pflege-Agent darf
nur triggerbasiert arbeiten: Er erhält den abgeschlossenen Diff, aktualisiert
ausschließlich nachweislich betroffene Informationsdateien und verändert niemals
parallel dieselbe Datei wie ein anderer Agent.

## 4. Qualitätsgrenzen

- Keine Runtime-Abhängigkeit ohne dokumentierten aktuellen Nutzen.
- ES-Module verwenden; Seiteneffekte auf `js/app.js` begrenzen.
- DOM-Abfragen zentralisieren und fehlende Elemente defensiv behandeln.
- Keine direkten Konsolenaufrufe außerhalb von `js/logger.js`.
- Keine Geheimnisse, Prompts oder personenbezogenen Inhalte protokollieren.
- Nutzertexte auf Deutsch; Bezeichner eindeutig und handlungsorientiert formulieren.
- Semantisches HTML, Tastaturbedienung, sichtbare Fokuszustände und reduzierte
  Animation erhalten.
- Warnschwellen: Hilfsdateien 150, normale Module 300, Kernmodule 500 und
  Funktionen 40 Zeilen; ab 60 Funktionszeilen Teilbarkeit begründet prüfen.

## 5. Abschlussvorlage

```text
Status: 🟢 sauber abgeschlossen | Entwicklungsfortschritt: … % | Prüfungen: …

ANALYSE
Ziel: …
Ist-Zustand: …
Betroffene Bereiche: …
Risiken / Nicht betroffen: …
Erfolgskriterien: …

PLAN
1. …
Änderungsbudget: …

PATCH
Geändert: …

VALIDIERUNG
Prüfung → Grund → Ergebnis

DIFF
Geplant: …
Tatsächlich: …
Unbeabsichtigt: keine

ABSCHLUSS
Ziel: erreicht / teilweise / nicht erreicht
Offen: …
Empfehlungen: maximal zwei
```

**Goldene Regel:** Jede Aktion muss neue Information oder eine konkrete,
auftragsrelevante Verbesserung liefern. Andernfalls unterbleibt sie.
