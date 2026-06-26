import type { Answers, Category, CategoryId } from '../types';

const line = (value?: string, fallback = '[bitte ergänzen]') => value?.trim() || fallback;

const amountText = (answers: Answers) => {
  const value = answers.amount?.trim();
  return value ? `${value} Euro` : '[Betrag ergänzen]';
};

const deadlineText = (answers: Answers) => {
  if (answers.deadlineDate) return answers.deadlineDate;
  if (answers.writtenDeadline === 'ja') return '[Datum der Frist ergänzen]';
  return '[falls vorhanden: Datum ergänzen]';
};

const senderBlock = (answers: Answers) => `Absenderin/Absender:
[Name]
[Adresse]
${answers.city ? answers.city : '[PLZ Ort]'}

`;

const closing = `Bitte bestatigen Sie mir den Eingang dieser Nachricht schriftlich.

Mit freundlichen Grüßen
[Name]`;

const installmentParagraph = (answers: Answers) =>
  `Ich bitte um eine realistische Ratenzahlung und schlage vor, den offenen Betrag von ${amountText(
    answers,
  )} in monatlichen Raten zu begleichen. Einen konkreten Vorschlag kann ich nach Prüfung meiner Einnahmen und Ausgaben kurzfristig nachreichen.`;

const extensionParagraph = (answers: Answers) =>
  `Ich bitte um Fristaufschub bis mindestens ${deadlineText(
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
  debtCourt:
    'ich melde mich wegen einer Inkasso-Forderung beziehungsweise eines gerichtlichen Mahnverfahrens.',
  family:
    'ich melde mich wegen einer familiären Veränderung und möchte die nächsten Schritte ruhig sortieren.',
};

const recipientByCategory: Record<CategoryId, string> = {
  rent: 'Vermieter / Hausverwaltung',
  energy: 'Energieversorger',
  jobcenter: 'Jobcenter / Sozialamt',
  health: 'Krankenkasse',
  garnishment: 'Bank',
  schufa: 'Schuldnerberatung',
  debtCourt: 'Inkassounternehmen / Gläubiger / Mahngericht',
  family: 'Sozialberatung / Familienberatung',
};

export function buildTemplate(category: Category, answers: Answers) {
  if (category.id === 'family') {
    return `${senderBlock(answers)}An:
${recipientByCategory[category.id]}

Betreff: Bitte um Klärung der nächsten Schritte - ${category.shortTitle}

Sehr geehrte Damen und Herren,

${categoryOpening[category.id]}

Thema: ${line(answers.familyEvent, 'nicht angegeben')}
Frist: ${deadlineText(answers)}
Kinder betroffen: ${line(answers.childrenAffected, 'nicht angegeben')}
Wichtige Punkte: ${line(answers.familyNotes, 'nicht angegeben')}

Ich bitte um einen kurzfristigen Termin oder eine kurze Rückmeldung, welche Unterlagen ich vorbereiten soll.

${closing}`;
  }

  const subject = `Bitte um Klärung und Unterstützung - ${category.shortTitle}`;
  return `${senderBlock(answers)}An:
${recipientByCategory[category.id]}

Betreff: ${subject}

Sehr geehrte Damen und Herren,

${categoryOpening[category.id]}

Aktuell geht es nach meiner Übersicht um einen offenen Betrag von ${amountText(answers)}. ${
    answers.writtenDeadline === 'ja'
      ? `Mir liegt eine schriftliche Frist bis ${deadlineText(answers)} vor.`
      : 'Eine eindeutige schriftliche Frist liegt mir derzeit nicht vor oder ist mir unklar.'
  }

${installmentParagraph(answers)}

${extensionParagraph(answers)}

${closing}`;
}

export function buildAllTemplates(category: Category, answers: Answers) {
  if (category.id === 'family') {
    const baseContext = `Ort: ${line(answers.city)}
Thema: ${line(answers.familyEvent, 'nicht angegeben')}
Frist: ${deadlineText(answers)}
Kinder betroffen: ${line(answers.childrenAffected, 'nicht angegeben')}
Wichtige Punkte: ${line(answers.familyNotes, 'nicht angegeben')}`;

    return [
      {
        label: 'Hauptvorlage',
        text: buildTemplate(category, answers),
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
      {
        label: 'Bitte um Klärung nächster Schritte',
        text: `${senderBlock(answers)}Betreff: Bitte um Klärung der nächsten Schritte

Sehr geehrte Damen und Herren,

ich möchte klären, welche nächsten Schritte in meiner familiären Situation sinnvoll und notwendig sind.

Hintergrund:
${baseContext}

Bitte teilen Sie mir mit, welche Stelle zuständig ist und welche Unterlagen benötigt werden.

${closing}`,
      },
    ];
  }

  const baseContext = `Ort: ${line(answers.city)}
Offener Betrag: ${amountText(answers)}
Frist: ${deadlineText(answers)}
Kontakt wurde bereits aufgenommen: ${line(answers.contacted, 'nicht angegeben')}`;

  return [
    {
      label: 'Hauptvorlage',
      text: buildTemplate(category, answers),
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
}
