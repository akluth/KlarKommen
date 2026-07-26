# KlarKommen

KlarKommen ist eine Web-App/PWA für Deutschland und Österreich, die Menschen in akuten bürokratischen und finanziellen Notlagen dabei hilft, ihre Situation zu sortieren, nächste Schritte zu planen und passende Textvorlagen zu erstellen.

Die App ist bewusst ruhig, klar und niedrigschwellig gestaltet. Sie ersetzt keine Rechtsberatung, sondern bietet eine erste Orientierung, wenn gerade vieles gleichzeitig drückt.

## Funktionen

- Länderwechsel zwischen Deutschland und Österreich mit Landesflaggen; Begriffe, Behörden, Fristen, Notrufnummern, Hilfsangebote und Textvorlagen werden landesspezifisch ausgegeben
- Sprachen: Deutsch, Türkisch, Arabisch und Ukrainisch – jeweils für beide Länder
- Auswahl typischer Notlagen:
  - Mietschulden / Kündigung
  - Stromsperre / Energieschulden
  - Grundsicherung / Jobcenter (früher Bürgergeld)
  - Krankenkasse / Beitragsschulden
  - Pfändung / P-Konto
  - Schufa / Kredit abgelehnt
  - Inkasso / Mahnbescheid
  - Familie / Lebensumbruch
- Österreichische Entsprechungen, darunter:
  - Sozialhilfe / Mindestsicherung und AMS
  - Kontopfändung / Existenzminimum
  - KSV1870 / CRIF
  - Inkasso / bedingter Zahlungsbefehl
  - WOHNSCHIRM, staatlich anerkannte Schuldenberatung, Arbeiterkammer und weitere offizielle Anlaufstellen
- Soforthilfe in etwa 60 Sekunden:
  - Ort oder PLZ kann angegeben oder übersprungen werden
  - zwei kurze Dringlichkeitseinschätzungen
  - konservative Ampelbewertung; unklare Angaben werden nie als „grün“ gewertet
  - drei konkrete Sofortmaßnahmen
  - drei verifizierte direkte Anlaufstellen mit Telefon oder Website und Quellenangabe
  - lokale Google-Suchlinks nur als klar gekennzeichneter Fallback
- Optionale ausführliche Beratung mit vorbefülltem Fragenbaum
- Ergebnis-Seite mit:
  - kurzer Einordnung der Lage
  - To-dos für heute
  - To-dos für morgen
  - möglichen Anlaufstellen
  - Fehlern, die vermieden werden sollten
- Automatisch erzeugte Textvorlagen, zum Beispiel für:
  - Vermieter
  - Energieversorger
  - Jobcenter oder Sozialamt beziehungsweise AMS oder zuständige Sozialhilfestelle
  - Krankenkasse
  - Bank
  - Schuldnerberatung
  - Ratenzahlung
  - Fristaufschub
  - Beratungstermin
- Kopierbutton für Textvorlagen
- „Alle Ergebnisse kopieren“
- Druckansicht
- PWA-Manifest
- Keine Anmeldung
- Kein Backend
- Keine Server-Speicherung personenbezogener Daten

## Datenschutz und Speicherung

KlarKommen verarbeitet Situationsangaben vollständig im Browser. Es gibt kein Backend und keine Nutzerkonten. Nur wenn eine Person selbst einen externen Link öffnet oder anruft, erhält der jeweilige Anbieter die dort sichtbaren Daten. Google-Suchlinks enthalten ausschließlich Hilfsart und den eingegebenen Ort oder die PLZ – niemals Betrag, Freitext oder andere Falldetails.

## Rechtlicher Hinweis

KlarKommen bietet keine Rechtsberatung und ersetzt keine Beratung durch Anwältinnen, Anwälte, Behörden oder Beratungsstellen. Die Hinweise dienen nur zur ersten Orientierung.

## Entwicklung

Voraussetzungen:

- Node.js
- npm

Installation:

```bash
npm install
```

Lokalen Entwicklungsserver starten:

```bash
npm run dev
```

Produktionsbuild erstellen:

```bash
npm run build
```

Automatisierte Tests ausführen:

```bash
npm test
```

## Tech-Stack

- React
- Vite
- TypeScript
- CSS
- Lokale TypeScript-Datenstrukturen

## Projektstruktur

```text
src/
  main.tsx
  App.tsx
  data/
    directHelp.ts
    localHelp.ts
    preparation.ts
    quickHelp.ts
  components/
    Header.tsx
    Footer.tsx
    CategorySelect.tsx
    QuickHelpFlow.tsx
    QuickHelpResults.tsx
    DirectHelpContacts.tsx
    QuestionFlow.tsx
    Results.tsx
    Checklist.tsx
    TemplateBox.tsx
  types/
    index.ts
  styles/
    global.css
```

## Ziel

Ruhig sortieren. Heute anfangen.
