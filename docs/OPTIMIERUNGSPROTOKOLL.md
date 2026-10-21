# Optimierungsprotokoll

## 2026-10-21 – SEC-BASE-URI-01: Basis-URLs gegen Manipulation absichern

- **Repository:** `provoware/Schnellprompter-Tool-2026`
- **Ausgangsstand:** `main` bei `329a6f1b324a5d3df9cde273c89c19384030bca1`
- **Befund (bestätigt):** Die Content-Security-Policy im HTML-Einstieg begrenzte Skripte, Stile und Netzwerkzugriffe, nicht jedoch `base-uri` (zuvor TODO Nr. 08). Ein zusätzliches `<base>`-Element könnte die Auflösung relativer Links und Dateipfade beeinflussen.
- **Änderung:** Die Meta-Policy enthält nun ausdrücklich `base-uri 'none'`. `scripts/check-project.js` prüft, dass exakt eine solche Regel mit ausschließlich `'none'` vorhanden ist. Der erledigte TODO-Eintrag wurde aus `todo.txt` entfernt.
- **Nutzen:** Eine manipulierbare Basisadresse wird im Browser untersagt; eine versehentliche spätere Abschwächung wird im vorhandenen Projektcheck erkannt.
- **Umfang:** Nur HTML-Sicherheitsrichtlinie, zugehörige Prüflogik, TODO und dieses Protokoll; keine Datenänderung, keine neuen Abhängigkeiten, kein Build-Zwang.
- **Validierung:** Der Vorzustand ohne `base-uri` wurde in GitHub bestätigt (PASS). Der tatsächliche Projektprüfcode dieses Branches wurde mit den elf vollständigen GitHub-Quelldateien und einem nachgebildeten Dateileser in einer JavaScript-Testumgebung ausgeführt: **15/15 PASS**. Drei Negativläufe (fehlende Regel, `'self'`, doppelte Regel) wurden wie erwartet abgewiesen (**3/3 PASS**). Ein vollständiges lokales `npm test` sowie der echte Browser-CSP-Test sind **BLOCKED**, da kein lokaler Checkout mit GitHub-Netzwerkzugriff und keine Browserprüfung möglich waren. Die bisher sichtbaren erfolgreichen CI-Läufe betreffen andere Commits und belegen diese Änderung nicht.
- **Risiko:** Sehr gering, da die Anwendung kein `<base>` benötigt; externe Einbettungen oder künftige neue Abläufe benötigen einen separaten Browsercheck.
- **Entwicklungszweig:** [`fix/csp-base-uri-20261021`](https://github.com/provoware/Schnellprompter-Tool-2026/tree/fix/csp-base-uri-20261021).
- **Änderungsvergleich:** [`main` gegenüber Entwicklungszweig](https://github.com/provoware/Schnellprompter-Tool-2026/compare/main...fix/csp-base-uri-20261021).
- **Pull Request:** [PR #10 – Entwurf](https://github.com/provoware/Schnellprompter-Tool-2026/pull/10), noch nicht zur Übernahme freigegeben.
- **Quelländerungs-Commit:** [`6756a60a67592dcc526eaee8ff047271240e9d01`](https://github.com/provoware/Schnellprompter-Tool-2026/commit/6756a60a67592dcc526eaee8ff047271240e9d01); diese Dokumentationspräzisierung ist ein Folge-Commit im selben PR.
- **Nächster Schritt:** `npm test` mit Node.js >= 20 auf vollständig ausgechecktem Branch ausführen, anschließend Browser-Konsole/Netzwerk im Zielbrowser auf CSP-Verstöße prüfen. Vor einer Übernahme Konflikte mit den offenen Pull Requests #5, #8 und #9 prüfen.

### Prüffreigabe

- Quellbefund und testbare neue Schutzbedingung: **PASS**
- Vollständiger Projektcheck `npm test`: **BLOCKED**
- Browserkontrolle der CSP-Wirkung: **BLOCKED**
- Merge nach `main`: **nicht freigegeben**
