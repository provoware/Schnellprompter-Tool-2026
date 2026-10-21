# Optimierungsprotokoll

## 2026-10-21 – SEC-BASE-URI-01: Basis-URLs gegen Manipulation absichern

- **Repository:** `provoware/Schnellprompter-Tool-2026`
- **Ausgangsstand:** `main` bei `329a6f1b324a5d3df9cde273c89c19384030bca1`
- **Befund (bestätigt):** Die Content-Security-Policy im HTML-Einstieg begrenzte Skripte, Stile und Netzwerkzugriffe, nicht jedoch `base-uri` (zuvor TODO Nr. 08). Ein zusätzliches `<base>`-Element könnte die Auflösung relativer Links und Dateipfade beeinflussen.
- **Änderung:** Die Meta-Policy enthält nun ausdrücklich `base-uri 'none'`. `scripts/check-project.js` prüft, dass exakt eine solche Regel mit ausschließlich `'none'` vorhanden ist. Der erledigte TODO-Eintrag wurde aus `todo.txt` entfernt.
- **Nutzen:** Eine manipulierbare Basisadresse wird im Browser untersagt; eine versehentliche spätere Abschwächung wird im vorhandenen Projektcheck erkannt.
- **Umfang:** Nur HTML-Sicherheitsrichtlinie, zugehörige Prüflogik, TODO und dieses Protokoll; keine Datenänderung, keine neuen Abhängigkeiten, kein Build-Zwang.
- **Validierung:** In der GitHub-Quellansicht wurde der Vorzustand ohne `base-uri` bestätigt (PASS). Der Prüfcode wurde anhand der vorgesehenen Richtlinie und absichtlich ungültiger Varianten (`'self'`, fehlende Regel, doppelte Regel) logisch geprüft (PASS). Ein vollständiges `npm test` sowie der echte Browser-CSP-Test sind **BLOCKED**, da dieser Durchlauf keinen lokalen GitHub-Checkout mit Netzwerkzugriff bzw. gestarteten Browser hat. Das ist kein CI-Nachweis.
- **Risiko:** Sehr gering, da die Anwendung kein `<base>` benötigt; externe Einbettungen oder künftige neue Abläufe benötigen einen separaten Browsercheck.
- **Entwicklungszweig:** [`fix/csp-base-uri-20261021`](https://github.com/provoware/Schnellprompter-Tool-2026/tree/fix/csp-base-uri-20261021).
- **Änderungsvergleich:** [`main` gegenüber Entwicklungszweig](https://github.com/provoware/Schnellprompter-Tool-2026/compare/main...fix/csp-base-uri-20261021).
- **PR und genauer Commit:** Im zugehörigen Pull Request und dessen Commitliste unmittelbar nachvollziehbar.
- **Nächster Schritt:** `npm test` mit Node.js >= 20 auf vollständig ausgechecktem Branch ausführen, anschließend Browser-Konsole/Netzwerk im Zielbrowser auf CSP-Verstöße prüfen. Vor einer Übernahme Konflikte mit den offenen Pull Requests #5, #8 und #9 prüfen.

### Prüffreigabe

- Quellbefund und testbare neue Schutzbedingung: **PASS**
- Vollständiger Projektcheck `npm test`: **BLOCKED**
- Browserkontrolle der CSP-Wirkung: **BLOCKED**
- Merge nach `main`: **nicht freigegeben**
