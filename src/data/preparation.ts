import type { Language } from '../i18n';
import type { Answers, CategoryId } from '../types';

const has = (answers: Answers, key: string, value: string) => answers[key] === value;

export type UrgencyLevel = 'red' | 'yellow' | 'green';

export interface UrgencyResult {
  level: UrgencyLevel;
  label: string;
  headline: string;
  summary: string;
  reasons: string[];
}

type SignalKey =
  | 'deadlineMissing'
  | 'deadlinePast'
  | 'deadlineOneDay'
  | 'deadlineThreeDays'
  | 'deadlineWeek'
  | 'deadlineLater'
  | 'evictionClaim'
  | 'immediateTermination'
  | 'rentTerminated'
  | 'energyBlocked'
  | 'energyThreatened'
  | 'childrenHealth'
  | 'jobcenterSanction'
  | 'objectionExpired'
  | 'decisionAvailable'
  | 'benefitsSuspendedThreat'
  | 'healthWarnings'
  | 'garnishedNoPAccount'
  | 'accountGarnished'
  | 'garnishmentOrder'
  | 'moneyNeededToday'
  | 'acuteDeadline'
  | 'creditRejected'
  | 'courtDebt'
  | 'claimDisputed'
  | 'claimUnclear'
  | 'childrenNoSupport'
  | 'livingChanged';

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const daysUntilDeadline = (deadline?: string) => {
  if (!deadline) return null;
  const date = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - startOfToday().getTime()) / 86_400_000);
};

const signalTexts: Record<Language, Record<SignalKey, string>> = {
  de: {
    deadlineMissing: 'Es gibt eine schriftliche Frist, aber das genaue Datum fehlt noch.',
    deadlinePast: 'Die angegebene Frist ist bereits abgelaufen.',
    deadlineOneDay: 'Die Frist läuft heute oder morgen ab.',
    deadlineThreeDays: 'Die Frist läuft innerhalb der nächsten drei Tage ab.',
    deadlineWeek: 'Die Frist läuft innerhalb der nächsten Woche ab.',
    deadlineLater: 'Die Frist liegt nicht unmittelbar in den nächsten Tagen.',
    evictionClaim: 'Es gibt bereits eine Räumungsklage.',
    immediateTermination: 'Es geht um eine fristlose Kündigung.',
    rentTerminated: 'Eine Kündigung wurde bereits ausgesprochen.',
    energyBlocked: 'Die Energiesperre wurde bereits durchgeführt.',
    energyThreatened: 'Eine Energiesperre wurde angedroht.',
    childrenHealth: 'Kinder oder gesundheitliche Gründe können die Lage verschärfen.',
    jobcenterSanction: 'Es geht um eine Sanktion und damit möglicherweise um Geld zum Leben.',
    objectionExpired: 'Die Widerspruchsfrist könnte bereits abgelaufen sein.',
    decisionAvailable: 'Ein Bescheid liegt vor und sollte genau geprüft werden.',
    benefitsSuspendedThreat: 'Das Ruhen von Leistungen wurde angedroht.',
    healthWarnings: 'Es gab bereits Mahnungen der Krankenkasse.',
    garnishedNoPAccount: 'Das Konto ist gepfändet und ein P-Konto ist noch nicht sicher eingerichtet.',
    accountGarnished: 'Das Konto ist gepfändet.',
    garnishmentOrder: 'Ein Pfändungs- und Überweisungsbeschluss liegt vor.',
    moneyNeededToday: 'Das Geld wird heute oder morgen gebraucht.',
    acuteDeadline: 'Es gibt eine akute Frist beim eigentlichen Problem.',
    creditRejected: 'Ein Kredit wurde vermutlich wegen Bonität oder Schufa abgelehnt.',
    courtDebt: 'Es liegt Gerichtspost oder ein gerichtliches Mahnverfahren nahe.',
    claimDisputed: 'Die Forderung ist ganz oder teilweise bestritten.',
    claimUnclear: 'Die Forderung ist dir nicht klar bekannt.',
    childrenNoSupport: 'Kinder sind betroffen und verlässliche Unterstützung fehlt gerade.',
    livingChanged: 'Die Wohnsituation verändert sich oder könnte sich bald verändern.',
  },
  tr: {
    deadlineMissing: 'Yazılı bir süre var, ancak kesin tarih henüz eksik.',
    deadlinePast: 'Belirtilen süre zaten geçmiş.',
    deadlineOneDay: 'Süre bugün veya yarın doluyor.',
    deadlineThreeDays: 'Süre önümüzdeki üç gün içinde doluyor.',
    deadlineWeek: 'Süre önümüzdeki hafta içinde doluyor.',
    deadlineLater: 'Süre önümüzdeki birkaç gün içinde değil.',
    evictionClaim: 'Tahliye davası zaten açılmış.',
    immediateTermination: 'Konu derhal fesih bildirimi.',
    rentTerminated: 'Fesih bildirimi zaten yapılmış.',
    energyBlocked: 'Enerji kesintisi zaten uygulanmış.',
    energyThreatened: 'Enerji kesintisi tehdidi var.',
    childrenHealth: 'Çocuklar veya sağlık nedenleri durumu ağırlaştırabilir.',
    jobcenterSanction: 'Konu yaptırım ve yaşam için gerekli para olabilir.',
    objectionExpired: 'İtiraz süresi geçmiş olabilir.',
    decisionAvailable: 'Bir karar yazısı var ve dikkatle kontrol edilmeli.',
    benefitsSuspendedThreat: 'Hizmetlerin askıya alınması tehdidi var.',
    healthWarnings: 'Sağlık sigortasından daha önce ihtarlar gelmiş.',
    garnishedNoPAccount: 'Hesap hacizli ve P-Konto henüz güvenli şekilde kurulmamış.',
    accountGarnished: 'Hesap hacizli.',
    garnishmentOrder: 'Haciz ve havale kararı mevcut.',
    moneyNeededToday: 'Paraya bugün veya yarın ihtiyaç var.',
    acuteDeadline: 'Asıl sorunla ilgili acil bir süre var.',
    creditRejected: 'Kredi muhtemelen kredi notu veya Schufa nedeniyle reddedilmiş.',
    courtDebt: 'Mahkeme postası veya resmi ödeme emri süreci söz konusu olabilir.',
    claimDisputed: 'Talebin tamamı veya bir kısmı itirazlı.',
    claimUnclear: 'Talep sana net olarak bilinmiyor.',
    childrenNoSupport: 'Çocuklar etkileniyor ve şu anda güvenilir destek yok.',
    livingChanged: 'Yaşam veya konut durumu değişiyor ya da yakında değişebilir.',
  },
  ar: {
    deadlineMissing: 'توجد مهلة مكتوبة، لكن التاريخ الدقيق غير معروف بعد.',
    deadlinePast: 'المهلة المذكورة انتهت بالفعل.',
    deadlineOneDay: 'المهلة تنتهي اليوم أو غدا.',
    deadlineThreeDays: 'المهلة تنتهي خلال الأيام الثلاثة القادمة.',
    deadlineWeek: 'المهلة تنتهي خلال الأسبوع القادم.',
    deadlineLater: 'المهلة ليست خلال الأيام القليلة القادمة مباشرة.',
    evictionClaim: 'توجد دعوى إخلاء بالفعل.',
    immediateTermination: 'الأمر يتعلق بإنهاء فوري للعقد.',
    rentTerminated: 'تم إصدار إنهاء للعقد بالفعل.',
    energyBlocked: 'تم قطع الطاقة بالفعل.',
    energyThreatened: 'تم التهديد بقطع الطاقة.',
    childrenHealth: 'وجود أطفال أو أسباب صحية قد يزيد خطورة الوضع.',
    jobcenterSanction: 'الأمر يتعلق بعقوبة وقد يمس المال اللازم للمعيشة.',
    objectionExpired: 'قد تكون مهلة الاعتراض قد انتهت بالفعل.',
    decisionAvailable: 'يوجد قرار رسمي وينبغي فحصه بدقة.',
    benefitsSuspendedThreat: 'تم التهديد بإيقاف الخدمات.',
    healthWarnings: 'وصلت تذكيرات أو إنذارات من شركة التأمين الصحي.',
    garnishedNoPAccount: 'الحساب محجوز ولم يتم تأمين حساب P-Konto بعد.',
    accountGarnished: 'الحساب محجوز.',
    garnishmentOrder: 'يوجد قرار حجز وتحويل.',
    moneyNeededToday: 'تحتاج إلى المال اليوم أو غدا.',
    acuteDeadline: 'توجد مهلة عاجلة في المشكلة الأصلية.',
    creditRejected: 'ربما تم رفض القرض بسبب الجدارة الائتمانية أو Schufa.',
    courtDebt: 'قد تكون هناك مراسلات من المحكمة أو إجراء أمر دفع قضائي.',
    claimDisputed: 'المطالبة محل اعتراض كلي أو جزئي.',
    claimUnclear: 'المطالبة غير واضحة بالنسبة لك.',
    childrenNoSupport: 'الأطفال متأثرون ولا يوجد دعم موثوق حاليا.',
    livingChanged: 'وضع السكن يتغير أو قد يتغير قريبا.',
  },
  uk: {
    deadlineMissing: 'Є письмовий строк, але точна дата ще відсутня.',
    deadlinePast: 'Вказаний строк уже минув.',
    deadlineOneDay: 'Строк спливає сьогодні або завтра.',
    deadlineThreeDays: 'Строк спливає протягом наступних трьох днів.',
    deadlineWeek: 'Строк спливає протягом наступного тижня.',
    deadlineLater: 'Строк не припадає безпосередньо на найближчі дні.',
    evictionClaim: 'Уже є позов про виселення.',
    immediateTermination: 'Йдеться про негайне розірвання договору.',
    rentTerminated: 'Розірвання договору вже оголошено.',
    energyBlocked: 'Постачання енергії вже відключено.',
    energyThreatened: 'Є загроза відключення енергії.',
    childrenHealth: 'Діти або стан здоров’я можуть ускладнювати ситуацію.',
    jobcenterSanction: 'Йдеться про санкцію і, можливо, про гроші на життя.',
    objectionExpired: 'Строк для заперечення міг уже минути.',
    decisionAvailable: 'Є офіційне рішення, його потрібно уважно перевірити.',
    benefitsSuspendedThreat: 'Є загроза призупинення виплат або послуг.',
    healthWarnings: 'Уже були нагадування від медичної страхової каси.',
    garnishedNoPAccount: 'Рахунок арештовано, а P-Konto ще не налаштовано надійно.',
    accountGarnished: 'Рахунок арештовано.',
    garnishmentOrder: 'Є рішення про арешт і переказ коштів.',
    moneyNeededToday: 'Гроші потрібні сьогодні або завтра.',
    acuteDeadline: 'Є терміновий строк у первинній проблемі.',
    creditRejected: 'Кредит, імовірно, відхилено через кредитоспроможність або Schufa.',
    courtDebt: 'Можлива судова пошта або судова процедура стягнення.',
    claimDisputed: 'Вимога повністю або частково оскаржується.',
    claimUnclear: 'Вимога для вас незрозуміла.',
    childrenNoSupport: 'Діти зачеплені, а надійної підтримки зараз немає.',
    livingChanged: 'Житлова ситуація змінюється або може скоро змінитися.',
  },
};

const urgencyText: Record<
  Language,
  Record<UrgencyLevel, { label: string; headline: string; summary: string; fallbackReason: string }>
> = {
  de: {
    red: {
      label: 'Rot',
      headline: 'Heute handeln',
      summary:
        'Es gibt deutliche Warnsignale. Schicke heute eine schriftliche Nachricht und suche möglichst schnell persönliche Hilfe.',
      fallbackReason: 'Mindestens ein Punkt wirkt akut und sollte heute geklärt werden.',
    },
    yellow: {
      label: 'Gelb',
      headline: 'Zeitnah klären',
      summary:
        'Die Lage wirkt nicht entspannt. Sortiere Unterlagen, reagiere schriftlich und plane innerhalb der nächsten Tage Beratung ein.',
      fallbackReason: 'Es gibt Punkte, die zeitnah geprüft werden sollten.',
    },
    green: {
      label: 'Grün',
      headline: 'Sortieren und dranbleiben',
      summary:
        'Es gibt aus deinen Angaben keine unmittelbaren Alarmsignale. Trotzdem solltest du Unterlagen sichern und den nächsten Schritt schriftlich festhalten.',
      fallbackReason: 'Keine akute Frist oder besonders dringliche Eskalation wurde angegeben.',
    },
  },
  tr: {
    red: {
      label: 'Kırmızı',
      headline: 'Bugün harekete geç',
      summary: 'Belirgin uyarı işaretleri var. Bugün yazılı mesaj gönder ve mümkün olan en kısa sürede kişisel yardım ara.',
      fallbackReason: 'En az bir nokta acil görünüyor ve bugün netleştirilmeli.',
    },
    yellow: {
      label: 'Sarı',
      headline: 'Yakında netleştir',
      summary: 'Durum rahat görünmüyor. Belgeleri sırala, yazılı yanıt ver ve önümüzdeki günlerde danışmanlık planla.',
      fallbackReason: 'Yakında kontrol edilmesi gereken noktalar var.',
    },
    green: {
      label: 'Yeşil',
      headline: 'Sırala ve takipte kal',
      summary: 'Yanıtlarında doğrudan alarm işareti görünmüyor. Yine de belgeleri sakla ve sonraki adımı yazılı olarak belirle.',
      fallbackReason: 'Acil bir süre veya özellikle acil bir tırmanma belirtilmedi.',
    },
  },
  ar: {
    red: {
      label: 'أحمر',
      headline: 'تصرف اليوم',
      summary: 'توجد إشارات تحذير واضحة. أرسل رسالة مكتوبة اليوم وابحث عن مساعدة شخصية في أسرع وقت ممكن.',
      fallbackReason: 'يوجد على الأقل أمر عاجل ينبغي توضيحه اليوم.',
    },
    yellow: {
      label: 'أصفر',
      headline: 'وضّح الأمر قريبا',
      summary: 'الوضع لا يبدو مريحا. رتّب المستندات، ورد كتابيا، وخطط لاستشارة خلال الأيام القادمة.',
      fallbackReason: 'توجد نقاط ينبغي فحصها قريبا.',
    },
    green: {
      label: 'أخضر',
      headline: 'رتّب الأمور وابق متابعا',
      summary: 'لا تظهر من إجاباتك إشارات إنذار مباشرة. مع ذلك احفظ المستندات وثبّت الخطوة التالية كتابيا.',
      fallbackReason: 'لم يتم ذكر مهلة عاجلة أو تصعيد شديد الاستعجال.',
    },
  },
  uk: {
    red: {
      label: 'Червоний',
      headline: 'Діяти сьогодні',
      summary: 'Є чіткі попереджувальні ознаки. Надішліть письмове повідомлення сьогодні і якнайшвидше шукайте особисту допомогу.',
      fallbackReason: 'Щонайменше один пункт виглядає терміновим і має бути з’ясований сьогодні.',
    },
    yellow: {
      label: 'Жовтий',
      headline: 'З’ясувати найближчим часом',
      summary: 'Ситуація не виглядає спокійною. Впорядкуйте документи, реагуйте письмово і заплануйте консультацію найближчими днями.',
      fallbackReason: 'Є пункти, які потрібно перевірити найближчим часом.',
    },
    green: {
      label: 'Зелений',
      headline: 'Впорядкувати і не відкладати',
      summary: 'З ваших відповідей не видно негайних сигналів тривоги. Але варто зберегти документи і письмово зафіксувати наступний крок.',
      fallbackReason: 'Не вказано гострого строку або особливо термінового загострення.',
    },
  },
};

const deadlineReason = (answers: Answers): { score: number; key: SignalKey } | null => {
  const daysLeft = daysUntilDeadline(answers.deadlineDate);

  if (daysLeft === null) {
    return answers.writtenDeadline === 'ja' ? { score: 2, key: 'deadlineMissing' } : null;
  }

  if (daysLeft < 0) return { score: 3, key: 'deadlinePast' };
  if (daysLeft <= 1) return { score: 3, key: 'deadlineOneDay' };
  if (daysLeft <= 3) return { score: 2, key: 'deadlineThreeDays' };
  if (daysLeft <= 7) return { score: 1, key: 'deadlineWeek' };

  return { score: 0, key: 'deadlineLater' };
};

export function buildUrgency(categoryId: CategoryId, answers: Answers, language: Language = 'de'): UrgencyResult {
  const signals: Array<{ score: number; key: SignalKey }> = [];
  const deadline = deadlineReason(answers);

  if (deadline) signals.push(deadline);

  switch (categoryId) {
    case 'rent':
      if (has(answers, 'evictionClaim', 'ja')) signals.push({ score: 3, key: 'evictionClaim' });
      if (has(answers, 'immediateTermination', 'ja')) signals.push({ score: 3, key: 'immediateTermination' });
      if (has(answers, 'rentTerminated', 'ja')) signals.push({ score: 2, key: 'rentTerminated' });
      break;
    case 'energy':
      if (has(answers, 'energyBlockStatus', 'durchgeführt')) signals.push({ score: 3, key: 'energyBlocked' });
      if (has(answers, 'energyBlockStatus', 'angedroht')) signals.push({ score: 2, key: 'energyThreatened' });
      if (has(answers, 'children', 'ja') || has(answers, 'healthReasons', 'ja')) {
        signals.push({ score: 2, key: 'childrenHealth' });
      }
      break;
    case 'jobcenter':
      if (has(answers, 'jobcenterIssue', 'Sanktion')) signals.push({ score: 2, key: 'jobcenterSanction' });
      if (has(answers, 'objectionDeadline', 'abgelaufen')) signals.push({ score: 2, key: 'objectionExpired' });
      if (has(answers, 'decisionAvailable', 'ja')) signals.push({ score: 1, key: 'decisionAvailable' });
      break;
    case 'health':
      if (has(answers, 'benefitsSuspendedThreat', 'ja')) signals.push({ score: 3, key: 'benefitsSuspendedThreat' });
      if (has(answers, 'healthWarnings', 'ja')) signals.push({ score: 1, key: 'healthWarnings' });
      break;
    case 'garnishment':
      if (has(answers, 'accountGarnished', 'ja') && !has(answers, 'pAccount', 'ja')) {
        signals.push({ score: 3, key: 'garnishedNoPAccount' });
      } else if (has(answers, 'accountGarnished', 'ja')) {
        signals.push({ score: 2, key: 'accountGarnished' });
      }
      if (has(answers, 'garnishmentOrder', 'ja')) signals.push({ score: 2, key: 'garnishmentOrder' });
      break;
    case 'schufa':
      if (has(answers, 'urgency', 'heute')) signals.push({ score: 3, key: 'moneyNeededToday' });
      if (has(answers, 'acuteDeadline', 'ja')) signals.push({ score: 2, key: 'acuteDeadline' });
      if (has(answers, 'creditRejected', 'ja') || has(answers, 'creditRejected', 'vermutlich')) {
        signals.push({ score: 1, key: 'creditRejected' });
      }
      break;
    case 'debtCourt':
      if (
        has(answers, 'debtLetterType', 'mahnbescheid') ||
        has(answers, 'debtLetterType', 'vollstreckungsbescheid') ||
        has(answers, 'courtYellowEnvelope', 'ja')
      ) {
        signals.push({ score: 3, key: 'courtDebt' });
      }
      if (has(answers, 'claimDisputed', 'ja') || has(answers, 'claimDisputed', 'teilweise')) {
        signals.push({ score: 2, key: 'claimDisputed' });
      }
      if (has(answers, 'claimKnown', 'nein') || has(answers, 'claimKnown', 'unklar')) {
        signals.push({ score: 1, key: 'claimUnclear' });
      }
      break;
    case 'family':
      if (has(answers, 'childrenAffected', 'ja') && has(answers, 'supportNetwork', 'nein')) {
        signals.push({ score: 2, key: 'childrenNoSupport' });
      }
      if (has(answers, 'livingSituationChanged', 'ja') || has(answers, 'livingSituationChanged', 'bald')) {
        signals.push({ score: 1, key: 'livingChanged' });
      }
      break;
  }

  const highestScore = signals.reduce((highest, signal) => Math.max(highest, signal.score), 0);
  const level: UrgencyLevel = highestScore >= 3 ? 'red' : highestScore >= 1 ? 'yellow' : 'green';
  const text = urgencyText[language][level];
  const relevantSignals =
    level === 'red' ? signals.filter((signal) => signal.score >= 2) : level === 'yellow' ? signals : [];

  return {
    level,
    label: text.label,
    headline: text.headline,
    summary: text.summary,
    reasons: relevantSignals.length
      ? relevantSignals.map((signal) => signalTexts[language][signal.key])
      : [text.fallbackReason],
  };
}

const sharedDocuments: Record<Language, string[]> = {
  de: [
    'Personalausweis oder anderes Ausweisdokument',
    'Alle aktuellen Schreiben, Mahnungen und Bescheide',
    'Nachweise zu Einkommen, Bürgergeld, Sozialhilfe, Rente oder Unterhalt',
    'Kontoauszüge der letzten Wochen',
    'Notizen zu Telefonaten, Namen, Datum und Uhrzeit',
  ],
  tr: [
    'Kimlik kartı veya başka bir kimlik belgesi',
    'Tüm güncel yazılar, ihtarlar ve kararlar',
    'Gelir, Bürgergeld, sosyal yardım, emeklilik veya nafaka belgeleri',
    'Son haftalara ait banka hesap dökümleri',
    'Telefon görüşmeleri, isimler, tarih ve saat notları',
  ],
  ar: [
    'بطاقة الهوية أو وثيقة تعريف أخرى',
    'كل الخطابات الحالية والإنذارات والقرارات',
    'إثباتات الدخل أو Bürgergeld أو المساعدة الاجتماعية أو المعاش أو النفقة',
    'كشوف الحساب البنكي للأسابيع الأخيرة',
    'ملاحظات عن المكالمات والأسماء والتاريخ والوقت',
  ],
  uk: [
    'Посвідчення особи або інший документ',
    'Усі актуальні листи, нагадування та рішення',
    'Підтвердження доходу, Bürgergeld, соціальної допомоги, пенсії або аліментів',
    'Виписки з рахунку за останні тижні',
    'Нотатки про телефонні розмови, імена, дати та час',
  ],
};

const documentsByCategory: Record<Language, Record<CategoryId, string[]>> = {
  de: {
    rent: ['Mietvertrag und letzte Nebenkostenabrechnung', 'Mahnung, Kündigung oder Schreiben der Hausverwaltung', 'Übersicht über offene Mieten und bereits gezahlte Beträge'],
    energy: ['Sperrandrohung oder Sperrmitteilung', 'Kundennummer, Zählernummer und letzte Jahresabrechnung', 'Übersicht über Abschläge, Rückstand und angebotene Raten'],
    jobcenter: ['Bescheid, Antrag, Weiterbewilligungsantrag oder Rückforderung', 'Nachweise, wann Schreiben angekommen oder abgegeben wurden', 'Mietvertrag, Kontoauszüge und Einkommensnachweise'],
    health: ['Schreiben der Krankenkasse und Forderungsaufstellung', 'Nachweise zu Einkommen, Selbstständigkeit oder Leistungsbezug', 'Versichertenkarte und Versicherungsnummer'],
    garnishment: ['Pfändungs- und Überweisungsbeschluss, falls vorhanden', 'Schreiben der Bank zur Kontopfändung oder zum P-Konto', 'Nachweise über Gehalt, Bürgergeld, Rente oder Unterhalt'],
    schufa: ['Ablehnungsschreiben oder Nachricht zum Kredit', 'Schreiben des eigentlichen Gläubigers oder Vertragspartners', 'Unterlagen zur Forderung und zum Verwendungszweck des Geldes'],
    debtCourt: ['Inkassoschreiben, Mahnung, Mahnbescheid oder Vollstreckungsbescheid', 'Gelber Umschlag mit Zustelldatum, falls vorhanden', 'Vertrag, Rechnung, Kündigung oder frühere Schreiben zur Forderung'],
    family: ['Urkunden, Bescheinigungen oder gerichtliche Schreiben', 'Unterlagen zu Wohnung, Konto, Versicherungen und gemeinsamen Verträgen', 'Nachweise zu Kindern, Betreuung, Schule oder Kita'],
  },
  tr: {
    rent: ['Kira sözleşmesi ve son yan gider hesabı', 'İhtar, fesih bildirimi veya ev yönetiminden yazı', 'Açık kira borçları ve ödenmiş tutarlar listesi'],
    energy: ['Kesinti tehdidi veya kesinti bildirimi', 'Müşteri numarası, sayaç numarası ve son yıllık hesap', 'Avans ödemeleri, borç ve teklif edilen taksitler listesi'],
    jobcenter: ['Karar, başvuru, devam başvurusu veya geri ödeme talebi', 'Yazıların ne zaman geldiğini veya teslim edildiğini gösteren belgeler', 'Kira sözleşmesi, hesap dökümleri ve gelir belgeleri'],
    health: ['Sağlık sigortası yazıları ve borç dökümü', 'Gelir, serbest çalışma veya yardım alma belgeleri', 'Sigorta kartı ve sigorta numarası'],
    garnishment: ['Varsa haciz ve havale kararı', 'Bankadan hesap haczi veya P-Konto yazıları', 'Maaş, Bürgergeld, emeklilik veya nafaka belgeleri'],
    schufa: ['Kredi reddi yazısı veya mesajı', 'Asıl alacaklı veya sözleşme ortağından yazılar', 'Alacak ve paranın kullanım amacıyla ilgili belgeler'],
    debtCourt: ['İnkasso yazısı, ihtar, ödeme emri veya icra emri', 'Varsa tebliğ tarihli sarı zarf', 'Sözleşme, fatura, fesih veya alacakla ilgili eski yazılar'],
    family: ['Resmi belgeler, sertifikalar veya mahkeme yazıları', 'Konut, hesap, sigorta ve ortak sözleşme belgeleri', 'Çocuklar, bakım, okul veya kreş belgeleri'],
  },
  ar: {
    rent: ['عقد الإيجار وآخر تسوية للتكاليف الجانبية', 'إنذار أو إنهاء أو خطاب من إدارة السكن', 'نظرة عامة على الإيجارات المفتوحة والمبالغ المدفوعة'],
    energy: ['تهديد بالقطع أو إشعار بالقطع', 'رقم العميل ورقم العداد وآخر فاتورة سنوية', 'نظرة عامة على الدفعات والمتأخرات والأقساط المعروضة'],
    jobcenter: ['قرار أو طلب أو طلب تمديد أو مطالبة استرداد', 'إثباتات موعد وصول أو تسليم الخطابات', 'عقد الإيجار وكشوف الحساب وإثباتات الدخل'],
    health: ['خطابات شركة التأمين الصحي وكشف المطالبة', 'إثباتات الدخل أو العمل الحر أو تلقي المساعدات', 'بطاقة التأمين ورقم التأمين'],
    garnishment: ['قرار الحجز والتحويل إن وجد', 'خطابات البنك حول حجز الحساب أو P-Konto', 'إثباتات الراتب أو Bürgergeld أو المعاش أو النفقة'],
    schufa: ['خطاب أو رسالة رفض القرض', 'خطابات الدائن الأصلي أو الشريك التعاقدي', 'مستندات المطالبة والغرض من المال'],
    debtCourt: ['خطاب تحصيل أو إنذار أو أمر دفع أو أمر تنفيذ', 'الظرف الأصفر مع تاريخ التسليم إن وجد', 'العقد أو الفاتورة أو الإنهاء أو خطابات سابقة عن المطالبة'],
    family: ['وثائق أو شهادات أو خطابات محكمة', 'مستندات السكن والحسابات والتأمينات والعقود المشتركة', 'إثباتات تخص الأطفال أو الرعاية أو المدرسة أو الحضانة'],
  },
  uk: {
    rent: ['Договір оренди та останній розрахунок додаткових витрат', 'Нагадування, розірвання або лист від управління будинком', 'Огляд боргів за оренду та вже сплачених сум'],
    energy: ['Попередження про відключення або повідомлення про відключення', 'Номер клієнта, номер лічильника та останній річний рахунок', 'Огляд авансових платежів, боргу та запропонованих розстрочок'],
    jobcenter: ['Рішення, заява, продовження заяви або вимога повернення', 'Докази, коли листи надійшли або були подані', 'Договір оренди, виписки з рахунку та підтвердження доходу'],
    health: ['Листи від медичної страхової каси та розрахунок вимоги', 'Підтвердження доходу, самозайнятості або отримання допомоги', 'Страхова картка та страховий номер'],
    garnishment: ['Рішення про арешт і переказ коштів, якщо є', 'Листи банку щодо арешту рахунку або P-Konto', 'Підтвердження зарплати, Bürgergeld, пенсії або аліментів'],
    schufa: ['Лист або повідомлення про відмову в кредиті', 'Листи від первинного кредитора або договірного партнера', 'Документи щодо вимоги та цілі використання грошей'],
    debtCourt: ['Лист інкасо, нагадування, Mahnbescheid або Vollstreckungsbescheid', 'Жовтий конверт із датою вручення, якщо є', 'Договір, рахунок, розірвання або попередні листи щодо вимоги'],
    family: ['Свідоцтва, довідки або судові листи', 'Документи щодо житла, рахунку, страхування та спільних договорів', 'Підтвердження щодо дітей, догляду, школи або дитсадка'],
  },
};

export function buildDocuments(categoryId: CategoryId, _answers: Answers, language: Language = 'de') {
  return [...documentsByCategory[language][categoryId], ...sharedDocuments[language]];
}

const sharedActionPlan: Record<Language, string[]> = {
  de: [
    'Wichtigste Schreiben fotografieren oder scannen.',
    'Aktenzeichen, Kundennummern und Fristen auf einem Blatt notieren.',
    'Passende Textvorlage kopieren und heute schriftlich absenden.',
    'Antworten, Eingangsbestätigungen und neue Fristen direkt sichern.',
  ],
  tr: [
    'En önemli yazıları fotoğrafla veya tara.',
    'Dosya numaralarını, müşteri numaralarını ve süreleri tek sayfaya yaz.',
    'Uygun metin şablonunu kopyala ve bugün yazılı olarak gönder.',
    'Yanıtları, alındı onaylarını ve yeni süreleri hemen sakla.',
  ],
  ar: [
    'صوّر أو امسح أهم الخطابات.',
    'اكتب أرقام الملفات وأرقام العملاء والمهل في ورقة واحدة.',
    'انسخ النموذج المناسب وأرسله كتابيا اليوم.',
    'احفظ الردود وإثباتات الاستلام والمهل الجديدة مباشرة.',
  ],
  uk: [
    'Сфотографувати або відсканувати найважливіші листи.',
    'Записати номери справ, номери клієнта та строки на одному аркуші.',
    'Скопіювати відповідний шаблон і надіслати письмово сьогодні.',
    'Одразу зберігати відповіді, підтвердження отримання та нові строки.',
  ],
};

const deadlineStep: Record<Language, string> = {
  de: 'Frist prüfen und sichtbar notieren.',
  tr: 'Süreyi kontrol et ve görünür şekilde not et.',
  ar: 'افحص المهلة ودوّنها بشكل واضح.',
  uk: 'Перевірити строк і записати його на видному місці.',
};

const categoryActionPlan: Record<Language, Record<CategoryId, string[]>> = {
  de: {
    rent: ['Vermieter oder Hausverwaltung um schriftliche Klärung, Ratenzahlung oder Fristaufschub bitten.', 'Jobcenter, Sozialamt oder Wohnungsnotfallhilfe wegen möglicher Übernahme der Mietschulden kontaktieren.'],
    energy: ['Energieversorger um Sperraussetzung, Ratenzahlung und Forderungsaufstellung bitten.', 'Jobcenter oder Sozialamt nach einem Darlehen für Energieschulden fragen.'],
    jobcenter: ['Bescheid oder Antrag nach Datum sortieren und fehlende Unterlagen markieren.', 'Jobcenter schriftlich um Sachstand, Vorschuss, Fristaufschub oder Überprüfung bitten.'],
    health: ['Krankenkasse um Forderungsaufstellung und Klärung des Versicherungsschutzes bitten.', 'Bei niedrigem Einkommen Beitragsprüfung oder Unterstützung durch Sozialamt oder Jobcenter anfragen.'],
    garnishment: ['Bank schriftlich um P-Konto-Umwandlung oder Bestätigung des Schutzes bitten.', 'Schuldnerberatung wegen Freibeträgen, Bescheinigung und Gläubigerkontakt anfragen.'],
    schufa: ['Direkten Gläubiger oder Vertragspartner um Fristaufschub oder Ratenzahlung bitten.', 'Teure Sofortkredite pausieren und zuerst Forderung, Schufa-Daten und Beratungsoptionen prüfen.'],
    debtCourt: ['Prüfen, ob das Schreiben vom Gericht, vom Gläubiger oder von einem Inkassounternehmen kommt.', 'Bei Gerichtspost das Zustelldatum notieren und sofort Beratung suchen.', 'Bei Inkasso schriftlich Forderungsaufstellung, Vollmacht und Nachweise anfordern.'],
    family: ['Wichtigste betroffene Personen, Kinder, Termine und Zuständigkeiten notieren.', 'Sozialberatung, Familienberatung oder zuständige Stelle mit kurzer Zusammenfassung kontaktieren.'],
  },
  tr: {
    rent: ['Ev sahibinden veya bina yönetiminden yazılı açıklama, taksit veya süre uzatımı iste.', 'Kira borcunun üstlenilmesi için Jobcenter, sosyal daire veya konut acil yardımını ara.'],
    energy: ['Enerji sağlayıcısından kesintinin durdurulmasını, taksit ve borç dökümü iste.', 'Enerji borcu için Jobcenter veya sosyal daireden kredi imkanı sor.'],
    jobcenter: ['Kararları veya başvuruları tarihe göre sırala ve eksik belgeleri işaretle.', 'Jobcenter’dan yazılı olarak durum, avans, süre uzatımı veya kontrol iste.'],
    health: ['Sağlık sigortasından borç dökümü ve sigorta korumasının açıklanmasını iste.', 'Düşük gelir varsa katkı kontrolü veya sosyal daire/Jobcenter desteği sor.'],
    garnishment: ['Bankadan yazılı olarak P-Konto dönüşümü veya koruma onayı iste.', 'Borç danışmanlığına muafiyetler, belge ve alacaklı iletişimi için başvur.'],
    schufa: ['Doğrudan alacaklıdan veya sözleşme ortağından süre uzatımı ya da taksit iste.', 'Pahalı hızlı kredileri beklet ve önce alacağı, Schufa verilerini ve danışmanlığı kontrol et.'],
    debtCourt: ['Yazının mahkemeden, alacaklıdan veya inkasso şirketinden gelip gelmediğini kontrol et.', 'Mahkeme postasında tebliğ tarihini not et ve hemen danışmanlık ara.', 'İnkassoda yazılı olarak borç dökümü, yetki ve belgeler iste.'],
    family: ['Etkilenen kişileri, çocukları, tarihleri ve sorumlu yerleri not et.', 'Sosyal danışmanlık, aile danışmanlığı veya yetkili yeri kısa özetle ara.'],
  },
  ar: {
    rent: ['اطلب من المؤجر أو إدارة السكن توضيحا كتابيا أو تقسيطا أو تمديد المهلة.', 'اتصل بـ Jobcenter أو مكتب الشؤون الاجتماعية أو مساعدة طوارئ السكن بشأن احتمال تغطية ديون الإيجار.'],
    energy: ['اطلب من مزود الطاقة تعليق القطع وتقسيطا وكشفا بالمطالبة.', 'اسأل Jobcenter أو مكتب الشؤون الاجتماعية عن قرض لديون الطاقة.'],
    jobcenter: ['رتّب القرار أو الطلب حسب التاريخ وحدد المستندات الناقصة.', 'اطلب كتابيا من Jobcenter حالة الملف أو دفعة مقدمة أو تمديد المهلة أو مراجعة القرار.'],
    health: ['اطلب من شركة التأمين الصحي كشف المطالبة وتوضيح حماية التأمين.', 'عند انخفاض الدخل اسأل عن فحص الاشتراكات أو دعم مكتب الشؤون الاجتماعية أو Jobcenter.'],
    garnishment: ['اطلب من البنك كتابيا تحويل الحساب إلى P-Konto أو تأكيد الحماية.', 'اتصل باستشارة الديون بخصوص المبالغ المعفاة والشهادة والتواصل مع الدائن.'],
    schufa: ['اطلب من الدائن المباشر أو الشريك التعاقدي تمديد المهلة أو التقسيط.', 'أوقف القروض السريعة المكلفة وافحص أولا المطالبة وبيانات Schufa وخيارات الاستشارة.'],
    debtCourt: ['افحص هل الخطاب من المحكمة أو الدائن أو شركة تحصيل.', 'في بريد المحكمة دوّن تاريخ التسليم وابحث فورا عن استشارة.', 'في التحصيل اطلب كتابيا كشف المطالبة والتفويض والإثباتات.'],
    family: ['دوّن أهم الأشخاص المتأثرين والأطفال والمواعيد والجهات المسؤولة.', 'اتصل بالاستشارة الاجتماعية أو الأسرية أو الجهة المختصة مع ملخص قصير.'],
  },
  uk: {
    rent: ['Попросити орендодавця або управління будинком письмово пояснити ситуацію, погодити розстрочку або продовжити строк.', 'Звернутися до Jobcenter, соціального відомства або допомоги при житловій кризі щодо можливого покриття боргу за оренду.'],
    energy: ['Попросити постачальника енергії призупинити відключення, погодити розстрочку та надати розрахунок вимоги.', 'Запитати Jobcenter або соціальне відомство про позику для боргів за енергію.'],
    jobcenter: ['Впорядкувати рішення або заяву за датами і позначити відсутні документи.', 'Письмово попросити Jobcenter про стан справи, аванс, продовження строку або перевірку.'],
    health: ['Попросити медичну страхову касу надати розрахунок вимоги та пояснити страховий захист.', 'За низького доходу запитати про перевірку внесків або підтримку соціального відомства чи Jobcenter.'],
    garnishment: ['Письмово попросити банк про перетворення рахунку на P-Konto або підтвердження захисту.', 'Звернутися до боргової консультації щодо неоподатковуваних сум, довідки та контакту з кредитором.'],
    schufa: ['Попросити прямого кредитора або договірного партнера про продовження строку або розстрочку.', 'Призупинити дорогі швидкі кредити і спочатку перевірити вимогу, дані Schufa та варіанти консультації.'],
    debtCourt: ['Перевірити, чи лист від суду, кредитора або інкасо-компанії.', 'Якщо це судова пошта, записати дату вручення і негайно шукати консультацію.', 'При інкасо письмово запросити розрахунок вимоги, повноваження та докази.'],
    family: ['Записати найважливіших залучених осіб, дітей, дати та відповідальні установи.', 'Звернутися до соціальної, сімейної або відповідальної консультації з коротким описом ситуації.'],
  },
};

export function buildActionPlan(categoryId: CategoryId, answers: Answers, language: Language = 'de') {
  const plan = [...sharedActionPlan[language]];

  if (answers.deadlineDate || answers.writtenDeadline === 'ja') {
    plan.unshift(deadlineStep[language]);
  }

  return [...plan, ...categoryActionPlan[language][categoryId]];
}
