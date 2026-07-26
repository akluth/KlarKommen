import type { Language } from '../i18n';
import { getQuickHelpTexts, type QuickDeadlineWindow } from '../i18n/quickHelp';
import type { Answers, CategoryId, Country } from '../types';

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

export function getQuickRiskOptions(
  categoryId: CategoryId,
  language: Language,
  country: Country = 'de',
): QuickRiskOption[] {
  const texts = getQuickHelpTexts(language, country).risks[categoryId];

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

const germanAustrianActions: Record<CategoryId, string[]> = {
  rent: [
    'Sichere Kündigung, Klage, Umschlag und Zustelldatum als Foto oder Kopie.',
    'Kontaktiere heute WOHNSCHIRM, eine Wohnberatungsstelle oder die Mietervereinigung und nenne jede Frist ausdrücklich.',
    'Antworte Vermieter oder Gericht nicht nur telefonisch; halte jeden Kontakt zusätzlich schriftlich fest.',
  ],
  energy: [
    'Rufe den Versorger heute an und frage nach Abschaltstatus, Gesamtbetrag und einer schriftlichen Lösung.',
    'Nenne Kinder, medizinische Geräte oder gesundheitliche Risiken sofort und halte Nachweise bereit.',
    'Frage WOHNSCHIRM ENERGIE, E-Control oder die Sozialberatung nach kurzfristiger Hilfe; akzeptiere keine untragbare Rate.',
  ],
  jobcenter: [
    'Kontaktiere heute das AMS oder die zuständige Sozialhilfestelle und sichere eine schriftliche Bestätigung.',
    'Wenn Geld für den Lebensunterhalt fehlt, sage ausdrücklich „akute Mittellosigkeit“ und frage nach Soforthilfe oder Vorschuss.',
    'Fotografiere Bescheid und Umschlag, notiere das Zustelldatum und lass die Rechtsmittelbelehrung sofort prüfen.',
  ],
  health: [
    'Kontaktiere deinen Krankenversicherungsträger, zum Beispiel die ÖGK, und verlange Versicherungs- und Beitragsstatus schriftlich.',
    'Wenn Behandlung oder Medikamente gefährdet sind, sage das sofort dem Versicherungsträger und der behandelnden Stelle.',
    'Bitte um eine tragbare Zahlungsregelung und unabhängige Beratung; bei medizinischer Lebensgefahr rufe die Rettung 144.',
  ],
  garnishment: [
    'Verlange von deiner Bank sofort schriftlich den Pfändungsstatus und die Prüfung, welche Beträge freizugeben sind.',
    'Sammle Nachweise über unpfändbare Leistungen und Unterhaltspflichten; kontaktiere bei Bedarf das Exekutionsgericht.',
    'Kontaktiere eine staatlich anerkannte Schuldenberatung wegen Existenzminimum, Kontofreigabe und Gläubigerkontakt.',
  ],
  schufa: [
    'Löse zuerst das eigentliche Problem bei Miete, Energie oder Lebensunterhalt; vermeide teure Sofortkredite.',
    'Fordere kostenlose Auskünfte nach Art. 15 DSGVO bei KSV1870 und CRIF an und bewahre sie sicher auf.',
    'Beanstande falsche Daten schriftlich bei der Auskunftei und dem meldenden Unternehmen und sichere Nachweise.',
  ],
  debtCourt: [
    'Sichere Schreiben, Umschlag und Zustelldatum; prüfe zuerst, ob der Absender ein österreichisches Gericht ist.',
    'Bei einem bedingten Zahlungsbefehl: Hole sofort Hilfe; für einen Einspruch bleiben grundsätzlich vier Wochen ab Zustellung.',
    'Erkenne eine unklare Forderung nicht vorschnell an und zahle nicht ungeprüft; nutze Arbeiterkammer oder Schuldenberatung.',
  ],
  family: [
    'Bei unmittelbarer Gefahr bringe dich und betroffene Kinder an einen sicheren Ort und rufe Polizei 133 oder Rettung 144.',
    'Notiere, was heute geklärt werden muss: Sicherheit, Kinder, Wohnen, Geld, Dokumente und erreichbare Unterstützung.',
    'Kontaktiere eine geförderte Familienberatung oder die Kinder- und Jugendhilfe; du musst die Lage nicht allein lösen.',
  ],
};

const austrianActions: Record<Language, Record<CategoryId, string[]>> = {
  de: germanAustrianActions,
  tr: {
    rent: ['Fesih, dava, zarf ve teslim tarihini fotoğraf veya kopya olarak sakla.', 'Bugün WOHNSCHIRM, konut danışması veya kiracı kuruluşuyla iletişime geç ve her süreyi açıkça belirt.', 'Ev sahibi veya mahkemeyle görüşmeleri yalnız telefonla bırakma; ayrıca yazılı kaydet.'],
    energy: ['Tedarikçiyi bugün ara; kesinti durumu, toplam borç ve yazılı çözüm iste.', 'Çocukları, tıbbi cihazları veya sağlık risklerini hemen bildir ve belgeleri hazırla.', 'WOHNSCHIRM ENERGIE, E-Control veya sosyal danışmaya hızlı yardım sor; ödeyemeyeceğin taksidi kabul etme.'],
    jobcenter: ['Bugün AMS veya yetkili sosyal yardım kurumuyla iletişime geç ve yazılı onay al.', 'Geçim parası yoksa açıkça “akute Mittellosigkeit” de ve acil yardım veya avans sor.', 'Kararı ve zarfı fotoğrafla, teslim tarihini yaz ve hukuk yolu açıklamasını hemen kontrol ettir.'],
    health: ['ÖGK gibi sağlık sigortanı ara ve sigorta ile prim durumunu yazılı iste.', 'Tedavi veya ilaç tehlikedeyse bunu hemen sigortaya ve tedavi merkezine bildir.', 'Ödenebilir plan ve bağımsız danışma iste; hayati tehlikede 144 ambulansı ara.'],
    garnishment: ['Bankadan hemen yazılı olarak haciz durumunu ve hangi tutarların serbest bırakılacağını sor.', 'Haczedilemez ödemeler ve nafaka yükümlülükleri için belgeleri topla; gerekirse icra mahkemesine başvur.', 'Geçim asgarisi, hesap erişimi ve alacaklı iletişimi için devletçe tanınan borç danışmasını ara.'],
    schufa: ['Önce kira, enerji veya geçim sorununu çöz; pahalı hızlı kredilerden kaçın.', 'KSV1870 ve CRIF’ten DSGVO Madde 15 uyarınca ücretsiz bilgi iste ve güvenli sakla.', 'Yanlış verileri kredi kuruluşuna ve bildiren şirkete yazılı bildir; kanıtları sakla.'],
    debtCourt: ['Yazıyı, zarfı ve teslim tarihini sakla; gönderenin Avusturya mahkemesi olup olmadığını kontrol et.', 'Şartlı ödeme emrinde hemen yardım al; itiraz için teslimden itibaren kural olarak dört hafta vardır.', 'Belirsiz talebi hemen kabul etme veya kontrolsüz ödeme yapma; Arbeiterkammer ya da borç danışmasını kullan.'],
    family: ['Doğrudan tehlikede kendini ve çocukları güvenli yere götür; 133 polisi veya 144 ambulansı ara.', 'Bugün gerekenleri yaz: güvenlik, çocuklar, konut, para, belgeler ve destek.', 'Desteklenen aile danışması veya çocuk ve gençlik yardımıyla iletişime geç; durumu yalnız çözmek zorunda değilsin.'],
  },
  ar: {
    rent: ['احتفظ بصورة أو نسخة من الإنهاء والدعوى والظرف وتاريخ الاستلام.', 'اتصل اليوم بـWOHNSCHIRM أو استشارة السكن أو جمعية المستأجرين واذكر كل مهلة بوضوح.', 'لا تكتف بالمكالمات مع المالك أو المحكمة؛ وثّق كل تواصل كتابة أيضا.'],
    energy: ['اتصل بالمزوّد اليوم واسأل عن حالة القطع والمبلغ الكامل وحل مكتوب.', 'اذكر الأطفال أو الأجهزة الطبية أو المخاطر الصحية فورا وجهّز الأدلة.', 'اسأل WOHNSCHIRM ENERGIE أو E-Control أو الاستشارة الاجتماعية عن مساعدة سريعة ولا تقبل قسطا لا تقدر عليه.'],
    jobcenter: ['اتصل اليوم بـAMS أو جهة المساعدة الاجتماعية المختصة واحتفظ بتأكيد مكتوب.', 'إذا كان مال المعيشة مفقودا فاذكر بوضوح «akute Mittellosigkeit» واسأل عن مساعدة عاجلة أو دفعة مقدمة.', 'صوّر القرار والظرف وسجّل تاريخ الاستلام واطلب فحص بيان طرق الطعن فورا.'],
    health: ['اتصل بالتأمين الصحي مثل ÖGK واطلب حالة التأمين والاشتراكات كتابة.', 'إذا كان العلاج أو الدواء مهددا فأبلغ التأمين والجهة العلاجية فورا.', 'اطلب خطة دفع ممكنة واستشارة مستقلة؛ عند خطر على الحياة اتصل بالإسعاف 144.'],
    garnishment: ['اطلب من البنك فورا وكتابة حالة الحجز وفحص المبالغ التي يجب الإفراج عنها.', 'اجمع إثباتات المدفوعات غير القابلة للحجز والتزامات النفقة واتصل بمحكمة التنفيذ عند الحاجة.', 'اتصل باستشارة ديون معترف بها رسميا بشأن الحد الأدنى للمعيشة والوصول للحساب والدائن.'],
    schufa: ['عالج أولا المشكلة الأصلية في الإيجار أو الطاقة أو المعيشة وتجنب القروض السريعة المكلفة.', 'اطلب معلومات مجانية وفق المادة 15 من DSGVO من KSV1870 وCRIF واحفظها بأمان.', 'اعترض كتابة على البيانات الخاطئة لدى شركة المعلومات والشركة المبلّغة واحتفظ بالأدلة.'],
    debtCourt: ['احتفظ بالخطاب والظرف وتاريخ الاستلام وتحقق هل المرسل محكمة نمساوية.', 'عند أمر دفع مشروط اطلب المساعدة فورا؛ توجد عادة أربعة أسابيع للاعتراض من تاريخ الاستلام.', 'لا تعترف بمطالبة غير واضحة ولا تدفع دون فحص؛ استخدم Arbeiterkammer أو استشارة الديون.'],
    family: ['عند الخطر المباشر انتقل أنت والأطفال إلى مكان آمن واتصل بالشرطة 133 أو الإسعاف 144.', 'دوّن ما يجب حله اليوم: الأمان والأطفال والسكن والمال والوثائق والدعم.', 'اتصل باستشارة أسرية مدعومة أو مساعدة الأطفال والشباب؛ لا يلزم أن تحل الوضع وحدك.'],
  },
  uk: {
    rent: ['Збережіть фото або копію розірвання, позову, конверта й дати вручення.', 'Сьогодні зверніться до WOHNSCHIRM, житлової консультації або організації орендарів і чітко назвіть кожен строк.', 'Не обмежуйтеся телефоном із власником чи судом; фіксуйте кожен контакт письмово.'],
    energy: ['Сьогодні зателефонуйте постачальнику й запитайте про стан відключення, загальну суму та письмове рішення.', 'Одразу повідомте про дітей, медичні прилади або ризики для здоров’я й підготуйте докази.', 'Запитайте WOHNSCHIRM ENERGIE, E-Control або соціальну консультацію про швидку допомогу; не погоджуйтеся на непосильний платіж.'],
    jobcenter: ['Сьогодні зверніться до AMS або відповідного органу соціальної допомоги й збережіть письмове підтвердження.', 'Якщо немає коштів на життя, прямо скажіть «akute Mittellosigkeit» і запитайте про термінову допомогу або аванс.', 'Сфотографуйте рішення й конверт, запишіть дату вручення та негайно перевірте роз’яснення про оскарження.'],
    health: ['Зв’яжіться зі страховою касою, наприклад ÖGK, і письмово запросіть статус страхування та внесків.', 'Якщо лікування чи ліки під загрозою, негайно повідомте касу та лікувальний заклад.', 'Попросіть посильний план оплати й незалежну консультацію; за загрози життю телефонуйте 144.'],
    garnishment: ['Негайно письмово запитайте банк про стан арешту та суми, які мають бути розблоковані.', 'Зберіть докази недоторканних виплат і зобов’язань з утримання; за потреби зверніться до виконавчого суду.', 'Зверніться до державної визнаної боргової консультації щодо прожиткового мінімуму, доступу до рахунку й кредитора.'],
    schufa: ['Спершу вирішуйте основну проблему оренди, енергії чи засобів на життя; уникайте дорогих швидких кредитів.', 'Запитайте у KSV1870 і CRIF безкоштовну інформацію за ст. 15 GDPR та безпечно її зберігайте.', 'Письмово оскаржте хибні дані у бюро та компанії, що їх подала, і збережіть докази.'],
    debtCourt: ['Збережіть лист, конверт і дату вручення; перевірте, чи відправник — австрійський суд.', 'За умовного платіжного наказу негайно шукайте допомогу; на заперечення зазвичай є чотири тижні від вручення.', 'Не визнавайте неясну вимогу й не платіть без перевірки; зверніться до Arbeiterkammer або боргової консультації.'],
    family: ['За безпосередньої небезпеки перейдіть із дітьми в безпечне місце й телефонуйте поліції 133 або швидкій 144.', 'Запишіть, що треба владнати сьогодні: безпека, діти, житло, гроші, документи й підтримка.', 'Зверніться до субсидованої сімейної консультації або допомоги дітям і молоді; не треба вирішувати все самостійно.'],
  },
};

export function buildQuickActions(
  categoryId: CategoryId,
  language: Language,
  country: Country = 'de',
) {
  if (country === 'de') return actions[language][categoryId];
  return austrianActions[language][categoryId];
}

export function isQuickChoiceComplete(answers: Answers) {
  return answers.triageCompleted === 'ja' && Boolean(answers.quickDeadlineWindow) && Boolean(answers.quickRisk);
}
