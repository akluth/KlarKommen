import type { Language } from './index';

export interface ResultExtraTexts {
  amountUnknown: string;
  contactChecklist: string[];
  contactTitle: string;
  copied: string;
  copyPackage: string;
  copyScript: string;
  deadlineWritten: string;
  deleteSavedCase: string;
  helpExternalNotice: string;
  helpSearchTitle: string;
  localHelpEyebrow: string;
  noDeadline: string;
  noPlace: string;
  packageAmount: string;
  packageCategory: string;
  packageContact: string;
  packageDeadline: string;
  packageEyebrow: string;
  packageHeading: string;
  packagePlace: string;
  packageSearchTitle: string;
  packageScriptTitle: string;
  packageWhy: string;
  phoneEyebrow: string;
  phoneHeading: string;
  printPdf: string;
  saveCase: string;
  savedCaseContinue: string;
  savedCaseEyebrow: string;
  savedCaseFallback: string;
  savedCaseHeading: string;
  savedCaseSavedAt: string;
  savedUpdate: string;
  taskDocumentsEyebrow: string;
  taskDocumentsTitle: string;
  taskNextEyebrow: string;
  taskNextTitle: string;
  urgencyEyebrow: string;
}

const de: ResultExtraTexts = {
  amountUnknown: 'nicht angegeben',
  contactChecklist: [
    'Einen passenden Suchlink öffnen.',
    'Stelle anrufen oder kurze Nachricht senden.',
    'Termin, Namen und Uhrzeit notieren.',
    'Beratungspaket kopieren oder als PDF speichern.',
    'Unterlagen für den Termin bereitlegen.',
  ],
  contactTitle: 'Kontakt aufnehmen',
  copied: 'Kopiert',
  copyPackage: 'Beratungspaket kopieren',
  copyScript: 'Skript kopieren',
  deadlineWritten: 'schriftliche Frist vorhanden, Datum prüfen',
  deleteSavedCase: 'Gespeicherten Fall löschen',
  helpExternalNotice:
    'Diese Suchlinks öffnen eine externe Suche. Es wird nichts automatisch an KlarKommen gesendet.',
  helpSearchTitle: 'Hilfe in deiner Nähe suchen',
  localHelpEyebrow: 'Echte Hilfe finden',
  noDeadline: 'nicht angegeben',
  noPlace: 'Ort nicht angegeben',
  packageAmount: 'Betrag',
  packageCategory: 'Kategorie',
  packageContact: 'Kontakt',
  packageDeadline: 'Frist',
  packageEyebrow: 'Beratungspaket',
  packageHeading: 'Für Gespräch, Termin oder Ausdruck',
  packagePlace: 'Ort',
  packageSearchTitle: 'Hilfe in der Nähe suchen',
  packageScriptTitle: 'Telefon- oder Mail-Skript',
  packageWhy: 'Warum diese Einschätzung',
  phoneEyebrow: 'Telefon oder Mail',
  phoneHeading: 'Was du sagen kannst',
  printPdf: 'Druck / PDF',
  saveCase: 'Fall auf diesem Gerät speichern',
  savedCaseContinue: 'Fall fortsetzen',
  savedCaseEyebrow: 'Auf diesem Gerät gespeichert',
  savedCaseFallback: 'Gespeicherter Fall',
  savedCaseHeading: 'Gespeicherten Fall fortsetzen',
  savedCaseSavedAt: 'zuletzt gespeichert am',
  savedUpdate: 'Speicherstand aktualisieren',
  taskDocumentsEyebrow: 'Damit Gespräche leichter werden',
  taskDocumentsTitle: 'Unterlagen bereitlegen',
  taskNextEyebrow: 'Jetzt konkret werden',
  taskNextTitle: 'Dein nächster Aktionsplan',
  urgencyEyebrow: 'Dringlichkeit',
};

const tr: ResultExtraTexts = {
  amountUnknown: 'belirtilmedi',
  contactChecklist: [
    'Uygun bir arama bağlantısı aç.',
    'Kurumu ara veya kısa bir mesaj gönder.',
    'Randevuyu, adı ve saati not et.',
    'Danışma paketini kopyala veya PDF olarak kaydet.',
    'Randevu için belgeleri hazırla.',
  ],
  contactTitle: 'İletişime geç',
  copied: 'Kopyalandı',
  copyPackage: 'Danışma paketini kopyala',
  copyScript: 'Metni kopyala',
  deadlineWritten: 'yazılı süre var, tarihi kontrol et',
  deleteSavedCase: 'Kaydedilen durumu sil',
  helpExternalNotice:
    'Bu bağlantılar harici bir arama açar. KlarKommen otomatik olarak hiçbir şey göndermez.',
  helpSearchTitle: 'Yakınında yardım ara',
  localHelpEyebrow: 'Gerçek yardım bul',
  noDeadline: 'belirtilmedi',
  noPlace: 'şehir belirtilmedi',
  packageAmount: 'Tutar',
  packageCategory: 'Kategori',
  packageContact: 'İletişim',
  packageDeadline: 'Süre',
  packageEyebrow: 'Danışma paketi',
  packageHeading: 'Görüşme, randevu veya çıktı için',
  packagePlace: 'Yer',
  packageSearchTitle: 'Yakında yardım ara',
  packageScriptTitle: 'Telefon veya mesaj metni',
  packageWhy: 'Bu değerlendirme neden',
  phoneEyebrow: 'Telefon veya mesaj',
  phoneHeading: 'Ne söyleyebilirsin',
  printPdf: 'Yazdır / PDF',
  saveCase: 'Durumu bu cihazda kaydet',
  savedCaseContinue: 'Duruma devam et',
  savedCaseEyebrow: 'Bu cihazda kaydedildi',
  savedCaseFallback: 'Kaydedilen durum',
  savedCaseHeading: 'Kaydedilen duruma devam et',
  savedCaseSavedAt: 'son kaydedilme tarihi',
  savedUpdate: 'Kaydı güncelle',
  taskDocumentsEyebrow: 'Görüşmeler kolaylaşsın diye',
  taskDocumentsTitle: 'Belgeleri hazırla',
  taskNextEyebrow: 'Şimdi somut adım',
  taskNextTitle: 'Sonraki eylem planın',
  urgencyEyebrow: 'Aciliyet',
};

const ar: ResultExtraTexts = {
  amountUnknown: 'غير محدد',
  contactChecklist: [
    'افتح رابط بحث مناسب.',
    'اتصل بالجهة أو أرسل رسالة قصيرة.',
    'دوّن الموعد والاسم والوقت.',
    'انسخ حزمة الاستشارة أو احفظها كملف PDF.',
    'جهّز المستندات للموعد.',
  ],
  contactTitle: 'التواصل مع جهة مساعدة',
  copied: 'تم النسخ',
  copyPackage: 'نسخ حزمة الاستشارة',
  copyScript: 'نسخ النص',
  deadlineWritten: 'توجد مهلة مكتوبة، افحص التاريخ',
  deleteSavedCase: 'حذف الحالة المحفوظة',
  helpExternalNotice:
    'هذه الروابط تفتح بحثا خارجيا. لا يرسل KlarKommen أي شيء تلقائيا.',
  helpSearchTitle: 'البحث عن مساعدة قريبة',
  localHelpEyebrow: 'العثور على مساعدة حقيقية',
  noDeadline: 'غير محدد',
  noPlace: 'لم يتم تحديد المدينة',
  packageAmount: 'المبلغ',
  packageCategory: 'الفئة',
  packageContact: 'جهة الاتصال',
  packageDeadline: 'المهلة',
  packageEyebrow: 'حزمة الاستشارة',
  packageHeading: 'للمكالمة أو الموعد أو الطباعة',
  packagePlace: 'المكان',
  packageSearchTitle: 'البحث عن مساعدة قريبة',
  packageScriptTitle: 'نص للهاتف أو الرسالة',
  packageWhy: 'سبب هذا التقييم',
  phoneEyebrow: 'هاتف أو رسالة',
  phoneHeading: 'ما يمكنك قوله',
  printPdf: 'طباعة / PDF',
  saveCase: 'حفظ الحالة على هذا الجهاز',
  savedCaseContinue: 'متابعة الحالة',
  savedCaseEyebrow: 'محفوظ على هذا الجهاز',
  savedCaseFallback: 'حالة محفوظة',
  savedCaseHeading: 'متابعة الحالة المحفوظة',
  savedCaseSavedAt: 'آخر حفظ في',
  savedUpdate: 'تحديث الحفظ',
  taskDocumentsEyebrow: 'حتى تصبح المحادثات أسهل',
  taskDocumentsTitle: 'تجهيز المستندات',
  taskNextEyebrow: 'خطوة ملموسة الآن',
  taskNextTitle: 'خطة عملك التالية',
  urgencyEyebrow: 'درجة الاستعجال',
};

const uk: ResultExtraTexts = {
  amountUnknown: 'не вказано',
  contactChecklist: [
    'Відкрити відповідне посилання для пошуку.',
    'Подзвонити до установи або надіслати коротке повідомлення.',
    'Записати дату зустрічі, ім’я контактної особи та час.',
    'Скопіювати консультаційний пакет або зберегти як PDF.',
    'Підготувати документи для консультації.',
  ],
  contactTitle: 'Зв’язатися',
  copied: 'Скопійовано',
  copyPackage: 'Скопіювати пакет',
  copyScript: 'Скопіювати текст',
  deadlineWritten: 'є письмовий строк, перевірте дату',
  deleteSavedCase: 'Видалити збережену справу',
  helpExternalNotice:
    'Ці посилання відкривають зовнішній пошук. KlarKommen нічого автоматично не надсилає.',
  helpSearchTitle: 'Знайти допомогу поруч',
  localHelpEyebrow: 'Знайти реальну допомогу',
  noDeadline: 'не вказано',
  noPlace: 'місто не вказано',
  packageAmount: 'Сума',
  packageCategory: 'Категорія',
  packageContact: 'Контакт',
  packageDeadline: 'Строк',
  packageEyebrow: 'Пакет для консультації',
  packageHeading: 'Для розмови, зустрічі або друку',
  packagePlace: 'Місце',
  packageSearchTitle: 'Пошук допомоги поруч',
  packageScriptTitle: 'Текст для телефону або повідомлення',
  packageWhy: 'Чому така оцінка',
  phoneEyebrow: 'Телефон або повідомлення',
  phoneHeading: 'Що можна сказати',
  printPdf: 'Друк / PDF',
  saveCase: 'Зберегти справу на цьому пристрої',
  savedCaseContinue: 'Продовжити справу',
  savedCaseEyebrow: 'Збережено на цьому пристрої',
  savedCaseFallback: 'Збережена справа',
  savedCaseHeading: 'Продовжити збережену справу',
  savedCaseSavedAt: 'востаннє збережено',
  savedUpdate: 'Оновити збереження',
  taskDocumentsEyebrow: 'Щоб розмова була легшою',
  taskDocumentsTitle: 'Підготувати документи',
  taskNextEyebrow: 'Наступний конкретний крок',
  taskNextTitle: 'Ваш план дій',
  urgencyEyebrow: 'Терміновість',
};

const textsByLanguage: Record<Language, ResultExtraTexts> = {
  ar,
  de,
  tr,
  uk,
};

export function getResultExtraTexts(language: Language) {
  return textsByLanguage[language] ?? de;
}
