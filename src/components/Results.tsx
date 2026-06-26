import { useState } from 'react';
import { useI18n } from '../i18n';
import { buildActionPlan, buildDocuments, buildUrgency } from '../data/preparation';
import type { Answers, Category } from '../types';
import Checklist from './Checklist';
import TaskList from './TaskList';
import TemplateBox from './TemplateBox';
import UrgencyCard from './UrgencyCard';

interface ResultsProps {
  category: Category;
  answers: Answers;
  onReset: () => void;
}

export default function Results({ category, answers, onReset }: ResultsProps) {
  const { t } = useI18n();
  const result = t.buildRecommendations(category.id, answers);
  const templates = t.buildAllTemplates(category, answers);
  const documents = buildDocuments(category.id, answers);
  const actionPlan = buildActionPlan(category.id, answers);
  const urgency = buildUrgency(category.id, answers);
  const [packageCopied, setPackageCopied] = useState(false);

  const packageLines = [
    t.ui.resultExportTitle(category.title),
    '',
    'Beratungspaket:',
    `Kategorie: ${category.title}`,
    `Ort: ${answers.city || 'nicht angegeben'}`,
    `Offener Betrag: ${answers.amount ? `${answers.amount} Euro` : 'nicht angegeben'}`,
    `Frist: ${answers.deadlineDate || (answers.writtenDeadline === 'ja' ? 'schriftliche Frist vorhanden, Datum prüfen' : 'nicht angegeben')}`,
    `Dringlichkeit: ${urgency.label} - ${urgency.headline}`,
    '',
    'Warum diese Einschätzung:',
    ...urgency.reasons.map((item) => `- ${item}`),
    '',
    'Aktionsplan:',
    ...actionPlan.map((item) => `- ${item}`),
    '',
    'Unterlagen:',
    ...documents.map((item) => `- ${item}`),
    '',
    `${t.ui.situationTitle}:`,
    ...result.situation.map((item) => `- ${item}`),
    '',
    `${t.ui.todayTitle}:`,
    ...result.today.map((item) => `- ${item}`),
    '',
    `${t.ui.tomorrowTitle}:`,
    ...result.tomorrow.map((item) => `- ${item}`),
    '',
    `${t.ui.helpTitle}:`,
    ...result.help.map((item) => `- ${item}`),
    '',
    `${t.ui.avoidTitle}:`,
    ...result.avoid.map((item) => `- ${item}`),
  ];

  const allResults = [
    ...packageLines,
    '',
    t.ui.templatesExportTitle,
    ...templates.flatMap((template) => ['', template.label, template.text]),
  ].join('\n');

  const copyAll = async () => {
    await navigator.clipboard.writeText(allResults);
  };

  const copyPackage = async () => {
    await navigator.clipboard.writeText(packageLines.join('\n'));
    setPackageCopied(true);
    window.setTimeout(() => setPackageCopied(false), 1800);
  };

  return (
    <section className="results" aria-labelledby="results-heading">
      <div className="results-hero">
        <p className="eyebrow">{t.ui.resultStep}</p>
        <h2 id="results-heading">{t.ui.resultHeading}</h2>
        <p>{t.ui.resultIntro}</p>
        <div className="results-actions">
          <button className="primary-button" type="button" onClick={copyAll}>
            {t.ui.copyAll}
          </button>
          <button className="secondary-button" type="button" onClick={() => window.print()}>
            Druck / PDF
          </button>
          <button className="ghost-button" type="button" onClick={onReset}>
            {t.ui.reset}
          </button>
        </div>
      </div>

      <UrgencyCard urgency={urgency} />

      <section className="panel package-card" aria-labelledby="package-heading">
        <div>
          <p className="eyebrow">Beratungspaket</p>
          <h3 id="package-heading">Für Gespräch, Termin oder Ausdruck</h3>
          <p>
            {category.title} · {answers.city || 'Ort nicht angegeben'} · {urgency.label} -{' '}
            {urgency.headline}
          </p>
        </div>
        <dl>
          <div>
            <dt>Frist</dt>
            <dd>
              {answers.deadlineDate ||
                (answers.writtenDeadline === 'ja'
                  ? 'Schriftliche Frist vorhanden'
                  : 'Nicht angegeben')}
            </dd>
          </div>
          <div>
            <dt>Betrag</dt>
            <dd>{answers.amount ? `${answers.amount} Euro` : 'Nicht angegeben'}</dd>
          </div>
          <div>
            <dt>Kontakt</dt>
            <dd>{category.primaryContact}</dd>
          </div>
        </dl>
        <div className="package-actions">
          <button className="secondary-button" type="button" onClick={copyPackage}>
            {packageCopied ? t.ui.copied : 'Beratungspaket kopieren'}
          </button>
          <button className="secondary-button" type="button" onClick={() => window.print()}>
            Als PDF speichern / drucken
          </button>
        </div>
      </section>

      <div className="results-grid priority-grid">
        <TaskList title="Dein nächster Aktionsplan" eyebrow="Jetzt konkret werden" items={actionPlan} />
        <TaskList
          title="Unterlagen bereitlegen"
          eyebrow="Damit Gespräche leichter werden"
          items={documents}
        />
      </div>

      <div className="results-grid">
        <Checklist title={t.ui.situationTitle} items={result.situation} />
        <Checklist title={t.ui.todayTitle} items={result.today} />
        <Checklist title={t.ui.tomorrowTitle} items={result.tomorrow} />
        <Checklist title={t.ui.helpTitle} items={result.help} />
        <Checklist title={t.ui.avoidTitle} items={result.avoid} tone="warning" />
      </div>

      <div className="template-stack">
        <div className="section-heading">
          <p className="eyebrow">{t.ui.templatesEyebrow}</p>
          <h2>{t.ui.templatesTitle}</h2>
        </div>
        {templates.map((template) => (
          <TemplateBox key={template.label} title={template.label} text={template.text} />
        ))}
      </div>
    </section>
  );
}
