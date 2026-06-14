import { DISCLAIMER } from '../data/disclaimer';
import { privacySections, realHelpSignals, urgentContacts } from '../data/legal';

interface InfoPageProps {
  page: 'imprint' | 'privacy' | 'help';
  onBack: () => void;
}

export default function InfoPage({ page, onBack }: InfoPageProps) {
  return (
    <section className="info-page">
      <button className="ghost-button info-back" type="button" onClick={onBack}>
        Zurück zur Startseite
      </button>
      {page === 'imprint' && <Imprint />}
      {page === 'privacy' && <Privacy />}
      {page === 'help' && <RealHelp />}
    </section>
  );
}

function Imprint() {
  return (
    <article className="panel info-panel">
      <p className="eyebrow">Rechtliches</p>
      <h1>Impressum</h1>
      <div className="legal-block">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Alexander Kluth
          <br />
          Kaistraße 2
          <br />
          40221 Düsseldorf
          <br />
          Deutschland
        </p>
      </div>
      <div className="legal-block">
        <h2>Kontakt</h2>
        <p>
          Mobil: <a href="tel:+491782870806">01 78 / 287 08 06</a>
          <br />
          E-Mail: <a href="mailto:kluth.dus@gmail.com">kluth.dus@gmail.com</a>
        </p>
      </div>
      <div className="legal-block">
        <h2>Hinweis</h2>
        <p>{DISCLAIMER}</p>
      </div>
    </article>
  );
}

function Privacy() {
  return (
    <article className="panel info-panel">
      <p className="eyebrow">Datenschutz</p>
      <h1>Datenschutzerklärung</h1>
      <p className="info-lead">
        Diese Erklärung beschreibt, wie KlarKommen mit Daten umgeht. Die App ist bewusst ohne
        Anmeldung, Backend und Server-Speicherung personenbezogener Situationsdaten gebaut.
      </p>
      {privacySections.map((section) => (
        <div className="legal-block" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.text}</p>
        </div>
      ))}
    </article>
  );
}

function RealHelp() {
  return (
    <article className="panel info-panel">
      <p className="eyebrow">Wichtig</p>
      <h1>Wann du echte Hilfe suchen solltest</h1>
      <p className="info-lead">
        KlarKommen kann sortieren und vorbereiten. In manchen Situationen solltest du aber nicht
        allein weitermachen, sondern direkt eine Beratungsstelle, Behörde, Anwältin oder einen
        Anwalt kontaktieren.
      </p>
      <div className="legal-block">
        <h2>Suche schnell Unterstützung, wenn...</h2>
        <ul className="info-list">
          {realHelpSignals.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="legal-block">
        <h2>Mögliche nächste Kontakte</h2>
        <ul className="info-list">
          {urgentContacts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
