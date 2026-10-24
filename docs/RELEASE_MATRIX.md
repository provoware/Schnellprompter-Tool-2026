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
| Fehlerbehandlung und Sicherheit | PARTIAL | CSP-Test `tests/csp-base-uri.test.mjs`; gespeicherte Optionen: `tests/settings.test.mjs`; `tests/runtime-errors.test.mjs` prüft feste Fehlercodes (neuer PR) | Logger-Gesamteingänge und Browser-/Sicherheitsgrenzfälle prüfen |
| Einstellungen und alte/defekte Browserdaten | PARTIAL | `tests/settings.test.mjs`: 12 Fälle für erlaubte Werte, ungültige Typen, beschädigtes JSON, Speichersperre | Reale Browserpersistenz und Migration prüfen |
| Design, Lesbarkeit, UX | OPEN | CSS/HTML vorhanden; keine aktuelle visuelle Abnahme für alle Zielgrößen | Browsercheck mit dokumentierten Screenshots |
| 800×600, 100/150/200 % Skalierung | OPEN | Kein reproduzierbarer Nachweis in diesem Arbeitsstand | Größen und Überlauf in realem Browser prüfen |
| Tastatur und Barrierefreiheit | PARTIAL | Skip-Link, Formularbeschriftung und Statusregion in `index.html` | Fokusfolge, Dialog und Tastatur-Regression im Browser |
| Browser-Kompatibilität | PARTIAL | PR #15: Markdown-Download ohne Ordner-API, Node-Tests; Chromium-Smoke PASS in GitHub-CI #40056137581 (SHA 0fba3388) | Echte Firefox-/Safari-Downloads und manuelle Dateiübernahme prüfen |
| Leistung und Wartbarkeit | PARTIAL | ES-Module ohne Runtime-Pakete; `scripts/check-project.js` | Große Eingaben, langsame Datenträger und Fehlerlast testen |
| Installation/Paketierung | PARTIAL | `npm start`, `manifest.webmanifest` | Installierbarkeit, Icons und Offline-Betrieb nachweisen |
| Automatische Funktions-/Regressionstests | PARTIAL | `npm test` enthält Projektcheck, 12 Einstellungsfälle und 5 neue Download-Fälle (PR #15) | Vollständige End-to-End-Tests für Notizen und Einstellungen |
| Integration, GUI/Browser | PARTIAL | `tests/test_note_fallback_browser.py` prüft Fallback-Formular in Chromium (CI #40056137581 PASS); CSP-Test bleibt bestehen | Reale Download-Ereignisse, Fokusfolge, 800×600 und Skalierung prüfen |
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

## Arbeitspaket 2026-10-24: Notiz-Download ohne Ordner-API (PR #15)

- **REQ/Finding:** TODO 03; in Firefox/Safari ohne Ordner-API konnte keine Notiz gesichert werden.
- **Basis und Abhängigkeit:** PR #14, Ausgangs-SHA `67f558b60b3070b8484dcde3c92946896a20db7d`;
  neuer Zweig `feat/note-download-fallback-20261024`, gestapelter PR #15 gegen PR #14.
- **Scope:** `js/note-download.js`, `js/app.js`, `index.html`, `tests/note-download.test.mjs`,
  `tests/test_note_fallback_browser.py`, `.github/workflows/quality.yml`, Projektcheck und zugehörige Dokumentation.
- **Invariante:** Chrome/Edge-Ordneranhang bleibt unverändert; Fallback lädt **nur eine Einzelnotiz** herunter,
  verspricht kein automatisches Anhängen und löscht den eingegebenen Text nicht.
- **Prüfplan:** 5 Node-Fälle (Inhalt, Dateiname, Leerfall, Blob-URL, Klickfehler),
  Chromium-Formular-Smoke ohne Ordner-API, bestehende CSP-/Speicherprüfungen und Node 20/22 in CI.
- **Prüfbeleg:** GitHub Actions #40056137581, SHA `0fba3388078bcf145c9a5d76594007529ad69a60`:
  **PASS** für Node 20 und 22 (`npm test`, CSP-Chromium und Download-Fallback-Chromium).
  Der Browser-Smoke prüft den vorbereiteten Blob-Link, nicht einen tatsächlichen Firefox-/Safari-Download.
  Nach diesem Dokumentationscommit ist die CI des neuen HEAD erneut zu prüfen.
- **Restpflicht:** Firefox/Safari reale Downloads, Download-Sperre, manuelle Zusammenführung,
  Datenverlust- und Tastatur-/Skalierungstests.
- **Rückweg:** Nur die Commits aus PR #15 rückgängig machen; PR #14 bleibt unabhängig.
- **Nächster Schritt:** CI am finalen PR-HEAD auswerten und Fehler selbst reparieren; danach reale Browserfälle.

## Recovery-Schlüssel 2026-10-24

Repository `provoware/Schnellprompter-Tool-2026`; Basis `67f558b60b3070b8484dcde3c92946896a20db7d`;
Branch `feat/note-download-fallback-20261024`; PR #15 (Entwurf, gestapelt auf PR #14);
Plan: TODO 03 Browser-Fallback; keine Migration, kein Merge und keine Veröffentlichung.
Letzter belegter CI-Stand: `0fba3388078bcf145c9a5d76594007529ad69a60`, Lauf #40056137581 PASS.
Neuer Dokumentations-HEAD benötigt einen eigenen CI-Beleg; kein Release-PASS ohne weitere Browserprüfungen.

## Arbeitspaket 2026-10-24: Datenschutz bei globalen Laufzeitfehlern

- **REQ/Finding:** TODO 09; bisher wurden `event.message` bzw. `event.reason.message` ungefiltert
  an den Logger übergeben. Browser- und Fremdfehler können dadurch Prompt-Inhalte oder Tokens offenlegen.
- **Basis:** PR #15, SHA `8b43e29813cb389864d8ac1f89545beafb6720ac`;
  Entwicklungszweig `fix/sanitize-runtime-error-logging-20261024` (gestapelt auf PR #15, dieser auf #14).
- **Scope:** `js/runtime-errors.js`, `js/app.js`, `tests/runtime-errors.test.mjs`,
  `todo.txt`, `docs/DEVELOPMENT.md` und diese Matrix.
- **Invariante:** Beide Browserereignisse bleiben protokolliert, aber ausschließlich mit festen
  Codes `WINDOW_ERROR`, `UNHANDLED_REJECTION` oder `UNKNOWN_RUNTIME_EVENT`;
  keine Fehlertexte, Pfade, Promise-Gründe oder Nutzerdaten auslesen.
- **Tests:** Vier isolierte Node-Regressionstests: Window-Fehler, Promise-Ablehnung,
  unbekannte und geerbte Ereignistypen sowie absichtlich werfende Getter auf sensiblen Feldern.
  `npm test` und Chromium-Prüfungen in Node 20/22 sind verbindliche CI-Gates.
- **Status:** Fachcode und Tests im GitHub-Entwicklungszweig; CI am endgültigen HEAD
  separat nachweisen. **Gesamt-Vorrelease weiterhin BLOCKED.**
- **Rückweg:** Fachcommits des neuen Zweigs zurücknehmen; PR #15 und #14 unverändert lassen.
- **Offen:** Reale Firefox-/Safari-Downloads, echte Browser-/GUI-/Skalierungs- und
  Tastaturprüfungen, Fachkern Prompt-Erstellung, Datenwiederherstellung und Release-Freeze.
- **Nächster Schritt:** GitHub-CI auf endgültigem SHA prüfen, Fehler reparieren;
  danach Browser-Fokusfolge und 800×600/150–200 % als nächste unabhängige Pflicht.

## Recovery-Schlüssel 2026-10-24 – Laufzeitlogger

Repository `provoware/Schnellprompter-Tool-2026`; Ausgangs-HEAD `8b43e29813cb389864d8ac1f89545beafb6720ac`;
Branch `fix/sanitize-runtime-error-logging-20261024`; gestapelte Basis PR #15 → PR #14 → main;
Plan TODO 09, nur oben genannter Scope, keine Migration, kein Merge, keine Veröffentlichung.
Prüfbelege und abschließende HEAD-SHA stehen im zugehörigen Pull Request;
ein CI-PASS ist bis zur tatsächlichen Prüfung **nicht behauptet**.
