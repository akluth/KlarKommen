import type { Category, Question, ResultContent } from '../types';
import type { BaseLanguage as Language } from './index';
import type { de } from './de';

type Translation = typeof de;

const sharedReplacements: Array<[string, string]> = [
  ['Grundsicherungsgeld (früher Bürgergeld)', 'Sozialhilfe bzw. Mindestsicherung'],
  ['Grundsicherungsgeld oder Sozialhilfe', 'Sozialhilfe bzw. Mindestsicherung'],
  ['Jobcenter oder Sozialamt', 'AMS oder zuständige Sozialhilfestelle'],
  ['Jobcenter / Sozialamt', 'AMS / zuständige Sozialhilfestelle'],
  ['Pfändungs- und Überweisungsbeschluss', 'Exekutionsbewilligung oder Zahlungsverbot'],
  ['Sozialgerichtliche Rechtsantragsstelle', 'zuständiges Verwaltungsgericht'],
  ['Verbraucherzentrale Energieberatung', 'Energieberatung der Arbeiterkammer'],
  ['Verbraucherzentrale', 'Arbeiterkammer oder Verein für Konsumenteninformation (VKI)'],
  ['Beratungshilfeschein', 'Verfahrenshilfe'],
  ['Erwerbslosenberatung', 'Arbeitslosenberatung'],
  ['Vollstreckungsgericht', 'Exekutionsgericht'],
  ['Vollstreckungsbescheid', 'rechtskräftiger Zahlungsbefehl oder Exekutionstitel'],
  ['eines gerichtlichen Mahnverfahrens', 'eines bedingten Zahlungsbefehls des Gerichts'],
  ['gerichtliches Mahnverfahren', 'bedingter Zahlungsbefehl des Gerichts'],
  ['gerichtlichen Mahnverfahren', 'bedingten Zahlungsbefehl des Gerichts'],
  ['gerichtlicher Mahnbescheid', 'bedingter Zahlungsbefehl des Gerichts'],
  ['gerichtlichen Mahnbescheid', 'bedingten Zahlungsbefehl des Gerichts'],
  ['Mahnbescheid', 'bedingter Zahlungsbefehl'],
  ['Mahngericht', 'Bezirksgericht'],
  ['Amtsgericht', 'Bezirksgericht'],
  ['Grundsicherungsgeld', 'Sozialhilfe bzw. Mindestsicherung'],
  ['Jobcenter', 'AMS'],
  ['Sozialamt', 'zuständige Sozialhilfestelle'],
  ['Wohngeld', 'Wohnbeihilfe'],
  ['Widerspruchsfrist', 'Beschwerdefrist'],
  ['Widerspruch', 'Beschwerde'],
  ['Abschlagshöhe', 'Höhe der Teilbeträge'],
  ['Abschläge', 'Teilbeträge'],
  ['P-Konto-Bescheinigung', 'Nachweis zu unpfändbaren Beträgen'],
  ['P-Konto', 'Schutz unpfändbarer Beträge'],
  ['Schufa', 'KSV1870 / CRIF'],
  ['SCHUFA', 'KSV1870 / CRIF'],
  ['Jugendamt', 'Kinder- und Jugendhilfe'],
  ['Kita', 'Kindergarten'],
  ['Nebenkostenabrechnung', 'Betriebskostenabrechnung'],
  ['Versichertenkarte', 'e-card'],
  ['Personalausweis', 'amtlicher Lichtbildausweis'],
  ['Sorge-/Umgangsfragen', 'Obsorge- und Kontaktrechtsfragen'],
  ['Sorge, Umgang', 'Obsorge, Kontaktrecht'],
  ['Sorgerecht', 'Obsorge'],
  ['Renten', 'Pensionen'],
  ['Rente', 'Pension'],
  ['Fachanwaltliche', 'Anwaltliche'],
  ['fachanwaltliche', 'anwaltliche'],
  ['drohende Räumung', 'drohende Delogierung'],
];

const languageReplacements: Record<Language, Array<[string, string]>> = {
  de: [
    ['Bei akuter Gefahr: Notruf 112 oder Polizei 110.', 'Bei akuter Gefahr: Rettung 144, Polizei 133 oder Euro-Notruf 112.'],
    ['Du hast einen Bescheid mit laufender Widerspruchsfrist erhalten', 'Du hast einen Bescheid oder Zahlungsbefehl mit laufender Beschwerde- oder Einspruchsfrist erhalten'],
    ['Bei Kontopfändung: Bank und Schuldnerberatung wegen Schutz unpfändbarer Beträge und Freibeträgen kontaktieren.', 'Bei Kontopfändung: Bank, Exekutionsgericht und staatlich anerkannte Schuldenberatung wegen unpfändbarer Beträge und Existenzminimum kontaktieren.'],
    ['Beim AMS oder zuständige Sozialhilfestelle', 'Beim AMS oder bei der zuständigen Sozialhilfestelle'],
    ['Sozialhilfe bzw. Mindestsicherung, Sozialhilfe, Wohnbeihilfe', 'Sozialhilfe bzw. Mindestsicherung oder Wohnbeihilfe'],
    ['Sozialhilfe bzw. Mindestsicherung, Sozialhilfe, Pension oder Unterhalt', 'Sozialhilfe bzw. Mindestsicherung, Pension oder Unterhalt'],
    ['Arbeiterkammer oder Verein für Konsumenteninformation (VKI) oder Energieschuldenberatung', 'Arbeiterkammer, Verein für Konsumenteninformation (VKI) oder Energieschuldenberatung'],
    ['Schuldnerberatung oder Arbeiterkammer oder Verein für Konsumenteninformation (VKI)', 'Schuldnerberatung, Arbeiterkammer oder Verein für Konsumenteninformation (VKI)'],
    ['Bezirksgericht oder Bezirksgericht', 'Bezirksgericht'],
    ['bei gerichtlichem bedingter Zahlungsbefehl', 'bei einem bedingten Zahlungsbefehl'],
    ['Gerichtliche bedingter Zahlungsbefehle', 'Bedingte Zahlungsbefehle des Gerichts'],
    ['eines bedingten Zahlungsbefehl des Gerichts', 'eines bedingten Zahlungsbefehls des Gerichts'],
    ['des Gerichtss', 'des Gerichts'],
    ['beim AMS beziehungsweise zuständige Sozialhilfestelle', 'beim AMS beziehungsweise bei der zuständigen Sozialhilfestelle'],
    ['wegen einer Kontopfändung beziehungsweise wegen Schutz über ein Schutz unpfändbarer Beträge', 'wegen einer Kontopfändung und der Freigabe unpfändbarer Beträge'],
    ['einer möglichen KSV1870 / CRIF- oder Bonitätsproblematik', 'möglicherweise unrichtigen Bonitätsdaten bei KSV1870 oder CRIF'],
    ['AMS-Eingangszone', 'zuständige AMS-Geschäftsstelle'],
    ['Mieterverein', 'Mietervereinigung oder Mieterhilfe'],
    ['Wohnungsnotfallhilfe der Stadt oder Kommune', 'WOHNSCHIRM-Beratungsstelle oder kommunale Wohnberatung'],
    ['Wenn Geld zum Leben fehlt: Eilantrag oder Vorschuss beim AMS ansprechen.', 'Wenn Geld zum Leben fehlt: bei der zuständigen Sozialhilfestelle Soforthilfe und beim AMS eine rasche Klärung ansprechen.'],
    ['Gelber Umschlag mit Zustelldatum', 'Umschlag und Zustellnachweis mit Zustelldatum'],
    ['Elternschaft / Sorge', 'Elternschaft / Obsorge'],
  ],
  tr: [
    ['Sozialhilfe bzw. Mindestsicherung', 'sosyal yardım veya Mindestsicherung'],
    ['zuständige Sozialhilfestelle', 'yetkili sosyal yardım kurumu'],
    ['Schutz unpfändbarer Beträge', 'haczedilemez tutarların korunması'],
    ['Nachweis zu unpfändbaren Beträgen', 'haczedilemez tutarlar için belge'],
    ['Arbeiterkammer oder Verein für Konsumenteninformation (VKI)', 'Arbeiterkammer veya Verein für Konsumenteninformation (VKI)'],
    ['rechtskräftiger Zahlungsbefehl oder Exekutionstitel', 'kesinleşmiş ödeme emri veya icra belgesi'],
    ['bedingter Zahlungsbefehl', 'şartlı ödeme emri'],
    ['Kinder- und Jugendhilfe', 'çocuk ve gençlik yardımı'],
    ['Almanya genelinde', 'Avusturya genelinde'],
    ['Almanya', 'Avusturya'],
    ['110’u', '133’ü'],
    ['110', '133'],
    ['112', '144'],
  ],
  ar: [
    ['Sozialhilfe bzw. Mindestsicherung', 'المساعدة الاجتماعية أو Mindestsicherung'],
    ['zuständige Sozialhilfestelle', 'جهة المساعدة الاجتماعية المختصة'],
    ['Schutz unpfändbarer Beträge', 'حماية المبالغ غير القابلة للحجز'],
    ['Nachweis zu unpfändbaren Beträgen', 'إثبات المبالغ غير القابلة للحجز'],
    ['Arbeiterkammer oder Verein für Konsumenteninformation (VKI)', 'Arbeiterkammer أو Verein für Konsumenteninformation (VKI)'],
    ['rechtskräftiger Zahlungsbefehl oder Exekutionstitel', 'أمر دفع نهائي أو سند تنفيذ'],
    ['bedingter Zahlungsbefehl', 'أمر دفع مشروط'],
    ['Kinder- und Jugendhilfe', 'مساعدة الأطفال والشباب'],
    ['كل ألمانيا', 'كل النمسا'],
    ['ألمانيا', 'النمسا'],
    ['110', '133'],
    ['112', '144'],
  ],
  uk: [
    ['Sozialhilfe bzw. Mindestsicherung', 'соціальна допомога або Mindestsicherung'],
    ['zuständige Sozialhilfestelle', 'відповідний орган соціальної допомоги'],
    ['Schutz unpfändbarer Beträge', 'захист недоторканних сум'],
    ['Nachweis zu unpfändbaren Beträgen', 'підтвердження недоторканних сум'],
    ['Arbeiterkammer oder Verein für Konsumenteninformation (VKI)', 'Arbeiterkammer або Verein für Konsumenteninformation (VKI)'],
    ['rechtskräftiger Zahlungsbefehl oder Exekutionstitel', 'остаточний платіжний наказ або виконавчий документ'],
    ['bedingter Zahlungsbefehl', 'умовний платіжний наказ'],
    ['Kinder- und Jugendhilfe', 'допомога дітям і молоді'],
    ['усій Німеччині', 'всій Австрії'],
    ['Німеччині', 'Австрії'],
    ['110', '133'],
    ['112', '144'],
  ],
};

function replaceText(value: string, language: Language) {
  const replaced = [...sharedReplacements, ...languageReplacements[language]].reduce(
    (text, [from, to]) => text.split(from).join(to),
    value,
  );
  return language === 'de'
    ? replaced.replace(/(\d[\d.]*,\d{2})\u00a0€/g, '€\u00a0$1')
    : replaced;
}

function rewriteValue(value: unknown, language: Language): unknown {
  if (typeof value === 'string') return replaceText(value, language);
  if (Array.isArray(value)) return value.map((item) => rewriteValue(item, language));
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteValue(item, language)]),
    );
  }
  return value;
}

const categoryOverrides: Record<Language, Partial<Record<Category['id'], Partial<Category>>>> = {
  de: {
    rent: {
      title: 'Mietrückstände / Kündigung',
      description: 'Offene Miete, Mahnung, Kündigung oder drohende Delogierung sortieren.',
    },
    energy: {
      title: 'Energieabschaltung / Energieschulden',
      description: 'Drohende oder bereits erfolgte Abschaltung, Teilbeträge und Ratenzahlung planen.',
    },
    jobcenter: {
      title: 'Sozialhilfe / AMS',
      shortTitle: 'Sozialhilfe / AMS',
      description:
        'Sozialhilfe bzw. Mindestsicherung, Arbeitslosengeld, Notstandshilfe, Antrag, Einstellung, Rückforderung oder Bescheid einordnen.',
      primaryContact: 'AMS oder zuständige Sozialhilfestelle',
    },
    garnishment: {
      title: 'Kontopfändung / Existenzminimum',
      shortTitle: 'Kontopfändung',
      description:
        'Kontopfändung, unpfändbare Leistungen, Existenzminimum und Freigabe notwendiger Beträge sortieren.',
      primaryContact: 'Bank, Exekutionsgericht oder staatlich anerkannte Schuldenberatung',
    },
    health: {
      title: 'Krankenversicherung / Beitragsrückstände',
      shortTitle: 'Krankenversicherung',
      description: 'Mahnungen, Beitragsrückstände und gefährdeten Versicherungsschutz strukturieren.',
      primaryContact: 'Krankenversicherungsträger, zum Beispiel ÖGK',
    },
    schufa: {
      title: 'KSV1870 / CRIF / Kredit abgelehnt',
      shortTitle: 'Bonitätsauskunft',
      description: 'Ablehnung, Bonitätsdaten, KSV1870/CRIF-Auskunft und sichere Alternativen abwägen.',
      primaryContact: 'Staatlich anerkannte Schuldenberatung',
    },
    debtCourt: {
      title: 'Inkasso / bedingter Zahlungsbefehl',
      shortTitle: 'Inkasso / Gericht',
      description:
        'Inkassoschreiben, Forderung, bedingten Zahlungsbefehl oder eine bereits laufende Exekution sortieren.',
      primaryContact: 'Inkassounternehmen, Gläubiger oder Bezirksgericht',
    },
  },
  tr: {
    jobcenter: { title: 'Sosyal yardım / AMS', shortTitle: 'Sosyal yardım / AMS', description: 'Sosyal yardım, Mindestsicherung, işsizlik parası, Notstandshilfe, başvuru, durdurma, geri ödeme veya resmî kararı sırala.', primaryContact: 'AMS veya yetkili sosyal yardım kurumu' },
    garnishment: { title: 'Hesap haczi / geçim asgarisi', shortTitle: 'Hesap haczi', description: 'Hesap haczi, haczedilemez ödemeler, geçim asgarisi ve gerekli paranın serbest bırakılmasını sırala.', primaryContact: 'Banka, icra mahkemesi veya devletçe tanınan borç danışması' },
    schufa: { title: 'KSV1870 / CRIF / kredi reddi', shortTitle: 'Kredi bilgileri', description: 'Reddetme, KSV1870/CRIF verileri, ücretsiz öz bilgi ve güvenli seçenekleri değerlendir.', primaryContact: 'Devletçe tanınan borç danışması' },
    debtCourt: { title: 'Tahsilat / şartlı ödeme emri', shortTitle: 'Tahsilat / mahkeme', description: 'Tahsilat yazısını, talebi, şartlı ödeme emrini veya icrayı sırala.', primaryContact: 'Tahsilat şirketi, alacaklı veya Bezirksgericht' },
  },
  ar: {
    jobcenter: { title: 'المساعدة الاجتماعية / AMS', shortTitle: 'المساعدة الاجتماعية / AMS', description: 'رتّب موضوع المساعدة الاجتماعية أو Mindestsicherung أو بدل البطالة أو Notstandshilfe أو الطلب أو الإيقاف أو الاسترداد أو القرار.', primaryContact: 'AMS أو جهة المساعدة الاجتماعية المختصة' },
    garnishment: { title: 'حجز الحساب / الحد الأدنى للمعيشة', shortTitle: 'حجز الحساب', description: 'رتّب حجز الحساب والمدفوعات غير القابلة للحجز والحد الأدنى للمعيشة والإفراج عن المال الضروري.', primaryContact: 'البنك أو محكمة التنفيذ أو استشارة ديون معترف بها رسميا' },
    schufa: { title: 'KSV1870 / CRIF / رفض القرض', shortTitle: 'بيانات الجدارة الائتمانية', description: 'قيّم الرفض وبيانات KSV1870/CRIF والمعلومات الذاتية المجانية والبدائل الآمنة.', primaryContact: 'استشارة ديون معترف بها رسميا' },
    debtCourt: { title: 'تحصيل الديون / أمر دفع مشروط', shortTitle: 'التحصيل / المحكمة', description: 'رتّب خطاب التحصيل والمطالبة وأمر الدفع المشروط أو التنفيذ الجاري.', primaryContact: 'شركة التحصيل أو الدائن أو Bezirksgericht' },
  },
  uk: {
    jobcenter: { title: 'Соціальна допомога / AMS', shortTitle: 'Соціальна допомога / AMS', description: 'Упорядкуйте питання соціальної допомоги, Mindestsicherung, допомоги з безробіття, Notstandshilfe, заяви, припинення, повернення або рішення.', primaryContact: 'AMS або відповідний орган соціальної допомоги' },
    garnishment: { title: 'Арешт рахунку / прожитковий мінімум', shortTitle: 'Арешт рахунку', description: 'Упорядкуйте арешт рахунку, недоторканні виплати, прожитковий мінімум і розблокування необхідних сум.', primaryContact: 'Банк, виконавчий суд або державна визнана боргова консультація' },
    schufa: { title: 'KSV1870 / CRIF / відмова в кредиті', shortTitle: 'Кредитні дані', description: 'Оцініть відмову, дані KSV1870/CRIF, безкоштовну власну інформацію та безпечні альтернативи.', primaryContact: 'Державна визнана боргова консультація' },
    debtCourt: { title: 'Інкасо / умовний платіжний наказ', shortTitle: 'Інкасо / суд', description: 'Упорядкуйте лист інкасо, вимогу, умовний платіжний наказ або поточне виконання.', primaryContact: 'Інкасо-компанія, кредитор або Bezirksgericht' },
  },
};

const germanQuestionOverrides: Record<string, Partial<Question>> = {
  city: { placeholder: 'z. B. 1010 Wien' },
  benefits: { text: 'Beziehst du Sozialhilfe bzw. Mindestsicherung?', },
  jobcenterIssue: {
    text: 'Worum geht es bei Sozialhilfe oder AMS?',
    options: [
      { value: 'Erstantrag', label: 'Erstantrag' },
      { value: 'Weiterbewilligung', label: 'Weitergewährung / Folgeantrag' },
      { value: 'Sanktion', label: 'Leistung eingestellt oder gekürzt' },
      { value: 'Rückforderung', label: 'Rückforderung' },
    ],
  },
  objectionDeadline: {
    text: 'Kennst du die Beschwerdefrist laut Rechtsmittelbelehrung?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' },
      { value: 'abgelaufen', label: 'Vermutlich abgelaufen' },
    ],
  },
  healthIncomeDetails: {
    placeholder: 'z. B. Lohn, Sozialhilfe/Mindestsicherung, selbstständig, kein Einkommen',
  },
  pAccount: {
    text: 'Ist der Schutz unpfändbarer Beträge bereits mit Bank oder Exekutionsgericht geklärt?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' },
      { value: 'beantragt', label: 'Prüfung oder Freigabe beantragt' },
    ],
  },
  garnishmentOrder: {
    text: 'Liegt eine Exekutionsbewilligung oder ein Zahlungsverbot vor?',
  },
  moneyOnAccount: {
    text: 'Gehen Lohn, Sozialhilfe/Mindestsicherung oder Pension auf dieses Konto?',
    options: [
      { value: 'Gehalt', label: 'Lohn oder Gehalt' },
      { value: 'Grundsicherungsgeld', label: 'Sozialhilfe / Mindestsicherung' },
      { value: 'Rente', label: 'Pension' },
      { value: 'Mehreres', label: 'Mehreres' },
      { value: 'nein', label: 'Nein' },
    ],
  },
  creditRejected: { text: 'Wurde ein Kredit wegen KSV1870-, CRIF- oder anderer Bonitätsdaten abgelehnt?' },
  debtLetterType: {
    text: 'Was für ein Schreiben ist es?',
    options: [
      { value: 'inkasso', label: 'Inkassoschreiben' },
      { value: 'mahnbescheid', label: 'Bedingter Zahlungsbefehl des Gerichts' },
      { value: 'vollstreckungsbescheid', label: 'Rechtskräftiger Zahlungsbefehl / Exekution' },
      { value: 'mahnung', label: 'Mahnung vom Gläubiger' },
      { value: 'unklar', label: 'Unklar' },
    ],
  },
  courtYellowEnvelope: { text: 'Kam das Schreiben nachweislich von einem österreichischen Gericht?' },
};

const questionOverrides: Record<Language, Record<string, Partial<Question>>> = {
  de: germanQuestionOverrides,
  tr: {
    city: { placeholder: 'örn. 1010 Wien' },
    benefits: { text: 'Sosyal yardım veya Mindestsicherung alıyor musun?' },
    jobcenterIssue: {
      text: 'Sosyal yardım veya AMS konusunda mesele nedir?',
      options: [
        { value: 'Erstantrag', label: 'İlk başvuru' },
        { value: 'Weiterbewilligung', label: 'Devam / takip başvurusu' },
        { value: 'Sanktion', label: 'Ödeme azaltıldı veya durduruldu' },
        { value: 'Rückforderung', label: 'Geri ödeme talebi' },
      ],
    },
    objectionDeadline: { text: 'Karardaki hukuk yolu açıklamasına göre şikâyet süresini biliyor musun?' },
    healthIncomeDetails: { placeholder: 'örn. maaş, sosyal yardım/Mindestsicherung, serbest çalışma, gelir yok' },
    pAccount: {
      text: 'Haczedilemez tutarların korunması banka veya icra mahkemesiyle netleşti mi?',
      options: [
        { value: 'ja', label: 'Evet' },
        { value: 'nein', label: 'Hayır' },
        { value: 'beantragt', label: 'İnceleme veya serbest bırakma istendi' },
      ],
    },
    garnishmentOrder: { text: 'İcra izni veya ödeme yasağı var mı?' },
    moneyOnAccount: {
      text: 'Bu hesaba maaş, sosyal yardım/Mindestsicherung veya emekli aylığı yatıyor mu?',
      options: [
        { value: 'Gehalt', label: 'Maaş' },
        { value: 'Grundsicherungsgeld', label: 'Sosyal yardım / Mindestsicherung' },
        { value: 'Rente', label: 'Emekli aylığı' },
        { value: 'Mehreres', label: 'Birden fazlası' },
        { value: 'nein', label: 'Hayır' },
      ],
    },
    creditRejected: { text: 'Kredi KSV1870, CRIF veya başka kredi verileri nedeniyle reddedildi mi?' },
    debtLetterType: {
      text: 'Bu ne tür bir yazı?',
      options: [
        { value: 'inkasso', label: 'Tahsilat yazısı' },
        { value: 'mahnbescheid', label: 'Mahkemeden şartlı ödeme emri' },
        { value: 'vollstreckungsbescheid', label: 'Kesinleşmiş ödeme emri / icra' },
        { value: 'mahnung', label: 'Alacaklıdan ihtar' },
        { value: 'unklar', label: 'Belirsiz' },
      ],
    },
    courtYellowEnvelope: { text: 'Yazının Avusturya mahkemesinden geldiği kesin mi?' },
  },
  ar: {
    city: { placeholder: 'مثلا 1010 Wien' },
    benefits: { text: 'هل تتلقى المساعدة الاجتماعية أو Mindestsicherung؟' },
    jobcenterIssue: {
      text: 'ما الموضوع مع المساعدة الاجتماعية أو AMS؟',
      options: [
        { value: 'Erstantrag', label: 'طلب أول' },
        { value: 'Weiterbewilligung', label: 'استمرار / طلب متابعة' },
        { value: 'Sanktion', label: 'تم خفض أو إيقاف المساعدة' },
        { value: 'Rückforderung', label: 'مطالبة باسترداد المال' },
      ],
    },
    objectionDeadline: { text: 'هل تعرف مهلة الشكوى حسب بيان طرق الطعن في القرار؟' },
    healthIncomeDetails: { placeholder: 'مثلا راتب، مساعدة اجتماعية/Mindestsicherung، عمل حر، بلا دخل' },
    pAccount: {
      text: 'هل تم توضيح حماية المبالغ غير القابلة للحجز مع البنك أو محكمة التنفيذ؟',
      options: [
        { value: 'ja', label: 'نعم' },
        { value: 'nein', label: 'لا' },
        { value: 'beantragt', label: 'طُلب الفحص أو الإفراج' },
      ],
    },
    garnishmentOrder: { text: 'هل توجد موافقة تنفيذ أو حظر دفع؟' },
    moneyOnAccount: {
      text: 'هل يصل إلى الحساب راتب أو مساعدة اجتماعية/Mindestsicherung أو معاش؟',
      options: [
        { value: 'Gehalt', label: 'راتب' },
        { value: 'Grundsicherungsgeld', label: 'مساعدة اجتماعية / Mindestsicherung' },
        { value: 'Rente', label: 'معاش' },
        { value: 'Mehreres', label: 'أكثر من نوع' },
        { value: 'nein', label: 'لا' },
      ],
    },
    creditRejected: { text: 'هل رُفض القرض بسبب KSV1870 أو CRIF أو بيانات ائتمانية أخرى؟' },
    debtLetterType: {
      text: 'ما نوع الخطاب؟',
      options: [
        { value: 'inkasso', label: 'خطاب تحصيل' },
        { value: 'mahnbescheid', label: 'أمر دفع مشروط من المحكمة' },
        { value: 'vollstreckungsbescheid', label: 'أمر دفع نهائي / تنفيذ' },
        { value: 'mahnung', label: 'إنذار من الدائن' },
        { value: 'unklar', label: 'غير واضح' },
      ],
    },
    courtYellowEnvelope: { text: 'هل ثبت أن الخطاب من محكمة نمساوية؟' },
  },
  uk: {
    city: { placeholder: 'наприклад 1010 Wien' },
    benefits: { text: 'Ви отримуєте соціальну допомогу або Mindestsicherung?' },
    jobcenterIssue: {
      text: 'Яке питання щодо соціальної допомоги або AMS?',
      options: [
        { value: 'Erstantrag', label: 'Перша заява' },
        { value: 'Weiterbewilligung', label: 'Продовження / наступна заява' },
        { value: 'Sanktion', label: 'Виплату зменшено або припинено' },
        { value: 'Rückforderung', label: 'Вимога повернення' },
      ],
    },
    objectionDeadline: { text: 'Ви знаєте строк скарги з роз’яснення про оскарження в рішенні?' },
    healthIncomeDetails: { placeholder: 'наприклад зарплата, соціальна допомога/Mindestsicherung, самозайнятість, без доходу' },
    pAccount: {
      text: 'Захист недоторканних сум уже з’ясовано з банком або виконавчим судом?',
      options: [
        { value: 'ja', label: 'Так' },
        { value: 'nein', label: 'Ні' },
        { value: 'beantragt', label: 'Перевірку або розблокування запитано' },
      ],
    },
    garnishmentOrder: { text: 'Є дозвіл на виконання або заборона платежу?' },
    moneyOnAccount: {
      text: 'На рахунок надходить зарплата, соціальна допомога/Mindestsicherung або пенсія?',
      options: [
        { value: 'Gehalt', label: 'Зарплата' },
        { value: 'Grundsicherungsgeld', label: 'Соціальна допомога / Mindestsicherung' },
        { value: 'Rente', label: 'Пенсія' },
        { value: 'Mehreres', label: 'Кілька видів' },
        { value: 'nein', label: 'Ні' },
      ],
    },
    creditRejected: { text: 'Кредит відхилили через KSV1870, CRIF або інші кредитні дані?' },
    debtLetterType: {
      text: 'Що це за лист?',
      options: [
        { value: 'inkasso', label: 'Лист інкасо' },
        { value: 'mahnbescheid', label: 'Умовний платіжний наказ суду' },
        { value: 'vollstreckungsbescheid', label: 'Остаточний платіжний наказ / виконання' },
        { value: 'mahnung', label: 'Нагадування кредитора' },
        { value: 'unklar', label: 'Незрозуміло' },
      ],
    },
    courtYellowEnvelope: { text: 'Підтверджено, що лист надійшов від австрійського суду?' },
  },
};

function overrideQuestions(questions: Question[], language: Language) {
  return questions.map((question) => ({ ...question, ...questionOverrides[language][question.id] }));
}

function refineGermanResult(result: ResultContent): ResultContent {
  const exact: Record<string, string> = {
    'Ein Schutz unpfändbarer Beträge ist vorhanden.':
      'Der Schutz unpfändbarer Beträge wurde bereits mit Bank oder Exekutionsgericht geklärt.',
    'Ein Schutz unpfändbarer Beträge ist noch nicht sicher eingerichtet.':
      'Der Schutz unpfändbarer Beträge ist noch nicht geklärt.',
    'Bank schriftlich um Umwandlung in ein Schutz unpfändbarer Beträge oder Bestätigung des Schutz unpfändbarer Beträge bitten.':
      'Bank schriftlich um Auskunft zur Kontopfändung und um Freigabe nachweislich unpfändbarer Beträge bitten.',
    'Bescheinigungen für erhöhte Existenzminimum prüfen, besonders bei Kindern oder Sozialleistungen.':
      'Nachweise zu unpfändbaren Leistungen und Unterhaltspflichten zusammenstellen; das Existenzminimum prüfen lassen.',
    'Schuldnerberatung wegen Nachweis zu unpfändbaren Beträgen und Gläubigerkontakt fragen.':
      'Staatlich anerkannte Schuldenberatung wegen Existenzminimum, Kontofreigabe und Gläubigerkontakt fragen.',
    'Nicht mehrere Schutz unpfändbarer Beträgeen einrichten.':
      'Nicht vorschnell neue Konten eröffnen; zuerst mit Bank oder Schuldenberatung klären, welche Beträge geschützt sind.',
    'Kostenlose Datenkopie bei Auskunfteien prüfen und falsche Einträge reklamieren.':
      'Kostenlose Auskunft nach Art. 15 DSGVO bei KSV1870 und CRIF anfordern und falsche Daten schriftlich berichtigen lassen.',
  };
  return Object.fromEntries(
    Object.entries(result).map(([key, values]) => [
      key,
      (values as string[]).map((value: string) => exact[value] ?? value),
    ]),
  ) as unknown as ResultContent;
}

export function adaptTranslationForAustria(base: Translation, language: Language): Translation {
  const translated = rewriteValue(base, language) as Translation;
  const categories = translated.categories.map((category) => ({
    ...category,
    ...categoryOverrides[language][category.id],
  }));
  const categoryQuestions = Object.fromEntries(
    Object.entries(translated.categoryQuestions).map(([categoryId, questions]) => [
      categoryId,
      overrideQuestions(questions, language),
    ]),
  ) as Translation['categoryQuestions'];

  return {
    ...translated,
    categories,
    commonQuestions: overrideQuestions(translated.commonQuestions, language),
    categoryQuestions,
    buildRecommendations(categoryId, answers) {
      const result = rewriteValue(base.buildRecommendations(categoryId, answers), language) as ResultContent;
      return language === 'de' ? refineGermanResult(result) : result;
    },
    buildAllTemplates(category, answers) {
      const localizedCategory = categories.find((item) => item.id === category.id) ?? category;
      return rewriteValue(base.buildAllTemplates(localizedCategory, answers), language) as ReturnType<Translation['buildAllTemplates']>;
    },
  };
}

export function adaptTextForAustria<T>(value: T, language: Language): T {
  return rewriteValue(value, language) as T;
}
