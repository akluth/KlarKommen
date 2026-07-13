import type { Language } from '../i18n';
import { getQuickHelpTexts, type QuickDeadlineWindow } from '../i18n/quickHelp';
import type { Answers, CategoryId } from '../types';

export interface QuickRiskOption {
  answers: Answers;
  help: string;
  label: string;
  value: string;
}

const riskMappings: Record<CategoryId, Record<string, Answers>> = {
  rent: {
    eviction: { evictionClaim: 'ja', rentTerminated: 'ja' },
    immediateTermination: { immediateTermination: 'ja', rentTerminated: 'ja' },
    termination: { evictionClaim: 'nein', rentTerminated: 'ja' },
    arrears: { evictionClaim: 'nein', immediateTermination: 'nein', rentTerminated: 'nein', quickCategoryConcern: 'ja' },
    unclear: { quickRiskUnclear: 'ja' },
  },
  energy: {
    blocked: { energyBlockStatus: 'durchgeführt' },
    imminent: { energyBlockStatus: 'angedroht', quickCategoryAcute: 'ja' },
    threatened: { energyBlockStatus: 'angedroht' },
    arrears: { energyBlockStatus: 'nicht angedroht', quickCategoryConcern: 'ja' },
    unclear: { quickRiskUnclear: 'ja' },
  },
  jobcenter: {
    noMoney: { basicNeedsAtRisk: 'ja' },
    stopped: { jobcenterIssue: 'Sanktion', quickCategoryAcute: 'ja' },
    deadline: { decisionAvailable: 'ja', quickCategoryConcern: 'ja' },
    application: { jobcenterIssue: 'Erstantrag' },
    unclear: { quickRiskUnclear: 'ja' },
  },
  health: {
    careAtRisk: { careAtRisk: 'ja' },
    suspended: { benefitsSuspendedThreat: 'ja' },
    warnings: { healthWarnings: 'ja' },
    question: { benefitsSuspendedThreat: 'nein', healthWarnings: 'nein' },
    unclear: { quickRiskUnclear: 'ja' },
  },
  garnishment: {
    noAccess: { accountGarnished: 'ja', basicNeedsAtRisk: 'ja', pAccount: 'nein' },
    noPAccount: { accountGarnished: 'ja', pAccount: 'nein' },
    pAccount: { accountGarnished: 'ja', pAccount: 'ja' },
    order: { garnishmentOrder: 'ja', quickCategoryConcern: 'ja' },
    unclear: { quickRiskUnclear: 'ja' },
  },
  schufa: {
    essential: { basicNeedsAtRisk: 'ja', urgency: 'heute' },
    rejected: { creditRejected: 'ja' },
    wrongData: { creditRejected: 'vermutlich', quickCategoryConcern: 'ja' },
    information: { acuteDeadline: 'nein', creditRejected: 'nein', urgency: 'später' },
    unclear: { quickRiskUnclear: 'ja' },
  },
  debtCourt: {
    enforcement: { debtLetterType: 'vollstreckungsbescheid' },
    courtOrder: { courtYellowEnvelope: 'ja', debtLetterType: 'mahnbescheid' },
    inkasso: { debtLetterType: 'inkasso', quickCategoryConcern: 'ja' },
    reminder: { claimKnown: 'unklar', quickCategoryConcern: 'ja' },
    unclear: { quickRiskUnclear: 'ja' },
  },
  family: {
    danger: { safetyAtRisk: 'ja' },
    childrenNoSupport: { childrenAffected: 'ja', supportNetwork: 'nein' },
    housing: { livingSituationChanged: 'ja' },
    transition: { safetyAtRisk: 'nein', supportNetwork: 'ja' },
    unclear: { quickRiskUnclear: 'ja' },
  },
};

export function getQuickRiskOptions(categoryId: CategoryId, language: Language): QuickRiskOption[] {
  const texts = getQuickHelpTexts(language).risks[categoryId];

  return Object.entries(riskMappings[categoryId]).map(([value, answers]) => {
    const optionText = texts.options[value];
    if (!optionText) throw new Error(`Missing quick-help translation for ${categoryId}.${value}`);
    return { answers, value, ...optionText };
  });
}

export function buildQuickAnswers(
  categoryId: CategoryId,
  location: string,
  deadlineWindow: QuickDeadlineWindow,
  riskValue: string,
): Answers {
  const riskAnswers = riskMappings[categoryId][riskValue];
  if (!riskAnswers) throw new Error(`Unknown quick-help risk value: ${categoryId}.${riskValue}`);

  const normalizedLocation = location.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 80);

  return {
    ...riskAnswers,
    ...(normalizedLocation ? { city: normalizedLocation } : {}),
    quickDeadlineWindow: deadlineWindow,
    quickRisk: riskValue,
    triageCompleted: 'ja',
  };
}

const actions: Record<Language, Record<CategoryId, string[]>> = {
  de: {
    rent: [
      'Sichere Kündigung, Klage, Umschlag und Zustelldatum als Foto oder Kopie.',
      'Kontaktiere heute Wohnungsnotfallhilfe, Sozialamt oder Mieterberatung und nenne jede Frist ausdrücklich.',
      'Antworte Vermieter oder Gericht nicht nur telefonisch; halte jeden Kontakt zusätzlich schriftlich fest.',
    ],
    energy: [
      'Rufe den Versorger heute an und frage nach Sperrstatus, Gesamtbetrag und einer schriftlichen Lösung.',
      'Nenne Kinder, medizinische Geräte oder gesundheitliche Risiken sofort und halte Nachweise bereit.',
      'Frage Sozialamt, Jobcenter oder Energieberatung nach kurzfristiger Hilfe; akzeptiere keine untragbare Rate.',
    ],
    jobcenter: [
      'Melde dich heute über Jobcenter-Postfach, Telefon oder persönlich und sichere eine schriftliche Bestätigung.',
      'Wenn Geld für den Lebensunterhalt fehlt, sage ausdrücklich „akute Mittellosigkeit“ und frage nach kurzfristiger Hilfe oder Vorschuss.',
      'Fotografiere Bescheid und Umschlag, notiere das Zustelldatum und lass eine laufende Frist sofort prüfen.',
    ],
    health: [
      'Kontaktiere deine Krankenkasse und verlange den aktuellen Versicherungs- und Beitragsstatus schriftlich.',
      'Wenn Behandlung oder Medikamente gefährdet sind, sage das sofort der Kasse und der behandelnden Stelle.',
      'Bitte um eine tragbare Zahlungsregelung und unabhängige Beratung; bei medizinischer Lebensgefahr gilt 112.',
    ],
    garnishment: [
      'Fordere deine Bank sofort schriftlich zur Umwandlung in ein P-Konto auf und sichere die Bestätigung.',
      'Nutze den offiziellen Justiz-Assistenten für den P-Konto-Antrag und warte damit nicht auf einen Beratungstermin.',
      'Kontaktiere eine anerkannte Schuldnerberatung wegen Freibetrag und möglicher P-Konto-Bescheinigung.',
    ],
    schufa: [
      'Löse zuerst das eigentliche Problem bei Miete, Energie oder Lebensunterhalt; vermeide teure Sofortkredite.',
      'Fordere ausschließlich die kostenlose SCHUFA-Datenkopie an und bewahre sie wegen sensibler Daten sicher auf.',
      'Beanstande falsche Einträge schriftlich bei SCHUFA und dem meldenden Unternehmen und sichere Nachweise.',
    ],
    debtCourt: [
      'Sichere Schreiben, gelben Umschlag und Zustelldatum; prüfe zuerst, ob der Absender ein Gericht ist.',
      'Bei Mahn- oder Vollstreckungsbescheid: Hole sofort Hilfe, denn gerichtliche Fristen laufen unabhängig von Kontaktversuchen weiter.',
      'Erkenne eine unklare Forderung nicht vorschnell an und zahle nicht ungeprüft; nutze Inkasso-Check oder Beratung.',
    ],
    family: [
      'Bei unmittelbarer Gefahr bringe dich und betroffene Kinder an einen sicheren Ort und rufe 110 oder 112.',
      'Notiere, was heute geklärt werden muss: Sicherheit, Kinder, Wohnen, Geld, Dokumente und erreichbare Unterstützung.',
      'Kontaktiere eine Familien- oder Krisenberatung; du musst die gesamte Lage nicht allein auf einmal lösen.',
    ],
  },
  tr: {
    rent: ['Fesih, dava, zarf ve teslim tarihini fotoğraf ya da kopya olarak sakla.', 'Bugün konut acil yardımını, Sozialamt’ı veya kiracı danışmasını ara ve her süreyi açıkça belirt.', 'Ev sahibi veya mahkemeyle görüşmeleri yalnız telefonla bırakma; ayrıca yazılı kaydet.'],
    energy: ['Tedarikçiyi bugün ara; kesinti durumu, toplam borç ve yazılı çözüm iste.', 'Çocukları, tıbbi cihazları veya sağlık risklerini hemen bildir ve belgeleri hazırla.', 'Sozialamt, Jobcenter veya enerji danışmasına kısa vadeli yardım sor; ödeyemeyeceğin taksidi kabul etme.'],
    jobcenter: ['Bugün Jobcenter posta kutusu, telefon veya yüz yüze başvur ve yazılı onay al.', 'Geçim parası yoksa “akute Mittellosigkeit” durumunu açıkça söyle ve kısa vadeli yardım veya avans sor.', 'Karar ve zarfı fotoğraflandır, teslim tarihini yaz ve devam eden süreyi hemen kontrol ettir.'],
    health: ['Sağlık sigortanı ara ve sigorta ile prim durumunu yazılı iste.', 'Tedavi veya ilaç tehlikedeyse bunu hemen sigortaya ve tedavi merkezine bildir.', 'Ödenebilir plan ve bağımsız danışma iste; hayati tıbbi tehlikede 112 geçerlidir.'],
    garnishment: ['Bankandan hesabı hemen yazılı olarak P-Konto’ya çevirmesini iste ve onayı sakla.', 'Resmi adalet P-Konto başvuru aracını kullan; danışma randevusunu bekleme.', 'Muafiyet ve olası P-Konto belgesi için tanınmış borç danışmasını ara.'],
    schufa: ['Önce kira, enerji veya geçim sorununu çöz; pahalı hızlı kredilerden kaçın.', 'Yalnızca ücretsiz SCHUFA veri kopyasını iste ve hassas verileri güvenli sakla.', 'Yanlış kayıtları SCHUFA’ya ve bildiren şirkete yazılı itiraz et; kanıtları sakla.'],
    debtCourt: ['Yazıyı, sarı zarfı ve teslim tarihini sakla; önce gönderenin mahkeme olup olmadığını kontrol et.', 'Mahnbescheid veya Vollstreckungsbescheid varsa hemen yardım al; mahkeme süreleri iletişim denemelerine rağmen işler.', 'Belirsiz borcu hemen kabul etme veya kontrolsüz ödeme yapma; Inkasso-Check ya da danışma kullan.'],
    family: ['Doğrudan tehlikede kendini ve çocukları güvenli yere götür; 110 veya 112’yi ara.', 'Bugün gerekenleri yaz: güvenlik, çocuklar, konut, para, belgeler ve ulaşılabilir destek.', 'Aile veya kriz danışmasını ara; her şeyi tek başına ve aynı anda çözmek zorunda değilsin.'],
  },
  ar: {
    rent: ['احتفظ بصورة أو نسخة من الإنهاء والدعوى والظرف وتاريخ الاستلام.', 'اتصل اليوم بمساعدة الطوارئ السكنية أو Sozialamt أو استشارة المستأجرين واذكر كل مهلة بوضوح.', 'لا تكتف بالمكالمات مع المالك أو المحكمة؛ وثّق كل تواصل كتابة أيضا.'],
    energy: ['اتصل بالمزوّد اليوم واسأل عن حالة القطع والمبلغ الكامل وحل مكتوب.', 'اذكر الأطفال أو الأجهزة الطبية أو المخاطر الصحية فورا وجهّز الأدلة.', 'اسأل Sozialamt أو Jobcenter أو استشارة الطاقة عن مساعدة سريعة ولا تقبل قسطا لا تقدر عليه.'],
    jobcenter: ['تواصل اليوم عبر صندوق Jobcenter أو الهاتف أو شخصيا واحتفظ بتأكيد مكتوب.', 'إذا كان مال المعيشة مفقودا فاذكر بوضوح «akute Mittellosigkeit» واسأل عن مساعدة سريعة أو دفعة مقدمة.', 'صوّر القرار والظرف وسجّل تاريخ الاستلام واطلب فحص أي مهلة جارية فورا.'],
    health: ['اتصل بشركة التأمين واطلب حالة التأمين والاشتراكات الحالية كتابة.', 'إذا كان العلاج أو الدواء مهددا فأبلغ شركة التأمين والجهة العلاجية فورا.', 'اطلب خطة دفع ممكنة واستشارة مستقلة؛ عند خطر طبي على الحياة اتصل بـ112.'],
    garnishment: ['اطلب من البنك فورا وبالكتابة تحويل الحساب إلى P-Konto واحتفظ بالتأكيد.', 'استخدم مساعد العدالة الرسمي لطلب P-Konto ولا تنتظر موعد الاستشارة.', 'اتصل باستشارة ديون معترف بها بخصوص الحد المعفى وشهادة P-Konto.'],
    schufa: ['عالج أولا المشكلة الأصلية في الإيجار أو الطاقة أو المعيشة وتجنب القروض السريعة المكلفة.', 'اطلب فقط نسخة SCHUFA المجانية واحفظها بأمان لأنها حساسة.', 'اعترض كتابة على البيانات الخاطئة لدى SCHUFA والشركة المبلّغة واحتفظ بالأدلة.'],
    debtCourt: ['احتفظ بالرسالة والظرف الأصفر وتاريخ الاستلام وتحقق أولا هل المرسل محكمة.', 'عند Mahnbescheid أو Vollstreckungsbescheid اطلب المساعدة فورا؛ مهلة المحكمة تستمر رغم محاولات الاتصال.', 'لا تعترف بمطالبة غير واضحة ولا تدفع دون فحص؛ استخدم Inkasso-Check أو الاستشارة.'],
    family: ['عند الخطر المباشر انتقل أنت والأطفال إلى مكان آمن واتصل بـ110 أو 112.', 'دوّن ما يجب حله اليوم: الأمان والأطفال والسكن والمال والوثائق والدعم المتاح.', 'اتصل باستشارة أسرية أو للأزمات؛ لا يلزم حل كل شيء وحدك دفعة واحدة.'],
  },
  uk: {
    rent: ['Збережіть фото або копію розірвання, позову, конверта й дати вручення.', 'Сьогодні зверніться до житлової екстреної служби, Sozialamt або консультації орендарів і чітко назвіть кожен строк.', 'Не обмежуйтеся телефоном із власником чи судом; фіксуйте кожен контакт також письмово.'],
    energy: ['Сьогодні зателефонуйте постачальнику й запитайте про стан відключення, загальну суму та письмове рішення.', 'Одразу повідомте про дітей, медичні прилади або ризики для здоров’я й підготуйте докази.', 'Запитайте Sozialamt, Jobcenter або енергоконсультацію про швидку допомогу; не погоджуйтеся на непосильний платіж.'],
    jobcenter: ['Сьогодні зверніться через скриньку Jobcenter, телефоном або особисто й збережіть письмове підтвердження.', 'Якщо немає коштів на життя, прямо скажіть «akute Mittellosigkeit» і запитайте про швидку допомогу або аванс.', 'Сфотографуйте рішення й конверт, запишіть дату вручення та негайно перевірте поточний строк.'],
    health: ['Зв’яжіться зі своєю касою й письмово запросіть поточний страховий статус і стан внесків.', 'Якщо лікування чи ліки під загрозою, негайно повідомте касу та лікувальний заклад.', 'Попросіть посильний план оплати й незалежну консультацію; за загрози життю телефонуйте 112.'],
    garnishment: ['Негайно письмово попросіть банк перетворити рахунок на P-Konto й збережіть підтвердження.', 'Скористайтеся офіційним помічником Justiz для заяви на P-Konto; не чекайте консультації.', 'Зверніться до визнаної боргової консультації щодо ліміту й можливої довідки P-Konto.'],
    schufa: ['Спершу вирішуйте основну проблему оренди, енергії чи засобів на життя; уникайте дорогих швидких кредитів.', 'Замовляйте лише безкоштовну копію даних SCHUFA й безпечно зберігайте чутливі дані.', 'Письмово оскаржте хибні записи у SCHUFA та компанії, що їх подала, і збережіть докази.'],
    debtCourt: ['Збережіть лист, жовтий конверт і дату вручення; спершу перевірте, чи відправник — суд.', 'За Mahnbescheid або Vollstreckungsbescheid негайно шукайте допомогу: судові строки тривають попри спроби зв’язку.', 'Не визнавайте неясну вимогу й не платіть без перевірки; скористайтеся Inkasso-Check або консультацією.'],
    family: ['За безпосередньої небезпеки перейдіть із дітьми в безпечне місце й телефонуйте 110 або 112.', 'Запишіть, що треба владнати сьогодні: безпека, діти, житло, гроші, документи й доступна підтримка.', 'Зверніться до сімейної або кризової консультації; не потрібно вирішувати все самостійно й одночасно.'],
  },
};

export function buildQuickActions(categoryId: CategoryId, language: Language) {
  return actions[language][categoryId];
}

export function isQuickChoiceComplete(answers: Answers) {
  return answers.triageCompleted === 'ja' && Boolean(answers.quickDeadlineWindow) && Boolean(answers.quickRisk);
}
