import type { Answers, CategoryId, ResultContent } from '../types';

const has = (answers: Answers, key: string, value: string) => answers[key] === value;
const filled = (answers: Answers, key: string) => Boolean(answers[key]?.trim());

const formatMoney = (value?: string) => {
  if (!value) return 'kein Betrag angegeben';
  const number = Number(value);
  if (Number.isNaN(number)) return `${value} Euro`;
  return `${number.toLocaleString('de-DE', { maximumFractionDigits: 2 })} Euro`;
};

const deadlineText = (answers: Answers) => {
  if (filled(answers, 'deadlineDate')) return `Frist bis ${answers.deadlineDate}`;
  if (has(answers, 'writtenDeadline', 'ja')) return 'schriftliche Frist vorhanden, Datum bitte prüfen';
  return 'keine klare schriftliche Frist angegeben';
};

const commonHelp = (city?: string) => [
  `Schuldnerberatung${city ? ` in ${city}` : ''}`,
  `Sozialberatung${city ? ` in ${city}` : ''}`,
  'Verbraucherzentrale',
  'Fachanwaltliche Beratung, wenn schon Klage, Bescheid oder Frist lauft',
];

const commonAvoid = [
  'Briefe nicht ungeoffnet liegen lassen.',
  'Keine Raten zusagen, die du realistisch nicht halten kannst.',
  'Telefonate kurz schriftlich bestatigen, damit du einen Nachweis hast.',
  'Originale nicht aus der Hand geben, nur Kopien versenden.',
];

export function buildRecommendations(categoryId: CategoryId, answers: Answers): ResultContent {
  const city = answers.city;
  const amount = formatMoney(answers.amount);
  const deadline = deadlineText(answers);

  const sharedToday = [
    'Alle Schreiben fotografieren oder scannen und nach Datum sortieren.',
    'Heute eine kurze schriftliche Nachricht senden und um Bestätigung bitten.',
    'Unterlagen zu Einkommen, Konto, Miete und offenen Betragen bereitlegen.',
  ];

  const sharedTomorrow = [
    'Bei einer passenden Beratungsstelle einen Termin anfragen.',
    'Prüfen, ob Bürgergeld, Sozialhilfe, Wohngeld oder ein Darlehen infrage kommt.',
    'Eine realistische Zahlungs- oder Fristaufschubbitte vorbereiten.',
  ];

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
          'Falls eine Klage vorliegt: Fristen aus dem Gerichtsschreiben sofort prufen lassen.',
        ],
        help: [
          ...commonHelp(city),
          'Mieterverein',
          'Wohnungsnotfallhilfe der Stadt oder Kommune',
          'Jobcenter oder Sozialamt wegen möglicher Mietschulden-Übernahme',
        ],
        avoid: [
          ...commonAvoid,
          'Nicht ausziehen oder Schlussel abgeben, ohne die Folgen beraten zu lassen.',
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
          'Falls Kinder oder medizinische Gerate betroffen sind: diese Umstande sofort nennen und Nachweise vorbereiten.',
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
          'Zahler oder Anschlusse nicht selbst manipulieren.',
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
          'Sozialberatung, Erwerbslosenberatung oder Anwaltliche Beratung mit Beratungshilfeschein prufen.',
          'Wenn Geld zum Leben fehlt: Eilantrag oder Vorschuss beim Jobcenter ansprechen.',
        ],
        help: [
          ...commonHelp(city),
          'Erwerbslosenberatung',
          'Sozialgerichtliche Rechtsantragsstelle bei sehr dringenden Fallen',
          'Jobcenter-Eingangszone mit schriftlicher Eingangsbestatigung',
        ],
        avoid: [
          ...commonAvoid,
          'Fristen nicht verstreichen lassen, ohne schriftlich zu reagieren.',
          'Unterlagen nicht ohne Kopie oder Eingangsbestatigung abgeben.',
        ],
      };
    case 'health':
      return {
        situation: [
          `Versicherung: ${answers.insuranceType || 'nicht angegeben'}.`,
          `Offener Betrag: ${amount}.`,
          has(answers, 'benefitsSuspendedThreat', 'ja')
            ? 'Das Ruhen von Leistungen wurde angedroht. Das sollte schnell geklart werden.'
            : 'Ein Ruhen von Leistungen wurde nicht eindeutig angegeben.',
          filled(answers, 'healthIncomeDetails')
            ? `Aktuelle Einkünfte: ${answers.healthIncomeDetails}.`
            : 'Aktuelle Einkünfte wurden noch nicht beschrieben.',
        ],
        today: [
          ...sharedToday,
          'Krankenkasse schriftlich um Forderungsaufstellung und Ratenzahlung bitten.',
          'Bei niedrigem Einkommen Nachweise zusammenstellen und Beitragsprufung verlangen.',
        ],
        tomorrow: [
          ...sharedTomorrow,
          'Beratungsstelle oder unabhangige Patientenberatung kontaktieren.',
          'Bei akuter Behandlung klaren, welche Leistungen trotz Schulden abgesichert sind.',
        ],
        help: [
          ...commonHelp(city),
          'Krankenkasse Beitragsabteilung',
          'Unabhangige Patientenberatung',
          'Sozialamt oder Jobcenter bei fehlendem Einkommen',
        ],
        avoid: [
          ...commonAvoid,
          'Krankenversicherung nicht einfach kundigen oder ignorieren.',
          'Arzttermine bei akuten Beschwerden nicht aus Angst vor Schulden aufschieben.',
        ],
      };
    case 'garnishment':
      return {
        situation: [
          has(answers, 'accountGarnished', 'ja')
            ? 'Das Konto ist gepfandet. Zugang zu geschutztem Geld muss schnell gesichert werden.'
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
          'Schuldnerberatung wegen P-Konto-Bescheinigung und Glaubigerkontakt fragen.',
          'Beim Vollstreckungsgericht nach Schutzantragen fragen, falls Geld blockiert bleibt.',
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
            ? 'Ein Kredit wurde wahrscheinlich wegen Bonitat oder Schufa abgelehnt.'
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
          'Beim eigentlichen Glaubiger oder Vertragspartner um Fristaufschub oder Ratenzahlung bitten.',
          'Keine teuren Sofortkredite abschließen, bevor Alternativen geprüft sind.',
        ],
        tomorrow: [
          ...sharedTomorrow,
          'Kostenlose Datenkopie bei Auskunfteien prufen und falsche Eintrage reklamieren.',
          'Schuldnerberatung nach sicheren Alternativen zu neuen Krediten fragen.',
        ],
        help: [
          ...commonHelp(city),
          'Schuldnerberatung',
          'Verbraucherzentrale',
          'Direkter Vertragspartner, bei dem die Frist lauft',
        ],
        avoid: [
          ...commonAvoid,
          'Keine Vorkosten für angeblich sichere Kredite zahlen.',
          'Neue Schulden nicht aufnehmen, wenn damit nur alte Fristen kurzfristig verdeckt werden.',
        ],
      };
    case 'debtCourt':
      return {
        situation: [
          `Art des Schreibens: ${answers.debtLetterType || 'nicht angegeben'}.`,
          `Offener Betrag: ${amount}.`,
          `Zur Frist: ${deadline}.`,
          has(answers, 'debtLetterType', 'mahnbescheid') ||
          has(answers, 'debtLetterType', 'vollstreckungsbescheid') ||
          has(answers, 'courtYellowEnvelope', 'ja')
            ? 'Gerichtspost oder ein gerichtliches Mahnverfahren ist ein starkes Warnsignal.'
            : 'Es wurde keine eindeutige Gerichtspost angegeben.',
        ],
        today: [
          ...sharedToday,
          'Prüfen, ob das Schreiben vom Gericht, Inkasso oder Gläubiger kommt.',
          'Bei Inkasso schriftlich Forderungsaufstellung, Vollmacht und Nachweise anfordern.',
        ],
        tomorrow: [
          ...sharedTomorrow,
          'Schuldnerberatung oder Verbraucherzentrale kontaktieren.',
          'Falls die Forderung falsch ist: Belege sammeln und nichts vorschnell anerkennen.',
        ],
        help: [
          ...commonHelp(city),
          'Verbraucherzentrale',
          'Amtsgericht oder Mahngericht',
        ],
        avoid: [
          ...commonAvoid,
          'Gerichtliche Mahnbescheide nicht wie normale Inkassobriefe behandeln.',
          'Keine unklare Forderung vorschnell anerkennen.',
        ],
      };
    case 'family':
      return {
        situation: [
          `Thema: ${answers.familyEvent || 'nicht angegeben'}.`,
          `Zur Frist: ${deadline}.`,
          has(answers, 'childrenAffected', 'ja')
            ? 'Kinder sind direkt betroffen. Betreuung, Unterhalt, Sorge- oder Umgangsfragen sollten früh mitgedacht werden.'
            : 'Direkt betroffene Kinder wurden nicht angegeben oder sind unklar.',
          has(answers, 'livingSituationChanged', 'ja') || has(answers, 'livingSituationChanged', 'bald')
            ? 'Die Wohnsituation verändert sich oder könnte sich bald verändern.'
            : 'Eine veränderte Wohnsituation wurde nicht angegeben.',
        ],
        today: [
          'Die wichtigsten Fakten notieren: Was ist passiert, seit wann, wer ist betroffen, welche Termine oder Fristen gibt es?',
          'Vorhandene Dokumente fotografieren oder kopieren und nach Thema sortieren.',
          'Wenn Kinder betroffen sind: Betreuung, Schule/Kita und wichtige Bezugspersonen für die nächsten Tage klären.',
          'Eine vertraute Person oder Beratungsstelle um einen konkreten nächsten Schritt bitten.',
        ],
        tomorrow: [
          'Sozialberatung, Familienberatung oder Erziehungsberatung kontaktieren.',
          'Prüfen, ob Standesamt, Jugendamt, Familiengericht, Krankenkasse, Arbeitgeber oder Versicherung informiert werden müssen.',
          'Bei Trennung oder Scheidung Unterhalt, Wohnung, Konto, gemeinsame Verträge und Sorge-/Umgangsfragen getrennt notieren.',
          'Bei Tod oder Geburt nötige Urkunden, Anträge, Leistungen und Meldungen Schritt für Schritt sammeln.',
        ],
        help: [
          ...commonHelp(city),
          'Familien- oder Erziehungsberatungsstelle',
          'Jugendamt, besonders wenn Kinder betroffen sind',
          'Standesamt bei Geburt oder Sterbefall',
          'Fachanwaltliche Beratung bei Scheidung, Sorge, Umgang, Unterhalt oder Erbe',
        ],
        avoid: [
          ...commonAvoid,
          'Keine wichtigen Vereinbarungen unter Druck unterschreiben.',
          'Kinder nicht als Boten oder Konfliktpartner einsetzen.',
          'Gemeinsame Konten, Verträge oder Versicherungen nicht vorschnell ändern, ohne Folgen zu prüfen.',
          'Bei akuter Gewalt oder Bedrohung nicht abwarten, sondern sofort Schutz und Hilfe holen.',
        ],
      };
  }
}
