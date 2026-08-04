import { isBaseLanguage, type BaseLanguage, type Language } from '../i18n';
import type { Answers, Category, CategoryId, Country } from '../types';
import { formatDateForLanguage, formatEuroForLanguage } from '../utils/formatters';
import { buildSwissContactChecklist, buildSwissHelpSearchLinks, buildSwissPhoneScript } from './localHelpSwitzerland';

export interface HelpSearchLink {
  label: string;
  query: string;
  url: string;
}

const searchUrl = (query: string) => `https://www.google.com/search?q=${encodeURIComponent(query)}`;

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

const austrianQueriesByCategory: Record<CategoryId, string[]> = {
  rent: ['WOHNSCHIRM Miete Beratungsstelle', 'Mietervereinigung Mietschulden', 'Wohnbeihilfe Beratung', 'staatlich anerkannte Schuldenberatung'],
  energy: ['WOHNSCHIRM Energie Beratungsstelle', 'E-Control Energieberatung', 'Arbeiterkammer Energieschulden', 'Energieschuldenberatung'],
  jobcenter: ['Sozialhilfe Mindestsicherung Antrag', 'AMS Beratung Bescheid', 'Arbeitslosenberatung', 'Verfahrenshilfe Verwaltungsgericht'],
  health: ['ÖGK Beitragsschulden Beratung', 'Patientenanwaltschaft', 'Krankenversicherung Sozialberatung', 'staatlich anerkannte Schuldenberatung'],
  garnishment: ['staatlich anerkannte Schuldenberatung Kontopfändung', 'Existenzminimum Kontopfändung', 'Bezirksgericht Exekution Amtstag', 'unpfändbare Leistungen Kontopfändung'],
  schufa: ['KSV1870 Auskunft Art 15 DSGVO', 'CRIF Selbstauskunft kostenlos', 'Arbeiterkammer Bonitätsdaten', 'Datenschutzbehörde Beschwerde Bonitätsauskunft'],
  debtCourt: ['Arbeiterkammer Inkasso Beratung', 'Schuldenberatung bedingter Zahlungsbefehl', 'Bezirksgericht Amtstag Zahlungsbefehl', 'Inkasso Forderung prüfen Österreich'],
  family: ['geförderte Familienberatung', 'Kinder und Jugendhilfe Beratung', 'Familiengerichtshilfe', 'Sozialberatung Familie'],
};

const queryLabels: Record<BaseLanguage, Record<CategoryId, string[]>> = {
  de: queriesByCategory,
  tr: {
    rent: ['Konut acil yardımı', 'Kira borcu danışması', 'Sozialamt kira borcu desteği', 'Jobcenter kira borcu desteği'],
    energy: ['Enerji borcu tüketici danışması', 'Sozialamt enerji borcu desteği', 'Jobcenter elektrik borcu desteği', 'Enerji borcu danışması'],
    jobcenter: ['İşsizler danışması', 'Jobcenter sosyal danışması', 'Sosyal mahkeme başvuru birimi', 'Sosyal hukuk adli yardım'],
    health: ['Sağlık sigortası borcu sosyal danışması', 'Bağımsız hasta danışması', 'Sağlık sigortası borcu danışması', 'Sozialamt sağlık sigortası'],
    garnishment: ['P-Konto belgesi borç danışması', 'P-Konto muafiyet danışması', 'İcra mahkemesi hesap haczi', 'Hesap haczi borç danışması'],
    schufa: ['Schufa borç danışması', 'Schufa tüketici danışması', 'Ücretsiz Schufa veri kopyası', 'Kredi reddi borç danışması'],
    debtCourt: ['Inkasso tüketici danışması', 'Mahnbescheid borç danışması', 'Mahnbescheid yerel mahkeme', 'Inkasso talebi kontrolü'],
    family: ['Aile danışması', 'Çocuk yetiştirme danışması', 'Jugendamt danışması', 'Aile sosyal danışması'],
  },
  ar: {
    rent: ['مساعدة طوارئ السكن', 'استشارة ديون الإيجار', 'مساعدة Sozialamt لديون الإيجار', 'مساعدة Jobcenter لديون الإيجار'],
    energy: ['استشارة المستهلك لديون الطاقة', 'مساعدة Sozialamt لديون الطاقة', 'مساعدة Jobcenter لديون الكهرباء', 'استشارة ديون الطاقة'],
    jobcenter: ['استشارة العاطلين عن العمل', 'استشارة اجتماعية حول Jobcenter', 'مكتب الطلبات في المحكمة الاجتماعية', 'مساعدة قضائية في القانون الاجتماعي'],
    health: ['استشارة اجتماعية لديون التأمين الصحي', 'استشارة مستقلة للمرضى', 'استشارة ديون التأمين الصحي', 'Sozialamt والتأمين الصحي'],
    garnishment: ['استشارة ديون لشهادة P-Konto', 'استشارة الحد المعفى في P-Konto', 'محكمة التنفيذ وحجز الحساب', 'استشارة ديون حجز الحساب'],
    schufa: ['استشارة ديون Schufa', 'استشارة المستهلك حول Schufa', 'نسخة Schufa مجانية', 'استشارة ديون بعد رفض القرض'],
    debtCourt: ['استشارة المستهلك حول Inkasso', 'استشارة ديون Mahnbescheid', 'المحكمة المحلية وMahnbescheid', 'فحص مطالبة Inkasso'],
    family: ['استشارة أسرية', 'استشارة تربية الأطفال', 'استشارة Jugendamt', 'استشارة اجتماعية للأسرة'],
  },
  uk: {
    rent: ['Житлова екстрена допомога', 'Консультація щодо боргу за оренду', 'Допомога Sozialamt з боргом за оренду', 'Допомога Jobcenter з боргом за оренду'],
    energy: ['Споживча консультація щодо енергоборгу', 'Допомога Sozialamt з енергоборгом', 'Допомога Jobcenter з боргом за електрику', 'Консультація щодо енергоборгу'],
    jobcenter: ['Консультація для безробітних', 'Соціальна консультація Jobcenter', 'Приймальня соціального суду', 'Юридична допомога із соціального права'],
    health: ['Соціальна консультація щодо боргу касі', 'Незалежна консультація пацієнтів', 'Консультація щодо боргу медичній касі', 'Sozialamt і медичне страхування'],
    garnishment: ['Боргова консультація для довідки P-Konto', 'Консультація щодо ліміту P-Konto', 'Виконавчий суд і арешт рахунку', 'Боргова консультація при арешті рахунку'],
    schufa: ['Боргова консультація Schufa', 'Споживча консультація Schufa', 'Безкоштовна копія даних Schufa', 'Боргова консультація після відмови у кредиті'],
    debtCourt: ['Споживча консультація Inkasso', 'Боргова консультація Mahnbescheid', 'Місцевий суд і Mahnbescheid', 'Перевірка вимоги Inkasso'],
    family: ['Сімейна консультація', 'Консультація з виховання', 'Консультація Jugendamt', 'Соціальна консультація сім’ї'],
  },
};

const austrianQueryLabels: Record<BaseLanguage, Record<CategoryId, string[]>> = {
  de: austrianQueriesByCategory,
  tr: {
    rent: ['WOHNSCHIRM kira yardımı', 'Kira borcu danışması', 'Konut yardımı danışması', 'Devletçe tanınan borç danışması'],
    energy: ['WOHNSCHIRM enerji yardımı', 'E-Control enerji danışması', 'Arbeiterkammer enerji borcu', 'Enerji borcu danışması'],
    jobcenter: ['Sosyal yardım / Mindestsicherung başvurusu', 'AMS kararı danışması', 'İşsizler danışması', 'İdare mahkemesi Verfahrenshilfe'],
    health: ['ÖGK prim borcu danışması', 'Hasta hakları birimi', 'Sağlık sigortası sosyal danışması', 'Devletçe tanınan borç danışması'],
    garnishment: ['Hesap haczi borç danışması', 'Hacizde geçim asgarisi', 'Bezirksgericht icra Amtstag', 'Haczedilemez ödemeler'],
    schufa: ['KSV1870 ücretsiz DSGVO bilgisi', 'CRIF ücretsiz öz bilgi', 'Arbeiterkammer kredi verileri', 'Veri koruma şikâyeti'],
    debtCourt: ['Arbeiterkammer tahsilat danışması', 'Şartlı ödeme emri borç danışması', 'Bezirksgericht ödeme emri', 'Tahsilat talebi kontrolü'],
    family: ['Desteklenen aile danışması', 'Çocuk ve gençlik yardımı', 'Aile mahkemesi yardımı', 'Aile sosyal danışması'],
  },
  ar: {
    rent: ['مساعدة WOHNSCHIRM للإيجار', 'استشارة ديون الإيجار', 'استشارة إعانة السكن', 'استشارة ديون معترف بها رسميا'],
    energy: ['مساعدة WOHNSCHIRM للطاقة', 'استشارة E-Control للطاقة', 'Arbeiterkammer وديون الطاقة', 'استشارة ديون الطاقة'],
    jobcenter: ['طلب المساعدة الاجتماعية / Mindestsicherung', 'استشارة قرار AMS', 'استشارة العاطلين', 'Verfahrenshilfe للمحكمة الإدارية'],
    health: ['استشارة ديون اشتراكات ÖGK', 'مكتب حقوق المرضى', 'استشارة اجتماعية للتأمين الصحي', 'استشارة ديون معترف بها رسميا'],
    garnishment: ['استشارة ديون حجز الحساب', 'الحد الأدنى للمعيشة عند الحجز', 'Bezirksgericht والتنفيذ', 'المدفوعات غير القابلة للحجز'],
    schufa: ['معلومات KSV1870 المجانية وفق DSGVO', 'معلومات CRIF الذاتية المجانية', 'Arbeiterkammer وبيانات الائتمان', 'شكوى حماية البيانات'],
    debtCourt: ['Arbeiterkammer واستشارة التحصيل', 'استشارة ديون لأمر الدفع المشروط', 'Bezirksgericht وأمر الدفع', 'فحص مطالبة التحصيل'],
    family: ['استشارة أسرية مدعومة', 'مساعدة الأطفال والشباب', 'مساعدة محكمة الأسرة', 'استشارة اجتماعية للأسرة'],
  },
  uk: {
    rent: ['Допомога WOHNSCHIRM з орендою', 'Консультація щодо боргу за оренду', 'Консультація з житлової допомоги', 'Державна визнана боргова консультація'],
    energy: ['Допомога WOHNSCHIRM з енергією', 'Енергоконсультація E-Control', 'Arbeiterkammer та енергоборги', 'Консультація щодо енергоборгу'],
    jobcenter: ['Заява на соціальну допомогу / Mindestsicherung', 'Консультація щодо рішення AMS', 'Консультація для безробітних', 'Verfahrenshilfe в адміністративному суді'],
    health: ['Консультація ÖGK щодо боргу', 'Пацієнтський омбудсман', 'Соціальна консультація зі страхування', 'Державна визнана боргова консультація'],
    garnishment: ['Боргова консультація при арешті рахунку', 'Прожитковий мінімум при арешті', 'Bezirksgericht та виконання', 'Недоторканні виплати'],
    schufa: ['Безкоштовна інформація KSV1870 за GDPR', 'Безкоштовна інформація CRIF', 'Arbeiterkammer і кредитні дані', 'Скарга до органу захисту даних'],
    debtCourt: ['Arbeiterkammer та інкасо', 'Боргова консультація щодо платіжного наказу', 'Bezirksgericht і платіжний наказ', 'Перевірка вимоги інкасо'],
    family: ['Субсидована сімейна консультація', 'Допомога дітям і молоді', 'Сімейна судова допомога', 'Соціальна консультація сім’ї'],
  },
};

const phoneAmountText: Record<BaseLanguage, (value?: string) => string> = {
  de: (value?: string) => (value ? formatEuroForLanguage(value, 'de') : 'einen noch zu klärenden Betrag'),
  tr: (value?: string) => (value ? formatEuroForLanguage(value, 'tr') : 'henüz netleşmemiş bir tutar'),
  ar: (value?: string) => (value ? formatEuroForLanguage(value, 'ar') : 'مبلغ لم يتضح بعد'),
  uk: (value?: string) => (value ? formatEuroForLanguage(value, 'uk') : 'суму, яку ще потрібно уточнити'),
};

const phoneDeadlineText: Record<BaseLanguage, (answers: Answers) => string> = {
  de: (answers: Answers) => {
    if (answers.deadlineDate) return `Die Frist läuft bis ${formatDateForLanguage(answers.deadlineDate, 'de')}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'Es gibt eine schriftliche Frist; das genaue Datum prüfe ich gerade.';
    }
    return 'Eine klare Frist ist mir bisher nicht bekannt.';
  },
  tr: (answers: Answers) => {
    if (answers.deadlineDate) return `Son tarih ${formatDateForLanguage(answers.deadlineDate, 'tr')}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'Yazılı bir süre var; kesin tarihi şu anda kontrol ediyorum.';
    }
    return 'Şu anda bildiğim net bir süre yok.';
  },
  ar: (answers: Answers) => {
    if (answers.deadlineDate) return `المهلة تنتهي في ${formatDateForLanguage(answers.deadlineDate, 'ar')}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'توجد مهلة مكتوبة؛ وأنا أتحقق حاليا من التاريخ الدقيق.';
    }
    return 'لا أعرف حاليا بوجود مهلة واضحة.';
  },
  uk: (answers: Answers) => {
    if (answers.deadlineDate) return `Строк спливає ${formatDateForLanguage(answers.deadlineDate, 'uk')}.`;
    if (answers.writtenDeadline === 'ja') {
      return 'Є письмовий строк; точну дату я зараз перевіряю.';
    }
    return 'Чіткого строку мені наразі не відомо.';
  },
};

export function buildHelpSearchLinks(
  categoryId: CategoryId,
  answers: Answers,
  language: Language,
  country: Country = 'de',
): HelpSearchLink[] {
  if (country === 'ch') return buildSwissHelpSearchLinks(categoryId, answers, language);
  const baseLanguage = isBaseLanguage(language) ? language : 'de';
  const city = answers.city?.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 80);
  const queries = country === 'at' ? austrianQueriesByCategory : queriesByCategory;
  const labels = country === 'at' ? austrianQueryLabels : queryLabels;

  return queries[categoryId].map((query, index) => {
    const fullQuery = withCity(query, city);
    return {
      label: city
        ? `${labels[baseLanguage][categoryId][index]} — ${city}`
        : labels[baseLanguage][categoryId][index],
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
  BaseLanguage,
  {
    lines: (category: Category, answers: Answers) => string[];
  }
>;

export function buildPhoneScript(category: Category, answers: Answers, language: Language, country: Country = 'de') {
  if (country === 'ch') return buildSwissPhoneScript(category, answers, language);
  const baseLanguage = isBaseLanguage(language) ? language : 'de';
  return phoneScriptText[baseLanguage].lines(category, answers).join('\n');
}

export function buildContactChecklist(language: Language, country: Country = 'de') {
  if (country === 'ch') return buildSwissContactChecklist(language);
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
  } satisfies Record<BaseLanguage, string[]>;

  return checklist[isBaseLanguage(language) ? language : 'de'];
}
