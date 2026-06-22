import type { CategoryId, Question } from '../types';

export const commonQuestions: Question[] = [
  {
    id: 'city',
    text: 'In welcher Stadt wohnst du?',
    type: 'text',
    placeholder: 'z. B. Leipzig',
    required: true,
  },
  {
    id: 'writtenDeadline',
    text: 'Gibt es eine schriftliche Frist?',
    type: 'select',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' },
      { value: 'unklar', label: 'Unklar' },
    ],
    required: true,
  },
  {
    id: 'deadlineDate',
    text: 'Bis wann lauft die Frist?',
    help: 'Falls du kein Datum hast, lass das Feld leer.',
    type: 'date',
  },
  {
    id: 'amount',
    text: 'Wie hoch ist der offene Betrag?',
    type: 'number',
    placeholder: 'Betrag in Euro',
  },
  {
    id: 'income',
    text: 'Hast du Einkommen?',
    type: 'select',
    options: [
      { value: 'regelmäßig', label: 'Ja, regelmäßig' },
      { value: 'unregelmäßig', label: 'Ja, unregelmäßig' },
      { value: 'nein', label: 'Nein' },
    ],
  },
  {
    id: 'benefits',
    text: 'Beziehst du Bürgergeld oder Sozialhilfe?',
    type: 'select',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' },
      { value: 'beantragt', label: 'Beantragt' },
      { value: 'unklar', label: 'Unklar' },
    ],
  },
  {
    id: 'officialLetter',
    text: 'Gibt es ein offizielles Schreiben?',
    type: 'select',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' },
      { value: 'unklar', label: 'Unklar' },
    ],
  },
  {
    id: 'contacted',
    text: 'Hast du schon Kontakt aufgenommen?',
    type: 'select',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' },
      { value: 'versucht', label: 'Versucht, aber keine Antwort' },
    ],
  },
];

export const categoryQuestions: Record<CategoryId, Question[]> = {
  rent: [
    {
      id: 'rentTerminated',
      category: 'rent',
      text: 'Wurde bereits gekündigt?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'angedroht', label: 'Nur angedroht' },
      ],
    },
    {
      id: 'immediateTermination',
      category: 'rent',
      text: 'Geht es um eine fristlose Kündigung?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'evictionClaim',
      category: 'rent',
      text: 'Gibt es bereits eine Räumungsklage?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'openRentMonths',
      category: 'rent',
      text: 'Wie viele Monatsmieten sind offen?',
      type: 'number',
      placeholder: 'z. B. 2',
    },
    {
      id: 'landlordInstallments',
      category: 'rent',
      text: 'Ist der Vermieter zu Ratenzahlung bereit?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Noch nicht geklärt' },
      ],
    },
  ],
  energy: [
    {
      id: 'energyBlockStatus',
      category: 'energy',
      text: 'Ist die Sperre angedroht oder bereits durchgeführt?',
      type: 'select',
      options: [
        { value: 'angedroht', label: 'Angedroht' },
        { value: 'durchgeführt', label: 'Bereits durchgeführt' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'children',
      category: 'energy',
      text: 'Leben minderjährige Kinder im Haushalt?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'healthReasons',
      category: 'energy',
      text: 'Gibt es gesundheitliche Gründe, die gegen eine Sperre sprechen?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'energyInstallmentsOffered',
      category: 'energy',
      text: 'Wurde schon eine Ratenzahlung angeboten?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'abgelehnt', label: 'Ja, aber abgelehnt' },
      ],
    },
  ],
  jobcenter: [
    {
      id: 'jobcenterIssue',
      category: 'jobcenter',
      text: 'Worum geht es?',
      type: 'select',
      options: [
        { value: 'Erstantrag', label: 'Erstantrag' },
        { value: 'Weiterbewilligung', label: 'Weiterbewilligung' },
        { value: 'Sanktion', label: 'Sanktion' },
        { value: 'Rückforderung', label: 'Rückforderung' },
      ],
    },
    {
      id: 'decisionAvailable',
      category: 'jobcenter',
      text: 'Ist ein Bescheid vorhanden?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'decisionDate',
      category: 'jobcenter',
      text: 'Wann kam der Bescheid?',
      type: 'date',
    },
    {
      id: 'objectionDeadline',
      category: 'jobcenter',
      text: 'Kennst du die Widerspruchsfrist?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'abgelaufen', label: 'Vermutlich abgelaufen' },
      ],
    },
  ],
  health: [
    {
      id: 'insuranceType',
      category: 'health',
      text: 'Bist du gesetzlich oder privat versichert?',
      type: 'select',
      options: [
        { value: 'gesetzlich', label: 'Gesetzlich' },
        { value: 'privat', label: 'Privat' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'healthWarnings',
      category: 'health',
      text: 'Gab es Mahnungen?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'benefitsSuspendedThreat',
      category: 'health',
      text: 'Wurde das Ruhen der Leistungen angedroht?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'healthIncomeDetails',
      category: 'health',
      text: 'Welche Einkünfte hast du aktuell?',
      type: 'textarea',
      placeholder: 'z. B. Lohn, Bürgergeld, selbstständig, kein Einkommen',
    },
  ],
  garnishment: [
    {
      id: 'pAccount',
      category: 'garnishment',
      text: 'Hast du bereits ein P-Konto?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'beantragt', label: 'Beantragt' },
      ],
    },
    {
      id: 'accountGarnished',
      category: 'garnishment',
      text: 'Ist dein Konto gepfändet?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'angekündigt', label: 'Angekündigt' },
      ],
    },
    {
      id: 'garnishmentOrder',
      category: 'garnishment',
      text: 'Liegt ein Pfändungs- und Überweisungsbeschluss vor?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'moneyOnAccount',
      category: 'garnishment',
      text: 'Geht Gehalt, Bürgergeld oder Rente auf dieses Konto?',
      type: 'select',
      options: [
        { value: 'Gehalt', label: 'Gehalt' },
        { value: 'Bürgergeld', label: 'Bürgergeld' },
        { value: 'Rente', label: 'Rente' },
        { value: 'Mehreres', label: 'Mehreres' },
        { value: 'nein', label: 'Nein' },
      ],
    },
  ],
  schufa: [
    {
      id: 'moneyPurpose',
      category: 'schufa',
      text: 'Wofür wird Geld gebraucht?',
      type: 'textarea',
      placeholder: 'z. B. Mietruckstand, Strom, Auto, Umzug',
    },
    {
      id: 'urgency',
      category: 'schufa',
      text: 'Wie dringend ist es?',
      type: 'select',
      options: [
        { value: 'heute', label: 'Heute oder morgen' },
        { value: 'woche', label: 'Diese Woche' },
        { value: 'monat', label: 'Diesen Monat' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'regularIncome',
      category: 'schufa',
      text: 'Hast du regelmassiges Einkommen?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unregelmäßig', label: 'Unregelmäßig' },
      ],
    },
    {
      id: 'creditRejected',
      category: 'schufa',
      text: 'Wurde ein Kredit wegen Schufa abgelehnt?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'vermutlich', label: 'Vermutlich' },
      ],
    },
    {
      id: 'acuteDeadline',
      category: 'schufa',
      text: 'Gibt es eine akute Frist?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
  ],
  family: [
    {
      id: 'familyEvent',
      category: 'family',
      text: 'Worum geht es gerade?',
      type: 'select',
      options: [
        { value: 'tod', label: 'Tod / Trauerfall' },
        { value: 'geburt', label: 'Geburt / Schwangerschaft' },
        { value: 'trennung', label: 'Trennung' },
        { value: 'scheidung', label: 'Scheidung' },
        { value: 'elternschaft', label: 'Elternschaft / Sorge' },
        { value: 'mehreres', label: 'Mehreres gleichzeitig' },
      ],
    },
    {
      id: 'childrenAffected',
      category: 'family',
      text: 'Sind Kinder direkt betroffen?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'livingSituationChanged',
      category: 'family',
      text: 'Hat sich die Wohnsituation verändert oder steht das bevor?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'bald', label: 'Vermutlich bald' },
      ],
    },
    {
      id: 'documentsNeeded',
      category: 'family',
      text: 'Gibt es Dokumente, die du besorgen oder ändern musst?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'nein', label: 'Nein' },
        { value: 'unklar', label: 'Unklar' },
      ],
    },
    {
      id: 'supportNetwork',
      category: 'family',
      text: 'Hast du gerade verlässliche Unterstützung?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Ja' },
        { value: 'teilweise', label: 'Teilweise' },
        { value: 'nein', label: 'Nein' },
      ],
    },
    {
      id: 'familyNotes',
      category: 'family',
      text: 'Was muss unbedingt mitgedacht werden?',
      type: 'textarea',
      placeholder: 'z. B. Termine, Kinderbetreuung, Erbe, Unterhalt, Wohnung, Sorge- oder Umgangsfragen',
    },
  ],
};
