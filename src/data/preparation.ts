import type { Answers, CategoryId } from '../types';

const has = (answers: Answers, key: string, value: string) => answers[key] === value;

export type UrgencyLevel = 'red' | 'yellow' | 'green';

export interface UrgencyResult {
  level: UrgencyLevel;
  label: string;
  headline: string;
  summary: string;
  reasons: string[];
}

const sharedDocuments = [
  'Personalausweis oder anderes Ausweisdokument',
  'Alle aktuellen Schreiben, Mahnungen und Bescheide',
  'Nachweise zu Einkommen, Bürgergeld, Sozialhilfe, Rente oder Unterhalt',
  'Kontoauszüge der letzten Wochen',
  'Notizen zu Telefonaten, Namen, Datum und Uhrzeit',
];

const sharedActionPlan = [
  'Wichtigste Schreiben fotografieren oder scannen.',
  'Aktenzeichen, Kundennummern und Fristen auf einem Blatt notieren.',
  'Passende Textvorlage kopieren und heute schriftlich absenden.',
  'Antworten, Eingangsbestätigungen und neue Fristen direkt sichern.',
];

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const daysUntilDeadline = (deadline?: string) => {
  if (!deadline) return null;
  const date = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - startOfToday().getTime()) / 86_400_000);
};

const deadlineReason = (answers: Answers) => {
  const daysLeft = daysUntilDeadline(answers.deadlineDate);

  if (daysLeft === null) {
    return answers.writtenDeadline === 'ja'
      ? { score: 2, text: 'Es gibt eine schriftliche Frist, aber das genaue Datum fehlt noch.' }
      : null;
  }

  if (daysLeft < 0) {
    return { score: 3, text: 'Die angegebene Frist ist bereits abgelaufen.' };
  }

  if (daysLeft <= 1) {
    return { score: 3, text: 'Die Frist läuft heute oder morgen ab.' };
  }

  if (daysLeft <= 3) {
    return { score: 2, text: 'Die Frist läuft innerhalb der nächsten drei Tage ab.' };
  }

  if (daysLeft <= 7) {
    return { score: 1, text: 'Die Frist läuft innerhalb der nächsten Woche ab.' };
  }

  return { score: 0, text: 'Die Frist liegt nicht unmittelbar in den nächsten Tagen.' };
};

export function buildUrgency(categoryId: CategoryId, answers: Answers): UrgencyResult {
  const signals: Array<{ score: number; text: string }> = [];
  const deadline = deadlineReason(answers);

  if (deadline) signals.push(deadline);

  switch (categoryId) {
    case 'rent':
      if (has(answers, 'evictionClaim', 'ja')) {
        signals.push({ score: 3, text: 'Es gibt bereits eine Räumungsklage.' });
      }
      if (has(answers, 'immediateTermination', 'ja')) {
        signals.push({ score: 3, text: 'Es geht um eine fristlose Kündigung.' });
      }
      if (has(answers, 'rentTerminated', 'ja')) {
        signals.push({ score: 2, text: 'Eine Kündigung wurde bereits ausgesprochen.' });
      }
      break;
    case 'energy':
      if (has(answers, 'energyBlockStatus', 'durchgeführt')) {
        signals.push({ score: 3, text: 'Die Energiesperre wurde bereits durchgeführt.' });
      }
      if (has(answers, 'energyBlockStatus', 'angedroht')) {
        signals.push({ score: 2, text: 'Eine Energiesperre wurde angedroht.' });
      }
      if (has(answers, 'children', 'ja') || has(answers, 'healthReasons', 'ja')) {
        signals.push({ score: 2, text: 'Kinder oder gesundheitliche Gründe können die Lage verschärfen.' });
      }
      break;
    case 'jobcenter':
      if (has(answers, 'jobcenterIssue', 'Sanktion')) {
        signals.push({ score: 2, text: 'Es geht um eine Sanktion und damit möglicherweise um Geld zum Leben.' });
      }
      if (has(answers, 'objectionDeadline', 'abgelaufen')) {
        signals.push({ score: 2, text: 'Die Widerspruchsfrist könnte bereits abgelaufen sein.' });
      }
      if (has(answers, 'decisionAvailable', 'ja')) {
        signals.push({ score: 1, text: 'Ein Bescheid liegt vor und sollte genau geprüft werden.' });
      }
      break;
    case 'health':
      if (has(answers, 'benefitsSuspendedThreat', 'ja')) {
        signals.push({ score: 3, text: 'Das Ruhen von Leistungen wurde angedroht.' });
      }
      if (has(answers, 'healthWarnings', 'ja')) {
        signals.push({ score: 1, text: 'Es gab bereits Mahnungen der Krankenkasse.' });
      }
      break;
    case 'garnishment':
      if (has(answers, 'accountGarnished', 'ja') && !has(answers, 'pAccount', 'ja')) {
        signals.push({ score: 3, text: 'Das Konto ist gepfändet und ein P-Konto ist noch nicht sicher eingerichtet.' });
      } else if (has(answers, 'accountGarnished', 'ja')) {
        signals.push({ score: 2, text: 'Das Konto ist gepfändet.' });
      }
      if (has(answers, 'garnishmentOrder', 'ja')) {
        signals.push({ score: 2, text: 'Ein Pfändungs- und Überweisungsbeschluss liegt vor.' });
      }
      break;
    case 'schufa':
      if (has(answers, 'urgency', 'heute')) {
        signals.push({ score: 3, text: 'Das Geld wird heute oder morgen gebraucht.' });
      }
      if (has(answers, 'acuteDeadline', 'ja')) {
        signals.push({ score: 2, text: 'Es gibt eine akute Frist beim eigentlichen Problem.' });
      }
      if (has(answers, 'creditRejected', 'ja') || has(answers, 'creditRejected', 'vermutlich')) {
        signals.push({ score: 1, text: 'Ein Kredit wurde vermutlich wegen Bonität oder Schufa abgelehnt.' });
      }
      break;
    case 'debtCourt':
      if (
        has(answers, 'debtLetterType', 'mahnbescheid') ||
        has(answers, 'debtLetterType', 'vollstreckungsbescheid') ||
        has(answers, 'courtYellowEnvelope', 'ja')
      ) {
        signals.push({ score: 3, text: 'Es liegt Gerichtspost oder ein gerichtliches Mahnverfahren nahe.' });
      }
      if (has(answers, 'claimDisputed', 'ja') || has(answers, 'claimDisputed', 'teilweise')) {
        signals.push({ score: 2, text: 'Die Forderung ist ganz oder teilweise bestritten.' });
      }
      if (has(answers, 'claimKnown', 'nein') || has(answers, 'claimKnown', 'unklar')) {
        signals.push({ score: 1, text: 'Die Forderung ist dir nicht klar bekannt.' });
      }
      break;
    case 'family':
      if (has(answers, 'childrenAffected', 'ja') && has(answers, 'supportNetwork', 'nein')) {
        signals.push({ score: 2, text: 'Kinder sind betroffen und verlässliche Unterstützung fehlt gerade.' });
      }
      if (has(answers, 'livingSituationChanged', 'ja') || has(answers, 'livingSituationChanged', 'bald')) {
        signals.push({ score: 1, text: 'Die Wohnsituation verändert sich oder könnte sich bald verändern.' });
      }
      break;
  }

  const highestScore = signals.reduce((highest, signal) => Math.max(highest, signal.score), 0);

  if (highestScore >= 3) {
    return {
      level: 'red',
      label: 'Rot',
      headline: 'Heute handeln',
      summary:
        'Es gibt deutliche Warnsignale. Schicke heute eine schriftliche Nachricht und suche möglichst schnell persönliche Hilfe.',
      reasons: signals.filter((signal) => signal.score >= 2).map((signal) => signal.text),
    };
  }

  if (highestScore >= 1) {
    return {
      level: 'yellow',
      label: 'Gelb',
      headline: 'Zeitnah klären',
      summary:
        'Die Lage wirkt nicht entspannt. Sortiere Unterlagen, reagiere schriftlich und plane innerhalb der nächsten Tage Beratung ein.',
      reasons: signals.map((signal) => signal.text),
    };
  }

  return {
    level: 'green',
    label: 'Grün',
    headline: 'Sortieren und dranbleiben',
    summary:
      'Es gibt aus deinen Angaben keine unmittelbaren Alarmsignale. Trotzdem solltest du Unterlagen sichern und den nächsten Schritt schriftlich festhalten.',
    reasons: ['Keine akute Frist oder besonders dringliche Eskalation wurde angegeben.'],
  };
}

export function buildDocuments(categoryId: CategoryId, answers: Answers) {
  switch (categoryId) {
    case 'rent':
      return [
        'Mietvertrag und letzte Nebenkostenabrechnung',
        'Mahnung, Kündigung oder Schreiben der Hausverwaltung',
        'Übersicht über offene Mieten und bereits gezahlte Beträge',
        'Nachweis über laufende Miete und Mietkonto, falls vorhanden',
        ...sharedDocuments,
      ];
    case 'energy':
      return [
        'Sperrandrohung oder Sperrmitteilung',
        'Kundennummer, Zählernummer und letzte Jahresabrechnung',
        'Übersicht über Abschläge, Rückstand und angebotene Raten',
        has(answers, 'children', 'ja') || has(answers, 'healthReasons', 'ja')
          ? 'Nachweise zu Kindern, Krankheit oder medizinisch notwendigen Geräten'
          : 'Nachweise zu besonderen Belastungen im Haushalt, falls vorhanden',
        ...sharedDocuments,
      ];
    case 'jobcenter':
      return [
        'Bescheid, Antrag, Weiterbewilligungsantrag oder Rückforderung',
        'Nachweise, wann Schreiben angekommen oder abgegeben wurden',
        'Mietvertrag, Kontoauszüge und Einkommensnachweise',
        'Eingangsbestätigungen oder Versandnachweise',
        ...sharedDocuments,
      ];
    case 'health':
      return [
        'Schreiben der Krankenkasse und Forderungsaufstellung',
        'Nachweise zu Einkommen, Selbstständigkeit oder Leistungsbezug',
        'Versichertenkarte und Versicherungsnummer',
        'Unterlagen zu laufender Behandlung oder dringenden Medikamenten',
        ...sharedDocuments,
      ];
    case 'garnishment':
      return [
        'Pfändungs- und Überweisungsbeschluss, falls vorhanden',
        'Schreiben der Bank zur Kontopfändung oder zum P-Konto',
        'Nachweise über Gehalt, Bürgergeld, Rente oder Unterhalt',
        'Bescheinigung für erhöhte Freibeträge, falls vorhanden',
        ...sharedDocuments,
      ];
    case 'schufa':
      return [
        'Ablehnungsschreiben oder Nachricht zum Kredit',
        'Schreiben des eigentlichen Gläubigers oder Vertragspartners',
        'Unterlagen zur Forderung und zum Verwendungszweck des Geldes',
        'Datenkopie oder Auskunft von Auskunfteien, falls vorhanden',
        ...sharedDocuments,
      ];
    case 'debtCourt':
      return [
        'Inkassoschreiben, Mahnung, Mahnbescheid oder Vollstreckungsbescheid',
        'Gelber Umschlag mit Zustelldatum, falls vorhanden',
        'Vertrag, Rechnung, Kündigung oder frühere Schreiben zur Forderung',
        'Zahlungsnachweise, Ratenvereinbarungen oder Kontoauszüge',
        'Eigene Notiz, welche Teile der Forderung unklar oder bestritten sind',
        ...sharedDocuments,
      ];
    case 'family':
      return [
        'Urkunden, Bescheinigungen oder gerichtliche Schreiben',
        'Unterlagen zu Wohnung, Konto, Versicherungen und gemeinsamen Verträgen',
        'Nachweise zu Kindern, Betreuung, Schule oder Kita',
        'Notizen zu Terminen, Absprachen und beteiligten Stellen',
        ...sharedDocuments,
      ];
  }
}

export function buildActionPlan(categoryId: CategoryId, answers: Answers) {
  const plan = [...sharedActionPlan];

  if (answers.deadlineDate || answers.writtenDeadline === 'ja') {
    plan.unshift('Frist prüfen und sichtbar notieren.');
  }

  switch (categoryId) {
    case 'rent':
      return [
        ...plan,
        'Vermieter oder Hausverwaltung um schriftliche Klärung, Ratenzahlung oder Fristaufschub bitten.',
        'Jobcenter, Sozialamt oder Wohnungsnotfallhilfe wegen möglicher Übernahme der Mietschulden kontaktieren.',
      ];
    case 'energy':
      return [
        ...plan,
        'Energieversorger um Sperraussetzung, Ratenzahlung und Forderungsaufstellung bitten.',
        'Jobcenter oder Sozialamt nach einem Darlehen für Energieschulden fragen.',
      ];
    case 'jobcenter':
      return [
        ...plan,
        'Bescheid oder Antrag nach Datum sortieren und fehlende Unterlagen markieren.',
        'Jobcenter schriftlich um Sachstand, Vorschuss, Fristaufschub oder Überprüfung bitten.',
      ];
    case 'health':
      return [
        ...plan,
        'Krankenkasse um Forderungsaufstellung und Klärung des Versicherungsschutzes bitten.',
        'Bei niedrigem Einkommen Beitragsprüfung oder Unterstützung durch Sozialamt oder Jobcenter anfragen.',
      ];
    case 'garnishment':
      return [
        ...plan,
        'Bank schriftlich um P-Konto-Umwandlung oder Bestätigung des Schutzes bitten.',
        'Schuldnerberatung wegen Freibeträgen, Bescheinigung und Gläubigerkontakt anfragen.',
      ];
    case 'schufa':
      return [
        ...plan,
        'Direkten Gläubiger oder Vertragspartner um Fristaufschub oder Ratenzahlung bitten.',
        'Teure Sofortkredite pausieren und zuerst Forderung, Schufa-Daten und Beratungsoptionen prüfen.',
      ];
    case 'debtCourt':
      return [
        ...plan,
        'Prüfen, ob das Schreiben vom Gericht, vom Gläubiger oder von einem Inkassounternehmen kommt.',
        'Bei Gerichtspost das Zustelldatum notieren und sofort Beratung suchen.',
        'Bei Inkasso schriftlich Forderungsaufstellung, Vollmacht und Nachweise anfordern.',
        'Wenn die Forderung falsch oder unklar ist: Belege sammeln und nichts vorschnell anerkennen.',
      ];
    case 'family':
      return [
        ...plan,
        'Wichtigste betroffene Personen, Kinder, Termine und Zuständigkeiten notieren.',
        'Sozialberatung, Familienberatung oder zuständige Stelle mit kurzer Zusammenfassung kontaktieren.',
      ];
  }
}
