import { useEffect, useMemo, useRef, useState } from 'react';
import { buildQuickAnswers, getQuickRiskOptions } from '../data/quickHelp';
import { useI18n } from '../i18n';
import { getQuickHelpTexts, type QuickDeadlineWindow } from '../i18n/quickHelp';
import type { Answers, Category } from '../types';
import EmergencyContacts from './EmergencyContacts';

interface QuickHelpFlowProps {
  category: Category;
  initialAnswers: Answers;
  onBack: () => void;
  onComplete: (answers: Answers) => void;
}

const deadlineValues: QuickDeadlineWindow[] = [
  'immediateNeeds',
  'today',
  'threeDays',
  'week',
  'later',
  'unclear',
];

const isDeadlineWindow = (value?: string): value is QuickDeadlineWindow =>
  Boolean(value && deadlineValues.includes(value as QuickDeadlineWindow));

export default function QuickHelpFlow({ category, initialAnswers, onBack, onComplete }: QuickHelpFlowProps) {
  const { language } = useI18n();
  const texts = getQuickHelpTexts(language);
  const riskOptions = useMemo(() => getQuickRiskOptions(category.id, language), [category.id, language]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [location, setLocation] = useState(initialAnswers.city ?? '');
  const [withoutLocation, setWithoutLocation] = useState(!initialAnswers.city && initialAnswers.triageCompleted === 'ja');
  const [deadlineWindow, setDeadlineWindow] = useState<QuickDeadlineWindow | ''>(
    isDeadlineWindow(initialAnswers.quickDeadlineWindow) ? initialAnswers.quickDeadlineWindow : '',
  );
  const [riskValue, setRiskValue] = useState(initialAnswers.quickRisk ?? '');
  const [showError, setShowError] = useState(false);
  const locationInvalid = showError && !withoutLocation && location.trim().length === 0;
  const riskInvalid = showError && !riskValue;
  const deadlineInvalid = showError && !deadlineWindow;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasLocation = withoutLocation || location.trim().length > 0;
    if (!hasLocation || !deadlineWindow || !riskValue) {
      setShowError(true);
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }

    onComplete(buildQuickAnswers(category.id, withoutLocation ? '' : location, deadlineWindow, riskValue));
  };

  return (
    <section className="quick-help-flow" aria-labelledby="quick-help-heading">
      <div className="quick-help-intro">
        <p className="eyebrow">{texts.eyebrow}</p>
        <h1 id="quick-help-heading" ref={headingRef} tabIndex={-1}>
          {texts.heading}
        </h1>
        <p>{texts.intro}</p>
      </div>

      <EmergencyContacts headingId="emergency-heading" texts={texts} />

      <form className="quick-help-form" onSubmit={submit} noValidate>
        <fieldset
          className="panel triage-fieldset location-fieldset"
          aria-describedby={locationInvalid ? 'location-help quick-help-error' : 'location-help'}
          aria-invalid={locationInvalid}
        >
          <legend>1 · {texts.locationLabel}</legend>
          <p id="location-help" className="field-help">{texts.locationHelp}</p>
          <input
            aria-describedby={locationInvalid ? 'location-help quick-help-error' : 'location-help'}
            aria-invalid={locationInvalid}
            aria-label={texts.locationLabel}
            autoComplete="postal-code"
            disabled={withoutLocation}
            maxLength={80}
            name="quick-location"
            placeholder={texts.locationPlaceholder}
            type="text"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setShowError(false);
            }}
          />
          <label className="skip-location-choice">
            <input
              checked={withoutLocation}
              name="without-location"
              type="checkbox"
              onChange={(event) => {
                setWithoutLocation(event.target.checked);
                setShowError(false);
              }}
            />
            <span>{texts.noLocation}</span>
          </label>
        </fieldset>

        <fieldset
          className="panel triage-fieldset"
          aria-describedby={riskInvalid ? 'quick-help-error' : undefined}
          aria-invalid={riskInvalid}
        >
          <legend>2 · {texts.risks[category.id].legend}</legend>
          <div className="triage-grid">
            {riskOptions.map((option) => (
              <label className={riskValue === option.value ? 'triage-option active' : 'triage-option'} key={option.value}>
                <input
                  checked={riskValue === option.value}
                  name="quick-risk"
                  type="radio"
                  value={option.value}
                  onChange={() => {
                    setRiskValue(option.value);
                    setShowError(false);
                  }}
                />
                <span className="triage-option-copy">
                  <strong>{option.label}</strong>
                  <small>{option.help}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset
          className="panel triage-fieldset"
          aria-describedby={deadlineInvalid ? 'quick-help-error' : undefined}
          aria-invalid={deadlineInvalid}
        >
          <legend>3 · {texts.timingLegend}</legend>
          <div className="triage-grid">
            {deadlineValues.map((value) => {
              const option = texts.timingOptions[value];
              return (
                <label className={deadlineWindow === value ? 'triage-option active' : 'triage-option'} key={value}>
                  <input
                    checked={deadlineWindow === value}
                    name="quick-deadline"
                    type="radio"
                    value={value}
                    onChange={() => {
                      setDeadlineWindow(value);
                      setShowError(false);
                    }}
                  />
                  <span className="triage-option-copy">
                    <strong>{option.label}</strong>
                    <small>{option.help}</small>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {showError && (
          <p className="form-error" id="quick-help-error" ref={errorRef} role="alert" tabIndex={-1}>
            {texts.requiredError}
          </p>
        )}

        <div className="flow-actions quick-help-actions">
          <button className="secondary-button" type="button" onClick={onBack}>{texts.back}</button>
          <button className="primary-button" type="submit">{texts.submit}</button>
        </div>
      </form>
    </section>
  );
}
