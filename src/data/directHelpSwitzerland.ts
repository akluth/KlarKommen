import type { Language } from '../i18n';
import type { Answers, CategoryId } from '../types';
import type { DirectHelpContact } from './directHelp';

type SwissContactId =
  | 'conciliation' | 'tenants' | 'debtAdvice' | 'elcom' | 'socialHelp' | 'rav'
  | 'premiumReduction' | 'healthOmbudsman' | 'debtOffice' | 'zek' | 'crif'
  | 'dataProtection' | 'consumerAdvice' | 'victimSupport' | 'help147' | 'help143';

interface CoreContact {
  name: string;
  phoneDisplay?: string;
  phoneHref?: string;
  sourceUrl: string;
  websiteUrl: string;
}

const verifiedAt = '2026-08-04';

const core: Record<SwissContactId, CoreContact> = {
  conciliation: { name: 'Schlichtungsbehörden in Mietsachen', websiteUrl: 'https://www.bwo.admin.ch/de/schlichtungsverfahren', sourceUrl: 'https://www.bwo.admin.ch/de/schlichtungsverfahren' },
  tenants: { name: 'Mieterinnen- und Mieterverband Schweiz', websiteUrl: 'https://www.mieterverband.ch/', sourceUrl: 'https://www.mieterverband.ch/' },
  debtAdvice: { name: 'Schuldenberatung Schweiz', phoneDisplay: '0800 708 708', phoneHref: 'tel:0800708708', websiteUrl: 'https://schulden.ch/fachstellen/', sourceUrl: 'https://schulden.ch/fachstellen/' },
  elcom: { name: 'ElCom – Elektrizitätskommission', websiteUrl: 'https://www.elcom.admin.ch/de/kontaktformular', sourceUrl: 'https://www.elcom.admin.ch/de/kontaktformular' },
  socialHelp: { name: 'SKOS – Anlaufstellen für Betroffene', websiteUrl: 'https://skos.ch/dienstleistungen/anlaufstellen-fuer-betroffene', sourceUrl: 'https://skos.ch/dienstleistungen/anlaufstellen-fuer-betroffene' },
  rav: { name: 'RAV / arbeit.swiss', websiteUrl: 'https://www.arbeit.swiss/de/stellensuchende/anmeldung-und-registrierung', sourceUrl: 'https://www.arbeit.swiss/de/stellensuchende/anmeldung-und-registrierung' },
  premiumReduction: { name: 'Prämienverbilligung – BAG', websiteUrl: 'https://www.bag.admin.ch/de/krankenversicherung-praemienverbilligung', sourceUrl: 'https://www.bag.admin.ch/de/krankenversicherung-praemienverbilligung' },
  healthOmbudsman: { name: 'Ombudsstelle Krankenversicherung', websiteUrl: 'https://om-kv.ch/', sourceUrl: 'https://om-kv.ch/' },
  debtOffice: { name: 'Betreibungsamt / SchKG', websiteUrl: 'https://www.fedlex.admin.ch/eli/cc/11/529_488_529/de', sourceUrl: 'https://www.fedlex.admin.ch/eli/cc/11/529_488_529/de' },
  zek: { name: 'ZEK / IKO – Auskunft', websiteUrl: 'https://www.zek.ch/de-ch/kredit-leasingnehmer/eintrage-zu-meiner-person', sourceUrl: 'https://www.zek.ch/de-ch/ueber-uns' },
  crif: { name: 'CRIF – Selbstauskunft', websiteUrl: 'https://www.crif.ch/privatpersonen/selbstauskunft/', sourceUrl: 'https://www.crif.ch/privatpersonen/selbstauskunft/' },
  dataProtection: { name: 'EDÖB – Datenschutz', websiteUrl: 'https://www.edoeb.admin.ch/de/inkasso-und-kreditwesen', sourceUrl: 'https://www.edoeb.admin.ch/de/inkasso-und-kreditwesen' },
  consumerAdvice: { name: 'Stiftung für Konsumentenschutz', websiteUrl: 'https://www.konsumentenschutz.ch/beratung/', sourceUrl: 'https://www.konsumentenschutz.ch/beratung/' },
  victimSupport: { name: 'Opferhilfe Schweiz', phoneDisplay: '142', phoneHref: 'tel:142', websiteUrl: 'https://www.opferhilfe-schweiz.ch/', sourceUrl: 'https://www.opferhilfe-schweiz.ch/' },
  help147: { name: '147 – Beratung für Kinder und Jugendliche', phoneDisplay: '147', phoneHref: 'tel:147', websiteUrl: 'https://www.147.ch/', sourceUrl: 'https://www.147.ch/' },
  help143: { name: 'Die Dargebotene Hand', phoneDisplay: '143', phoneHref: 'tel:143', websiteUrl: 'https://www.143.ch/', sourceUrl: 'https://www.143.ch/' },
};

const order: Record<CategoryId, SwissContactId[]> = {
  rent: ['conciliation', 'tenants', 'debtAdvice'],
  energy: ['elcom', 'socialHelp', 'debtAdvice'],
  jobcenter: ['rav', 'socialHelp', 'debtAdvice'],
  health: ['premiumReduction', 'healthOmbudsman', 'debtAdvice'],
  garnishment: ['debtOffice', 'debtAdvice', 'socialHelp'],
  schufa: ['zek', 'crif', 'dataProtection'],
  debtCourt: ['debtOffice', 'debtAdvice', 'consumerAdvice'],
  family: ['victimSupport', 'help147', 'help143'],
};

const categoryDescription: Record<Language, Record<CategoryId, string>> = {
  de: { rent: 'Hilft bei Mietrückständen, Kündigung und dem zuständigen Schlichtungsverfahren.', energy: 'Hilft bei Stromrechnung, Abschaltungsandrohung und finanzieller Überbrückung.', jobcenter: 'Hilft bei RAV, Arbeitslosenkasse, Sozialhilfe und kantonalen Zuständigkeiten.', health: 'Hilft bei Krankenkassenprämien, Prämienverbilligung und offenen Forderungen.', garnishment: 'Hilft bei Betreibung, Lohn- oder Kontopfändung und dem Existenzminimum.', schufa: 'Hilft bei ZEK-, IKO- oder CRIF-Daten, Auskunft und Berichtigung.', debtCourt: 'Hilft bei Inkasso, Zahlungsbefehl, Rechtsvorschlag und Betreibung.', family: 'Vertrauliche Unterstützung bei familiärer Krise, Gewalt oder Überforderung.' },
  fr: { rent: 'Aide pour les loyers impayés, la résiliation et la conciliation compétente.', energy: 'Aide pour les factures d’énergie, les menaces de coupure et les difficultés financières.', jobcenter: 'Aide concernant l’ORP, la caisse de chômage, l’aide sociale et les compétences cantonales.', health: 'Aide pour les primes, la réduction de primes et les créances de l’assurance-maladie.', garnishment: 'Aide en cas de poursuite, saisie du salaire ou du compte et calcul du minimum vital.', schufa: 'Aide pour consulter ou rectifier les données ZEK, IKO ou CRIF.', debtCourt: 'Aide pour le recouvrement, le commandement de payer et l’opposition.', family: 'Soutien confidentiel en cas de crise familiale, de violence ou de détresse.' },
  gsw: { rent: 'Hilft bi Mietrückständ, Chündigung und bim zuständige Schlichtigsverfahre.', energy: 'Hilft bi Stromrechnige, Aakündigung vo ere Abschaltig und finanzielle Engpäss.', jobcenter: 'Hilft bi RAV, Arbeitslosechasse, Sozialhilf und kantonale Zuständigkeite.', health: 'Hilft bi Krankekasseprämie, Prämieverbilligung und offne Forderige.', garnishment: 'Hilft bi Betriibig, Lohn- oder Kontopfändig und bim Existenzminimum.', schufa: 'Hilft bi ZEK-, IKO- oder CRIF-Date, Uskunft und Berichtigung.', debtCourt: 'Hilft bi Inkasso, Zahligsbefehl, Rechtsvorschlag und Betriibig.', family: 'Vertroulichi Unterstützig bi Familiekrise, Gwalt oder Überforderig.' },
  tr: { rent: 'Kira borcu, fesih ve yetkili uzlaştırma sürecinde yardımcı olur.', energy: 'Enerji faturası, kesinti tehdidi ve maddi sıkıntıda yardımcı olur.', jobcenter: 'RAV, işsizlik kasası, sosyal yardım ve kanton yetkilerinde yardımcı olur.', health: 'Sağlık sigortası primleri, prim indirimi ve açık borçlarda yardımcı olur.', garnishment: 'Takip, maaş veya hesap haczi ve geçim asgarisinde yardımcı olur.', schufa: 'ZEK, IKO veya CRIF verilerini görme ve düzeltmede yardımcı olur.', debtCourt: 'Tahsilat, ödeme emri, itiraz ve borç takibinde yardımcı olur.', family: 'Aile krizi, şiddet veya bunalmışlıkta gizli destek sunar.' },
  ar: { rent: 'تساعد في متأخرات الإيجار وإنهاء العقد وإجراءات المصالحة المختصة.', energy: 'تساعد في فواتير الطاقة والتهديد بالقطع والضائقة المالية.', jobcenter: 'تساعد بخصوص RAV وصندوق البطالة والمساعدة الاجتماعية والاختصاص الكانتوني.', health: 'تساعد في أقساط التأمين وتخفيض الأقساط والمطالبات المفتوحة.', garnishment: 'تساعد في إجراءات التحصيل وحجز الأجر أو الحساب والحد الأدنى للمعيشة.', schufa: 'تساعد في الاطلاع على بيانات ZEK أو IKO أو CRIF وتصحيحها.', debtCourt: 'تساعد في التحصيل وأمر الدفع والاعتراض وإجراءات التنفيذ.', family: 'دعم سري في الأزمات الأسرية أو العنف أو الضغط الشديد.' },
  uk: { rent: 'Допомагає з боргом за оренду, розірванням договору та процедурою примирення.', energy: 'Допомагає з рахунками за енергію, загрозою відключення та фінансовою скрутою.', jobcenter: 'Допомагає щодо RAV, каси безробіття, соціальної допомоги та кантональних повноважень.', health: 'Допомагає з внесками, зменшенням внесків і боргами медичного страхування.', garnishment: 'Допомагає при стягненні, арешті зарплати чи рахунку та визначенні прожиткового мінімуму.', schufa: 'Допомагає отримати або виправити дані ZEK, IKO чи CRIF.', debtCourt: 'Допомагає з інкасо, платіжним наказом, запереченням і стягненням.', family: 'Конфіденційна підтримка у сімейній кризі, при насильстві чи перевантаженні.' },
};

const commonCopy: Record<Language, { availability: string; limitation: string }> = {
  de: { availability: 'Online erreichbar; regionale Öffnungs- und Beratungszeiten prüfen.', limitation: 'Ein Kontakt wahrt keine Frist und ersetzt keine anwaltliche Vertretung.' },
  fr: { availability: 'Accessible en ligne; vérifiez les horaires et l’offre de votre région.', limitation: 'Une prise de contact ne suspend aucun délai et ne remplace pas une représentation juridique.' },
  gsw: { availability: 'Online erreichbar; regionali Öffnigs- und Beratigsziite prüefe.', limitation: 'En Kontakt wahrt kei Frist und ersetzt kei rechtlichi Vertretig.' },
  tr: { availability: 'Çevrimiçi erişilebilir; bölgesel saatleri ve hizmeti kontrol edin.', limitation: 'İletişim kurmak süreyi durdurmaz ve avukat temsilinin yerini tutmaz.' },
  ar: { availability: 'متاحة عبر الإنترنت؛ تحقق من المواعيد والخدمات المحلية.', limitation: 'التواصل لا يوقف أي مهلة ولا يعوض التمثيل القانوني.' },
  uk: { availability: 'Доступно онлайн; перевірте регіональні години та умови.', limitation: 'Звернення не зупиняє строк і не замінює юридичного представництва.' },
};

export function buildSwissDirectHelpContacts(categoryId: CategoryId, language: Language, _answers: Answers = {}): DirectHelpContact[] {
  return order[categoryId].map((id) => ({
    id,
    ...core[id],
    ...commonCopy[language],
    description: categoryDescription[language][categoryId],
    lastVerifiedAt: verifiedAt,
  }));
}
