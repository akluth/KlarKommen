import type { Answers, Category, CategoryId, Question, ResultContent } from '../types';
import type { Language } from './index';
import type { de } from './de';

type Translation = typeof de;
type SpecialLanguage = 'fr' | 'gsw';

const sharedReplacements: Array<[string, string]> = [
  ['Grundsicherungsgeld (früher Bürgergeld)', 'Sozialhilfe'],
  ['Grundsicherungsgeld oder Sozialhilfe', 'Sozialhilfe'],
  ['Grundsicherungsgeld', 'Sozialhilfe'],
  ['Jobcenter oder Sozialamt', 'RAV, Arbeitslosenkasse oder Sozialdienst'],
  ['Jobcenter / Sozialamt', 'RAV / Arbeitslosenkasse / Sozialdienst'],
  ['Jobcenter', 'RAV oder Arbeitslosenkasse'],
  ['Sozialamt', 'Sozialdienst'],
  ['Pfändungs- und Überweisungsbeschluss', 'Pfändungsankündigung oder Pfändungsurkunde'],
  ['P-Konto-Bescheinigung', 'Nachweis für die Berechnung des Existenzminimums'],
  ['P-Konto', 'Schutz des betreibungsrechtlichen Existenzminimums'],
  ['Vollstreckungsgericht', 'Betreibungsamt'],
  ['Vollstreckungsbescheid', 'Fortsetzungsbegehren oder Pfändungsankündigung'],
  ['gerichtliches Mahnverfahren', 'Betreibungsverfahren'],
  ['gerichtlichen Mahnverfahren', 'Betreibungsverfahren'],
  ['gerichtlicher Mahnbescheid', 'Zahlungsbefehl des Betreibungsamts'],
  ['gerichtlichen Mahnbescheid', 'Zahlungsbefehl des Betreibungsamts'],
  ['Mahnbescheid', 'Zahlungsbefehl'],
  ['Mahngericht', 'Betreibungsamt'],
  ['Amtsgericht', 'Betreibungsamt'],
  ['Sozialgerichtliche Rechtsantragsstelle', 'kantonale Rechtsberatungsstelle'],
  ['Beratungshilfeschein', 'unentgeltliche Rechtspflege'],
  ['Verbraucherzentrale Energieberatung', 'kantonale Energie- oder Konsumentenberatung'],
  ['Verbraucherzentrale', 'Konsumentenschutz'],
  ['Schufa', 'ZEK / IKO / CRIF'],
  ['SCHUFA', 'ZEK / IKO / CRIF'],
  ['Wohngeld', 'kantonale oder kommunale Wohnhilfe'],
  ['Jugendamt', 'KESB oder kantonale Familienberatung'],
  ['Kita', 'Kindertagesstätte'],
  ['Nebenkostenabrechnung', 'Nebenkostenabrechnung'],
  ['Personalausweis', 'amtlicher Ausweis'],
  ['Räumung', 'Ausweisung'],
  ['Renten', 'Renten'],
  ['Fachanwaltliche', 'Anwaltliche'],
  ['fachanwaltliche', 'anwaltliche'],
];

const languageReplacements: Record<Language, Array<[string, string]>> = {
  de: [
    ['Bei akuter Gefahr: Notruf 112 oder Polizei 110.', 'Bei akuter Gefahr: Sanitätsnotruf 144, Polizei 117 oder europäischer Notruf 112.'],
    ['Widerspruchsfrist', 'Einsprache- oder Rechtsmittelfrist'],
    ['Widerspruch', 'Einsprache'],
    ['Gelber Umschlag mit Zustelldatum', 'Zahlungsbefehl und Zustellnachweis'],
    ['Erwerbslosenberatung', 'Arbeitslosenberatung'],
  ],
  tr: [['Almanya', 'İsviçre'], ['110', '117']],
  ar: [['ألمانيا', 'سويسرا'], ['110', '117']],
  uk: [['Німеччині', 'Швейцарії'], ['Німеччина', 'Швейцарія'], ['110', '117']],
  fr: [],
  gsw: [],
};

const swissLegalUrgent: Record<Exclude<Language, SpecialLanguage>, string[]> = {
  de: ['Zahlungsbefehl: Wenn du die Forderung bestreitest, erhebe grundsätzlich innert 10 Tagen Rechtsvorschlag beim Betreibungsamt.', 'Mietzinsrückstand: Eine Zahlungsfrist nach Art. 257d OR beträgt bei Wohn- und Geschäftsräumen mindestens 30 Tage.'],
  tr: ['Ödeme emri: Borca itiraz ediyorsanız kural olarak 10 gün içinde Betreibungsamt nezdinde Rechtsvorschlag yapın.', 'Kira borcu: OR 257d uyarınca konut ve işyerlerinde yazılı ödeme süresi en az 30 gündür.'],
  ar: ['أمر الدفع: إذا كنت تعترض على المطالبة، قدّم الاعتراض Rechtsvorschlag لدى Betreibungsamt خلال 10 أيام من حيث المبدأ.', 'متأخرات الإيجار: مهلة الدفع الكتابية للسكن والعمل وفق المادة 257d OR لا تقل عن 30 يوما.'],
  uk: ['Платіжний наказ: якщо ви заперечуєте вимогу, як правило, подайте Rechtsvorschlag до Betreibungsamt протягом 10 днів.', 'Борг за оренду: письмовий строк оплати за ст. 257d OR для житлових і комерційних приміщень становить щонайменше 30 днів.'],
};

function replaceCurrency(value: string, language: Language) {
  let result = value.replace(/€/g, 'CHF');
  if (language === 'de' || language === 'gsw') {
    result = result.replace(/(\d{1,3}(?:\.\d{3})*),(\d{2})\s*CHF/g, (_match, whole, decimals) =>
      `CHF ${String(whole).replace(/\./g, '’')}.${decimals}`,
    );
  }
  return result;
}

function replaceText(value: string, language: Language) {
  const replaced = [...sharedReplacements, ...languageReplacements[language]].reduce(
    (text, [from, to]) => text.split(from).join(to),
    value,
  );
  return replaceCurrency(replaced, language);
}

function rewriteValue(value: unknown, language: Language): unknown {
  if (typeof value === 'string') return replaceText(value, language);
  if (Array.isArray(value)) return value.map((item) => rewriteValue(item, language));
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewriteValue(item, language)]));
  }
  return value;
}

const categories: Record<Language, Category[]> = {
  de: [
    { id: 'rent', title: 'Mietzinsrückstände / Kündigung', shortTitle: 'Mietzins', description: 'Offene Mietzinse, Zahlungsfrist, Kündigung oder drohende Ausweisung sortieren.', primaryContact: 'Vermieterschaft, Mieterverband oder Schlichtungsbehörde' },
    { id: 'energy', title: 'Energieabschaltung / Energieschulden', shortTitle: 'Energie', description: 'Drohende Abschaltung, Akontozahlungen und Zahlungsvereinbarung planen.', primaryContact: 'Energieversorger oder Sozialdienst' },
    { id: 'jobcenter', title: 'Sozialhilfe / RAV', shortTitle: 'Sozialhilfe / RAV', description: 'Sozialhilfe, Arbeitslosenentschädigung, Einstellung in der Anspruchsberechtigung, Rückforderung oder Verfügung einordnen.', primaryContact: 'Sozialdienst, RAV oder Arbeitslosenkasse' },
    { id: 'health', title: 'Krankenkassenprämien / Prämienausstände', shortTitle: 'Krankenkasse', description: 'Mahnung, Zahlungsaufforderung, Betreibung und Prämienverbilligung strukturieren.', primaryContact: 'Krankenkasse oder kantonale Prämienverbilligungsstelle' },
    { id: 'garnishment', title: 'Kontopfändung / Existenzminimum', shortTitle: 'Pfändung', description: 'Pfändung, unpfändbare Leistungen und betreibungsrechtliches Existenzminimum sortieren.', primaryContact: 'Betreibungsamt oder Schuldenberatung' },
    { id: 'schufa', title: 'ZEK / IKO / CRIF / Kredit abgelehnt', shortTitle: 'Bonitätsdaten', description: 'Kreditablehnung, gespeicherte Bonitätsdaten und Auskunftsrecht prüfen.', primaryContact: 'ZEK, CRIF oder Schuldenberatung' },
    { id: 'debtCourt', title: 'Inkasso / Zahlungsbefehl', shortTitle: 'Betreibung', description: 'Inkassoschreiben, Zahlungsbefehl, Rechtsvorschlag oder Fortsetzungsbegehren sortieren.', primaryContact: 'Betreibungsamt oder Schuldenberatung' },
    { id: 'family', title: 'Familie / Lebensumbruch', shortTitle: 'Familie', description: 'Tod, Geburt, Trennung, Scheidung, Kinderbelange oder Erwachsenenschutz sortieren.', primaryContact: 'Familienberatung, KESB oder Opferhilfe' },
  ],
  tr: [
    { id: 'rent', title: 'Kira borcu / fesih', shortTitle: 'Kira', description: 'Açık kirayı, ödeme süresini, feshi veya tahliye riskini sırala.', primaryContact: 'Ev sahibi, kiracılar derneği veya uzlaştırma makamı' },
    { id: 'energy', title: 'Enerji kesintisi / enerji borcu', shortTitle: 'Enerji', description: 'Kesinti riskini, avans ödemelerini ve ödeme planını sırala.', primaryContact: 'Enerji şirketi veya sosyal hizmet' },
    { id: 'jobcenter', title: 'Sosyal yardım / RAV', shortTitle: 'Sosyal yardım / RAV', description: 'Sosyal yardım, işsizlik ödeneği, hakkın durdurulması, geri ödeme veya kararı sırala.', primaryContact: 'Sosyal hizmet, RAV veya işsizlik kasası' },
    { id: 'health', title: 'Sağlık sigortası prim borcu', shortTitle: 'Sağlık sigortası', description: 'İhtar, ödeme çağrısı, icra ve prim indirimi konusunu sırala.', primaryContact: 'Sağlık sigortası veya kanton prim indirimi kurumu' },
    { id: 'garnishment', title: 'Hesap haczi / geçim asgarisi', shortTitle: 'Haciz', description: 'Haczi, korunmuş ödemeleri ve icra geçim asgarisini sırala.', primaryContact: 'Betreibungsamt veya borç danışması' },
    { id: 'schufa', title: 'ZEK / IKO / CRIF / kredi reddi', shortTitle: 'Kredi verileri', description: 'Kredi reddini, kayıtlı verileri ve bilgi hakkını kontrol et.', primaryContact: 'ZEK, CRIF veya borç danışması' },
    { id: 'debtCourt', title: 'Tahsilat / Zahlungsbefehl', shortTitle: 'İcra', description: 'Tahsilat yazısını, ödeme emrini, Rechtsvorschlag veya devam talebini sırala.', primaryContact: 'Betreibungsamt veya borç danışması' },
    { id: 'family', title: 'Aile / yaşam değişikliği', shortTitle: 'Aile', description: 'Ölüm, doğum, ayrılık, boşanma, çocuklar veya koruma konularını sırala.', primaryContact: 'Aile danışması, KESB veya mağdur yardımı' },
  ],
  ar: [
    { id: 'rent', title: 'متأخرات الإيجار / الإنهاء', shortTitle: 'الإيجار', description: 'رتّب الإيجار المفتوح ومهلة الدفع والإنهاء أو خطر الإخلاء.', primaryContact: 'المؤجر أو جمعية المستأجرين أو هيئة الصلح' },
    { id: 'energy', title: 'قطع الطاقة / ديون الطاقة', shortTitle: 'الطاقة', description: 'رتّب خطر القطع والدفعات المسبقة واتفاق الدفع.', primaryContact: 'مزود الطاقة أو الخدمة الاجتماعية' },
    { id: 'jobcenter', title: 'المساعدة الاجتماعية / RAV', shortTitle: 'المساعدة / RAV', description: 'رتّب المساعدة الاجتماعية وتعويض البطالة والإيقاف والاسترداد أو القرار.', primaryContact: 'الخدمة الاجتماعية أو RAV أو صندوق البطالة' },
    { id: 'health', title: 'متأخرات أقساط التأمين الصحي', shortTitle: 'التأمين الصحي', description: 'رتّب الإنذار وطلب الدفع والتحصيل وتخفيض القسط.', primaryContact: 'شركة التأمين أو جهة تخفيض الأقساط في الكانتون' },
    { id: 'garnishment', title: 'حجز الحساب / حد المعيشة', shortTitle: 'الحجز', description: 'رتّب الحجز والمدفوعات المحمية وحد المعيشة في التنفيذ.', primaryContact: 'مكتب التنفيذ Betreibungsamt أو استشارة الديون' },
    { id: 'schufa', title: 'ZEK / IKO / CRIF / رفض القرض', shortTitle: 'بيانات الائتمان', description: 'افحص الرفض والبيانات المخزنة وحق الحصول على المعلومات.', primaryContact: 'ZEK أو CRIF أو استشارة الديون' },
    { id: 'debtCourt', title: 'تحصيل / أمر دفع', shortTitle: 'التنفيذ', description: 'رتّب خطاب التحصيل وأمر الدفع والاعتراض أو طلب الاستمرار.', primaryContact: 'Betreibungsamt أو استشارة الديون' },
    { id: 'family', title: 'الأسرة / تغير الحياة', shortTitle: 'الأسرة', description: 'رتّب الوفاة والولادة والانفصال والطلاق وشؤون الأطفال أو الحماية.', primaryContact: 'استشارة الأسرة أو KESB أو مساعدة الضحايا' },
  ],
  uk: [
    { id: 'rent', title: 'Борг за оренду / розірвання', shortTitle: 'Оренда', description: 'Упорядкуйте борг, строк оплати, розірвання або ризик виселення.', primaryContact: 'Орендодавець, спілка орендарів або орган примирення' },
    { id: 'energy', title: 'Відключення енергії / борг', shortTitle: 'Енергія', description: 'Упорядкуйте ризик відключення, авансові платежі та угоду про оплату.', primaryContact: 'Постачальник енергії або соціальна служба' },
    { id: 'jobcenter', title: 'Соціальна допомога / RAV', shortTitle: 'Допомога / RAV', description: 'Упорядкуйте соціальну допомогу, виплати з безробіття, зупинення права, повернення або рішення.', primaryContact: 'Соціальна служба, RAV або каса безробіття' },
    { id: 'health', title: 'Борг за медичні страхові внески', shortTitle: 'Медстрахування', description: 'Упорядкуйте нагадування, вимогу оплати, стягнення та зниження внесків.', primaryContact: 'Страховик або кантональна служба зниження внесків' },
    { id: 'garnishment', title: 'Арешт рахунку / прожитковий мінімум', shortTitle: 'Арешт', description: 'Упорядкуйте арешт, захищені виплати та виконавчий прожитковий мінімум.', primaryContact: 'Betreibungsamt або боргова консультація' },
    { id: 'schufa', title: 'ZEK / IKO / CRIF / відмова в кредиті', shortTitle: 'Кредитні дані', description: 'Перевірте відмову, збережені дані та право на інформацію.', primaryContact: 'ZEK, CRIF або боргова консультація' },
    { id: 'debtCourt', title: 'Інкасо / платіжний наказ', shortTitle: 'Стягнення', description: 'Упорядкуйте інкасо, платіжний наказ, заперечення або продовження стягнення.', primaryContact: 'Betreibungsamt або боргова консультація' },
    { id: 'family', title: 'Сім’я / зміна життя', shortTitle: 'Сім’я', description: 'Упорядкуйте смерть, народження, розлучення, дітей або захист.', primaryContact: 'Сімейна консультація, KESB або допомога потерпілим' },
  ],
  fr: [
    { id: 'rent', title: 'Arriérés de loyer / résiliation', shortTitle: 'Loyer', description: 'Clarifier les loyers impayés, le délai de paiement, la résiliation ou le risque d’expulsion.', primaryContact: 'Bailleur, association de locataires ou autorité de conciliation' },
    { id: 'energy', title: 'Coupure d’énergie / factures impayées', shortTitle: 'Énergie', description: 'Organiser les démarches face à une coupure, aux acomptes et à un plan de paiement.', primaryContact: 'Fournisseur d’énergie ou service social' },
    { id: 'jobcenter', title: 'Aide sociale / ORP', shortTitle: 'Aide sociale / ORP', description: 'Clarifier l’aide sociale, l’indemnité de chômage, une suspension, une restitution ou une décision.', primaryContact: 'Service social, ORP ou caisse de chômage' },
    { id: 'health', title: 'Primes maladie impayées', shortTitle: 'Assurance-maladie', description: 'Clarifier rappel, sommation, poursuite et réduction des primes.', primaryContact: 'Assureur ou service cantonal de réduction des primes' },
    { id: 'garnishment', title: 'Saisie du compte / minimum vital', shortTitle: 'Saisie', description: 'Clarifier la saisie, les prestations insaisissables et le minimum vital.', primaryContact: 'Office des poursuites ou conseil en désendettement' },
    { id: 'schufa', title: 'ZEK / IKO / CRIF / crédit refusé', shortTitle: 'Données de solvabilité', description: 'Vérifier le refus, les données enregistrées et le droit d’accès.', primaryContact: 'ZEK, CRIF ou conseil en désendettement' },
    { id: 'debtCourt', title: 'Recouvrement / commandement de payer', shortTitle: 'Poursuite', description: 'Clarifier recouvrement, commandement de payer, opposition ou continuation de la poursuite.', primaryContact: 'Office des poursuites ou conseil en désendettement' },
    { id: 'family', title: 'Famille / changement de vie', shortTitle: 'Famille', description: 'Clarifier décès, naissance, séparation, divorce, enfants ou protection.', primaryContact: 'Conseil familial, APEA ou aide aux victimes' },
  ],
  gsw: [
    { id: 'rent', title: 'Mietzinsusständ / Chündigung', shortTitle: 'Mietzins', description: 'Offeni Mietzinse, Zahligsfrist, Chündigung oder e drohendi Uswiisig sortiere.', primaryContact: 'Vermieterschaft, Mieterverband oder Schlichtigsbehörde' },
    { id: 'energy', title: 'Energieabschaltig / Energieschulde', shortTitle: 'Energie', description: 'E drohendi Abschaltig, Akontozahlige und e Zahligsvereinbarig plane.', primaryContact: 'Energieversorger oder Sozialdienst' },
    { id: 'jobcenter', title: 'Sozialhilf / RAV', shortTitle: 'Sozialhilf / RAV', description: 'Sozialhilf, Arbeitsloseentschädigung, Iistellig, Rückforderig oder Verfüegig iordne.', primaryContact: 'Sozialdienst, RAV oder Arbeitslosechasse' },
    { id: 'health', title: 'Chrankekasseprämie / Prämieusständ', shortTitle: 'Chrankekasse', description: 'Mahnung, Zahligsufforderig, Betriibig und Prämieverbilligung sortiere.', primaryContact: 'Chrankekasse oder kantonali Prämieverbilligungsstell' },
    { id: 'garnishment', title: 'Kontopfändig / Existenzminimum', shortTitle: 'Pfändig', description: 'Pfändig, unpfändbari Leistige und s betreibigsrechtliche Existenzminimum sortiere.', primaryContact: 'Betriibigsamt oder Schuldeberatig' },
    { id: 'schufa', title: 'ZEK / IKO / CRIF / Kredit abglehnt', shortTitle: 'Bonitätsdate', description: 'Kreditablehnig, gspeichereti Bonitätsdate und s Uskunftsrecht prüefe.', primaryContact: 'ZEK, CRIF oder Schuldeberatig' },
    { id: 'debtCourt', title: 'Inkasso / Zahligsbefehl', shortTitle: 'Betriibig', description: 'Inkassoschriibe, Zahligsbefehl, Rechtsvorschlag oder Fortsetzigsbegehre sortiere.', primaryContact: 'Betriibigsamt oder Schuldeberatig' },
    { id: 'family', title: 'Familie / Läbesumbruch', shortTitle: 'Familie', description: 'Tod, Geburt, Trennig, Scheidig, Chindstheme oder Schutz sortiere.', primaryContact: 'Familieberatig, KESB oder Opferhilf' },
  ],
};

const changedQuestionOverrides: Record<Language, Record<string, Partial<Question>>> = {
  de: {
    city: { placeholder: 'z. B. 8001 Zürich' }, benefits: { text: 'Beziehst du Sozialhilfe?' },
    jobcenterIssue: { text: 'Worum geht es bei Sozialhilfe, RAV oder Arbeitslosenkasse?', options: [{ value: 'Erstantrag', label: 'Anmeldung / Gesuch' }, { value: 'Weiterbewilligung', label: 'Laufender Anspruch' }, { value: 'Sanktion', label: 'Leistung eingestellt oder gekürzt' }, { value: 'Rückforderung', label: 'Rückforderung' }] },
    objectionDeadline: { text: 'Kennst du die Einsprache- oder Rechtsmittelfrist der Verfügung?' },
    pAccount: { text: 'Ist das betreibungsrechtliche Existenzminimum bereits mit dem Betreibungsamt geklärt?', options: [{ value: 'ja', label: 'Ja' }, { value: 'nein', label: 'Nein' }, { value: 'beantragt', label: 'Abklärung beantragt' }] },
    garnishmentOrder: { text: 'Liegt eine Pfändungsankündigung oder Pfändungsurkunde vor?' },
    moneyOnAccount: { text: 'Gehen Lohn, Sozialhilfe oder Rente auf dieses Konto?', options: [{ value: 'Gehalt', label: 'Lohn' }, { value: 'Grundsicherungsgeld', label: 'Sozialhilfe' }, { value: 'Rente', label: 'Rente' }, { value: 'Mehreres', label: 'Mehreres' }, { value: 'nein', label: 'Nein' }] },
    creditRejected: { text: 'Wurde ein Kredit wegen ZEK-, IKO-, CRIF- oder anderer Bonitätsdaten abgelehnt?' },
    debtLetterType: { text: 'Was für ein Schreiben liegt vor?', options: [{ value: 'inkasso', label: 'Inkassoschreiben' }, { value: 'mahnbrief', label: 'Mahnung des Gläubigers' }, { value: 'mahnbescheid', label: 'Zahlungsbefehl des Betreibungsamts' }, { value: 'vollstreckungsbescheid', label: 'Fortsetzungsbegehren / Pfändungsankündigung' }, { value: 'unklar', label: 'Unklar' }] },
    courtYellowEnvelope: { text: 'Kam ein Zahlungsbefehl vom Betreibungsamt?' },
  },
  tr: {}, ar: {}, uk: {}, fr: {}, gsw: {},
};

for (const language of ['tr', 'ar', 'uk'] as const) {
  changedQuestionOverrides[language] = {
    city: { placeholder: language === 'tr' ? 'örn. 8001 Zürih' : language === 'ar' ? 'مثلا 8001 زيورخ' : 'наприклад 8001 Цюрих' },
    benefits: { text: language === 'tr' ? 'Sosyal yardım alıyor musun?' : language === 'ar' ? 'هل تتلقى مساعدة اجتماعية؟' : 'Ви отримуєте соціальну допомогу?' },
    jobcenterIssue: { text: language === 'tr' ? 'Sosyal yardım, RAV veya işsizlik kasasıyla ilgili konu nedir?' : language === 'ar' ? 'ما الموضوع مع المساعدة الاجتماعية أو RAV أو صندوق البطالة؟' : 'Яке питання щодо соціальної допомоги, RAV або каси безробіття?' },
    pAccount: { text: language === 'tr' ? 'İcra geçim asgarisi Betreibungsamt ile netleşti mi?' : language === 'ar' ? 'هل تم توضيح حد المعيشة مع Betreibungsamt؟' : 'Виконавчий прожитковий мінімум уже з’ясовано з Betreibungsamt?' },
    garnishmentOrder: { text: language === 'tr' ? 'Haciz duyurusu veya tutanağı var mı?' : language === 'ar' ? 'هل يوجد إشعار أو محضر حجز؟' : 'Є повідомлення або акт про арешт?' },
    moneyOnAccount: { text: language === 'tr' ? 'Bu hesaba maaş, sosyal yardım veya emekli aylığı yatıyor mu?' : language === 'ar' ? 'هل يصل إلى الحساب راتب أو مساعدة اجتماعية أو معاش؟' : 'На рахунок надходить зарплата, соціальна допомога або пенсія?' },
    creditRejected: { text: language === 'tr' ? 'Kredi ZEK, IKO, CRIF veya başka kredi verileri nedeniyle reddedildi mi?' : language === 'ar' ? 'هل رُفض القرض بسبب ZEK أو IKO أو CRIF أو بيانات ائتمانية أخرى؟' : 'Кредит відхилили через ZEK, IKO, CRIF або інші кредитні дані?' },
    debtLetterType: { text: language === 'tr' ? 'Hangi yazı geldi?' : language === 'ar' ? 'ما نوع الخطاب؟' : 'Який лист ви отримали?' },
    courtYellowEnvelope: { text: language === 'tr' ? 'Betreibungsamt’tan Zahlungsbefehl geldi mi?' : language === 'ar' ? 'هل وصل أمر دفع من Betreibungsamt؟' : 'Надійшов платіжний наказ від Betreibungsamt?' },
  };
}

const specialUi: Record<SpecialLanguage, Translation['ui']> = {
  fr: {
    back: 'Retour', next: 'Continuer', print: 'Imprimer', copied: 'Copié', copyText: 'Copier le texte', reset: 'Examiner une nouvelle situation', languageLabel: 'Langue',
    heroEyebrow: 'Mettre de l’ordre. Commencer aujourd’hui.', heroClaim: 'Une première orientation lorsque le loyer, l’énergie, l’aide sociale, l’assurance-maladie, le compte ou les données de solvabilité deviennent trop lourds.',
    important: 'Important :', helpPreviewEyebrow: 'Ne restez pas seul·e', helpPreviewTitle: 'Quand chercher une aide réelle', helpPreviewText: 'En cas de délai, de courrier officiel, de coupure ou de saisie, un soutien direct est important. KlarKommen aide à préparer, mais ne remplace pas un conseil personnel.', showAllHelp: 'Voir toutes les indications',
    categoryStep: 'Étape 1', categoryHeading: 'Quelle situation vous correspond le mieux ?', questionStep: 'Étape 2', questionHeading: 'Quelques informations pour y voir clair', progressLabel: (current, total) => `${current} / ${total}`, progressAria: (progress) => `Progression ${progress} pour cent`, showResults: 'Afficher le résultat',
    resultStep: 'Étape 3 · Résultat', resultHeading: 'Votre situation est structurée.', resultIntro: 'Il ne s’agit pas d’une appréciation juridique, mais d’une liste de travail calme pour commencer aujourd’hui.', copyAll: 'Copier tous les résultats', situationTitle: 'Situation en bref', todayTitle: 'À faire aujourd’hui', tomorrowTitle: 'À faire demain', helpTitle: 'Ces services peuvent aider', avoidTitle: 'Erreurs à éviter', templatesEyebrow: 'Modèles', templatesTitle: 'Textes adaptés', resultExportTitle: (title) => `Résultat KlarKommen – ${title}`, templatesExportTitle: 'Modèles de texte :',
    footerNavAria: 'Informations juridiques et aide', imprint: 'Mentions légales', privacy: 'Protection des données', realHelp: 'Quand chercher une aide réelle ?', localDataNotice: 'Vos données restent dans ce navigateur. Un prestataire externe ne reçoit la recherche affichée que lorsque vous ouvrez son lien.', backToStart: 'Retour à l’accueil', legalEyebrow: 'Informations juridiques', imprintDetails: 'Informations sur l’exploitant', contact: 'Contact', note: 'Remarque', privacyTitle: 'Déclaration de confidentialité', privacyLead: 'KlarKommen fonctionne sans compte, sans backend et sans stockage serveur des données relatives à votre situation.', realHelpEyebrow: 'Important', realHelpTitle: 'Quand chercher une aide réelle', realHelpLead: 'KlarKommen peut aider à structurer et préparer. Dans certaines situations, contactez directement un service de conseil, une autorité ou un avocat.', realHelpSignalsTitle: 'Cherchez rapidement du soutien si…', urgentContactsTitle: 'Contacts possibles',
  },
  gsw: {
    back: 'Zrugg', next: 'Wiiter', print: 'Drucke', copied: 'Kopiert', copyText: 'Text kopiere', reset: 'Neui Situation prüefe', languageLabel: 'Spraach',
    heroEyebrow: 'Ruhig sortiere. Hüt afange.', heroClaim: 'E erschti Orientierig, wenn Mietzins, Energie, Sozialhilf, Chrankekasse, Konto oder Bonitätsdate grad z vill wärde.',
    important: 'Wichtig:', helpPreviewEyebrow: 'Nöd elei bliibe', helpPreviewTitle: 'Wänn du richtigi Hilf söttsch sueche', helpPreviewText: 'Wänn Friste, amtlichi Poscht, Abschaltige oder Pfändige im Ruum stönd, isch direkti Unterstützig wichtig. KlarKommen hilft bim Vorbereite, ersetzt aber kei persönligi Beratig.', showAllHelp: 'Alli Hiwiis aluege',
    categoryStep: 'Schritt 1', categoryHeading: 'Weli Situation passt am beschte?', questionStep: 'Schritt 2', questionHeading: 'Es paar Aagabe sortiere', progressLabel: (current, total) => `${current} / ${total}`, progressAria: (progress) => `Fortschritt ${progress} Prozent`, showResults: 'Ergebnis aazeige',
    resultStep: 'Schritt 3 · Ergebnis', resultHeading: 'Dini Situation isch sortiert.', resultIntro: 'Das isch kei rechtlichi Beurteilig, sondern e ruhigi Arbeitsliste, damit du hüt chasch afange.', copyAll: 'Alli Ergebnis kopiere', situationTitle: 'D Lag churz sortiert', todayTitle: 'Was du hüt söttsch mache', tomorrowTitle: 'Was du morn söttsch mache', helpTitle: 'Die Stelle chönnte hälfe', avoidTitle: 'Fähler, wo du söttsch vermiide', templatesEyebrow: 'Vorlage', templatesTitle: 'Passendi Texte', resultExportTitle: (title) => `KlarKommen Ergebnis – ${title}`, templatesExportTitle: 'Textvorlage:',
    footerNavAria: 'Rächtlichs und Hilf', imprint: 'Impressum', privacy: 'Dateschutz', realHelp: 'Wänn richtigi Hilf sueche?', localDataNotice: 'Dini Iigabe bliibed i däm Browser. Erst wenn du en externe Link ufmachsch, bechunnt de Aabieter d aazeigti Suechaafrag.', backToStart: 'Zrugg zur Startsiite', legalEyebrow: 'Rächtlichs', imprintDetails: 'Aagabe zum Betreiber', contact: 'Kontakt', note: 'Hiwiis', privacyTitle: 'Dateschutzerklärig', privacyLead: 'KlarKommen isch ohni Aameldig, Backend und Server-Speicherig vo persönliche Falldate baut.', realHelpEyebrow: 'Wichtig', realHelpTitle: 'Wänn du richtigi Hilf söttsch sueche', realHelpLead: 'KlarKommen cha sortiere und vorbereite. I gwüsse Situatione söttsch direkt e Beratigsstell, Behörde oder en Aawalt kontaktiere.', realHelpSignalsTitle: 'Suech schnäll Unterstützig, wenn…', urgentContactsTitle: 'Möglici nöchsti Kontakte',
  },
};

const specialQuestions: Record<SpecialLanguage, Record<string, string>> = {
  fr: {
    city: 'Dans quelle ville habitez-vous ?', writtenDeadline: 'Y a-t-il un délai écrit ?', deadlineDate: 'Jusqu’à quand court le délai ?', amount: 'Quel est le montant impayé ?', income: 'Avez-vous un revenu ?', benefits: 'Recevez-vous l’aide sociale ?', officialLetter: 'Avez-vous reçu un document officiel ?', contacted: 'Avez-vous déjà pris contact ?', rentTerminated: 'Le bail a-t-il déjà été résilié ?', immediateTermination: 'S’agit-il d’une résiliation extraordinaire ?', evictionClaim: 'Une procédure d’expulsion est-elle déjà engagée ?', openRentMonths: 'Combien de mois de loyer sont impayés ?', landlordInstallments: 'Le bailleur accepte-t-il un paiement échelonné ?', energyBlockStatus: 'La coupure est-elle annoncée ou déjà effectuée ?', children: 'Des enfants mineurs vivent-ils dans le ménage ?', healthReasons: 'Y a-t-il des raisons médicales contre une coupure ?', energyInstallmentsOffered: 'Un paiement échelonné a-t-il déjà été proposé ?', jobcenterIssue: 'Quel est le problème avec l’aide sociale, l’ORP ou la caisse de chômage ?', decisionAvailable: 'Avez-vous reçu une décision ?', decisionDate: 'Quand avez-vous reçu la décision ?', objectionDeadline: 'Connaissez-vous le délai d’opposition ou de recours ?', insuranceType: 'De quelle assurance-maladie s’agit-il ?', healthWarnings: 'Avez-vous reçu des rappels ?', benefitsSuspendedThreat: 'Une suspension de prestations a-t-elle été annoncée ?', healthIncomeDetails: 'Quels revenus avez-vous actuellement ?', pAccount: 'Le minimum vital a-t-il déjà été clarifié avec l’office des poursuites ?', accountGarnished: 'Votre compte est-il saisi ?', garnishmentOrder: 'Avez-vous reçu un avis ou un procès-verbal de saisie ?', moneyOnAccount: 'Le salaire, l’aide sociale ou une rente arrivent-ils sur ce compte ?', moneyPurpose: 'À quoi l’argent est-il nécessaire ?', urgency: 'Quelle est l’urgence ?', regularIncome: 'Avez-vous un revenu régulier ?', creditRejected: 'Un crédit a-t-il été refusé à cause de ZEK, IKO, CRIF ou d’autres données ?', acuteDeadline: 'Y a-t-il un délai urgent ?', debtLetterType: 'Quel document avez-vous reçu ?', claimKnown: 'Connaissez-vous la créance ?', claimDisputed: 'La créance vous paraît-elle fausse ou trop élevée ?', courtYellowEnvelope: 'Avez-vous reçu un commandement de payer de l’office des poursuites ?', debtAlreadyPaid: 'Avez-vous déjà payé quelque chose ?', familyEvent: 'Que se passe-t-il actuellement ?', childrenAffected: 'Des enfants sont-ils directement concernés ?', livingSituationChanged: 'La situation de logement a-t-elle changé ou va-t-elle changer ?', documentsNeeded: 'Faut-il obtenir ou modifier des documents ?', supportNetwork: 'Avez-vous actuellement un soutien fiable ?', familyNotes: 'Que faut-il absolument prendre en compte ?',
  },
  gsw: {
    city: 'I welere Stadt wohnsch du?', writtenDeadline: 'Git s e schriftlichi Frist?', deadlineDate: 'Bis wänn lauft d Frist?', amount: 'Wie höch isch de offeni Betrag?', income: 'Hesch du es Iikomme?', benefits: 'Beziehsch du Sozialhilf?', officialLetter: 'Git s es amtlichs Schriibe?', contacted: 'Hesch du scho Kontakt ufgnoh?', rentTerminated: 'Isch scho kündigt worde?', immediateTermination: 'Gaht s um e usserordentligi Chündigung?', evictionClaim: 'Lauft scho es Uswiisigsverfahre?', openRentMonths: 'Wie vill Monatsmietzinse sind offe?', landlordInstallments: 'Isch d Vermieterschaft zu Ratezahlig bereit?', energyBlockStatus: 'Isch d Abschaltig aakündigt oder scho gmacht?', children: 'Läbed minderjährigi Chind im Huushalt?', healthReasons: 'Git s gsundheitlichi Gründ gege e Abschaltig?', energyInstallmentsOffered: 'Isch scho e Ratezahlig aabote worde?', jobcenterIssue: 'Worum gaht s bi Sozialhilf, RAV oder Arbeitslosechasse?', decisionAvailable: 'Hesch du e Verfüegig?', decisionDate: 'Wänn isch d Verfüegig cho?', objectionDeadline: 'Kennsch d Iisprache- oder Rechtsmittelfrist?', insuranceType: 'Um weli Chrankekasse gaht s?', healthWarnings: 'Hesch Mahnige becho?', benefitsSuspendedThreat: 'Isch e Leistigsufschub aakündigt worde?', healthIncomeDetails: 'Was für Iikünfte hesch du aktuell?', pAccount: 'Isch s Existenzminimum scho mit em Betriibigsamt klärt?', accountGarnished: 'Isch dis Konto pfändet?', garnishmentOrder: 'Git s e Pfändigsaakündigung oder Pfändigsurkund?', moneyOnAccount: 'Chömed Lohn, Sozialhilf oder Rente uf das Konto?', moneyPurpose: 'Für was bruchsch s Gäld?', urgency: 'Wie dringend isch es?', regularIncome: 'Hesch du es regelmässigs Iikomme?', creditRejected: 'Isch en Kredit wäge ZEK, IKO, CRIF oder andere Bonitätsdate abglehnt worde?', acuteDeadline: 'Git s e akut Frist?', debtLetterType: 'Was für es Schriibe hesch du?', claimKnown: 'Kennsch d Forderig?', claimDisputed: 'Findsch du d Forderig falsch oder z höch?', courtYellowEnvelope: 'Hesch en Zahligsbefehl vom Betriibigsamt becho?', debtAlreadyPaid: 'Hesch scho öppis zahlt?', familyEvent: 'Worum gaht s grad?', childrenAffected: 'Sind Chind direkt betroffe?', livingSituationChanged: 'Hät sich d Wohnsituation verändert oder passiert das bald?', documentsNeeded: 'Muesch Dokument bsorge oder ändere?', supportNetwork: 'Hesch grad verlässligi Unterstützig?', familyNotes: 'Was mues unbedingt mitdänkt werde?',
  },
};

const specialOptionLabels: Record<SpecialLanguage, Record<string, string>> = {
  fr: { ja: 'Oui', nein: 'Non', unklar: 'Pas clair', versucht: 'Essayé, sans réponse', regelmäßig: 'Oui, régulièrement', unregelmäßig: 'Irrégulier', beantragt: 'Demandé', angedroht: 'Annoncé', durchgeführt: 'Déjà effectué', abgelehnt: 'Oui, mais refusé', Erstantrag: 'Inscription / demande', Weiterbewilligung: 'Droit en cours', Sanktion: 'Prestation réduite ou suspendue', Rückforderung: 'Demande de restitution', abgelaufen: 'Probablement échu', gesetzlich: 'Assurance de base', privat: 'Assurance complémentaire / privée', angekündigt: 'Annoncé', Gehalt: 'Salaire', Grundsicherungsgeld: 'Aide sociale', Rente: 'Rente', Mehreres: 'Plusieurs', heute: 'Aujourd’hui ou demain', woche: 'Cette semaine', monat: 'Ce mois-ci', vermutlich: 'Probablement', inkasso: 'Lettre de recouvrement', mahnbrief: 'Rappel du créancier', mahnbescheid: 'Commandement de payer', vollstreckungsbescheid: 'Continuation / avis de saisie', teilweise: 'Partiellement', tod: 'Décès / deuil', geburt: 'Naissance / grossesse', trennung: 'Séparation', scheidung: 'Divorce', elternschaft: 'Parentalité / autorité parentale', mehreres: 'Plusieurs éléments', bald: 'Probablement bientôt' },
  gsw: { ja: 'Ja', nein: 'Nei', unklar: 'Unklar', versucht: 'Versuecht, aber kei Antwort', regelmäßig: 'Ja, regelmässig', unregelmäßig: 'Unregelmässig', beantragt: 'Beantragt', angedroht: 'Aakündigt', durchgeführt: 'Scho gmacht', abgelehnt: 'Ja, aber abglehnt', Erstantrag: 'Aameldig / Gsuech', Weiterbewilligung: 'Laufende Aaspruch', Sanktion: 'Leistig kürzt oder iigstellt', Rückforderung: 'Rückforderig', abgelaufen: 'Vermutlich abgloffe', gesetzlich: 'Grundversicherig', privat: 'Zuesatz- oder Privatversicherig', angekündigt: 'Aakündigt', Gehalt: 'Lohn', Grundsicherungsgeld: 'Sozialhilf', Rente: 'Rente', Mehreres: 'Mehres', heute: 'Hüt oder morn', woche: 'Die Wuche', monat: 'Dä Monet', vermutlich: 'Vermutlich', inkasso: 'Inkassoschriibe', mahnbrief: 'Mahnung vom Gläubiger', mahnbescheid: 'Zahligsbefehl', vollstreckungsbescheid: 'Fortsetzig / Pfändigsaakündigung', teilweise: 'Teilwiis', tod: 'Tod / Truurfall', geburt: 'Geburt / Schwangerschaft', trennung: 'Trennig', scheidung: 'Scheidig', elternschaft: 'Elteresii / elterlichi Sorg', mehreres: 'Mehres gliichziitig', bald: 'Vermutlich bald' },
};

const specialPlaceholders: Record<SpecialLanguage, Record<string, string>> = {
  fr: {
    city: 'p. ex. 1200 Genève',
    amount: 'Montant en CHF',
    openRentMonths: 'p. ex. 2',
    healthIncomeDetails: 'p. ex. salaire, aide sociale, activité indépendante, aucun revenu',
    moneyPurpose: 'p. ex. loyer, énergie, voiture ou déménagement',
    familyNotes: 'p. ex. rendez-vous, garde, succession, entretien, logement ou autorité parentale',
  },
  gsw: {
    city: 'z. B. 8001 Züri',
    amount: 'Betrag i CHF',
    openRentMonths: 'z. B. 2',
    healthIncomeDetails: 'z. B. Lohn, Sozialhilf, selbständig oder kei Iikomme',
    moneyPurpose: 'z. B. Miete, Energie, Auto oder Umzug',
    familyNotes: 'z. B. Termin, Chindebetreuig, Erbe, Unterhalt, Wohnig oder Sorgerechtsfrage',
  },
};

function localizeSpecialQuestions(questions: Question[], language: SpecialLanguage) {
  return questions.map((question) => ({
    ...question,
    text: specialQuestions[language][question.id] ?? question.text,
    help: question.help ? (language === 'fr' ? 'Ajoutez les informations disponibles; laissez vide si vous ne savez pas.' : 'Trag i, was du weisch; wenn du s nöd weisch, lah s Feld leer.') : undefined,
    placeholder: question.placeholder ? (specialPlaceholders[language][question.id] ?? question.placeholder) : undefined,
    options: question.options?.map((option) => ({ ...option, label: specialOptionLabels[language][option.value] ?? option.label })),
  }));
}

const specialLegal: Record<SpecialLanguage, Translation['legal']> = {
  fr: {
    realHelpSignals: ['Vous avez reçu un commandement de payer, une convocation ou un autre courrier officiel.', 'L’électricité, le gaz ou l’eau sont coupés ou vont l’être immédiatement.', 'Votre compte est saisi et l’argent nécessaire au loyer, à la nourriture ou aux médicaments est bloqué.', 'Une décision ou un délai d’opposition ou de recours est en cours.', 'Un traitement ou des médicaments indispensables sont menacés.', 'Vous vous sentez dépassé·e, menacé·e ou en danger.'],
    urgentContacts: ['Danger immédiat : ambulance 144, police 117 ou numéro européen 112.', 'Commandement de payer : l’opposition doit en principe être formée dans les 10 jours.', 'Loyer ou énergie : contactez le service social communal ou cantonal et un service spécialisé.', 'Saisie : contactez immédiatement l’office des poursuites et un conseil en désendettement.'],
    privacySections: [
      { title: 'En bref', text: 'KlarKommen traite vos données uniquement dans ce navigateur. Il n’existe ni compte ni base de données pour vos informations.' },
      { title: 'Responsable', text: 'Alexander Kluth, Kaistraße 2, 40221 Düsseldorf, Allemagne. E-mail : alex@denkwerk-kluth.de' },
      { title: 'Données traitées', text: 'Les informations sur votre situation servent uniquement à produire localement des indications et des modèles de texte.' },
      { title: 'Aucun stockage serveur', text: 'Un cas enregistré reste dans le stockage local de cet appareil jusqu’à sa suppression.' },
      { title: 'Liens externes', text: 'Un service externe ne reçoit des données que si vous ouvrez un lien ou passez un appel.' },
      { title: 'Hébergement', text: 'Cloudflare peut traiter les données techniques nécessaires à la livraison et à la protection du site.' },
      { title: 'Prise de contact', text: 'Les informations transmises par e-mail ou téléphone sont utilisées pour traiter votre demande.' },
      { title: 'Vos droits', text: 'Vous pouvez demander accès, rectification, effacement ou limitation selon les règles applicables.' },
    ],
  },
  gsw: {
    realHelpSignals: ['Du hesch en Zahligsbefehl, e Vorladig oder anderi amtlichi Poscht becho.', 'Strom, Gas oder Wasser sind scho abgstellt oder d Abschaltig staht grad bevor.', 'Dis Konto isch pfändet und du chunsch nöd a s Gäld für Mietzins, Ässe oder Medikament.', 'Du hesch e Verfüegig mit laufender Iisprache- oder Rechtsmittelfrist.', 'Behandlig oder wichtigi Medikament sind akut gfährdet.', 'Du fühlsch di überforderet, bedroht oder nüm sicher.'],
    urgentContacts: ['Bi akuter Gfahr: Sanität 144, Polizei 117 oder europäische Notruf 112.', 'Bi eme Zahligsbefehl: De Rechtsvorschlag mues grundsätzlich innert 10 Täg gmacht werde.', 'Bi Mietzins- oder Energieschulde: Sozialdienst und Fachberatig kontaktiere.', 'Bi ere Pfändig: Sofort s Betriibigsamt und e Schuldeberatig kontaktiere.'],
    privacySections: [
      { title: 'Churzfassig', text: 'KlarKommen verarbeitet dini Iigabe nur lokal i dim Browser. Es git kei Konto und kei Datebank für dini Aagabe.' },
      { title: 'Verantwortlich', text: 'Alexander Kluth, Kaistraße 2, 40221 Düsseldorf, Dütschland. E-Mail: alex@denkwerk-kluth.de' },
      { title: 'Weli Date wärded verarbeitet?', text: 'Dini Situationsaagabe wärded nur bruucht, zum lokal Hiwiis und Textvorlage z erstelle.' },
      { title: 'Kei Server-Speicherig', text: 'En gspeicherete Fall bliibt lokal uf däm Grät, bis du en löschsch.' },
      { title: 'Externi Links', text: 'Externi Aabieter bechömed erst Date, wenn du en Link ufmachsch oder aalüütsch.' },
      { title: 'Hosting', text: 'Cloudflare cha technisch nötigi Zuegriffsdate verarbeite, zum d Siite uszlieferä und z schütze.' },
      { title: 'Kontakt', text: 'Aagabe per E-Mail oder Telefon wärded für d Bearbeitig vo dinere Aafrag bruucht.' },
      { title: 'Dini Rächt', text: 'Du chasch im Rahme vo de geltende Regle Uskunft, Berichtigung, Löschig oder Iischränkig verlange.' },
    ],
  },
};

const formatChf = (value: string | undefined, language: SpecialLanguage) => {
  const amount = Number(value?.replace(',', '.'));
  if (!value || !Number.isFinite(amount)) return language === 'fr' ? 'montant non indiqué' : 'kei Betrag aageh';
  return new Intl.NumberFormat(language === 'fr' ? 'fr-CH' : 'de-CH', { style: 'currency', currency: 'CHF' }).format(amount);
};

function buildSpecialRecommendations(categoryId: CategoryId, answers: Answers, language: SpecialLanguage): ResultContent {
  const amount = formatChf(answers.amount, language);
  const deadline = answers.deadlineDate || (language === 'fr' ? 'date non indiquée' : 'Datum nöd aageh');
  const city = answers.city ? ` ${language === 'fr' ? 'à' : 'i'} ${answers.city}` : '';
  const common = language === 'fr'
    ? { today: ['Photographiez tous les documents et classez-les par date.', 'Répondez aujourd’hui par écrit et demandez une confirmation.', 'Notez les délais et conservez les preuves d’envoi.'], tomorrow: ['Prenez rendez-vous avec un service spécialisé.', 'Préparez revenus, relevés, contrats et courriers officiels.'], help: [`Conseil en désendettement${city}`, `Service social${city}`], avoid: ['Ne laissez pas les courriers fermés.', 'N’acceptez pas d’échéances que vous ne pouvez pas tenir.', 'Ne remettez que des copies.'] }
    : { today: ['Fotografier alli Schriibe und sortier si nach Datum.', 'Antwort hüt schriftlich und verlang e Bestätigung.', 'Notier alli Friste und sicher d Versandnachwiis.'], tomorrow: ['Mach en Termin bi ere Fachstell ab.', 'Leg Iikommensnachwiis, Konto-uszüg, Verträg und amtlichi Schriibe bereit.'], help: [`Schuldeberatig${city}`, `Sozialdienst${city}`], avoid: ['Lah kei Brief ungeöffnet ligge.', 'Versprich kei Rate, wo du nöd chasch zahle.', 'Gib nur Kopie use.'] };
  const specific: Record<SpecialLanguage, Record<CategoryId, { situation: string[]; today: string[]; tomorrow: string[]; help: string[]; avoid: string[] }>> = {
    fr: {
      rent: { situation: [`Arriérés de loyer : ${amount}.`, `Délai : ${deadline}.`], today: ['Contactez le bailleur par écrit et demandez un délai ou un plan réaliste.', 'En cas de menace de résiliation, mentionnez immédiatement l’art. 257d CO à un service de conseil.'], tomorrow: ['Contactez l’association de locataires ou l’autorité de conciliation.'], help: ['Association suisse des locataires', 'Autorité de conciliation en matière de bail'], avoid: ['Ne rendez pas les clés sans avoir clarifié les conséquences.'] },
      energy: { situation: [`Factures d’énergie impayées : ${amount}.`, `Délai : ${deadline}.`], today: ['Appelez le fournisseur et demandez par écrit le statut de la coupure et un plan de paiement.', 'Signalez immédiatement enfants, appareils médicaux ou risques de santé.'], tomorrow: ['Demandez une aide urgente au service social.'], help: ['Fournisseur d’énergie', 'Service social communal ou cantonal'], avoid: ['Ne manipulez jamais le compteur ou le raccordement.'] },
      jobcenter: { situation: [`Sujet : ${answers.jobcenterIssue || 'non indiqué'}.`, `Délai : ${deadline}.`], today: ['Contactez par écrit le service social, l’ORP ou la caisse de chômage compétente.', 'En absence d’argent vital, demandez explicitement une aide d’urgence.'], tomorrow: ['Faites contrôler la décision et les voies de droit.'], help: ['Service social', 'ORP et caisse de chômage'], avoid: ['Ne laissez pas expirer un délai sans réaction écrite.'] },
      health: { situation: [`Primes impayées : ${amount}.`, `Délai : ${deadline}.`], today: ['Demandez à l’assureur le décompte complet et une solution de paiement.', 'Vérifiez immédiatement votre droit à une réduction individuelle des primes.'], tomorrow: ['Contactez le service cantonal compétent et un conseil indépendant.'], help: ['Assureur-maladie', 'Service cantonal de réduction des primes'], avoid: ['N’ignorez pas la sommation ou la poursuite.'] },
      garnishment: { situation: ['Le compte est saisi ou menacé de saisie.', `Délai : ${deadline}.`], today: ['Contactez immédiatement l’office des poursuites pour le calcul du minimum vital.', 'Documentez salaire, prestations insaisissables et obligations d’entretien.'], tomorrow: ['Faites vérifier la saisie par un conseil en désendettement.'], help: ['Office des poursuites', 'Conseil en désendettement'], avoid: ['Ne déplacez pas des revenus sans clarifier les conséquences.'] },
      schufa: { situation: ['Un crédit ou un contrat a été refusé ou les données semblent incorrectes.', `Besoin financier : ${answers.moneyPurpose || 'non indiqué'}.`], today: ['Résolvez d’abord le besoin essentiel sans prendre de crédit rapide coûteux.', 'Demandez vos données à ZEK/IKO et CRIF selon le droit d’accès.'], tomorrow: ['Contestez par écrit toute donnée fausse auprès de la source.'], help: ['ZEK / IKO', 'CRIF Suisse', 'PFPDT'], avoid: ['Ne payez jamais de frais anticipés pour un crédit prétendument garanti.'] },
      debtCourt: { situation: [`Document : ${answers.debtLetterType || 'non indiqué'}.`, `Montant : ${amount}.`, `Délai : ${deadline}.`], today: ['Si vous avez reçu un commandement de payer, formez opposition dans les 10 jours si vous contestez la créance.', 'Conservez le commandement de payer et la preuve de notification.'], tomorrow: ['Faites vérifier la créance et les frais.'], help: ['Office des poursuites', 'Conseil en désendettement'], avoid: ['Ne confondez pas une lettre d’encaissement avec un commandement de payer officiel.', 'Ne reconnaissez pas une créance contestée sans vérification.'] },
      family: { situation: [`Sujet : ${answers.familyEvent || 'non indiqué'}.`, `Délai : ${deadline}.`], today: ['Notez les personnes concernées, les enfants, le logement et les échéances.', 'En cas de danger, mettez-vous à l’abri et appelez le 117 ou le 144.'], tomorrow: ['Contactez un conseil familial, l’APEA ou l’aide aux victimes selon la situation.'], help: ['Conseil familial', 'APEA / KESB', 'Aide aux victimes'], avoid: ['Ne signez rien d’important sous pression.'] },
    },
    gsw: {
      rent: { situation: [`Offeni Mietzinse: ${amount}.`, `Frist: ${deadline}.`], today: ['Schriib de Vermieterschaft und bitt um e realistischi Ratezahlig oder Frist.', 'Bi ere Chündigungsandrohig: Sofort Mieterverband oder Fachberatig kontaktiere.'], tomorrow: ['Meld di bim Mieterverband oder bi de Schlichtigsbehörde.'], help: ['Mieterverband', 'Schlichtigsbehörde i Mietsache'], avoid: ['Gib d Schlüssel nöd ab, bevor d Folge klärt sind.'] },
      energy: { situation: [`Offeni Energierechnige: ${amount}.`, `Frist: ${deadline}.`], today: ['Rüef de Versorger aa und verlang de Abschaltstatus und e Zahligslösig schriftlich.', 'Meld Chind, medizinischi Grät oder Gsundheitsrisike sofort.'], tomorrow: ['Frag bim Sozialdienst nach dringender Hilf.'], help: ['Energieversorger', 'Kommunale oder kantonale Sozialdienst'], avoid: ['Manipulier nie de Zähler oder Aaschluss.'] },
      jobcenter: { situation: [`Thema: ${answers.jobcenterIssue || 'nöd aageh'}.`, `Frist: ${deadline}.`], today: ['Kontaktiere Sozialdienst, RAV oder Arbeitslosechasse schriftlich.', 'Wenn s Gäld zum Läbe fehlt, verlang ausdrücklich Nothilf.'], tomorrow: ['Lah d Verfüegig und d Rechtsmittelbelehrig prüefe.'], help: ['Sozialdienst', 'RAV und Arbeitslosechasse'], avoid: ['Lah kei Frist ohni schriftlichi Reaktion ablaufe.'] },
      health: { situation: [`Offeni Prämie: ${amount}.`, `Frist: ${deadline}.`], today: ['Verlang vo de Chrankekasse e vollständigi Ufstellig und e Zahligslösig.', 'Prüef sofort de Aaspruch uf Prämieverbilligung.'], tomorrow: ['Kontaktiere d kantonali Stell und e unabhängigi Beratig.'], help: ['Chrankekasse', 'Kantonali Prämieverbilligungsstell'], avoid: ['Ignorier Mahnige und Betriibig nöd.'] },
      garnishment: { situation: ['S Konto isch pfändet oder e Pfändig isch aakündigt.', `Frist: ${deadline}.`], today: ['Kontaktiere sofort s Betriibigsamt für d Berechnig vom Existenzminimum.', 'Sammle Nachwiis zu Lohn, unpfändbare Leistige und Unterhaltspflichte.'], tomorrow: ['Lah d Pfändig vo ere Schuldeberatig prüefe.'], help: ['Betriibigsamt', 'Schuldeberatig'], avoid: ['Verschieb kei Iikünfte, bevor d Folge klärt sind.'] },
      schufa: { situation: ['En Kredit oder Vertrag isch abglehnt worde oder Date sind möglicherwiis falsch.', `Gäldbedarf: ${answers.moneyPurpose || 'nöd aageh'}.`], today: ['Lös s Grundproblem ohni tüüre Sofortkredit.', 'Verlang dini Date bi ZEK/IKO und CRIF mit em Uskunftsrecht.'], tomorrow: ['Beanstand falsch Date schriftlich bi de verantwortliche Stell.'], help: ['ZEK / IKO', 'CRIF Schwiiz', 'EDÖB'], avoid: ['Zahl kei Vorköste für angeblich garantierti Kredit.'] },
      debtCourt: { situation: [`Schriibe: ${answers.debtLetterType || 'nöd aageh'}.`, `Betrag: ${amount}.`, `Frist: ${deadline}.`], today: ['Wenn du en Zahligsbefehl hesch und d Forderig bestriitsch, mach innert 10 Täg Rechtsvorschlag.', 'Sicher de Zahligsbefehl und de Zustellnachwiis.'], tomorrow: ['Lah d Forderig und d Chöste prüefe.'], help: ['Betriibigsamt', 'Schuldeberatig'], avoid: ['Verwechsl es Inkassoschriibe nöd mit eme amtliche Zahligsbefehl.', 'Erkenn kei bestrittnigi Forderig ungeprüeft aa.'] },
      family: { situation: [`Thema: ${answers.familyEvent || 'nöd aageh'}.`, `Frist: ${deadline}.`], today: ['Notier betroffeni Persone, Chind, Wohnig und Friste.', 'Bi Gfahr: Gang a en sichere Ort und rüef 117 oder 144.'], tomorrow: ['Kontaktiere Familieberatig, KESB oder Opferhilf – je nach Situation.'], help: ['Familieberatig', 'KESB', 'Opferhilf'], avoid: ['Underschriib nüt Wichtigs under Druck.'] },
    },
  };
  const own = specific[language][categoryId];
  return { situation: own.situation, today: [...common.today, ...own.today], tomorrow: [...common.tomorrow, ...own.tomorrow], help: [...common.help, ...own.help], avoid: [...common.avoid, ...own.avoid] };
}

function buildSpecialTemplates(category: Category, answers: Answers, language: SpecialLanguage, count: number) {
  const amount = formatChf(answers.amount, language);
  const place = answers.city || (language === 'fr' ? '[NPA localité]' : '[PLZ Ort]');
  const deadline = answers.deadlineDate || (language === 'fr' ? '[date du délai]' : '[Fristdatum]');
  const recipient = category.primaryContact;
  if (language === 'fr') {
    const header = `[Nom]\n[Adresse]\n${place}\n\nÀ :\n${recipient}\n\n`;
    const closing = 'Veuillez confirmer par écrit la réception de ce message.\n\nMeilleures salutations\n[Nom]';
    const context = `Situation : ${category.title}\nMontant : ${amount}\nDélai : ${deadline}`;
    return [
      { label: 'Demande principale', text: `${header}Objet : Demande de clarification et de soutien\n\nMadame, Monsieur,\n\nJe vous contacte au sujet de ${category.title.toLowerCase()}. Je souhaite clarifier rapidement la situation et trouver une solution réaliste.\n\n${context}\n\nJe vous prie de m’indiquer les prochaines étapes et les documents nécessaires.\n\n${closing}` },
      { label: 'Demande de paiement échelonné', text: `${header}Objet : Demande de paiement échelonné\n\nMadame, Monsieur,\n\nJe propose de régler le montant de ${amount} par mensualités supportables. Merci de me transmettre un décompte complet et une proposition écrite.\n\n${context}\n\n${closing}` },
      { label: 'Demande de prolongation du délai', text: `${header}Objet : Demande de prolongation du délai\n\nMadame, Monsieur,\n\nJe demande une prolongation du délai au-delà du ${deadline}, afin de faire vérifier les documents et de proposer une solution viable.\n\n${context}\n\n${closing}` },
      { label: 'Demande de rendez-vous', text: `${header}Objet : Demande de rendez-vous rapide\n\nMadame, Monsieur,\n\nJe souhaite un rendez-vous rapide au sujet de ${category.title.toLowerCase()}. Merci de m’indiquer les documents à préparer.\n\n${context}\n\n${closing}` },
    ].slice(0, count);
  }
  const header = `[Name]\n[Adresse]\n${place}\n\nA:\n${recipient}\n\n`;
  const closing = 'Bitte bestätig mer de Iigang vo dere Nachricht schriftlich.\n\nFründlichi Grüess\n[Name]';
  const context = `Situation: ${category.title}\nBetrag: ${amount}\nFrist: ${deadline}`;
  return [
    { label: 'Hauptvorlag', text: `${header}Betreff: Bitte um Klärig und Unterstützig\n\nGuete Tag\n\nIch meld mi wäge ${category.title}. Ich möcht d Situation schnäll kläre und e realistischi Lösig finde.\n\n${context}\n\nBitte teiled mer d nöchste Schritt und d nötige Unterlage mit.\n\n${closing}` },
    { label: 'Bitte um Ratezahlig', text: `${header}Betreff: Bitte um Ratezahlig\n\nGuete Tag\n\nIch schlah vor, de Betrag vo ${amount} i tragbare monatliche Rate z zahle. Bitte schicked mer e vollständigi Ufstellig und e schriftliche Vorschlag.\n\n${context}\n\n${closing}` },
    { label: 'Bitte um Fristverlängerig', text: `${header}Betreff: Bitte um Fristverlängerig\n\nGuete Tag\n\nIch bitt um e Verlängerig vo de Frist über de ${deadline} use, damit ich d Unterlage prüefe lah und e tragfähigi Lösig vorschlah cha.\n\n${context}\n\n${closing}` },
    { label: 'Bitte um en Termin', text: `${header}Betreff: Bitte um en kurzfristige Termin\n\nGuete Tag\n\nIch möcht en kurzfristige Termin wäge ${category.title}. Bitte teiled mer mit, weli Unterlage ich söll mitbringe.\n\n${context}\n\n${closing}` },
  ].slice(0, count);
}

function buildSpecialTranslation(base: Translation, language: SpecialLanguage): Translation {
  const localizedCategories = categories[language];
  return {
    ...base,
    languageName: language === 'fr' ? 'Français' : 'Schwiizerdütsch',
    disclaimer: language === 'fr'
      ? 'KlarKommen ne remplace pas un conseil juridique. En cas de délai, de résiliation, de saisie ou de courrier officiel, cherchez rapidement une aide professionnelle.'
      : 'KlarKommen ersetzt kei Rechtsberatig. Bi Friste, Chündigunge, Pfändige oder amtlicher Poscht söttsch schnäll professionelli Hilf hole.',
    ui: specialUi[language],
    categories: localizedCategories,
    commonQuestions: localizeSpecialQuestions(base.commonQuestions, language),
    categoryQuestions: Object.fromEntries(Object.entries(base.categoryQuestions).map(([id, questions]) => [id, localizeSpecialQuestions(questions, language)])) as Translation['categoryQuestions'],
    legal: specialLegal[language],
    buildRecommendations: (categoryId, answers) => buildSpecialRecommendations(categoryId, answers, language),
    buildAllTemplates: (category, answers) => buildSpecialTemplates(
      localizedCategories.find((item) => item.id === category.id) ?? category,
      answers,
      language,
      base.buildAllTemplates(category, answers).length,
    ),
  };
}

function overrideChangedQuestions(questions: Question[], language: Language) {
  return questions.map((question) => ({ ...question, ...changedQuestionOverrides[language][question.id] }));
}

export function adaptTranslationForSwitzerland(base: Translation, language: Language): Translation {
  if (language === 'fr' || language === 'gsw') return buildSpecialTranslation(base, language);
  const translated = rewriteValue(base, language) as Translation;
  const localizedCategories = categories[language];
  return {
    ...translated,
    categories: localizedCategories,
    commonQuestions: overrideChangedQuestions(translated.commonQuestions, language),
    categoryQuestions: Object.fromEntries(Object.entries(translated.categoryQuestions).map(([id, questions]) => [id, overrideChangedQuestions(questions, language)])) as Translation['categoryQuestions'],
    legal: { ...translated.legal, urgentContacts: [...swissLegalUrgent[language], ...translated.legal.urgentContacts] },
    buildRecommendations(categoryId, answers) {
      return rewriteValue(base.buildRecommendations(categoryId, answers), language) as ResultContent;
    },
    buildAllTemplates(category, answers) {
      const localized = localizedCategories.find((item) => item.id === category.id) ?? category;
      return rewriteValue(base.buildAllTemplates(localized, answers), language) as ReturnType<Translation['buildAllTemplates']>;
    },
  };
}

export function adaptTextForSwitzerland<T>(value: T, language: Language): T {
  return rewriteValue(value, language) as T;
}
