import { useEffect, useState } from 'react';
import CategorySelect from './components/CategorySelect';
import Footer from './components/Footer';
import Header from './components/Header';
import InfoPage from './components/InfoPage';
import QuestionFlow from './components/QuestionFlow';
import QuickHelpFlow from './components/QuickHelpFlow';
import QuickHelpResults from './components/QuickHelpResults';
import Results from './components/Results';
import { useI18n } from './i18n';
import { getResultExtraTexts } from './i18n/resultExtras';
import type { Answers, Category } from './types';
import { deleteSavedCase, loadSavedCase, saveCase, type SavedCase } from './utils/savedCase';

type InfoStep = 'imprint' | 'privacy' | 'help';
type Step = 'start' | 'quickHelp' | 'quickResults' | 'questions' | 'results' | InfoStep;

const scrollToTop = () => {
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
};

export default function App() {
  const { country, language, t } = useI18n();
  const locale = language === 'de' && country === 'at'
    ? 'de-AT'
    : { ar: 'ar', de: 'de-DE', tr: 'tr-TR', uk: 'uk-UA' }[language];
  const extraTexts = getResultExtraTexts(language);
  const [step, setStep] = useState<Step>('start');
  const [category, setCategory] = useState<Category | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [savedCase, setSavedCase] = useState<SavedCase | null>(null);
  const visibleSavedCase = savedCase?.country === country ? savedCase : null;
  const localizedCategory = category
    ? t.categories.find((item) => item.id === category.id) ?? category
    : null;

  useEffect(() => {
    setSavedCase(loadSavedCase());
  }, []);

  const reset = () => {
    setStep('start');
    setCategory(null);
    setAnswers({});
    setCheckedItems({});
    scrollToTop();
  };

  const selectCategory = (nextCategory: Category) => {
    setCategory(nextCategory);
    setAnswers({});
    setCheckedItems({});
    setStep('quickHelp');
    scrollToTop();
  };

  const completeQuickHelp = (nextAnswers: Answers) => {
    setAnswers(nextAnswers);
    setCheckedItems({});
    setStep('quickResults');
    scrollToTop();
  };

  const completeQuestions = (nextAnswers: Answers) => {
    const completedAnswers = { ...nextAnswers };
    if (completedAnswers.writtenDeadline) delete completedAnswers.quickDeadlineWindow;
    setAnswers(completedAnswers);
    setCheckedItems({});
    setStep('results');
    scrollToTop();
  };

  const saveCurrentCase = () => {
    if (!category) return;
    saveCase({
      country,
      categoryId: category.id,
      answers,
      checkedItems,
    });
    setSavedCase(loadSavedCase());
  };

  const continueSavedCase = () => {
    if (!visibleSavedCase) return;
    const nextCategory = t.categories.find((item) => item.id === visibleSavedCase.categoryId);
    if (!nextCategory) return;
    setCategory(nextCategory);
    setAnswers(visibleSavedCase.answers);
    setCheckedItems(visibleSavedCase.checkedItems);
    setStep('results');
    scrollToTop();
  };

  const removeSavedCase = () => {
    deleteSavedCase();
    setSavedCase(null);
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
            {visibleSavedCase && (
              <section className="saved-case-panel panel" aria-labelledby="saved-case-heading">
                <div>
                  <p className="eyebrow">{extraTexts.savedCaseEyebrow}</p>
                  <h2 id="saved-case-heading">{extraTexts.savedCaseHeading}</h2>
                  <p>
                    {t.categories.find((item) => item.id === visibleSavedCase.categoryId)?.title ??
                      extraTexts.savedCaseFallback}{' '}
                    - {extraTexts.savedCaseSavedAt}{' '}
                    {new Date(visibleSavedCase.savedAt).toLocaleDateString(locale)}
                  </p>
                </div>
                <div className="saved-case-actions">
                  <button className="primary-button" type="button" onClick={continueSavedCase}>
                    {extraTexts.savedCaseContinue}
                  </button>
                  <button className="ghost-button" type="button" onClick={removeSavedCase}>
                    {extraTexts.deleteSavedCase}
                  </button>
                </div>
              </section>
            )}
            <CategorySelect categories={t.categories} onSelect={selectCategory} />
          </>
        )}

        {step === 'quickHelp' && localizedCategory && (
          <QuickHelpFlow
            category={localizedCategory}
            initialAnswers={answers}
            onBack={reset}
            onComplete={completeQuickHelp}
          />
        )}

        {step === 'quickResults' && localizedCategory && (
          <QuickHelpResults
            answers={answers}
            category={localizedCategory}
            onContinue={() => {
              setStep('questions');
              scrollToTop();
            }}
            onEdit={() => {
              setStep('quickHelp');
              scrollToTop();
            }}
          />
        )}

        {step === 'questions' && localizedCategory && (
          <QuestionFlow
            category={localizedCategory}
            initialAnswers={answers}
            onComplete={completeQuestions}
            onBack={() => {
              setStep('quickResults');
              scrollToTop();
            }}
          />
        )}

        {step === 'results' && localizedCategory && (
          <Results
            category={localizedCategory}
            answers={answers}
            checkedItems={checkedItems}
            savedCaseExists={Boolean(visibleSavedCase)}
            onCheckedItemsChange={setCheckedItems}
            onDeleteSavedCase={removeSavedCase}
            onReset={reset}
            onSaveCase={saveCurrentCase}
          />
        )}

        {(step === 'imprint' || step === 'privacy' || step === 'help') && (
          <InfoPage page={step} onBack={reset} />
        )}
      </main>
      <Footer
        onNavigate={(page) => {
          setStep(page);
          scrollToTop();
        }}
      />
    </div>
  );
}
