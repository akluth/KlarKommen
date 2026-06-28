import type { Language } from '../i18n';
import type { Answers, Category, CategoryId } from '../types';

export interface HelpSearchLink {
  label: string;
  query: string;
  url: string;
}

const searchUrl = (query: string) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;

const withCity = (query: string, city?: string) => [query, city].filter(Boolean).join(' ');

const queriesByCategory: Record<CategoryId, string[]> = {
  rent: [
    'Wohnungsnotfallhilfe',
    'Mieterverein Mietschulden',
    'Sozialamt Mietschulden Darlehen',
    'Jobcenter Mietschulden Darlehen',
  ],
  energy: [
    'Verbraucherzentrale Energieschulden',
    'Sozialamt Energieschulden Darlehen',
    'Jobcenter Stromschulden Darlehen',
    'Energieschuldenberatung',
  ],
  jobcenter: [
    'Erwerbslosenberatung',
    'Sozialberatung Jobcenter',
    'Sozialgericht Rechtsantragsstelle',
    'Beratungshilfe Sozialrecht',
  ],
  health: [
    'Sozialberatung Krankenkasse Beitragsschulden',
    'Unabhängige Patientenberatung',
    'Krankenkasse Beitragsschulden Beratung',
    'Sozialamt Krankenversicherung',
  ],
  garnishment: [
    'Schuldnerberatung P-Konto Bescheinigung',
    'P-Konto Freibetrag Beratung',
    'Vollstreckungsgericht Kontopfändung',
    'Schuldnerberatung Kontopfändung',
  ],
  schufa: [
    'Schuldnerberatung Schufa',
    'Verbraucherzentrale Schufa',
    'Schufa Datenkopie kostenlos',
    'Kredit abgelehnt Schuldnerberatung',
  ],
  debtCourt: [
    'Verbraucherzentrale Inkasso',
    'Schuldnerberatung Mahnbescheid',
    'Amtsgericht Mahnbescheid',
    'Inkasso Forderung prüfen',
  ],
  family: [
    'Familienberatung',
    'Erziehungsberatung',
    'Jugendamt Beratung',
    'Sozialberatung Familie',
  ],
};

const placeWord: Record<Language, string> = {
  ar: 'في',
  de: 'in',
  tr: 'içinde',
  uk: 'у',
};

export function buildHelpSearchLinks(categoryId: CategoryId, answers: Answers, language: Language): HelpSearchLink[] {
  const city = answers.city?.trim();

  return queriesByCategory[categoryId].map((query) => {
    const fullQuery = withCity(query, city);
    return {
      label: city ? `${query} ${placeWord[language]} ${city}` : query,
      query: fullQuery,
      url: searchUrl(fullQuery),
    };
  });
}

export function buildPhoneScript(category: Category, answers: Answers) {
  const deadline =
    answers.deadlineDate ||
    (answers.writtenDeadline === 'ja'
      ? 'eine schriftliche Frist, das genaue Datum prüfe ich gerade'
      : 'keine klare Frist');
  const amount = answers.amount ? `${answers.amount} Euro` : 'einen noch zu klärenden Betrag';

  return [
    `Hallo, mein Name ist [Name]. Ich brauche bitte kurzfristig Beratung zu ${category.title}.`,
    `Es geht um ${amount}. Es gibt ${deadline}.`,
    'Ich habe Schreiben und Unterlagen gesammelt und kann sie zu einem Termin mitbringen oder vorher senden.',
    'Können Sie mir sagen, ob ich bei Ihnen richtig bin und wann ein kurzfristiger Termin möglich ist?',
  ].join('\n');
}

export function buildContactChecklist(language: Language) {
  const checklist = {
    de: [
      'Einen passenden Suchlink öffnen.',
      'Stelle anrufen oder kurze Nachricht senden.',
      'Termin, Namen und Uhrzeit notieren.',
      'Beratungspaket kopieren oder als PDF speichern.',
      'Unterlagen für den Termin bereitlegen.',
    ],
    tr: [
      'Uygun bir arama bağlantısı aç.',
      'Kurumu ara veya kısa bir mesaj gönder.',
      'Randevuyu, adı ve saati not et.',
      'Danışma paketini kopyala veya PDF olarak kaydet.',
      'Randevu için belgeleri hazırla.',
    ],
    ar: [
      'افتح رابط بحث مناسب.',
      'اتصل بالجهة أو أرسل رسالة قصيرة.',
      'دوّن الموعد والاسم والوقت.',
      'انسخ حزمة الاستشارة أو احفظها كملف PDF.',
      'جهّز المستندات للموعد.',
    ],
    uk: [
      'Відкрити відповідне посилання для пошуку.',
      'Подзвонити до установи або надіслати коротке повідомлення.',
      'Записати дату зустрічі, ім’я контактної особи та час.',
      'Скопіювати консультаційний пакет або зберегти як PDF.',
      'Підготувати документи для консультації.',
    ],
  } satisfies Record<Language, string[]>;

  return checklist[language];
}
