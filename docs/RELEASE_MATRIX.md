# Vorrelease-Pflichtmatrix – Schnellprompter

Stand: 2026-10-23. **Ausgangs-HEAD main:** `90c6834f9467bd4a1039465fe11202d9b06e4ac4`. Entwicklungszweig: `fix/validate-stored-settings-20261023`.
**Fachcommit:** `a1a8c3bdaa5f6908c444e89b230e8e1f3d3a28c7` · **PR:** #14 (`fix/validate-stored-settings-20261023`).
Die jeweils aktuelle Zweigspitze und die unabhängigen CI-Ergebnisse stehen im Pull Request.
Status bedeutet: **PASS** = durch konkret genannte Prüfung belegt; **PARTIAL** = Teilnachweis;
**OPEN** = nicht umgesetzt/nicht nachgewiesen; **BLOCKED** = notwendige Voraussetzung fehlt.
Ein grüner Projektcheck ist kein Beweis für vollständige Produkt- oder Browserreife.

| Release-Pflicht | Status | Ist / prüfbarer Nachweis | Nächste Pflicht |
|---|---|---|---|
| Prompt erstellen, bearbeiten, speichern | OPEN | `index.html` zeigt einen bewusst leeren Prompt-Arbeitsbereich; TODO 01 | Kernablauf und Akzeptanzkriterien festlegen, danach implementieren |
| Schnelle Entwicklernotiz | PARTIAL | `js/quick-notes.js`, `tests/quick-notes.test.mjs`: Schreiben, Abbruch und Leerfall | Echte Browserinteraktion und Wiederholungsfälle |
| Datenverlustschutz, Recovery | PARTIAL | Stream-Abbruch bei Seek-/Write-/Close-Fehlern mit Regressionstest | Isolierte Browser-Recovery und knapper Speicher |
| Fehlerbehandlung und Sicherheit | PARTIAL | CSP-Test `tests/csp-base-uri.test.mjs`; gespeicherte Optionen: `tests/settings.test.mjs` | Fehlermeldungen im Laufzeitlogger auf feste Codes begrenzen (TODO 09) |
| Einstellungen und alte/defekte Browserdaten | PARTIAL | `tests/settings.test.mjs`: 12 Fälle für erlaubte Werte, ungültige Typen, beschädigtes JSON, Speichersperre | Reale Browserpersistenz und Migration prüfen |
| Design, Lesbarkeit, UX | OPEN | CSS/HTML vorhanden; keine aktuelle visuelle Abnahme für alle Zielgrößen | Browsercheck mit dokumentierten Screenshots |
| 800×600, 100/150/200 % Skalierung | OPEN | Kein reproduzierbarer Nachweis in diesem Arbeitsstand | Größen und Überlauf in realem Browser prüfen |
| Tastatur und Barrierefreiheit | PARTIAL | Skip-Link, Formularbeschriftung und Statusregion in `index.html` | Fokusfolge, Dialog und Tastatur-Regression im Browser |
| Browser-Kompatibilität | BLOCKED | Ordner-API nur in unterstützten Browsern; TODO 03 | Download-/Kopier-Fallback ohne Dateiverlust |
| Leistung und Wartbarkeit | PARTIAL | ES-Module ohne Runtime-Pakete; `scripts/check-project.js` | Große Eingaben, langsame Datenträger und Fehlerlast testen |
| Installation/Paketierung | PARTIAL | `npm start`, `manifest.webmanifest` | Installierbarkeit, Icons und Offline-Betrieb nachweisen |
| Automatische Funktions-/Regressionstests | PARTIAL | `npm test` enthält Projektcheck und Node-Tests; neue 12 Einstellungsfälle | End-to-End-Test für Notizen und Einstellungen |
| Integration, GUI/Browser | OPEN | Browser-CSP-Prüfung in `tests/test_csp_browser.py`; keine vollständige Interaktion | Isolierten Browser-Smoke-Test hinzufügen |
| CI und Release-Freeze | PARTIAL | `.github/workflows/quality.yml` prüft Node 20/22 + Chromium-CSP | PR-CI grün, vollständige Release-Gates und Freeze |
| Dokumentation und Nutzer-Endabnahme | OPEN | README, Entwicklungsdokumentation und TODO vorhanden | Nach vollständiger technischer Reife eine gebündelte Kubuntu-/Sichtabnahme |

## Aktuelles Arbeitspaket: validierte Einstellungen

- **REQ:** TODO 06; manipulierte oder alte Werte dürfen weder ungültige `select`-Optionen
  noch fremde `data-highlight`-Zustände erzeugen.
- **Änderung:** Nur die beiden bekannten Einstellungsfelder werden aus dem Browserspeicher
  übernommen, und nur mit erlaubten Optionswerten. Unbekannte Schlüssel werden ignoriert.
- **Prüfung:** `node --test tests/settings.test.mjs` (12 Fälle), `npm test` in der PR-CI;
  visuelle UI nicht verändert. Isolierter lokaler Node-Test: **12/12 PASS** vor GitHub-Übertragung.
  GitHub-Actions-Prüfung des Fachcommits: **PASS** in Node 20 und Node 22 (Projektcheck,
  Node-Tests und Chromium-CSP-Gate), Lauf `39981385153`, abgeschlossen 2026-10-23.
  Die spätere CI-Prüfung des reinen Dokumentationscommits bleibt unabhängig zu prüfen.
- **Rückweg:** Den einen fachlichen Commit im Entwicklungszweig rückgängig machen.
- **Nächster Schritt:** TODO 09 (kontrollierte Laufzeitfehlercodes) oder TODO 03 (Browser-Fallback),
  abhängig von Risiken und offenen CI-Gates.

## Recovery-Schlüssel

Ausgangsstand: `90c6834f9467bd4a1039465fe11202d9b06e4ac4`; Plan: TODO 06 abschließen; Scope:
`js/quick-notes.js`, `tests/settings.test.mjs`, `todo.txt`, diese Matrix.
Nicht-Ziele: Prompt-Editor, Dateimigration, Browserberechtigungen, Veröffentlichung.
Neue Befunde in `todo.txt` dokumentieren. Kein Release-PASS ohne Browser- und CI-Belege.
