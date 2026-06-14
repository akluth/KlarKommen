import { useState } from 'react';
import CategorySelect from './components/CategorySelect';
import Footer from './components/Footer';
import Header from './components/Header';
import InfoPage from './components/InfoPage';
import QuestionFlow from './components/QuestionFlow';
import Results from './components/Results';
import { categories } from './data/categories';
import { DISCLAIMER } from './data/disclaimer';
import { realHelpSignals } from './data/legal';
import type { Answers, Category } from './types';

type InfoStep = 'imprint' | 'privacy' | 'help';
type Step = 'start' | 'questions' | 'results' | InfoStep;

export default function App() {
  const [step, setStep] = useState<Step>('start');
  const [category, setCategory] = useState<Category | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

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
                <p className="eyebrow">Ruhig sortieren. Heute anfangen.</p>
                <h1>KlarKommen</h1>
                <p className="claim">
                  Erste Orientierung, wenn Miete, Strom, Jobcenter, Krankenkasse, Konto oder
                  Schufa gerade zu viel werden.
                </p>
                <div className="disclaimer-card" role="note">
                  <strong>Wichtig:</strong>
                  <p>{DISCLAIMER}</p>
                </div>
              </div>
            </section>
            <section className="help-preview panel" aria-labelledby="real-help-heading">
              <div>
                <p className="eyebrow">Nicht allein bleiben</p>
                <h2 id="real-help-heading">Wann du echte Hilfe suchen solltest</h2>
                <p>
                  Wenn Fristen, Gerichtspost, Sperren oder Pfändungen im Raum stehen, ist direkte
                  Unterstützung wichtig. KlarKommen kann vorbereiten, ersetzt aber keine persönliche
                  Beratung.
                </p>
              </div>
              <ul>
                {realHelpSignals.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="secondary-button" type="button" onClick={() => setStep('help')}>
                Alle Hinweise ansehen
              </button>
            </section>
            <CategorySelect categories={categories} onSelect={selectCategory} />
          </>
        )}

        {step === 'questions' && category && (
          <QuestionFlow category={category} onComplete={completeQuestions} onBack={reset} />
        )}

        {step === 'results' && category && (
          <Results category={category} answers={answers} onReset={reset} />
        )}

        {(step === 'imprint' || step === 'privacy' || step === 'help') && (
          <InfoPage page={step} onBack={reset} />
        )}
      </main>
      <Footer onNavigate={(page) => setStep(page)} />
    </div>
  );
}
