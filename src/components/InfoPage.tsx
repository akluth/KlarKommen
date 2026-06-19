import { useI18n } from '../i18n';

interface InfoPageProps {
  page: 'imprint' | 'privacy' | 'help';
  onBack: () => void;
}

export default function InfoPage({ page, onBack }: InfoPageProps) {
  const { t } = useI18n();

  return (
    <section className="info-page">
      <button className="ghost-button info-back" type="button" onClick={onBack}>
        {t.ui.backToStart}
      </button>
      {page === 'imprint' && <Imprint />}
      {page === 'privacy' && <Privacy />}
      {page === 'help' && <RealHelp />}
    </section>
  );
}

function Imprint() {
  const { t } = useI18n();

  return (
    <article className="panel info-panel">
      <p className="eyebrow">{t.ui.legalEyebrow}</p>
      <h1>{t.ui.imprint}</h1>
      <div className="legal-block">
        <h2>{t.ui.imprintDetails}</h2>
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
        <h2>{t.ui.contact}</h2>
        <p>
          Mobil: <a href="tel:+491782870806">01 78 / 287 08 06</a>
          <br />
          E-Mail: <a href="mailto:alex@denkwerk-kluth.de">alex@denkwerk-kluth.de</a>
        </p>
      </div>
      <div className="legal-block">
        <h2>{t.ui.note}</h2>
        <p>{t.disclaimer}</p>
      </div>
    </article>
  );
}

function Privacy() {
  const { t } = useI18n();

  return (
    <article className="panel info-panel">
      <p className="eyebrow">{t.ui.privacy}</p>
      <h1>{t.ui.privacyTitle}</h1>
      <p className="info-lead">{t.ui.privacyLead}</p>
      {t.legal.privacySections.map((section) => (
        <div className="legal-block" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.text}</p>
        </div>
      ))}
    </article>
  );
}

function RealHelp() {
  const { t } = useI18n();

  return (
    <article className="panel info-panel">
      <p className="eyebrow">{t.ui.realHelpEyebrow}</p>
      <h1>{t.ui.realHelpTitle}</h1>
      <p className="info-lead">{t.ui.realHelpLead}</p>
      <div className="legal-block">
        <h2>{t.ui.realHelpSignalsTitle}</h2>
        <ul className="info-list">
          {t.legal.realHelpSignals.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="legal-block">
        <h2>{t.ui.urgentContactsTitle}</h2>
        <ul className="info-list">
          {t.legal.urgentContacts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
