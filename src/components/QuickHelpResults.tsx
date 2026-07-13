import { useEffect, useRef } from 'react';
import { buildDirectHelpContacts } from '../data/directHelp';
import { buildHelpSearchLinks } from '../data/localHelp';
import { buildUrgency } from '../data/preparation';
import { buildQuickActions } from '../data/quickHelp';
import { useI18n } from '../i18n';
import { getQuickHelpTexts } from '../i18n/quickHelp';
import { getResultExtraTexts } from '../i18n/resultExtras';
import type { Answers, Category } from '../types';
import DirectHelpContacts from './DirectHelpContacts';
import EmergencyContacts from './EmergencyContacts';
import UrgencyCard from './UrgencyCard';

interface QuickHelpResultsProps {
  answers: Answers;
  category: Category;
  onContinue: () => void;
  onEdit: () => void;
}

export default function QuickHelpResults({ answers, category, onContinue, onEdit }: QuickHelpResultsProps) {
  const { language } = useI18n();
  const texts = getQuickHelpTexts(language);
  const extraTexts = getResultExtraTexts(language);
  const urgency = buildUrgency(category.id, answers, language);
  const actions = buildQuickActions(category.id, language);
  const contacts = buildDirectHelpContacts(category.id, language, answers);
  const searchLinks = buildHelpSearchLinks(category.id, answers, language);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="quick-help-results" aria-labelledby="quick-result-heading">
      <div className="quick-help-intro">
        <p className="eyebrow">{texts.resultEyebrow} · {category.title}</p>
        <h1 id="quick-result-heading" ref={headingRef} tabIndex={-1}>{texts.resultHeading}</h1>
        <p>{texts.resultIntro}</p>
      </div>

      {(answers.safetyAtRisk === 'ja' || category.id === 'family') && (
        <EmergencyContacts
          danger={answers.safetyAtRisk === 'ja'}
          headingId="result-emergency-heading"
          texts={texts}
        />
      )}

      <UrgencyCard eyebrowLabel={extraTexts.urgencyEyebrow} urgency={urgency} />

      <section className="panel quick-actions-card" aria-labelledby="quick-actions-heading">
        <p className="eyebrow">{texts.actionEyebrow}</p>
        <h2 id="quick-actions-heading">{texts.actionHeading}</h2>
        <ol>
          {actions.slice(0, 3).map((action) => <li key={action}>{action}</li>)}
        </ol>
      </section>

      <DirectHelpContacts contacts={contacts} language={language} texts={texts} />

      <section className="panel google-help-card" aria-labelledby="google-help-heading">
        <div>
          <p className="eyebrow">{texts.googleEyebrow}</p>
          <h2 id="google-help-heading">{texts.googleHeading}</h2>
          <p>{texts.googleNotice}</p>
        </div>
        <div className="search-link-grid">
          {searchLinks.map((link) => (
            <a
              className="search-link"
              href={link.url}
              key={link.query}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} <span className="visually-hidden">({texts.newTab})</span>
            </a>
          ))}
        </div>
      </section>

      <div className="flow-actions quick-result-actions">
        <button className="secondary-button" type="button" onClick={onEdit}>{texts.changeAnswers}</button>
        <button className="primary-button" type="button" onClick={onContinue}>{texts.continueDetails}</button>
      </div>
    </section>
  );
}
