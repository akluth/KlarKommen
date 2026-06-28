import { useState } from 'react';
import { buildContactChecklist, buildHelpSearchLinks, buildPhoneScript } from '../data/localHelp';
import { buildActionPlan, buildDocuments, buildUrgency } from '../data/preparation';
import { useI18n } from '../i18n';
import { getResultExtraTexts } from '../i18n/resultExtras';
import type { Answers, Category } from '../types';
import Checklist from './Checklist';
import LocalHelp from './LocalHelp';
import TaskList from './TaskList';
import TemplateBox from './TemplateBox';
import UrgencyCard from './UrgencyCard';

interface ResultsProps {
  category: Category;
  answers: Answers;
  checkedItems: Record<string, boolean>;
  savedCaseExists: boolean;
  onCheckedItemsChange: (checkedItems: Record<string, boolean>) => void;
  onDeleteSavedCase: () => void;
  onReset: () => void;
  onSaveCase: () => void;
}

export default function Results({
  category,
  answers,
  checkedItems,
  savedCaseExists,
  onCheckedItemsChange,
  onDeleteSavedCase,
  onReset,
  onSaveCase,
}: ResultsProps) {
  const { language, t } = useI18n();
  const extraTexts = getResultExtraTexts(language);
  const result = t.buildRecommendations(category.id, answers);
  const templates = t.buildAllTemplates(category, answers);
  const documents = buildDocuments(category.id, answers, language);
  const actionPlan = buildActionPlan(category.id, answers, language);
  const urgency = buildUrgency(category.id, answers, language);
  const helpSearchLinks = buildHelpSearchLinks(category.id, answers, language);
  const phoneScript = buildPhoneScript(category, answers);
  const contactChecklist = buildContactChecklist(language);
  const [packageCopied, setPackageCopied] = useState(false);

  const deadlineText =
    answers.deadlineDate ||
    (answers.writtenDeadline === 'ja' ? extraTexts.deadlineWritten : extraTexts.noDeadline);

  const packageLines = [
    t.ui.resultExportTitle(category.title),
    '',
    `${extraTexts.packageEyebrow}:`,
    `${extraTexts.packageCategory}: ${category.title}`,
    `${extraTexts.packagePlace}: ${answers.city || extraTexts.noPlace}`,
    `${extraTexts.packageAmount}: ${answers.amount ? `${answers.amount} Euro` : extraTexts.amountUnknown}`,
    `${extraTexts.packageDeadline}: ${deadlineText}`,
    `${extraTexts.urgencyEyebrow}: ${urgency.label} - ${urgency.headline}`,
    '',
    `${extraTexts.packageWhy}:`,
    ...urgency.reasons.map((item) => `- ${item}`),
    '',
    `${extraTexts.taskNextTitle}:`,
    ...actionPlan.map((item) => `- ${item}`),
    '',
    `${extraTexts.taskDocumentsTitle}:`,
    ...documents.map((item) => `- ${item}`),
    '',
    `${extraTexts.packageSearchTitle}:`,
    ...helpSearchLinks.map((item) => `- ${item.label}: ${item.url}`),
    '',
    `${extraTexts.packageScriptTitle}:`,
    phoneScript,
    '',
    `${extraTexts.contactTitle}:`,
    ...contactChecklist.map((item) => `- ${item}`),
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
          <button className="secondary-button" type="button" onClick={onSaveCase}>
            {savedCaseExists ? extraTexts.savedUpdate : extraTexts.saveCase}
          </button>
          <button className="secondary-button" type="button" onClick={() => window.print()}>
            {extraTexts.printPdf}
          </button>
          {savedCaseExists && (
            <button className="ghost-button" type="button" onClick={onDeleteSavedCase}>
              {extraTexts.deleteSavedCase}
            </button>
          )}
          <button className="ghost-button" type="button" onClick={onReset}>
            {t.ui.reset}
          </button>
        </div>
      </div>

      <UrgencyCard eyebrowLabel={extraTexts.urgencyEyebrow} urgency={urgency} />

      <section className="panel package-card" aria-labelledby="package-heading">
        <div>
          <p className="eyebrow">{extraTexts.packageEyebrow}</p>
          <h3 id="package-heading">{extraTexts.packageHeading}</h3>
          <p>
            {category.title} - {answers.city || extraTexts.noPlace} - {urgency.label} - {urgency.headline}
          </p>
        </div>
        <dl>
          <div>
            <dt>{extraTexts.packageDeadline}</dt>
            <dd>{deadlineText}</dd>
          </div>
          <div>
            <dt>{extraTexts.packageAmount}</dt>
            <dd>{answers.amount ? `${answers.amount} Euro` : extraTexts.amountUnknown}</dd>
          </div>
          <div>
            <dt>{extraTexts.packageContact}</dt>
            <dd>{category.primaryContact}</dd>
          </div>
        </dl>
        <div className="package-actions">
          <button className="secondary-button" type="button" onClick={copyPackage}>
            {packageCopied ? extraTexts.copied : extraTexts.copyPackage}
          </button>
          <button className="secondary-button" type="button" onClick={() => window.print()}>
            {extraTexts.printPdf}
          </button>
        </div>
      </section>

      <LocalHelp
        checkedItems={checkedItems}
        links={helpSearchLinks}
        onCheckedItemsChange={onCheckedItemsChange}
        phoneScript={phoneScript}
        tasks={contactChecklist}
        texts={extraTexts}
      />

      <div className="results-grid priority-grid">
        <TaskList
          title={extraTexts.taskNextTitle}
          eyebrow={extraTexts.taskNextEyebrow}
          items={actionPlan}
          checkedItems={checkedItems}
          onCheckedItemsChange={onCheckedItemsChange}
        />
        <TaskList
          title={extraTexts.taskDocumentsTitle}
          eyebrow={extraTexts.taskDocumentsEyebrow}
          items={documents}
          checkedItems={checkedItems}
          onCheckedItemsChange={onCheckedItemsChange}
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
