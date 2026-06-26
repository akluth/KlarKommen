import type { Category } from '../types';

export const categories: Category[] = [
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
    description: 'Mahnungen, Beitragsrückstände und mögliches Ruhen von Leistungen strukturieren.',
    primaryContact: 'Krankenkasse',
  },
  {
    id: 'garnishment',
    title: 'Pfändung / P-Konto',
    shortTitle: 'P-Konto',
    description: 'Kontopfändung, Freibetrag, P-Konto und existenzsichernde Zahlungen sortieren.',
    primaryContact: 'Bank',
  },
  {
    id: 'schufa',
    title: 'Schufa / Kredit abgelehnt',
    shortTitle: 'Schufa',
    description: 'Ablehnung, Dringlichkeit, Alternativen und Beratungsbedarf abwagen.',
    primaryContact: 'Schuldnerberatung',
  },
  {
    id: 'debtCourt',
    title: 'Inkasso / Mahnbescheid',
    shortTitle: 'Inkasso',
    description: 'Inkassoschreiben, Forderung oder gerichtlichen Mahnbescheid sortieren.',
    primaryContact: 'Inkassounternehmen, Gläubiger oder Mahngericht',
  },
  {
    id: 'family',
    title: 'Familie / Lebensumbruch',
    shortTitle: 'Familie',
    description: 'Tod, Geburt, Trennung, Scheidung oder Elternschaft ruhig sortieren.',
    primaryContact: 'Sozialberatung oder Familienberatung',
  },
];
