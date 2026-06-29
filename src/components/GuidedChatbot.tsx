import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useI18n } from '../i18n';
import type { Answers, Category, CategoryId, Question } from '../types';

interface GuidedChatbotProps {
  categories: Category[];
  onComplete: (category: Category, answers: Answers) => void;
}

type Phase = 'intake' | 'questions' | 'ready';

interface AnalysisResult {
  answers: Answers;
  categoryId: CategoryId;
  confidence: 'hoch' | 'mittel' | 'niedrig';
  findings: string[];
}

const categoryKeywords: Record<CategoryId, string[]> = {
  debtCourt: [
    'inkasso',
    'mahnbescheid',
    'vollstreckungsbescheid',
    'gelber brief',
    'gericht',
    'forderung',
    'glaeubiger',
    'gläubiger',
  ],
  energy: ['strom', 'gas', 'energie', 'sperre', 'stromsperre', 'abschlag', 'versorger'],
  family: ['trennung', 'scheidung', 'geburt', 'tod', 'kind', 'unterhalt', 'familie', 'jugendamt'],
  garnishment: ['pfaendung', 'pfändung', 'p-konto', 'pkonto', 'freibetrag', 'bank', 'konto blockiert'],
  health: ['krankenkasse', 'krankenversicherung', 'beitrag', 'beitragsschulden', 'leistung ruht'],
  jobcenter: ['jobcenter', 'buergergeld', 'bürgergeld', 'sozialamt', 'bescheid', 'sanktion'],
  rent: ['miete', 'mietschulden', 'vermieter', 'kuendigung', 'kündigung', 'raeumung', 'räumung', 'wohnung'],
  schufa: ['schufa', 'kredit', 'bonitaet', 'bonität', 'ablehnung', 'darlehen', 'sofortkredit'],
};

export default function GuidedChatbot({ categories, onComplete }: GuidedChatbotProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('intake');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [intakeText, setIntakeText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const questions = useMemo<Question[]>(() => {
    if (!selectedCategory) return [];
    return [...t.commonQuestions, ...t.categoryQuestions[selectedCategory.id]];
  }, [selectedCategory, t]);

  const currentQuestion = questions[questionIndex];
  const currentValue = currentQuestion ? answers[currentQuestion.id] ?? '' : '';
  const answeredQuestions = questions.slice(0, questionIndex).filter((question) => answers[question.id]);
  const progress = questions.length > 0 ? Math.round((questionIndex / questions.length) * 100) : 0;
  const canContinue = !currentQuestion || !currentQuestion.required || currentValue.trim().length > 0;

  const analyzeIntake = () => {
    const nextAnalysis = analyzeSituation(intakeText);
    const category = categories.find((item) => item.id === nextAnalysis.categoryId);
    if (!category) return;

    const nextQuestions = [...t.commonQuestions, ...t.categoryQuestions[category.id]];
    const firstOpenQuestion = nextQuestions.findIndex((question) => !nextAnalysis.answers[question.id]);

    setSelectedCategory(category);
    setAnswers(nextAnalysis.answers);
    setAnalysis(nextAnalysis);
    setQuestionIndex(firstOpenQuestion >= 0 ? firstOpenQuestion : 0);
    setPhase('questions');
  };

  const updateAnswer = (question: Question, value: string) => {
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  };

  const answerAndContinue = (question: Question, value: string) => {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    continueWith(nextAnswers);
  };

  const continueWith = (nextAnswers = answers) => {
    if (!currentQuestion) return;
    const nextValue = nextAnswers[currentQuestion.id] ?? '';
    const nextCanContinue = !currentQuestion.required || nextValue.trim().length > 0;
    if (!nextCanContinue) return;
    if (questionIndex >= questions.length - 1) {
      setAnswers(nextAnswers);
      setPhase('ready');
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const goBack = () => {
    if (phase === 'ready') {
      setPhase('questions');
      setQuestionIndex(Math.max(questions.length - 1, 0));
      return;
    }
    if (phase === 'questions' && questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
      return;
    }
    setSelectedCategory(null);
    setAnswers({});
    setAnalysis(null);
    setQuestionIndex(0);
    setPhase('intake');
  };

  const resetChat = () => {
    setSelectedCategory(null);
    setAnswers({});
    setAnalysis(null);
    setIntakeText('');
    setQuestionIndex(0);
    setPhase('intake');
  };

  const showResults = () => {
    if (!selectedCategory) return;
    onComplete(selectedCategory, answers);
  };

  return (
    <aside className={isOpen ? 'guided-chat-widget open' : 'guided-chat-widget'}>
      {isOpen && (
        <section className="guided-chat-panel" aria-labelledby="guided-chat-heading">
          <div className="guided-chat-header">
            <div>
              <p className="eyebrow">Gefuehrter Chat</p>
              <h2 id="guided-chat-heading">KlarKommen Chat</h2>
              <p>Beschreibe kurz, was passiert ist. Die Analyse bleibt in diesem Browser.</p>
            </div>
            <button
              className="chat-icon-button"
              type="button"
              aria-label="Chat schliessen"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>
          </div>

          <div className="chat-window" aria-live="polite">
            <ChatBubble tone="bot">
              Schreib mir in deinen Worten, worum es geht. Ich erkenne daraus Thema, Dringlichkeit
              und erste Angaben und frage dann gezielt nach.
            </ChatBubble>

            {phase === 'intake' && (
              <>
                <textarea
                  className="chat-intake-input"
                  value={intakeText}
                  rows={5}
                  placeholder="z. B. Ich habe zwei Monatsmieten offen, eine fristlose Kuendigung bekommen und wohne in Leipzig."
                  onChange={(event) => setIntakeText(event.target.value)}
                />
                <button
                  className="primary-button"
                  type="button"
                  disabled={intakeText.trim().length < 12}
                  onClick={analyzeIntake}
                >
                  Situation analysieren
                </button>
              </>
            )}

            {analysis && selectedCategory && (
              <>
                <ChatBubble tone="user">{intakeText}</ChatBubble>
                <div className="chat-analysis-card">
                  <strong>Erkannt: {selectedCategory.title}</strong>
                  <span>Sicherheit: {analysis.confidence}</span>
                  {analysis.findings.length > 0 && (
                    <ul>
                      {analysis.findings.map((finding) => (
                        <li key={finding}>{finding}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {answeredQuestions.map((question) => (
              <div className="chat-exchange" key={question.id}>
                <ChatBubble tone="bot">{question.text}</ChatBubble>
                <ChatBubble tone="user">{formatAnswer(question, answers[question.id])}</ChatBubble>
              </div>
            ))}

            {phase === 'questions' && currentQuestion && (
              <>
                <ChatBubble tone="bot">
                  {currentQuestion.text}
                  {currentQuestion.help && <span className="chat-help">{currentQuestion.help}</span>}
                </ChatBubble>
                <QuestionReply
                  question={currentQuestion}
                  value={currentValue}
                  onChange={(value) => updateAnswer(currentQuestion, value)}
                  onChoose={(value) => answerAndContinue(currentQuestion, value)}
                />
              </>
            )}

            {phase === 'ready' && selectedCategory && (
              <>
                <ChatBubble tone="bot">
                  Fertig. Ich habe deine Antworten sortiert und kann daraus jetzt die passende
                  Arbeitsliste, Kontakte und Textvorlagen zusammenstellen.
                </ChatBubble>
                <div className="chat-summary">
                  <strong>{selectedCategory.title}</strong>
                  <span>{Object.keys(answers).length} Antworten erfasst</span>
                </div>
              </>
            )}
          </div>

          {phase !== 'intake' && (
            <div className="chat-progress" aria-label={t.ui.progressAria(progress)}>
              <span style={{ width: `${phase === 'ready' ? 100 : progress}%` }} />
            </div>
          )}

          {phase !== 'intake' && (
            <div className="guided-chat-actions">
              <button className="secondary-button" type="button" onClick={goBack}>
                {t.ui.back}
              </button>
              {phase === 'questions' && currentQuestion?.type !== 'select' && (
                <button className="primary-button" type="button" disabled={!canContinue} onClick={() => continueWith()}>
                  {questionIndex === questions.length - 1 ? 'Chat abschliessen' : t.ui.next}
                </button>
              )}
              {phase === 'ready' && (
                <button className="primary-button" type="button" onClick={showResults}>
                  {t.ui.showResults}
                </button>
              )}
              <button className="ghost-button" type="button" onClick={resetChat}>
                Neu starten
              </button>
            </div>
          )}
        </section>
      )}

      <button
        className="chat-launcher"
        type="button"
        aria-expanded={isOpen}
        aria-controls="guided-chat-heading"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span aria-hidden="true">?</span>
        <strong>{isOpen ? 'Chat minimieren' : 'Hilfe-Chat'}</strong>
      </button>
    </aside>
  );
}

function ChatBubble({ children, tone }: { children: ReactNode; tone: 'bot' | 'user' }) {
  return <div className={`chat-bubble chat-bubble-${tone}`}>{children}</div>;
}

interface QuestionReplyProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onChoose: (value: string) => void;
}

function QuestionReply({ question, value, onChange, onChoose }: QuestionReplyProps) {
  if (question.type === 'select') {
    return (
      <div className="chat-choice-list">
        {question.options?.map((option) => (
          <button
            className={value === option.value ? 'chat-choice active' : 'chat-choice'}
            key={option.value}
            type="button"
            onClick={() => onChoose(option.value)}
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
        className="chat-input"
        value={value}
        placeholder={question.placeholder}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      className="chat-input"
      min={question.type === 'number' ? '0' : undefined}
      type={question.type}
      inputMode={question.type === 'number' ? 'decimal' : undefined}
      value={value}
      placeholder={question.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function formatAnswer(question: Question, value = '') {
  if (question.type === 'select') {
    return question.options?.find((option) => option.value === value)?.label ?? value;
  }
  if (question.type === 'number' && value) return `${value} Euro`;
  return value || 'Keine Angabe';
}

function analyzeSituation(input: string): AnalysisResult {
  const normalized = normalizeText(input);
  const scores = Object.entries(categoryKeywords).map(([categoryId, keywords]) => ({
    categoryId: categoryId as CategoryId,
    score: keywords.reduce(
      (total, keyword) => (normalized.includes(normalizeText(keyword)) ? total + 1 : total),
      0,
    ),
  }));
  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const second = scores[1];
  const categoryId = top.score > 0 ? top.categoryId : 'debtCourt';
  const confidence = top.score >= 3 && top.score > second.score ? 'hoch' : top.score >= 1 ? 'mittel' : 'niedrig';
  const answers: Answers = {};
  const findings: string[] = [];

  answers.intakeSummary = input.trim();

  const city = extractCity(input);
  if (city) {
    answers.city = city;
    findings.push(`Ort erkannt: ${city}`);
  }

  const amount = extractAmount(input);
  if (amount) {
    answers.amount = amount;
    findings.push(`Betrag erkannt: ${amount} Euro`);
  }

  const date = extractDate(input);
  if (date) {
    answers.deadlineDate = date;
    answers.writtenDeadline = 'ja';
    findings.push(`Fristdatum erkannt: ${date}`);
  } else if (containsAny(normalized, ['frist', 'bis morgen', 'heute', 'kuendigung', 'kündigung', 'sperrandrohung', 'mahnbescheid'])) {
    answers.writtenDeadline = 'ja';
    findings.push('Schriftliche oder zeitkritische Frist wahrscheinlich');
  } else {
    answers.writtenDeadline = 'unklar';
  }

  if (containsAny(normalized, ['brief', 'schreiben', 'bescheid', 'mahnung', 'kuendigung', 'kündigung', 'mahnbescheid'])) {
    answers.officialLetter = 'ja';
    findings.push('Offizielles Schreiben wahrscheinlich');
  }

  if (containsAny(normalized, ['angerufen', 'geschrieben', 'email', 'e-mail', 'kontakt aufgenommen'])) {
    answers.contacted = 'ja';
  } else if (containsAny(normalized, ['keinen kontakt', 'nicht gemeldet', 'noch nicht'])) {
    answers.contacted = 'nein';
  }

  if (containsAny(normalized, ['buergergeld', 'bürgergeld', 'sozialhilfe', 'jobcenter'])) answers.benefits = 'ja';
  if (containsAny(normalized, ['kein einkommen', 'arbeitslos', 'ohne einkommen'])) answers.income = 'nein';
  if (containsAny(normalized, ['lohn', 'gehalt', 'rente'])) answers.income = 'regelmäßig';

  applyCategoryAnswers(categoryId, normalized, answers, findings);

  return { answers, categoryId, confidence, findings };
}

function applyCategoryAnswers(
  categoryId: CategoryId,
  normalized: string,
  answers: Answers,
  findings: string[],
) {
  if (categoryId === 'rent') {
    if (containsAny(normalized, ['fristlose kuendigung', 'fristlose kündigung', 'fristlos gekuendigt', 'fristlos gekündigt'])) {
      answers.immediateTermination = 'ja';
    }
    if (containsAny(normalized, ['kuendigung', 'kündigung', 'gekuendigt', 'gekündigt'])) answers.rentTerminated = 'ja';
    if (containsAny(normalized, ['raeumungsklage', 'räumungsklage', 'klage'])) answers.evictionClaim = 'ja';
    const months = normalized.match(/(\d+|eine|einer|ein|zwei|drei|vier|fuenf|fünf|sechs)\s*(monatsmieten|mieten|monate)/);
    if (months?.[1]) answers.openRentMonths = numberWordToDigit(months[1]);
    if (answers.rentTerminated === 'ja') findings.push('Kuendigung/Mietthema erkannt');
  }

  if (categoryId === 'energy') {
    if (containsAny(normalized, ['bereits gesperrt', 'abgestellt', 'durchgefuehrt', 'durchgeführt'])) answers.energyBlockStatus = 'durchgeführt';
    else if (containsAny(normalized, ['sperrandrohung', 'angedroht', 'sperre droht'])) answers.energyBlockStatus = 'angedroht';
    if (containsAny(normalized, ['kind', 'kinder'])) answers.children = 'ja';
    if (containsAny(normalized, ['krank', 'medizin', 'gesundheit'])) answers.healthReasons = 'ja';
  }

  if (categoryId === 'jobcenter') {
    if (containsAny(normalized, ['sanktion'])) answers.jobcenterIssue = 'Sanktion';
    else if (containsAny(normalized, ['rueckforderung', 'rückforderung'])) answers.jobcenterIssue = 'Rückforderung';
    else if (containsAny(normalized, ['weiterbewilligung'])) answers.jobcenterIssue = 'Weiterbewilligung';
    else if (containsAny(normalized, ['antrag'])) answers.jobcenterIssue = 'Erstantrag';
    if (containsAny(normalized, ['bescheid'])) answers.decisionAvailable = 'ja';
  }

  if (categoryId === 'garnishment') {
    if (containsAny(normalized, ['p-konto', 'pkonto'])) answers.pAccount = 'ja';
    if (containsAny(normalized, ['gepfaendet', 'gepfändet', 'pfaendung', 'pfändung', 'blockiert'])) answers.accountGarnished = 'ja';
    if (containsAny(normalized, ['pfändungs- und überweisungsbeschluss', 'pfaendungs- und ueberweisungsbeschluss', 'pfueb', 'pfüb'])) {
      answers.garnishmentOrder = 'ja';
    }
    if (containsAny(normalized, ['gehalt', 'lohn'])) answers.moneyOnAccount = 'Gehalt';
    if (containsAny(normalized, ['buergergeld', 'bürgergeld'])) answers.moneyOnAccount = 'Bürgergeld';
    if (containsAny(normalized, ['rente'])) answers.moneyOnAccount = 'Rente';
  }

  if (categoryId === 'health') {
    if (containsAny(normalized, ['gesetzlich'])) answers.insuranceType = 'gesetzlich';
    if (containsAny(normalized, ['privat'])) answers.insuranceType = 'privat';
    if (containsAny(normalized, ['mahnung', 'mahnungen'])) answers.healthWarnings = 'ja';
    if (containsAny(normalized, ['ruhen', 'leistung ruht', 'leistungen ruhen'])) answers.benefitsSuspendedThreat = 'ja';
  }

  if (categoryId === 'schufa') {
    if (containsAny(normalized, ['abgelehnt', 'kredit abgelehnt'])) answers.creditRejected = 'ja';
    if (containsAny(normalized, ['heute', 'morgen', 'sofort'])) answers.urgency = 'heute';
    if (containsAny(normalized, ['diese woche'])) answers.urgency = 'woche';
    if (containsAny(normalized, ['regelmaessig', 'regelmäßig', 'gehalt', 'lohn'])) answers.regularIncome = 'ja';
  }

  if (categoryId === 'debtCourt') {
    if (containsAny(normalized, ['mahnbescheid'])) answers.debtLetterType = 'mahnbescheid';
    else if (containsAny(normalized, ['vollstreckungsbescheid'])) answers.debtLetterType = 'vollstreckungsbescheid';
    else if (containsAny(normalized, ['inkasso'])) answers.debtLetterType = 'inkasso';
    if (containsAny(normalized, ['gelber brief', 'gelben brief'])) answers.courtYellowEnvelope = 'ja';
    if (containsAny(normalized, ['falsch', 'stimmt nicht', 'bestritten'])) answers.claimDisputed = 'ja';
  }

  if (categoryId === 'family') {
    if (containsAny(normalized, ['trennung'])) answers.familyEvent = 'Trennung';
    else if (containsAny(normalized, ['scheidung'])) answers.familyEvent = 'Scheidung';
    else if (containsAny(normalized, ['geburt'])) answers.familyEvent = 'Geburt';
    else if (containsAny(normalized, ['tod', 'gestorben'])) answers.familyEvent = 'Tod';
    if (containsAny(normalized, ['kind', 'kinder'])) answers.childrenAffected = 'ja';
    if (containsAny(normalized, ['wohnung', 'umzug', 'ausziehen'])) answers.livingSituationChanged = 'ja';
  }
}

function extractAmount(input: string) {
  const match = input.match(/(\d{1,3}(?:[.\s]\d{3})*(?:,\d{1,2})?|\d+)\s*(?:€|eur|euro)/i);
  if (!match?.[1]) return '';
  return match[1].replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
}

function extractCity(input: string) {
  const match = input.match(/\b(?:wohne|wohnhaft|lebe|bin)\s+(?:in|aus)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß -]{1,40})/);
  if (!match?.[1]) return '';
  return match[1].replace(/[,.!?].*$/, '').trim();
}

function extractDate(input: string) {
  const iso = input.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return iso[0];
  const german = input.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{2,4})\b/);
  if (!german) return '';
  const day = german[1].padStart(2, '0');
  const month = german[2].padStart(2, '0');
  const year = german[3].length === 2 ? `20${german[3]}` : german[3];
  return `${year}-${month}-${day}`;
}

function containsAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(normalizeText(needle)));
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/ß/g, 'ss');
}

function numberWordToDigit(value: string) {
  const normalized = normalizeText(value);
  const words: Record<string, string> = {
    ein: '1',
    eine: '1',
    einer: '1',
    zwei: '2',
    drei: '3',
    vier: '4',
    fuenf: '5',
    fünf: '5',
    sechs: '6',
  };
  return words[normalized] ?? normalized;
}
