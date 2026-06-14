# KlarKommen

KlarKommen ist eine deutsche Web-App/PWA, die Menschen in akuten bürokratischen und finanziellen Notlagen dabei hilft, ihre Situation zu sortieren, nächste Schritte zu planen und passende Textvorlagen zu erstellen.

Die App ist bewusst ruhig, klar und niedrigschwellig gestaltet. Sie ersetzt keine Rechtsberatung, sondern bietet eine erste Orientierung, wenn gerade vieles gleichzeitig drückt.

## Funktionen

- Auswahl typischer Notlagen:
  - Mietschulden / Kündigung
  - Stromsperre / Energieschulden
  - Bürgergeld / Jobcenter
  - Krankenkasse / Beitragsschulden
  - Pfändung / P-Konto
  - Schufa / Kredit abgelehnt
- Schrittweiser Fragenbaum mit verständlichen Fragen
- Ergebnis-Seite mit:
  - kurzer Einordnung der Lage
  - To-dos für heute
  - To-dos für morgen
  - möglichen Anlaufstellen
  - Fehlern, die vermieden werden sollten
- Automatisch erzeugte Textvorlagen, zum Beispiel für:
  - Vermieter
  - Energieversorger
  - Jobcenter oder Sozialamt
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

KlarKommen läuft vollständig im Browser. Es gibt kein Backend, keine Nutzerkonten und keine externe API. Personenbezogene Angaben werden nicht an einen Server gesendet.

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
    categories.ts
    questions.ts
    recommendations.ts
    templates.ts
  components/
    Header.tsx
    Footer.tsx
    CategorySelect.tsx
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

