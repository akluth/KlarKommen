import { useState } from 'react';
import CategorySelect from './components/CategorySelect';
import Footer from './components/Footer';
import Header from './components/Header';
import InfoPage from './components/InfoPage';
import QuestionFlow from './components/QuestionFlow';
import Results from './components/Results';
import { useI18n } from './i18n';
import type { Answers, Category } from './types';

type InfoStep = 'imprint' | 'privacy' | 'help';
type Step = 'start' | 'questions' | 'results' | InfoStep;

export default function App() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>('start');
  const [category, setCategory] = useState<Category | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const localizedCategory = category
    ? t.categories.find((item) => item.id === category.id) ?? category
    : null;

  const reset = () => {
    setStep('start');
    setCategory(null);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (nextCategory: Category) => {
    setCategory(nextCategory);
    setStep('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeQuestions = (nextAnswers: Answers) => {
    setAnswers(nextAnswers);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <Header showReset={step !== 'start'} onReset={reset} />
      <main>
        {step === 'start' && (
          <>
            <section className="hero">
              <div className="hero-content">
                <p className="eyebrow">{t.ui.heroEyebrow}</p>
                <h1>KlarKommen</h1>
                <p className="claim">{t.ui.heroClaim}</p>
                <div className="disclaimer-card" role="note">
                  <strong>{t.ui.important}</strong>
                  <p>{t.disclaimer}</p>
                </div>
              </div>
            </section>
            <section className="help-preview panel" aria-labelledby="real-help-heading">
              <div>
                <p className="eyebrow">{t.ui.helpPreviewEyebrow}</p>
                <h2 id="real-help-heading">{t.ui.helpPreviewTitle}</h2>
                <p>{t.ui.helpPreviewText}</p>
              </div>
              <ul>
                {t.legal.realHelpSignals.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="secondary-button" type="button" onClick={() => setStep('help')}>
                {t.ui.showAllHelp}
              </button>
            </section>
            <CategorySelect categories={t.categories} onSelect={selectCategory} />
          </>
        )}

        {step === 'questions' && localizedCategory && (
          <QuestionFlow category={localizedCategory} onComplete={completeQuestions} onBack={reset} />
        )}

        {step === 'results' && localizedCategory && (
          <Results category={localizedCategory} answers={answers} onReset={reset} />
        )}

        {(step === 'imprint' || step === 'privacy' || step === 'help') && (
          <InfoPage page={step} onBack={reset} />
        )}
      </main>
      <Footer onNavigate={(page) => setStep(page)} />
    </div>
  );
}
