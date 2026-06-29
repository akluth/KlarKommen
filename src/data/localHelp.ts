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

const phoneAmountText: Record<Language, (value?: string) => string> = {
  de: (value?: string) => (value ? `${value} Euro` : 'einen noch zu klärenden Betrag'),
  tr: (value?: string) => (value ? `${value} Euro` : 'henüz netleşmemiş bir tutar'),
  ar: (value?: string) => (value ? `${value} Euro` : 'مبلغ لم يتضح بعد'),
  uk: (value?: string) => (value ? `${value} Euro` : 'суму, яку ще потрібно уточнити'),
};

const phoneDeadlineText: Record<Language, (answers: Answers) => string> = {
  de: (answers: Answers) => {
    if (answers.deadlineDate) return `Die Frist läuft bis ${answers.deadlineDate}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'Es gibt eine schriftliche Frist; das genaue Datum prüfe ich gerade.';
    }
    return 'Eine klare Frist ist mir bisher nicht bekannt.';
  },
  tr: (answers: Answers) => {
    if (answers.deadlineDate) return `Son tarih ${answers.deadlineDate}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'Yazılı bir süre var; kesin tarihi şu anda kontrol ediyorum.';
    }
    return 'Şu anda bildiğim net bir süre yok.';
  },
  ar: (answers: Answers) => {
    if (answers.deadlineDate) return `المهلة تنتهي في ${answers.deadlineDate}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'توجد مهلة مكتوبة؛ وأنا أتحقق حاليا من التاريخ الدقيق.';
    }
    return 'لا أعرف حاليا بوجود مهلة واضحة.';
  },
  uk: (answers: Answers) => {
    if (answers.deadlineDate) return `Строк спливає ${answers.deadlineDate}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'Є письмовий строк; точну дату я зараз перевіряю.';
    }
    return 'Чіткого строку мені наразі не відомо.';
  },
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

const phoneScriptText = {
  de: {
    lines: (category: Category, answers: Answers) => [
      `Hallo, mein Name ist [Name]. Ich brauche bitte kurzfristig Beratung zu ${category.title}.`,
      `Es geht um ${phoneAmountText.de(answers.amount)}. ${phoneDeadlineText.de(answers)}`,
      'Ich habe Schreiben und Unterlagen gesammelt und kann sie zu einem Termin mitbringen oder vorher senden.',
      'Können Sie mir sagen, ob ich bei Ihnen richtig bin und wann ein kurzfristiger Termin möglich ist?',
    ],
  },
  tr: {
    lines: (category: Category, answers: Answers) => [
      `Merhaba, benim adım [Name]. ${category.title} konusunda kısa sürede danışmanlık almak istiyorum.`,
      `Konu ${phoneAmountText.tr(answers.amount)} ile ilgili. ${phoneDeadlineText.tr(answers)}`,
      'Yazıları ve belgeleri topladım; randevuya getirebilir veya önceden gönderebilirim.',
      'Doğru yere başvurup başvurmadığımı ve kısa sürede ne zaman randevu mümkün olduğunu söyleyebilir misiniz?',
    ],
  },
  ar: {
    lines: (category: Category, answers: Answers) => [
      `مرحبا، اسمي [Name]. أحتاج من فضلكم إلى استشارة قريبة بخصوص ${category.title}.`,
      `الأمر يتعلق بـ ${phoneAmountText.ar(answers.amount)}. ${phoneDeadlineText.ar(answers)}`,
      'جمعت الرسائل والمستندات ويمكنني إحضارها إلى الموعد أو إرسالها مسبقا.',
      'هل يمكنكم إخباري إن كنت في الجهة الصحيحة ومتى يمكن الحصول على موعد قريب؟',
    ],
  },
  uk: {
    lines: (category: Category, answers: Answers) => [
      `Добрий день, мене звати [Name]. Мені потрібна швидка консультація щодо ${category.title}.`,
      `Йдеться про ${phoneAmountText.uk(answers.amount)}. ${phoneDeadlineText.uk(answers)}`,
      'Я зібрав/зібрала листи й документи та можу принести їх на зустріч або надіслати заздалегідь.',
      'Скажіть, будь ласка, чи я звертаюся за правильною адресою і коли можливий найближчий термін?',
    ],
  },
} satisfies Record<
  Language,
  {
    lines: (category: Category, answers: Answers) => string[];
  }
>;

export function buildPhoneScript(category: Category, answers: Answers, language: Language) {
  return phoneScriptText[language].lines(category, answers).join('\n');
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
