import { useMemo, useState } from 'react';
import { categoryQuestions, commonQuestions } from '../data/questions';
import type { Answers, Category, Question } from '../types';

interface QuestionFlowProps {
  category: Category;
  onComplete: (answers: Answers) => void;
  onBack: () => void;
}

export default function QuestionFlow({ category, onComplete, onBack }: QuestionFlowProps) {
  const questions = useMemo(
    () => [...commonQuestions, ...categoryQuestions[category.id]],
    [category.id],
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const current = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);
  const value = answers[current.id] ?? '';
  const canContinue = !current.required || value.trim().length > 0;

  const updateAnswer = (question: Question, nextValue: string) => {
    setAnswers((previous) => ({ ...previous, [question.id]: nextValue }));
  };

  const next = () => {
    if (!canContinue) return;
    if (index === questions.length - 1) {
      onComplete(answers);
      return;
    }
    setIndex((currentIndex) => currentIndex + 1);
  };

  const previous = () => {
    if (index === 0) {
      onBack();
      return;
    }
    setIndex((currentIndex) => currentIndex - 1);
  };

  return (
    <section className="flow-shell" aria-labelledby="question-heading">
      <div className="flow-top">
        <div>
          <p className="eyebrow">Schritt 2 · {category.title}</p>
          <h2 id="question-heading">Ein paar Angaben sortieren</h2>
        </div>
        <span className="progress-label">
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="progress-track" aria-label={`Fortschritt ${progress} Prozent`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <article className="question-card">
        <label htmlFor={current.id}>{current.text}</label>
        {current.help && <p className="field-help">{current.help}</p>}
        <QuestionInput question={current} value={value} onChange={(nextValue) => updateAnswer(current, nextValue)} />
      </article>

      <div className="flow-actions">
        <button className="secondary-button" type="button" onClick={previous}>
          Zurück
        </button>
        <button className="primary-button" type="button" disabled={!canContinue} onClick={next}>
          {index === questions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter'}
        </button>
      </div>
    </section>
  );
}

interface QuestionInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  if (question.type === 'select') {
    return (
      <div className="option-list">
        {question.options?.map((option) => (
          <button
            className={value === option.value ? 'option-button active' : 'option-button'}
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <textarea
        id={question.id}
        value={value}
        placeholder={question.placeholder}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      id={question.id}
      min={question.type === 'number' ? '0' : undefined}
      type={question.type}
      inputMode={question.type === 'number' ? 'decimal' : undefined}
      value={value}
      placeholder={question.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
