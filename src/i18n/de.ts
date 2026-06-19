import type { Answers, Category, CategoryId, Question, ResultContent } from '../types';

const has = (answers: Answers, key: string, value: string) => answers[key] === value;
const filled = (answers: Answers, key: string) => Boolean(answers[key]?.trim());

const line = (value?: string, fallback = '[bitte ergänzen]') => value?.trim() || fallback;

const formatMoney = (value?: string) => {
  if (!value) return 'kein Betrag angegeben';
  const number = Number(value);
  if (Number.isNaN(number)) return `${value} Euro`;
  return `${number.toLocaleString('de-DE', { maximumFractionDigits: 2 })} Euro`;
};

const amountText = (answers: Answers) => {
  const value = answers.amount?.trim();
  return value ? `${value} Euro` : '[Betrag ergänzen]';
};

const deadlineText = (answers: Answers) => {
  if (filled(answers, 'deadlineDate')) return `Frist bis ${answers.deadlineDate}`;
  if (has(answers, 'writtenDeadline', 'ja')) return 'schriftliche Frist vorhanden, Datum bitte prüfen';
  return 'keine klare schriftliche Frist angegeben';
};

const templateDeadlineText = (answers: Answers) => {
  if (answers.deadlineDate) return answers.deadlineDate;
  if (answers.writtenDeadline === 'ja') return '[Datum der Frist ergänzen]';
  return '[falls vorhanden: Datum ergänzen]';
};

const senderBlock = (answers: Answers) => `Absenderin/Absender:
[Name]
[Adresse]
${answers.city ? answers.city : '[PLZ Ort]'}

`;

const closing = `Bitte bestätigen Sie mir den Eingang dieser Nachricht schriftlich.

Mit freundlichen Grüßen
[Name]`;

const commonHelp = (city?: string) => [
  `Schuldnerberatung${city ? ` in ${city}` : ''}`,
  `Sozialberatung${city ? ` in ${city}` : ''}`,
  'Verbraucherzentrale',
  'Fachanwaltliche Beratung, wenn schon Klage, Bescheid oder Frist läuft',
];

const commonAvoid = [
  'Briefe nicht ungeöffnet liegen lassen.',
  'Keine Raten zusagen, die du realistisch nicht halten kannst.',
  'Telefonate kurz schriftlich bestätigen, damit du einen Nachweis hast.',
  'Originale nicht aus der Hand geben, nur Kopien versenden.',
];

const sharedToday = [
  'Alle Schreiben fotografieren oder scannen und nach Datum sortieren.',
  'Heute eine kurze schriftliche Nachricht senden und um Bestätigung bitten.',
  'Unterlagen zu Einkommen, Konto, Miete und offenen Beträgen bereitlegen.',
];

const sharedTomorrow = [
  'Bei einer passenden Beratungsstelle einen Termin anfragen.',
  'Prüfen, ob Bürgergeld, Sozialhilfe, Wohngeld oder ein Darlehen infrage kommt.',
  'Eine realistische Zahlungs- oder Fristaufschubbitte vorbereiten.',
];

const installmentParagraph = (answers: Answers) =>
  `Ich bitte um eine realistische Ratenzahlung und schlage vor, den offenen Betrag von ${amountText(
    answers,
  )} in monatlichen Raten zu begleichen. Einen konkreten Vorschlag kann ich nach Prüfung meiner Einnahmen und Ausgaben kurzfristig nachreichen.`;

const extensionParagraph = (answers: Answers) =>
  `Ich bitte um Fristaufschub bis mindestens ${templateDeadlineText(
    answers,
  )}, damit ich Unterlagen sortieren, Beratung einholen und eine tragfähige Lösung vorschlagen kann.`;

const appointmentParagraph = (category: Category) =>
  `Ich bitte um einen kurzfristigen Beratungstermin. Es geht um ${category.title}. Ich möchte meine Unterlagen sortieren und die nächsten Schritte besprechen.`;

const categoryOpening: Record<CategoryId, string> = {
  rent:
    'ich melde mich wegen offener Mietzahlungen und möchte eine Lösung finden, damit die Wohnung gesichert bleibt.',
  energy:
    'ich melde mich wegen offener Energiekosten und einer drohenden oder bereits erfolgten Sperre.',
  jobcenter:
    'ich melde mich wegen einer Angelegenheit beim Jobcenter beziehungsweise Sozialamt.',
  health:
    'ich melde mich wegen Beitragsschulden und möchte eine Klärung meiner Krankenversicherung erreichen.',
  garnishment:
    'ich melde mich wegen einer Kontopfändung beziehungsweise wegen Schutz über ein P-Konto.',
  schufa:
    'ich melde mich wegen einer finanziellen Notlage und einer möglichen Schufa- oder Bonitätsproblematik.',
};

const recipientByCategory: Record<CategoryId, string> = {
  rent: 'Vermieter / Hausverwaltung',
  energy: 'Energieversorger',
  jobcenter: 'Jobcenter / Sozialamt',
  health: 'Krankenkasse',
  garnishment: 'Bank',
  schufa: 'Schuldnerberatung',
};

export const de = {
  languageName: 'Deutsch',
  disclaimer:
    'KlarKommen ersetzt keine Rechtsberatung. Die Hinweise helfen dir beim Sortieren deiner Lage. Bei Fristen, Kündigungen, Pfändungen oder Gerichtsbriefen solltest du möglichst schnell professionelle Hilfe holen.',
  ui: {
    back: 'Zurück',
    next: 'Weiter',
    print: 'Drucken',
    copied: 'Kopiert',
    copyText: 'Text kopieren',
    reset: 'Neue Situation prüfen',
    languageLabel: 'Sprache',
    heroEyebrow: 'Ruhig sortieren. Heute anfangen.',
    heroClaim:
      'Erste Orientierung, wenn Miete, Strom, Jobcenter, Krankenkasse, Konto oder Schufa gerade zu viel werden.',
    important: 'Wichtig:',
    helpPreviewEyebrow: 'Nicht allein bleiben',
    helpPreviewTitle: 'Wann du echte Hilfe suchen solltest',
    helpPreviewText:
      'Wenn Fristen, Gerichtspost, Sperren oder Pfändungen im Raum stehen, ist direkte Unterstützung wichtig. KlarKommen kann vorbereiten, ersetzt aber keine persönliche Beratung.',
    showAllHelp: 'Alle Hinweise ansehen',
    categoryStep: 'Schritt 1',
    categoryHeading: 'Welche Situation passt am ehesten?',
    questionStep: 'Schritt 2',
    questionHeading: 'Ein paar Angaben sortieren',
    progressLabel: (current: number, total: number) => `${current} / ${total}`,
    progressAria: (progress: number) => `Fortschritt ${progress} Prozent`,
    showResults: 'Ergebnis anzeigen',
    resultStep: 'Schritt 3 · Ergebnis',
    resultHeading: 'Deine Situation ist sortiert.',
    resultIntro:
      'Das ist keine rechtliche Bewertung. Es ist eine ruhige Arbeitsliste, damit du heute anfangen kannst.',
    copyAll: 'Alle Ergebnisse kopieren',
    situationTitle: 'Lage kurz sortiert',
    todayTitle: 'Was du heute tun solltest',
    tomorrowTitle: 'Was du morgen tun solltest',
    helpTitle: 'Diese Stellen könnten helfen',
    avoidTitle: 'Fehler, die du vermeiden solltest',
    templatesEyebrow: 'Vorlagen',
    templatesTitle: 'Passende Texte',
    resultExportTitle: (categoryTitle: string) => `KlarKommen Ergebnis - ${categoryTitle}`,
    templatesExportTitle: 'Textvorlagen:',
    footerNavAria: 'Rechtliches und Hilfe',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    realHelp: 'Wann echte Hilfe suchen?',
    localDataNotice:
      'Alle Angaben bleiben in diesem Browser. Es gibt kein Backend und keine Anmeldung.',
    backToStart: 'Zurück zur Startseite',
    legalEyebrow: 'Rechtliches',
    imprintDetails: 'Angaben gemäß § 5 TMG',
    contact: 'Kontakt',
    note: 'Hinweis',
    privacyTitle: 'Datenschutzerklärung',
    privacyLead:
      'Diese Erklärung beschreibt, wie KlarKommen mit Daten umgeht. Die App ist bewusst ohne Anmeldung, Backend und Server-Speicherung personenbezogener Situationsdaten gebaut.',
    realHelpEyebrow: 'Wichtig',
    realHelpTitle: 'Wann du echte Hilfe suchen solltest',
    realHelpLead:
      'KlarKommen kann sortieren und vorbereiten. In manchen Situationen solltest du aber nicht allein weitermachen, sondern direkt eine Beratungsstelle, Behörde, Anwältin oder einen Anwalt kontaktieren.',
    realHelpSignalsTitle: 'Suche schnell Unterstützung, wenn...',
    urgentContactsTitle: 'Mögliche nächste Kontakte',
  },
  categories: [
    {
      id: 'rent',
      title: 'Mietschulden / Kündigung',
      shortTitle: 'Miete',
      description: 'Offene Miete, Mahnung, Kündigung oder drohende Räumung sortieren.',
      primaryContact: 'Vermieter oder Hausverwaltung',
    },
    {
      id: 'energy',
      title: 'Stromsperre / Energieschulden',
      shortTitle: 'Energie',
      description: 'Drohende oder bereits durchgeführte Sperre, Abschläge und Ratenzahlung planen.',
      primaryContact: 'Energieversorger',
    },
    {
      id: 'jobcenter',
      title: 'Bürgergeld / Jobcenter',
      shortTitle: 'Jobcenter',
      description: 'Antrag, Weiterbewilligung, Sanktion, Rückforderung oder Bescheid einordnen.',
      primaryContact: 'Jobcenter oder Sozialamt',
    },
    {
      id: 'health',
      title: 'Krankenkasse / Beitragsschulden',
      shortTitle: 'Krankenkasse',
      description:
        'Mahnungen, Beitragsrückstände und mögliches Ruhen von Leistungen strukturieren.',
      primaryContact: 'Krankenkasse',
    },
    {
      id: 'garnishment',
      title: 'Pfändung / P-Konto',
      shortTitle: 'P-Konto',
      description:
        'Kontopfändung, Freibetrag, P-Konto und existenzsichernde Zahlungen sortieren.',
      primaryContact: 'Bank',
    },
    {
      id: 'schufa',
      title: 'Schufa / Kredit abgelehnt',
      shortTitle: 'Schufa',
      description: 'Ablehnung, Dringlichkeit, Alternativen und Beratungsbedarf abwägen.',
      primaryContact: 'Schuldnerberatung',
    },
  ] as Category[],
  commonQuestions: [
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
      text: 'Bis wann läuft die Frist?',
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
  ] as Question[],
  categoryQuestions: {
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
        placeholder: 'z. B. Mietrückstand, Strom, Auto, Umzug',
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
        text: 'Hast du regelmäßiges Einkommen?',
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
  } as Record<CategoryId, Question[]>,
  legal: {
    realHelpSignals: [
      'Du hast eine Räumungsklage, einen Gerichtstermin oder Post vom Gericht bekommen.',
      'Strom, Gas oder Wasser sind bereits gesperrt oder die Sperre steht unmittelbar bevor.',
      'Dein Konto ist gepfändet und du kommst nicht an Geld für Miete, Essen oder Medikamente.',
      'Du hast einen Bescheid mit laufender Widerspruchsfrist erhalten und bist unsicher, was er bedeutet.',
      'Krankenversicherungsschutz, Behandlung oder wichtige Medikamente sind akut gefährdet.',
      'Du fühlst dich überfordert, bedroht oder nicht mehr sicher.',
    ],
    urgentContacts: [
      'Bei akuter Gefahr: Notruf 112 oder Polizei 110.',
      'Bei gerichtlichen Schreiben: sofort Beratungsstelle, Anwältin oder Anwalt kontaktieren.',
      'Bei Miet- oder Energieschulden: Sozialamt, Jobcenter oder Schuldnerberatung in deiner Stadt anfragen.',
      'Bei Kontopfändung: Bank und Schuldnerberatung wegen P-Konto und Freibeträgen kontaktieren.',
    ],
    privacySections: [
      {
        title: 'Kurzfassung',
        text: 'KlarKommen verarbeitet deine Eingaben nur lokal in deinem Browser. Es gibt kein Backend, keine Anmeldung und keine Datenbank für deine Angaben.',
      },
      {
        title: 'Verantwortlicher',
        text: 'Alexander Kluth, Kaistraße 2, 40221 Düsseldorf, Deutschland. E-Mail: alex@denkwerk-kluth.de',
      },
      {
        title: 'Welche Daten werden verarbeitet?',
        text: 'Die App fragt nach Angaben zu deiner Situation, zum Beispiel Kategorie, Fristen, Beträgen oder Kontaktstand. Diese Angaben werden nur genutzt, um lokal im Browser Hinweise und Textvorlagen zu erzeugen.',
      },
      {
        title: 'Keine Server-Speicherung',
        text: 'Die eingegebenen Situationsdaten werden nicht an einen KlarKommen-Server übertragen und nicht serverseitig gespeichert. Beim Neuladen oder Zurücksetzen der App können Eingaben verloren gehen.',
      },
      {
        title: 'Hosting und technische Zugriffe',
        text: 'Die Website wird über Cloudflare bereitgestellt. Beim Aufruf der Seite können technisch notwendige Zugriffsdaten wie IP-Adresse, Zeitpunkt des Abrufs, Browserinformationen und angefragte Dateien verarbeitet werden, damit die Website ausgeliefert und geschützt werden kann.',
      },
      {
        title: 'Kontaktaufnahme',
        text: 'Wenn du per E-Mail oder Telefon Kontakt aufnimmst, werden die von dir übermittelten Angaben zur Bearbeitung der Anfrage verwendet.',
      },
      {
        title: 'Deine Rechte',
        text: 'Du kannst im Rahmen der gesetzlichen Vorgaben Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Widerspruch verlangen. Außerdem kannst du dich bei einer Datenschutzaufsichtsbehörde beschweren.',
      },
    ],
  },
  buildRecommendations(categoryId: CategoryId, answers: Answers): ResultContent {
    const city = answers.city;
    const amount = formatMoney(answers.amount);
    const deadline = deadlineText(answers);

    switch (categoryId) {
      case 'rent':
        return {
          situation: [
            `Es geht um Mietschulden in Höhe von ${amount}.`,
            `Zur Frist: ${deadline}.`,
            has(answers, 'rentTerminated', 'ja')
              ? 'Eine Kündigung wurde bereits ausgesprochen. Das ist zeitkritisch.'
              : 'Eine Kündigung ist noch nicht eindeutig ausgesprochen oder nur angedroht.',
            has(answers, 'evictionClaim', 'ja')
              ? 'Eine Räumungsklage ist ein starkes Warnsignal. Hole dir sofort Beratung.'
              : 'Eine Räumungsklage wurde nicht angegeben.',
          ],
          today: [
            ...sharedToday,
            'Vermieter oder Hausverwaltung schriftlich um Ratenzahlung oder Fristaufschub bitten.',
            'Beim Jobcenter oder Sozialamt nach einer Übernahme der Mietschulden als Darlehen fragen.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Mieterverein, Wohnungsnotfallhilfe oder Sozialberatung kontaktieren.',
            'Falls eine Klage vorliegt: Fristen aus dem Gerichtsschreiben sofort prüfen lassen.',
          ],
          help: [
            ...commonHelp(city),
            'Mieterverein',
            'Wohnungsnotfallhilfe der Stadt oder Kommune',
            'Jobcenter oder Sozialamt wegen möglicher Mietschulden-Übernahme',
          ],
          avoid: [
            ...commonAvoid,
            'Nicht ausziehen oder Schlüssel abgeben, ohne die Folgen beraten zu lassen.',
            'Keine mündlichen Absprachen ohne schriftliche Bestätigung verlassen.',
          ],
        };
      case 'energy':
        return {
          situation: [
            `Es geht um Energieschulden in Höhe von ${amount}.`,
            `Zur Frist: ${deadline}.`,
            has(answers, 'energyBlockStatus', 'durchgeführt')
              ? 'Die Sperre wurde bereits durchgeführt. Jetzt geht es um schnelle Wiederherstellung.'
              : 'Die Sperre ist angedroht oder noch unklar. Jetzt zählt schnelle schriftliche Reaktion.',
            has(answers, 'children', 'ja') || has(answers, 'healthReasons', 'ja')
              ? 'Kinder oder gesundheitliche Gründe können für die Abwendung einer Sperre wichtig sein.'
              : 'Besondere Haushalts- oder Gesundheitsgründe wurden nicht angegeben.',
          ],
          today: [
            ...sharedToday,
            'Energieversorger schriftlich um Sperraussetzung, Ratenzahlung und aktuelle Forderungsaufstellung bitten.',
            'Falls Kinder oder medizinische Geräte betroffen sind: diese Umstände sofort nennen und Nachweise vorbereiten.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Jobcenter oder Sozialamt nach Darlehen für Energieschulden fragen.',
            'Verbraucherzentrale oder Energieschuldenberatung kontaktieren.',
          ],
          help: [
            ...commonHelp(city),
            'Energieversorger-Sperrhotline',
            'Jobcenter oder Sozialamt',
            'Verbraucherzentrale Energieberatung',
          ],
          avoid: [
            ...commonAvoid,
            'Zähler oder Anschlüsse nicht selbst manipulieren.',
            'Keine neue Abschlagshöhe akzeptieren, die sofort wieder zu Rückständen führt.',
          ],
        };
      case 'jobcenter':
        return {
          situation: [
            `Thema: ${answers.jobcenterIssue || 'nicht angegeben'}.`,
            `Zur Frist: ${deadline}.`,
            has(answers, 'decisionAvailable', 'ja')
              ? 'Ein Bescheid liegt vor. Datum und Rechtsbehelfsbelehrung sind wichtig.'
              : 'Es liegt kein Bescheid vor. Dann ist eine schriftliche Sachstandsfrage sinnvoll.',
            has(answers, 'objectionDeadline', 'abgelaufen')
              ? 'Die Widerspruchsfrist könnte abgelaufen sein. Trotzdem gibt es mögliche Prüfwege.'
              : 'Die Widerspruchsfrist sollte genau geprüft werden.',
          ],
          today: [
            ...sharedToday,
            'Bescheid, Antrag oder Forderung nach Datum sortieren.',
            'Jobcenter schriftlich um Sachstand, Fristaufschub oder Überprüfung bitten.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Sozialberatung, Erwerbslosenberatung oder anwaltliche Beratung mit Beratungshilfeschein prüfen.',
            'Wenn Geld zum Leben fehlt: Eilantrag oder Vorschuss beim Jobcenter ansprechen.',
          ],
          help: [
            ...commonHelp(city),
            'Erwerbslosenberatung',
            'Sozialgerichtliche Rechtsantragsstelle bei sehr dringenden Fällen',
            'Jobcenter-Eingangszone mit schriftlicher Eingangsbestätigung',
          ],
          avoid: [
            ...commonAvoid,
            'Fristen nicht verstreichen lassen, ohne schriftlich zu reagieren.',
            'Unterlagen nicht ohne Kopie oder Eingangsbestätigung abgeben.',
          ],
        };
      case 'health':
        return {
          situation: [
            `Versicherung: ${answers.insuranceType || 'nicht angegeben'}.`,
            `Offener Betrag: ${amount}.`,
            has(answers, 'benefitsSuspendedThreat', 'ja')
              ? 'Das Ruhen von Leistungen wurde angedroht. Das sollte schnell geklärt werden.'
              : 'Ein Ruhen von Leistungen wurde nicht eindeutig angegeben.',
            filled(answers, 'healthIncomeDetails')
              ? `Aktuelle Einkünfte: ${answers.healthIncomeDetails}.`
              : 'Aktuelle Einkünfte wurden noch nicht beschrieben.',
          ],
          today: [
            ...sharedToday,
            'Krankenkasse schriftlich um Forderungsaufstellung und Ratenzahlung bitten.',
            'Bei niedrigem Einkommen Nachweise zusammenstellen und Beitragsprüfung verlangen.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Beratungsstelle oder unabhängige Patientenberatung kontaktieren.',
            'Bei akuter Behandlung klären, welche Leistungen trotz Schulden abgesichert sind.',
          ],
          help: [
            ...commonHelp(city),
            'Krankenkasse Beitragsabteilung',
            'Unabhängige Patientenberatung',
            'Sozialamt oder Jobcenter bei fehlendem Einkommen',
          ],
          avoid: [
            ...commonAvoid,
            'Krankenversicherung nicht einfach kündigen oder ignorieren.',
            'Arzttermine bei akuten Beschwerden nicht aus Angst vor Schulden aufschieben.',
          ],
        };
      case 'garnishment':
        return {
          situation: [
            has(answers, 'accountGarnished', 'ja')
              ? 'Das Konto ist gepfändet. Zugang zu geschütztem Geld muss schnell gesichert werden.'
              : 'Eine Kontopfändung ist nicht eindeutig aktiv oder nur angekündigt.',
            has(answers, 'pAccount', 'ja')
              ? 'Ein P-Konto ist vorhanden.'
              : 'Ein P-Konto ist noch nicht sicher eingerichtet.',
            `Auf das Konto geht: ${answers.moneyOnAccount || 'nicht angegeben'}.`,
            `Zur Frist: ${deadline}.`,
          ],
          today: [
            ...sharedToday,
            'Bank schriftlich um Umwandlung in ein P-Konto oder Bestätigung des P-Kontos bitten.',
            'Bescheinigungen für erhöhte Freibeträge prüfen, besonders bei Kindern oder Sozialleistungen.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Schuldnerberatung wegen P-Konto-Bescheinigung und Gläubigerkontakt fragen.',
            'Beim Vollstreckungsgericht nach Schutzanträgen fragen, falls Geld blockiert bleibt.',
          ],
          help: [
            ...commonHelp(city),
            'Bankfiliale oder Kontoservice',
            'Anerkannte Schuldnerberatung',
            'Vollstreckungsgericht',
          ],
          avoid: [
            ...commonAvoid,
            'Nicht mehrere P-Konten einrichten.',
            'Geldeingänge nicht ungeklärt auf ein gepfändetes Konto laufen lassen, wenn kein Schutz besteht.',
          ],
        };
      case 'schufa':
        return {
          situation: [
            has(answers, 'creditRejected', 'ja') || has(answers, 'creditRejected', 'vermutlich')
              ? 'Ein Kredit wurde wahrscheinlich wegen Bonität oder Schufa abgelehnt.'
              : 'Eine konkrete Schufa-Ablehnung wurde nicht angegeben.',
            `Dringlichkeit: ${answers.urgency || 'nicht angegeben'}.`,
            filled(answers, 'moneyPurpose')
              ? `Geldbedarf: ${answers.moneyPurpose}.`
              : 'Der Zweck des Geldbedarfs wurde noch nicht beschrieben.',
            has(answers, 'acuteDeadline', 'ja')
              ? 'Es gibt eine akute Frist. Priorität hat die direkte Lösung des Grundproblems.'
              : 'Eine akute Frist wurde nicht eindeutig angegeben.',
          ],
          today: [
            ...sharedToday,
            'Beim eigentlichen Gläubiger oder Vertragspartner um Fristaufschub oder Ratenzahlung bitten.',
            'Keine teuren Sofortkredite abschließen, bevor Alternativen geprüft sind.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Kostenlose Datenkopie bei Auskunfteien prüfen und falsche Einträge reklamieren.',
            'Schuldnerberatung nach sicheren Alternativen zu neuen Krediten fragen.',
          ],
          help: [
            ...commonHelp(city),
            'Schuldnerberatung',
            'Verbraucherzentrale',
            'Direkter Vertragspartner, bei dem die Frist läuft',
          ],
          avoid: [
            ...commonAvoid,
            'Keine Vorkosten für angeblich sichere Kredite zahlen.',
            'Neue Schulden nicht aufnehmen, wenn damit nur alte Fristen kurzfristig verdeckt werden.',
          ],
        };
    }
  },
  buildAllTemplates(category: Category, answers: Answers) {
    const subject = `Bitte um Klärung und Unterstützung - ${category.shortTitle}`;
    const baseContext = `Ort: ${line(answers.city)}
Offener Betrag: ${amountText(answers)}
Frist: ${templateDeadlineText(answers)}
Kontakt wurde bereits aufgenommen: ${line(answers.contacted, 'nicht angegeben')}`;

    const mainTemplate = `${senderBlock(answers)}An:
${recipientByCategory[category.id]}

Betreff: ${subject}

Sehr geehrte Damen und Herren,

${categoryOpening[category.id]}

Aktuell geht es nach meiner Übersicht um einen offenen Betrag von ${amountText(answers)}. ${
      answers.writtenDeadline === 'ja'
        ? `Mir liegt eine schriftliche Frist bis ${templateDeadlineText(answers)} vor.`
        : 'Eine eindeutige schriftliche Frist liegt mir derzeit nicht vor oder ist mir unklar.'
    }

${installmentParagraph(answers)}

${extensionParagraph(answers)}

${closing}`;

    return [
      {
        label: 'Hauptvorlage',
        text: mainTemplate,
      },
      {
        label: 'Bitte um Ratenzahlung',
        text: `${senderBlock(answers)}Betreff: Bitte um Ratenzahlung

Sehr geehrte Damen und Herren,

${installmentParagraph(answers)}

Hintergrund:
${baseContext}

${closing}`,
      },
      {
        label: 'Bitte um Fristaufschub',
        text: `${senderBlock(answers)}Betreff: Bitte um Fristaufschub

Sehr geehrte Damen und Herren,

${extensionParagraph(answers)}

Hintergrund:
${baseContext}

${closing}`,
      },
      {
        label: 'Bitte um Beratungstermin',
        text: `${senderBlock(answers)}Betreff: Bitte um kurzfristigen Beratungstermin

Sehr geehrte Damen und Herren,

${appointmentParagraph(category)}

Hintergrund:
${baseContext}

${closing}`,
      },
    ];
  },
};
