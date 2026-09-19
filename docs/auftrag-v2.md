# Überarbeiteter Umsetzungsauftrag – Fassung 2

## Ziel

Die Schnellprompter-Anwendung wird zu einer laienfreundlichen Bibliothek für
wiederverwendbare Arbeitsabläufe. Jeder Arbeitsablauf besitzt einen Titel und
einen Text. Der Titel wird als deutlich erkennbare Schaltfläche angezeigt. Ein
Druck darauf kopiert die ausgewählte Textfassung unmittelbar in die
Zwischenablage und bestätigt den Erfolg verständlich.

## Verbindliche Funktionen

1. Arbeitsabläufe anlegen, bearbeiten, löschen und frei oder nach Titel, Art und
   Aktualität sortieren.
2. Gleichlautende Titel, Texte und Fassungen durch vereinheitlichte Indizes
   erkennen und unbeabsichtigte Doppelanlagen verhindern.
3. Änderungen wahlweise als neue Fassung behalten; ältere Fassungen auswählbar
   und kopierbar machen.
4. Platzhalter mit alternativen Namen in einem eigenen Einstellungsbereich
   verwalten. Beim Kopieren auf noch offene Platzhalter hinweisen.
5. Bestand einschließlich Fassungen und Platzhaltern als Sicherungsdatei ausgeben
   und ältere sowie aktuelle Sicherungsformate defensiv einlesen.
6. Alle Bedienbegriffe auf Deutsch, ohne unnötige Fachwörter oder Abkürzungen,
   mit sichtbaren Erklärsymbolen, kurzen Zusatzhinweisen und einer Hilfe in drei
   Schritten anbieten.
7. Wiederverwendbare Hilfetexte getrennt vom Ablaufcode mit eigener
   Fassungsnummer pflegen.
8. Nachweisbare Rückschritte durch ein maschinenlesbares Qualitätsmanifest mit
   eindeutigen Fällen, Auslösern, Prüfschritten und Erwartungen absichern.

## Architekturgrenzen

Die Anwendung bleibt ohne Laufzeitabhängigkeiten vollständig browsernativ.
Autonome Unteragenten werden nicht vorgetäuscht: Solange keine sichere
serverseitige Modellschnittstelle, Rechtebegrenzung, Kostenkontrolle und
Datenschutzentscheidung bestehen, werden Rollen, Auslöser und Kollisionsschutz
nur als überprüfbares Zielbild dokumentiert.

## Abnahme

Syntaxprüfung, Projektprüfung, Browserprüfung des Hauptablaufs und Diffprüfung
müssen erfolgreich sein. Der Abschlussbericht bleibt im unterstützten,
diffbaren Markdown-Format erhalten. Ein vollständiges Projektarchiv wird gemäß
Auftrag nur in jeder fünften nachgewiesenen Iteration erstellt.
