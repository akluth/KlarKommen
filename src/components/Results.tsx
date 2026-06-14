import { buildRecommendations } from '../data/recommendations';
import { buildAllTemplates } from '../data/templates';
import type { Answers, Category } from '../types';
import Checklist from './Checklist';
import TemplateBox from './TemplateBox';

interface ResultsProps {
  category: Category;
  answers: Answers;
  onReset: () => void;
}

export default function Results({ category, answers, onReset }: ResultsProps) {
  const result = buildRecommendations(category.id, answers);
  const templates = buildAllTemplates(category, answers);

  const allResults = [
    `KlarKommen Ergebnis - ${category.title}`,
    '',
    'Lage kurz sortiert:',
    ...result.situation.map((item) => `- ${item}`),
    '',
    'Was du heute tun solltest:',
    ...result.today.map((item) => `- ${item}`),
    '',
    'Was du morgen tun solltest:',
    ...result.tomorrow.map((item) => `- ${item}`),
    '',
    'Diese Stellen konnten helfen:',
    ...result.help.map((item) => `- ${item}`),
    '',
    'Fehler, die du vermeiden solltest:',
    ...result.avoid.map((item) => `- ${item}`),
    '',
    'Textvorlagen:',
    ...templates.flatMap((template) => ['', template.label, template.text]),
  ].join('\n');

  const copyAll = async () => {
    await navigator.clipboard.writeText(allResults);
  };

  return (
    <section className="results" aria-labelledby="results-heading">
      <div className="results-hero">
        <p className="eyebrow">Schritt 3 · Ergebnis</p>
        <h2 id="results-heading">Deine Situation ist sortiert.</h2>
        <p>
          Das ist keine rechtliche Bewertung. Es ist eine ruhige Arbeitsliste, damit du heute
          anfangen kannst.
        </p>
        <div className="results-actions">
          <button className="primary-button" type="button" onClick={copyAll}>
            Alle Ergebnisse kopieren
          </button>
          <button className="secondary-button" type="button" onClick={() => window.print()}>
            Drucken
          </button>
          <button className="ghost-button" type="button" onClick={onReset}>
            Neue Situation prüfen
          </button>
        </div>
      </div>

      <div className="results-grid">
        <Checklist title="Lage kurz sortiert" items={result.situation} />
        <Checklist title="Was du heute tun solltest" items={result.today} />
        <Checklist title="Was du morgen tun solltest" items={result.tomorrow} />
        <Checklist title="Diese Stellen könnten helfen" items={result.help} />
        <Checklist title="Fehler, die du vermeiden solltest" items={result.avoid} tone="warning" />
      </div>

      <div className="template-stack">
        <div className="section-heading">
          <p className="eyebrow">Vorlagen</p>
          <h2>Passende Texte</h2>
        </div>
        {templates.map((template) => (
          <TemplateBox key={template.label} title={template.label} text={template.text} />
        ))}
      </div>
    </section>
  );
}
