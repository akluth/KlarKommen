import type { Language } from '../i18n';
import type { Answers, CategoryId } from '../types';
import type { DirectHelpContact } from './directHelp';

type AustrianContactId =
  | 'wohnschirm'
  | 'debtAdvice'
  | 'eControl'
  | 'socialHelp'
  | 'ams'
  | 'oegk'
  | 'patientAdvocacy'
  | 'justiceExecution'
  | 'ksv'
  | 'crif'
  | 'dataProtection'
  | 'workerChamber'
  | 'paymentOrder'
  | 'familyAdvice'
  | 'telephoneCounselling'
  | 'ratAufDraht';

interface AustrianCore {
  phoneDisplay?: string;
  phoneHref?: string;
  sourceUrl: string;
  websiteUrl: string;
}

const verifiedAt = '2026-07-26';

const core: Record<AustrianContactId, AustrianCore> = {
  wohnschirm: {
    websiteUrl: 'https://wohnschirm.at/',
    sourceUrl: 'https://www.oesterreich.gv.at/de/themen/bauen_und_wohnen/wohnen/wohnschirm',
  },
  debtAdvice: {
    websiteUrl: 'https://schuldenberatung.at/beratungsstellen/',
    sourceUrl: 'https://schuldenberatung.at/beratungsstellen/',
  },
  eControl: {
    phoneDisplay: '0800 21 20 20',
    phoneHref: 'tel:0800212020',
    websiteUrl: 'https://www.e-control.at/energie-hotline',
    sourceUrl: 'https://www.e-control.at/energie-hotline',
  },
  socialHelp: {
    websiteUrl:
      'https://www.oesterreich.gv.at/de/lebenslagen/Ich-ben%C3%B6tige-finanzielle-Unterst%C3%BCtzung/finanzielle-unterst%C3%BCtzung-sozialhilfe-bzw-mindestsicherung',
    sourceUrl:
      'https://www.oesterreich.gv.at/de/lebenslagen/Ich-ben%C3%B6tige-finanzielle-Unterst%C3%BCtzung/finanzielle-unterst%C3%BCtzung-sozialhilfe-bzw-mindestsicherung',
  },
  ams: {
    websiteUrl: 'https://www.ams.at/arbeitsuchende/ServiceLine',
    sourceUrl: 'https://www.ams.at/arbeitsuchende/ServiceLine',
  },
  oegk: {
    phoneDisplay: '05 0766-0',
    phoneHref: 'tel:+43507660',
    websiteUrl: 'https://www.gesundheitskasse.at/cdscontent/?contentid=10007.867380',
    sourceUrl: 'https://www.gesundheitskasse.at/cdscontent/?contentid=10007.867380',
  },
  patientAdvocacy: {
    websiteUrl:
      'https://www.oesterreich.gv.at/de/themen/gesundheit/patientenrechte/Seite.3700200',
    sourceUrl:
      'https://www.oesterreich.gv.at/de/themen/gesundheit/patientenrechte/Seite.3700200',
  },
  justiceExecution: {
    websiteUrl:
      'https://www.oesterreich.gv.at/de/themen/gesetze_und_recht/gerichtsorganisation_der_justiz/zivilrecht/3/1/Seite.1010641',
    sourceUrl:
      'https://www.oesterreich.gv.at/de/themen/gesetze_und_recht/gerichtsorganisation_der_justiz/zivilrecht/3/1/Seite.1010641',
  },
  ksv: {
    phoneDisplay: '+43 50 1870-1000',
    phoneHref: 'tel:+435018701000',
    websiteUrl: 'https://www.ksv.at/datenschutzerklaerung',
    sourceUrl: 'https://www.ksv.at/datenschutzerklaerung',
  },
  crif: {
    websiteUrl: 'https://www.crif.at/fuer-privatpersonen/wie-komme-ich-zu-meiner-selbstauskunft/',
    sourceUrl: 'https://www.crif.at/fuer-privatpersonen/wie-komme-ich-zu-meiner-selbstauskunft/',
  },
  dataProtection: {
    websiteUrl: 'https://dsb.gv.at/eingabe-an-die-dsb/beschwerde',
    sourceUrl: 'https://dsb.gv.at/eingabe-an-die-dsb/beschwerde',
  },
  workerChamber: {
    websiteUrl: 'https://www.arbeiterkammer.at/beratung/konsumentenschutz/index.html',
    sourceUrl: 'https://www.arbeiterkammer.at/beratung/konsumentenschutz/index.html',
  },
  paymentOrder: {
    websiteUrl:
      'https://www.oesterreich.gv.at/de/themen/gesetze_und_recht/gerichtsorganisation_der_justiz/zivilrecht/2/1/Seite.1010321',
    sourceUrl:
      'https://www.oesterreich.gv.at/de/themen/gesetze_und_recht/gerichtsorganisation_der_justiz/zivilrecht/2/1/Seite.1010321',
  },
  familyAdvice: {
    websiteUrl: 'https://www.familienberatung.gv.at/',
    sourceUrl: 'https://www.familienberatung.gv.at/faq.html',
  },
  telephoneCounselling: {
    phoneDisplay: '142',
    phoneHref: 'tel:142',
    websiteUrl: 'https://www.telefonseelsorge.at/',
    sourceUrl: 'https://www.oesterreich.gv.at/de/themen/notfaelle_unfaelle_und_kriminalitaet/notrufnummern',
  },
  ratAufDraht: {
    phoneDisplay: '147',
    phoneHref: 'tel:147',
    websiteUrl: 'https://www.rataufdraht.at/',
    sourceUrl: 'https://www.oesterreich.gv.at/de/themen/notfaelle_unfaelle_und_kriminalitaet/notrufnummern',
  },
};

type CompactCopy = Record<AustrianContactId, { name: string; description: string }>;

const de: CompactCopy = {
  wohnschirm: { name: 'WOHNSCHIRM', description: 'Kostenlose Beratung und mögliche Hilfe bei Mietschulden, drohendem Wohnungsverlust oder Energieabschaltung.' },
  debtAdvice: { name: 'Staatlich anerkannte Schuldenberatung', description: 'Kostenlose, unabhängige Beratung zu Schulden, Kontopfändung, Inkasso und Privatkonkurs in ganz Österreich.' },
  eControl: { name: 'E-Control Energie-Hotline', description: 'Kostenlose Beratung zu Strom, Gas, Rechnung, Sperre und Problemen mit Energieunternehmen.' },
  socialHelp: { name: 'Sozialhilfe / Mindestsicherung', description: 'Offizielle Übersicht zu Anspruch und Antrag bei Gemeindeamt, Bezirkshauptmannschaft, Magistrat oder MA 40 in Wien.' },
  ams: { name: 'AMS ServiceLine', description: 'Landesspezifische Telefonnummern und Kontakt zum Arbeitsmarktservice bei Arbeitslosengeld, Notstandshilfe und Bescheiden.' },
  oegk: { name: 'Österreichische Gesundheitskasse (ÖGK)', description: 'Kundenservice zu Versicherung, Beiträgen, Rückständen und möglichen Zahlungsvereinbarungen.' },
  patientAdvocacy: { name: 'Patientenanwaltschaften der Bundesländer', description: 'Kostenlose, unabhängige Unterstützung bei Patientenrechten und Problemen mit Gesundheitseinrichtungen.' },
  justiceExecution: { name: 'Österreichische Justiz – Exekution', description: 'Offizielle Information zu Kontopfändung, unpfändbaren Leistungen und Existenzminimum.' },
  ksv: { name: 'KSV1870 – Auskunft nach Art. 15 DSGVO', description: 'Kostenlose Selbstauskunft über gespeicherte Bonitätsdaten; nicht mit dem kostenpflichtigen InfoPass verwechseln.' },
  crif: { name: 'CRIF – kostenlose Selbstauskunft', description: 'Auskunft über gespeicherte personenbezogene Bonitätsdaten und Grundlage für eine Berichtigung.' },
  dataProtection: { name: 'Österreichische Datenschutzbehörde', description: 'Behördliche Beschwerdestelle, wenn Auskunft oder Berichtigung personenbezogener Daten verweigert wird.' },
  workerChamber: { name: 'Arbeiterkammer – Konsumentenschutz', description: 'Beratung zu Wohnen, Energie, Banken, Krediten, Inkasso, Versicherungen und Verbraucherrechten.' },
  paymentOrder: { name: 'Österreichische Justiz – bedingter Zahlungsbefehl', description: 'Offizielle Erklärung: 14 Tage zum Zahlen oder vier Wochen für einen Einspruch.' },
  familyAdvice: { name: 'Geförderte Familienberatung', description: 'Kostenlose, vertrauliche und anonyme Familien-, Trennungs-, Eltern- und Krisenberatung in ganz Österreich.' },
  telephoneCounselling: { name: 'TelefonSeelsorge 142', description: 'Kostenloses und vertrauliches Gespräch bei Krise, Überforderung, Verlust oder Einsamkeit.' },
  ratAufDraht: { name: 'Rat auf Draht 147', description: 'Kostenlose Hilfe für Kinder, Jugendliche und Bezugspersonen bei Sorgen, Gewalt oder familiären Krisen.' },
};

const tr: CompactCopy = {
  wohnschirm: { name: 'WOHNSCHIRM', description: 'Kira borcu, konut kaybı veya enerji kesintisi tehlikesinde ücretsiz danışma ve olası destek.' },
  debtAdvice: { name: 'Devletçe tanınan borç danışması', description: 'Avusturya genelinde borç, hesap haczi, tahsilat ve kişisel iflas için ücretsiz bağımsız danışma.' },
  eControl: { name: 'E-Control enerji hattı', description: 'Elektrik, gaz, fatura, kesinti ve enerji şirketleriyle sorunlar için ücretsiz danışma.' },
  socialHelp: { name: 'Sosyal yardım / Mindestsicherung', description: 'Haklar ve belediye, kaymakamlık, Magistrat veya Viyana MA 40 başvurusu için resmî bilgi.' },
  ams: { name: 'AMS ServiceLine', description: 'İşsizlik parası, Notstandshilfe ve kararlar için eyalete göre AMS iletişim bilgileri.' },
  oegk: { name: 'Avusturya Sağlık Kasası (ÖGK)', description: 'Sigorta, primler, borçlar ve olası ödeme düzenlemeleri için müşteri hizmeti.' },
  patientAdvocacy: { name: 'Eyalet hasta hakları birimleri', description: 'Hasta hakları ve sağlık kuruluşlarıyla sorunlarda ücretsiz bağımsız destek.' },
  justiceExecution: { name: 'Avusturya adaleti – icra', description: 'Hesap haczi, haczedilemez ödemeler ve geçim asgarisi hakkında resmî bilgi.' },
  ksv: { name: 'KSV1870 – DSGVO Madde 15 bilgisi', description: 'Saklanan kredi verileri için ücretsiz öz bilgi; ücretli InfoPass ile karıştırmayın.' },
  crif: { name: 'CRIF – ücretsiz öz bilgi', description: 'Saklanan kişisel kredi verileri ve düzeltme için bilgi.' },
  dataProtection: { name: 'Avusturya Veri Koruma Kurumu', description: 'Kişisel veri bilgisi veya düzeltme reddedilirse resmî şikâyet yeri.' },
  workerChamber: { name: 'Arbeiterkammer – tüketici koruması', description: 'Konut, enerji, banka, kredi, tahsilat, sigorta ve tüketici hakları danışması.' },
  paymentOrder: { name: 'Avusturya adaleti – şartlı ödeme emri', description: 'Resmî açıklama: ödeme için 14 gün veya itiraz için dört hafta.' },
  familyAdvice: { name: 'Desteklenen aile danışması', description: 'Avusturya genelinde ücretsiz, gizli ve anonim aile, ayrılık, ebeveyn ve kriz danışması.' },
  telephoneCounselling: { name: 'TelefonSeelsorge 142', description: 'Kriz, bunalmışlık, kayıp veya yalnızlıkta ücretsiz ve gizli görüşme.' },
  ratAufDraht: { name: 'Rat auf Draht 147', description: 'Çocuklar, gençler ve yakınları için sorun, şiddet veya aile krizinde ücretsiz yardım.' },
};

const ar: CompactCopy = {
  wohnschirm: { name: 'WOHNSCHIRM', description: 'استشارة مجانية ومساعدة محتملة عند ديون الإيجار أو خطر فقدان السكن أو قطع الطاقة.' },
  debtAdvice: { name: 'استشارة الديون المعترف بها رسميا', description: 'استشارة مجانية ومستقلة في كل النمسا للديون وحجز الحساب والتحصيل والإفلاس الشخصي.' },
  eControl: { name: 'خط الطاقة E-Control', description: 'استشارة مجانية للكهرباء والغاز والفواتير والقطع والمشاكل مع شركات الطاقة.' },
  socialHelp: { name: 'المساعدة الاجتماعية / Mindestsicherung', description: 'معلومات رسمية عن الاستحقاق والتقديم لدى البلدية أو المقاطعة أو Magistrat أو MA 40 في فيينا.' },
  ams: { name: 'خط AMS', description: 'أرقام AMS حسب الولاية للبطالة وNotstandshilfe والقرارات الرسمية.' },
  oegk: { name: 'صندوق الصحة النمساوي (ÖGK)', description: 'خدمة للعملاء حول التأمين والاشتراكات والمتأخرات وترتيبات الدفع الممكنة.' },
  patientAdvocacy: { name: 'مكاتب حقوق المرضى في الولايات', description: 'دعم مجاني ومستقل لحقوق المرضى والمشاكل مع المؤسسات الصحية.' },
  justiceExecution: { name: 'العدل النمساوي – التنفيذ', description: 'معلومات رسمية عن حجز الحساب والمدفوعات غير القابلة للحجز والحد الأدنى للمعيشة.' },
  ksv: { name: 'KSV1870 – معلومات المادة 15 من DSGVO', description: 'معلومات ذاتية مجانية عن بيانات الجدارة الائتمانية؛ لا تخلطها مع InfoPass المدفوع.' },
  crif: { name: 'CRIF – معلومات ذاتية مجانية', description: 'معلومات عن بيانات الجدارة الائتمانية الشخصية المخزنة وأساس طلب التصحيح.' },
  dataProtection: { name: 'هيئة حماية البيانات النمساوية', description: 'جهة شكوى رسمية إذا رُفض الوصول إلى البيانات الشخصية أو تصحيحها.' },
  workerChamber: { name: 'غرفة العمال – حماية المستهلك', description: 'استشارة في السكن والطاقة والبنوك والقروض والتحصيل والتأمين وحقوق المستهلك.' },
  paymentOrder: { name: 'العدل النمساوي – أمر دفع مشروط', description: 'شرح رسمي: 14 يوما للدفع أو أربعة أسابيع لتقديم اعتراض.' },
  familyAdvice: { name: 'الاستشارة الأسرية المدعومة', description: 'استشارة أسرية وأبوية وأزمات مجانية وسرية ومجهولة في كل النمسا.' },
  telephoneCounselling: { name: 'TelefonSeelsorge 142', description: 'محادثة مجانية وسرية عند الأزمة أو الضغط أو الفقد أو الوحدة.' },
  ratAufDraht: { name: 'Rat auf Draht 147', description: 'مساعدة مجانية للأطفال والشباب والمقربين عند القلق أو العنف أو الأزمات الأسرية.' },
};

const uk: CompactCopy = {
  wohnschirm: { name: 'WOHNSCHIRM', description: 'Безкоштовна консультація та можлива допомога з боргом за оренду, загрозою втрати житла чи відключення енергії.' },
  debtAdvice: { name: 'Державна визнана боргова консультація', description: 'Безкоштовна незалежна допомога з боргами, арештом рахунку, інкасо та особистим банкрутством по всій Австрії.' },
  eControl: { name: 'Енергетична лінія E-Control', description: 'Безкоштовна консультація щодо електрики, газу, рахунків, відключення та проблем з постачальником.' },
  socialHelp: { name: 'Соціальна допомога / Mindestsicherung', description: 'Офіційна інформація про право й заяву до громади, районної адміністрації, магістрату або MA 40 у Відні.' },
  ams: { name: 'AMS ServiceLine', description: 'Контакти AMS за федеральною землею щодо допомоги з безробіття, Notstandshilfe та рішень.' },
  oegk: { name: 'Австрійська каса здоров’я (ÖGK)', description: 'Підтримка щодо страхування, внесків, заборгованості та можливої домовленості про оплату.' },
  patientAdvocacy: { name: 'Пацієнтські омбудсмани земель', description: 'Безкоштовна незалежна підтримка з прав пацієнтів і проблем із медичними закладами.' },
  justiceExecution: { name: 'Австрійська юстиція – виконання', description: 'Офіційна інформація про арешт рахунку, недоторканні виплати та прожитковий мінімум.' },
  ksv: { name: 'KSV1870 – інформація за ст. 15 GDPR', description: 'Безкоштовна власна інформація про кредитні дані; не плутайте з платним InfoPass.' },
  crif: { name: 'CRIF – безкоштовна власна інформація', description: 'Інформація про збережені персональні кредитні дані й підстава для виправлення.' },
  dataProtection: { name: 'Австрійський орган захисту даних', description: 'Офіційна скарга, якщо доступ до персональних даних або виправлення відхилено.' },
  workerChamber: { name: 'Arbeiterkammer – захист споживачів', description: 'Консультація щодо житла, енергії, банків, кредитів, інкасо, страхування й прав споживачів.' },
  paymentOrder: { name: 'Австрійська юстиція – умовний платіжний наказ', description: 'Офіційне пояснення: 14 днів на оплату або чотири тижні на заперечення.' },
  familyAdvice: { name: 'Субсидована сімейна консультація', description: 'Безкоштовна, конфіденційна й анонімна допомога сім’ям, батькам та у кризі по всій Австрії.' },
  telephoneCounselling: { name: 'TelefonSeelsorge 142', description: 'Безкоштовна конфіденційна розмова при кризі, перевантаженні, втраті чи самотності.' },
  ratAufDraht: { name: 'Rat auf Draht 147', description: 'Безкоштовна допомога дітям, молоді та близьким при тривозі, насильстві чи сімейній кризі.' },
};

const copy: Record<Language, CompactCopy> = { ar, de, tr, uk };

const common: Record<Language, { availability: string; limitation: string }> = {
  de: {
    availability: 'Website jederzeit; Telefonzeiten und örtliche Zuständigkeit bitte auf der verlinkten Seite prüfen.',
    limitation: 'Der Kontakt ersetzt keine Rechtsberatung und wahrt keine laufende Frist automatisch.',
  },
  tr: {
    availability: 'Site her zaman açık; telefon saatini ve yerel yetkiyi bağlantıdan kontrol et.',
    limitation: 'Bu iletişim hukuk danışmasının yerini almaz ve işleyen süreyi otomatik durdurmaz.',
  },
  ar: {
    availability: 'الموقع متاح دائما؛ تحقق من ساعات الهاتف والاختصاص المحلي في الرابط.',
    limitation: 'الاتصال لا يعوض الاستشارة القانونية ولا يوقف المهلة الجارية تلقائيا.',
  },
  uk: {
    availability: 'Сайт доступний завжди; години телефону й місцеву компетенцію перевірте за посиланням.',
    limitation: 'Контакт не замінює юридичну консультацію й автоматично не зупиняє поточний строк.',
  },
};

const contactOrder: Record<CategoryId, AustrianContactId[]> = {
  rent: ['wohnschirm', 'debtAdvice', 'workerChamber'],
  energy: ['wohnschirm', 'eControl', 'workerChamber'],
  jobcenter: ['socialHelp', 'ams', 'workerChamber'],
  health: ['oegk', 'patientAdvocacy', 'debtAdvice'],
  garnishment: ['debtAdvice', 'justiceExecution', 'workerChamber'],
  schufa: ['ksv', 'crif', 'dataProtection'],
  debtCourt: ['paymentOrder', 'workerChamber', 'debtAdvice'],
  family: ['telephoneCounselling', 'familyAdvice', 'ratAufDraht'],
};

export function buildAustrianDirectHelpContacts(
  categoryId: CategoryId,
  language: Language,
  answers: Answers = {},
): DirectHelpContact[] {
  let ids = [...contactOrder[categoryId]];
  if (categoryId === 'schufa' && answers.basicNeedsAtRisk === 'ja') {
    ids = ['socialHelp', 'debtAdvice', 'workerChamber'];
  }

  return ids.map((id) => ({
    id: `at-${id}`,
    ...core[id],
    ...copy[language][id],
    ...common[language],
    lastVerifiedAt: verifiedAt,
  }));
}
