import type { DirectHelpContact } from '../data/directHelp';
import type { Language } from '../i18n';
import type { QuickHelpTexts } from '../i18n/quickHelp';
import { localeByLanguage } from '../utils/formatters';

interface DirectHelpContactsProps {
  contacts: DirectHelpContact[];
  language: Language;
  texts: QuickHelpTexts;
}

export default function DirectHelpContacts({ contacts, language, texts }: DirectHelpContactsProps) {
  const dateFormatter = new Intl.DateTimeFormat(localeByLanguage[language], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <section className="direct-help-section" aria-labelledby="direct-help-heading">
      <div className="section-heading compact-heading">
        <p className="eyebrow">{texts.directContactEyebrow}</p>
        <h2 id="direct-help-heading">{texts.directContactHeading}</h2>
        <p>{texts.directContactIntro}</p>
      </div>
      <div className="direct-contact-grid">
        {contacts.map((contact) => (
          <article className="panel direct-contact-card" key={contact.id}>
            <div>
              <h3>{contact.name}</h3>
              <p className="direct-contact-description">{contact.description}</p>
            </div>
            <dl>
              <div>
                <dt>{texts.verifiedOn}</dt>
                <dd>{dateFormatter.format(new Date(`${contact.lastVerifiedAt}T12:00:00`))}</dd>
              </div>
            </dl>
            <p className="direct-contact-availability">{contact.availability}</p>
            <p className="direct-contact-limitation">{contact.limitation}</p>
            <div className="direct-contact-actions">
              {contact.phoneHref && contact.phoneDisplay && (
                <a className="primary-link-button" href={contact.phoneHref}>
                  {texts.callNow}: <bdi dir="ltr">{contact.phoneDisplay}</bdi>
                </a>
              )}
              <a
                className="secondary-link-button"
                href={contact.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {texts.visitWebsite} <span className="visually-hidden">({texts.newTab})</span>
              </a>
            </div>
            <a
              className="source-link"
              href={contact.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {texts.source}: <bdi>{new URL(contact.sourceUrl).hostname}</bdi>{' '}
              <span className="visually-hidden">({texts.newTab})</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
