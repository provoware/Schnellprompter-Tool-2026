# Hinweise für spätere Iterationen

## Zielbild für unterstützende Unteragenten

Die folgenden Rollen sind ein **Planungsbild**, keine derzeit ausführbare Funktion
der Anwendung. Jede Rolle erhält nur einen klar abgegrenzten Auftrag und liefert
ein prüfbares Ergebnis:

| Rolle | Aufgabe | Ergebnis |
| --- | --- | --- |
| Prüfer | Akzeptanzkriterien, Tests und erkennbare Rückschritte prüfen | Prüfbericht mit Belegen |
| Planer | Ziel, Risiken, Abhängigkeiten und kleinstes Änderungspaket bestimmen | begrenzter Arbeitsplan |
| Iterationsorganisator | Reihenfolge, Zuständigkeiten und offene Punkte pflegen | konfliktfreier Ablaufplan |
| Vorprüfer | Vor jeder Änderung Umfang, Voraussetzungen und Schutzregeln prüfen | Freigabe oder begründeter Stopp |
| Letzter Entscheider | Ergebnisse bewerten und die nächste sinnvolle Iteration festlegen | Abschlussentscheidung mit höchstens zwei Folgeschritten |
| Laienhilfe | Bedienhinweise auf Verständlichkeit und Handlungsnutzen prüfen | konkrete, einfache Hilfetexte |
| Entwicklerdokumentation | technische Außenwirkung und Wartungshinweise nachführen | überprüfte Dokumentationsänderung |
| Großanalyse-Empfehlungsagent | Nur bei ausdrücklich gestarteter Gesamtanalyse Verbesserungen sammeln | ergänzte Empfehlungsliste mit Begründung, Nutzen und Umfang; keine Codeänderung |

## Auslöser und Ablauf

1. Eine bestätigte Änderung startet Planer und Vorprüfer.
2. Der Vorprüfer lässt die Arbeit nur bei eindeutigem Ziel, festem Dateibudget,
   messbaren Erfolgskriterien und benannten Rückschrittrisiken beginnen.
3. Der Iterationsorganisator vergibt getrennte Dateien oder Bereiche. Der Prüfer
   arbeitet erst mit einem stabilen Zwischenstand.
4. Laienhilfe und Entwicklerdokumentation werden nur ausgelöst, wenn sich
   Bedienung beziehungsweise technische Außenwirkung tatsächlich ändern.
5. Der letzte Entscheider schließt die aktuelle Iteration ab und plant genau zwei
   Schritte voraus: den nächsten umsetzbaren Schritt und einen davon abhängigen
   Reserveschritt. Der Reserveschritt wird erst nach erneuter Vorprüfung aktiv.
6. Eine Gesamtanalyse wird nur bewusst und selten ausgelöst. Ihr Agent darf
   ausschließlich Empfehlungen an diese Datei anhängen.

## Kollisionsschutz und Disziplin

- Eine Datei oder ein klar benannter Bereich hat gleichzeitig genau eine
  schreibende Rolle. Alle anderen Rollen arbeiten dort nur lesend.
- Vor Arbeitsbeginn werden Zuständigkeit, erwartetes Ergebnis und erlaubte
  Dateien festgehalten. Überschneidungen führen zum Stopp statt zum Zusammenführen
  konkurrierender Änderungen.
- Jede Übergabe enthält Ausgangsstand, Belege und offene Risiken. Ungeprüfte
  Annahmen gelten nicht als Freigabe.
- Nach zwei ungeplanten Folgeänderungen stoppt die Iteration und kehrt zur Planung
  zurück. Änderungen außerhalb des freigegebenen Umfangs bleiben für eine spätere
  Iteration vorgemerkt.
- Der letzte Entscheider darf nur einen belegbar grünen Stand freigeben. Die
  Zwei-Schritte-Vorausschau begründet Reihenfolge und Abhängigkeit, löst aber keine
  automatische Änderung aus.

## Warum dies derzeit nicht automatisch ausführbar ist

Die Anwendung läuft vollständig im Browser und besitzt bewusst keine sichere
Schnittstelle zu einem Sprachmodell oder zu einem geschützten Serverdienst. Sie
kann daher weder unabhängige Unteragenten starten noch deren Rechte, Kosten,
Dateizugriffe oder Ergebnisse verlässlich kontrollieren. Ein direkter Aufruf aus
dem Browser würde Zugangsdaten offenlegen und Nutzereingaben an einen externen
Dienst übertragen. Ohne ausdrückliche Einwilligung, Datenminimierung,
Authentisierung, Kostenbegrenzung, Protokollierung ohne sensible Inhalte und eine
serverseitige Rechteprüfung wäre diese Automatisierung weder sicher noch
nachvollziehbar. Bis diese Voraussetzungen entworfen und geprüft sind, bleibt der
Ablauf eine menschlich ausgeführte Arbeitsanweisung.

## Priorisierte nächste Iterationen

### 1. Hoch: Rollenablauf als manuelle Prüfliste erproben

**Begründung:** Die Rollen und Übergaben müssen sich zunächst ohne technische
Automatisierung bewähren. **Nutzen:** Unklare Zuständigkeiten und unnötige Schritte
werden früh sichtbar. **Umfang:** Eine wiederverwendbare Prüfliste und ein
ausgefülltes Beispiel; keine Änderung der Anwendung.

### 2. Hoch: Sicherheits- und Datenschutzkonzept festlegen

**Begründung:** Eine Modellanbindung verarbeitet möglicherweise vertrauliche
Textbausteine und verursacht externe Kosten. **Nutzen:** Klare Entscheidung, ob
und unter welchen Grenzen eine Automatisierung verantwortbar ist. **Umfang:**
Datenwege, Einwilligung, Aufbewahrung, Rechte, Kostenobergrenzen, Fehlerfälle und
Abschaltmöglichkeit dokumentieren.

### 3. Mittel: Kleinen, serverseitig abgesicherten Versuch planen

**Begründung:** Erst nach dem Sicherheitskonzept lässt sich die technische
Machbarkeit sinnvoll bewerten. **Nutzen:** Eine einzelne lesende Rolle kann mit
begrenztem Risiko geprüft werden. **Umfang:** Nur der Prüfer, nur freigegebene
Inhalte, feste Ausgabeform, Zeit- und Kostenlimit sowie menschliche Freigabe;
keine selbstständigen Schreibzugriffe.

### 4. Niedrig: Weitere Rollen schrittweise freigeben

**Begründung:** Mehrere gleichzeitig aktive Rollen erhöhen Kosten und
Kollisionsrisiko deutlich. **Nutzen:** Nachgewiesen hilfreiche Rollen können ohne
großen Sprung ergänzt werden. **Umfang:** Je Iteration höchstens eine neue Rolle,
mit Vergleichswerten zu Fehlerquote, Laufzeit und Kosten sowie einer einfachen
Rücknahme des Schritts.
