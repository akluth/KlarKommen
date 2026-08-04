import { isBaseLanguage, type BaseLanguage, type Language } from './index';
import type { CategoryId, Country } from '../types';
import { adaptTextForAustria } from './austria';
import { getSwissQuickHelpTexts } from './quickHelpSwitzerland';

export type QuickDeadlineWindow =
  | 'immediateNeeds'
  | 'today'
  | 'threeDays'
  | 'week'
  | 'later'
  | 'unclear';

export interface QuickChoiceText {
  help: string;
  label: string;
}

export interface QuickRiskText {
  legend: string;
  options: Record<string, QuickChoiceText>;
}

export interface QuickHelpTexts {
  actionEyebrow: string;
  actionHeading: string;
  back: string;
  callNow: string;
  changeAnswers: string;
  continueDetails: string;
  directContactEyebrow: string;
  directContactHeading: string;
  directContactIntro: string;
  emergencyCall: string;
  emergencyHeading: string;
  emergencyPolice: string;
  emergencyText: string;
  eyebrow: string;
  googleEyebrow: string;
  googleHeading: string;
  googleNotice: string;
  heading: string;
  intro: string;
  locationHelp: string;
  locationLabel: string;
  locationPlaceholder: string;
  newTab: string;
  noLocation: string;
  requiredError: string;
  resultEyebrow: string;
  resultHeading: string;
  resultIntro: string;
  source: string;
  submit: string;
  timingLegend: string;
  timingOptions: Record<QuickDeadlineWindow, QuickChoiceText>;
  verifiedOn: string;
  visitWebsite: string;
  risks: Record<CategoryId, QuickRiskText>;
}

const de: QuickHelpTexts = {
  actionEyebrow: 'Die ersten Minuten zählen',
  actionHeading: 'Diese Schritte kannst du jetzt gehen',
  back: 'Andere Situation wählen',
  callNow: 'Jetzt anrufen',
  changeAnswers: 'Angaben ändern',
  continueDetails: 'Ausführliche Beratung starten',
  directContactEyebrow: 'Geprüfte Anlaufstellen',
  directContactHeading: 'Hier bekommst du direkt Hilfe',
  directContactIntro:
    'Diese Stellen sind bundesweit erreichbar oder führen dich zu einer zuständigen Stelle vor Ort. Ein Anruf oder eine Nachricht wahrt keine rechtliche Frist.',
  emergencyCall: '112 anrufen',
  emergencyHeading: 'Bist du oder eine andere Person unmittelbar in Gefahr?',
  emergencyPolice: '110 anrufen',
  emergencyText:
    'Bei Lebensgefahr oder einem medizinischen Notfall rufe 112. Bei akuter Bedrohung oder Gewalt rufe 110. Finanzielle Dringlichkeit allein ist kein Fall für den Notruf.',
  eyebrow: 'Soforthilfe · etwa 60 Sekunden',
  googleEyebrow: 'Lokaler Such-Fallback',
  googleHeading: 'Weitere Hilfe mit Google suchen',
  googleNotice:
    'Erst wenn du einen Link öffnest, werden Hilfsart und Ort oder PLZ als Suchanfrage an Google übertragen. KlarKommen lädt Google nicht automatisch und übermittelt keine weiteren Fallangaben.',
  heading: 'Was ist jetzt sofort wichtig?',
  intro:
    'Drei kurze Angaben reichen für erste Schritte und direkte Kontakte. Wenn du etwas nicht weißt, wähle „Unklar“ – das wird nicht als Entwarnung gewertet.',
  locationHelp:
    'Nur PLZ oder Stadt eingeben, keine Straße oder Namen. Die Angabe bleibt bis zum Öffnen eines externen Links in diesem Browser.',
  locationLabel: 'Welche PLZ oder Stadt ist zuständig?',
  locationPlaceholder: 'z. B. 04109 oder Leipzig',
  newTab: 'öffnet in einem neuen Tab',
  noLocation: 'Ohne Ort fortfahren',
  requiredError: 'Bitte gib einen Ort an oder wähle „Ohne Ort“ und beantworte beide Einschätzungen. „Unklar“ ist eine gültige Antwort.',
  resultEyebrow: 'Soforthilfe-Ergebnis',
  resultHeading: 'Das kannst du jetzt konkret tun',
  resultIntro:
    'Diese Kurzprüfung ist eine vorsichtige Ersteinschätzung, keine rechtliche oder medizinische Bewertung. Du kannst sofort einen Kontakt nutzen oder deine Lage anschließend genauer sortieren.',
  source: 'Quelle',
  submit: 'Soforthilfe anzeigen',
  timingLegend: 'Was macht die Lage zeitlich dringend?',
  timingOptions: {
    immediateNeeds: {
      label: 'Heute fehlt etwas Lebensnotwendiges',
      help: 'Zum Beispiel Geld oder Zugang für Essen, Unterkunft, Energie, Behandlung oder Medikamente.',
    },
    today: {
      label: 'Frist abgelaufen oder heute/morgen',
      help: 'Auch wählen, wenn ein Termin oder eine Sperre heute oder morgen bevorsteht.',
    },
    threeDays: {
      label: 'Frist in zwei bis drei Tagen',
      help: 'Es bleiben höchstens drei Tage zum Reagieren.',
    },
    week: {
      label: 'Frist in vier bis sieben Tagen',
      help: 'Die Sache sollte in den nächsten Tagen geklärt werden.',
    },
    later: {
      label: 'Später oder keine akute Frist',
      help: 'Aus deiner Sicht muss nicht innerhalb einer Woche reagiert werden.',
    },
    unclear: {
      label: 'Unklar',
      help: 'Du weißt nicht, ob eine Frist oder unmittelbare Versorgungslücke besteht.',
    },
  },
  verifiedOn: 'zuletzt anhand der Quelle geprüft',
  visitWebsite: 'Website öffnen',
  risks: {
    rent: {
      legend: 'Was ist beim Wohnen bereits passiert?',
      options: {
        eviction: { label: 'Räumungsklage oder Räumungstermin', help: 'Es gibt Post vom Gericht oder einen konkreten Termin.' },
        immediateTermination: { label: 'Fristlose Kündigung erhalten', help: 'Die Kündigung ist bereits schriftlich zugegangen.' },
        termination: { label: 'Andere Kündigung erhalten', help: 'Es gibt eine Kündigung, aber keine Räumungsklage.' },
        arrears: { label: 'Mietrückstand oder Mahnung', help: 'Noch keine Kündigung oder Klage bekannt.' },
        unclear: { label: 'Unklar', help: 'Du kannst das Schreiben oder den Stand nicht sicher einordnen.' },
      },
    },
    energy: {
      legend: 'Wie ist der Stand bei Strom oder Gas?',
      options: {
        blocked: { label: 'Bereits gesperrt', help: 'Strom oder Gas ist aktuell abgestellt.' },
        imminent: { label: 'Sperre steht unmittelbar bevor', help: 'Ein konkreter Sperrtermin ist sehr nah.' },
        threatened: { label: 'Sperre wurde angedroht', help: 'Es gibt eine Androhung, aber noch keinen unmittelbaren Termin.' },
        arrears: { label: 'Rückstand oder Mahnung ohne Sperrandrohung', help: 'Es sind Schulden offen, die Versorgung läuft noch.' },
        unclear: { label: 'Unklar', help: 'Du kannst die Schreiben oder den Versorgungsstatus nicht sicher einordnen.' },
      },
    },
    jobcenter: {
      legend: 'Was ist beim Jobcenter gerade am dringendsten?',
      options: {
        noMoney: { label: 'Geld für den Lebensunterhalt fehlt jetzt', help: 'Essen, Wohnen oder Medikamente sind aktuell nicht gesichert.' },
        stopped: { label: 'Leistung wurde gekürzt oder gestoppt', help: 'Zum Beispiel durch eine Sanktion oder ausbleibende Zahlung.' },
        deadline: { label: 'Bescheid oder Widerspruchsfrist', help: 'Ein Bescheid muss zeitnah geprüft werden.' },
        application: { label: 'Antrag, Weiterbewilligung oder allgemeine Frage', help: 'Keine akute Versorgungslücke bekannt.' },
        unclear: { label: 'Unklar', help: 'Du kannst den Bescheid oder den aktuellen Stand nicht sicher einordnen.' },
      },
    },
    health: {
      legend: 'Was ist bei der Krankenversicherung bereits passiert?',
      options: {
        careAtRisk: { label: 'Behandlung oder Medikamente akut gefährdet', help: 'Notwendige Versorgung ist aktuell nicht gesichert.' },
        suspended: { label: 'Leistungen ruhen oder sollen ruhen', help: 'Die Krankenkasse hat Einschränkungen angekündigt oder umgesetzt.' },
        warnings: { label: 'Beitragsschulden oder Mahnungen', help: 'Noch keine Leistungseinschränkung bekannt.' },
        question: { label: 'Allgemeine Versicherungsfrage', help: 'Keine akute Einschränkung oder Mahnung bekannt.' },
        unclear: { label: 'Unklar', help: 'Du kannst den Versicherungsstatus oder das Schreiben nicht sicher einordnen.' },
      },
    },
    garnishment: {
      legend: 'Was ist mit deinem Konto passiert?',
      options: {
        noAccess: { label: 'Gepfändet und kein Geld verfügbar', help: 'Du kommst nicht an Geld für den Lebensunterhalt.' },
        noPAccount: { label: 'Gepfändet, noch kein bestätigtes P-Konto', help: 'Die Umwandlung ist noch nicht sicher abgeschlossen.' },
        pAccount: { label: 'Gepfändet, P-Konto besteht', help: 'Es gibt trotzdem ein Problem mit Zugriff oder Freibetrag.' },
        order: { label: 'Pfändung angekündigt oder Beschluss erhalten', help: 'Das Konto ist möglicherweise noch nicht blockiert.' },
        unclear: { label: 'Unklar', help: 'Du kannst den Kontostatus oder das Schreiben nicht sicher einordnen.' },
      },
    },
    schufa: {
      legend: 'Was ist beim Kredit- oder Schufa-Thema passiert?',
      options: {
        essential: { label: 'Geld wird heute für etwas Lebensnotwendiges gebraucht', help: 'Zum Beispiel Miete, Energie, Essen oder Medikamente.' },
        rejected: { label: 'Kredit oder Vertrag wurde abgelehnt', help: 'Schufa oder Bonität wurde als Grund genannt oder vermutet.' },
        wrongData: { label: 'Ein Schufa-Eintrag wirkt falsch', help: 'Du möchtest Daten prüfen oder korrigieren lassen.' },
        information: { label: 'Datenkopie oder allgemeine Information', help: 'Keine akute Frist oder Versorgungslücke bekannt.' },
        unclear: { label: 'Unklar', help: 'Du weißt noch nicht, was gespeichert ist oder warum etwas abgelehnt wurde.' },
      },
    },
    debtCourt: {
      legend: 'Welches Schreiben liegt vor?',
      options: {
        enforcement: { label: 'Vollstreckungsbescheid', help: 'Ein gerichtlicher Vollstreckungsbescheid ist angekommen.' },
        courtOrder: { label: 'Mahnbescheid oder gelber Gerichtsbrief', help: 'Das Schreiben kommt von einem Gericht.' },
        inkasso: { label: 'Inkassoschreiben', help: 'Das Schreiben kommt von einem Inkassounternehmen.' },
        reminder: { label: 'Mahnung oder unbekannte Forderung', help: 'Kein Gericht als Absender erkennbar.' },
        unclear: { label: 'Unklar', help: 'Du kannst Absender oder Art des Schreibens nicht sicher erkennen.' },
      },
    },
    family: {
      legend: 'Was braucht gerade zuerst Aufmerksamkeit?',
      options: {
        danger: { label: 'Akute Bedrohung, Gewalt oder Kindeswohlgefahr', help: 'Du oder eine andere Person ist möglicherweise nicht sicher.' },
        childrenNoSupport: { label: 'Kinder betroffen und Unterstützung fehlt', help: 'Du bist mit der Situation gerade weitgehend allein.' },
        housing: { label: 'Wohnsituation ändert sich akut', help: 'Auszug, Trennung oder Verlust der Wohnung steht bevor.' },
        transition: { label: 'Trennung, Geburt, Tod oder andere Veränderung', help: 'Keine unmittelbare Gefahr bekannt.' },
        unclear: { label: 'Unklar', help: 'Du weißt noch nicht, was zuerst geklärt werden muss.' },
      },
    },
  },
};

const tr: QuickHelpTexts = {
  ...de,
  actionEyebrow: 'İlk dakikalar önemli',
  actionHeading: 'Şimdi atabileceğin adımlar',
  back: 'Başka bir durum seç',
  callNow: 'Şimdi ara',
  changeAnswers: 'Yanıtları değiştir',
  continueDetails: 'Ayrıntılı danışmayı başlat',
  directContactEyebrow: 'Kontrol edilmiş başvuru yerleri',
  directContactHeading: 'Buradan doğrudan yardım alabilirsin',
  directContactIntro: 'Bu kurumlara Almanya genelinde ulaşılabilir veya seni yerel yetkili kuruma yönlendirirler. Arama ya da mesaj yasal süreyi durdurmaz.',
  emergencyCall: '112’yi ara',
  emergencyHeading: 'Sen veya başka biri şu anda doğrudan tehlikede mi?',
  emergencyPolice: '110’u ara',
  emergencyText: 'Hayati tehlike veya tıbbi acil durumda 112’yi ara. Akut tehdit ya da şiddette 110’u ara. Yalnızca mali aciliyet acil çağrı nedeni değildir.',
  eyebrow: 'Acil yardım · yaklaşık 60 saniye',
  googleEyebrow: 'Yerel arama yedeği',
  googleHeading: 'Google ile başka yardım ara',
  googleNotice: 'Yalnızca bir bağlantıyı açtığında yardım türü ile şehir veya posta kodu Google’a arama sorgusu olarak aktarılır. KlarKommen Google’ı otomatik yüklemez ve başka durum bilgisi göndermez.',
  heading: 'Şu anda en önemli olan ne?',
  intro: 'Üç kısa bilgi ilk adımlar ve doğrudan bağlantılar için yeterli. Bir şeyi bilmiyorsan “Belirsiz” seç; bu, tehlike yok anlamına gelmez.',
  locationHelp: 'Yalnızca posta kodu veya şehir yaz; sokak ya da isim yazma. Harici bağlantı açılana kadar bilgi bu tarayıcıda kalır.',
  locationLabel: 'Hangi posta kodu veya şehir yetkili?',
  locationPlaceholder: 'örn. 04109 veya Leipzig',
  newTab: 'yeni sekmede açılır',
  noLocation: 'Konum olmadan devam et',
  requiredError: 'Lütfen bir konum gir veya “Konum olmadan” seçeneğini işaretle ve iki değerlendirmeyi de yanıtla. “Belirsiz” geçerli bir yanıttır.',
  resultEyebrow: 'Acil yardım sonucu',
  resultHeading: 'Şimdi somut olarak yapabileceklerin',
  resultIntro: 'Bu kısa kontrol dikkatli bir ilk değerlendirmedir; hukuki veya tıbbi değerlendirme değildir. Hemen bir bağlantıyı kullanabilir ya da ardından durumunu ayrıntılı sıralayabilirsin.',
  source: 'Kaynak',
  submit: 'Acil yardımı göster',
  timingLegend: 'Durumu zaman açısından acil yapan ne?',
  timingOptions: {
    immediateNeeds: { label: 'Bugün temel bir ihtiyaç karşılanmıyor', help: 'Örneğin yemek, barınma, enerji, tedavi veya ilaç için para ya da erişim yok.' },
    today: { label: 'Süre geçti veya bugün/yarın bitiyor', help: 'Bugün ya da yarın bir randevu veya kesinti varsa da seç.' },
    threeDays: { label: 'Süre iki ila üç gün içinde', help: 'Tepki vermek için en fazla üç gün var.' },
    week: { label: 'Süre dört ila yedi gün içinde', help: 'Konu önümüzdeki günlerde çözülmeli.' },
    later: { label: 'Daha sonra veya acil süre yok', help: 'Sence bir hafta içinde tepki vermek gerekmiyor.' },
    unclear: { label: 'Belirsiz', help: 'Bir süre veya doğrudan ihtiyaç açığı olup olmadığını bilmiyorsun.' },
  },
  verifiedOn: 'kaynak üzerinden son kontrol',
  visitWebsite: 'Web sitesini aç',
  risks: {
    rent: { legend: 'Konut konusunda ne oldu?', options: {
      eviction: { label: 'Tahliye davası veya tahliye tarihi', help: 'Mahkemeden yazı ya da somut bir tarih var.' }, immediateTermination: { label: 'Derhal fesih bildirimi geldi', help: 'Yazılı fesih bildirimi ulaştı.' }, termination: { label: 'Başka bir fesih bildirimi geldi', help: 'Fesih var ama tahliye davası yok.' }, arrears: { label: 'Kira borcu veya ihtar', help: 'Bilinen fesih ya da dava yok.' }, unclear: { label: 'Belirsiz', help: 'Yazıyı veya durumu güvenle sınıflandıramıyorsun.' },
    } },
    energy: { legend: 'Elektrik veya gazın durumu nedir?', options: {
      blocked: { label: 'Zaten kesildi', help: 'Elektrik veya gaz şu anda kapalı.' }, imminent: { label: 'Kesinti çok yakında', help: 'Somut kesinti tarihi çok yakın.' }, threatened: { label: 'Kesinti tehdidi var', help: 'Tehdit var ama yakın tarih yok.' }, arrears: { label: 'Kesinti tehdidi olmadan borç veya ihtar', help: 'Borç var, hizmet devam ediyor.' }, unclear: { label: 'Belirsiz', help: 'Yazıyı veya hizmet durumunu güvenle sınıflandıramıyorsun.' },
    } },
    jobcenter: { legend: 'Jobcenter konusunda şu anda en acil olan ne?', options: {
      noMoney: { label: 'Geçim parası şimdi eksik', help: 'Yemek, konut veya ilaç şu anda güvence altında değil.' }, stopped: { label: 'Ödeme azaltıldı veya durdu', help: 'Örneğin yaptırım ya da gelmeyen ödeme nedeniyle.' }, deadline: { label: 'Karar veya itiraz süresi', help: 'Bir karar yakında kontrol edilmeli.' }, application: { label: 'Başvuru, uzatma veya genel soru', help: 'Bilinen akut ihtiyaç açığı yok.' }, unclear: { label: 'Belirsiz', help: 'Kararı veya güncel durumu güvenle sınıflandıramıyorsun.' },
    } },
    health: { legend: 'Sağlık sigortasında ne oldu?', options: {
      careAtRisk: { label: 'Tedavi veya ilaç akut tehlikede', help: 'Gerekli sağlık hizmeti şu anda güvence altında değil.' }, suspended: { label: 'Hizmetler durdu veya duracak', help: 'Sigorta kısıtlama bildirdi ya da uyguladı.' }, warnings: { label: 'Prim borcu veya ihtarlar', help: 'Bilinen hizmet kısıtlaması yok.' }, question: { label: 'Genel sigorta sorusu', help: 'Bilinen akut kısıtlama veya ihtar yok.' }, unclear: { label: 'Belirsiz', help: 'Sigorta durumunu veya yazıyı güvenle sınıflandıramıyorsun.' },
    } },
    garnishment: { legend: 'Hesabına ne oldu?', options: {
      noAccess: { label: 'Hacizli ve para kullanılamıyor', help: 'Geçim için gereken paraya ulaşamıyorsun.' }, noPAccount: { label: 'Hacizli, onaylanmış P-Konto yok', help: 'Dönüşüm henüz güvenle tamamlanmadı.' }, pAccount: { label: 'Hacizli, P-Konto var', help: 'Yine de erişim veya muafiyet sorunu var.' }, order: { label: 'Haciz bildirildi veya karar geldi', help: 'Hesap henüz bloke olmamış olabilir.' }, unclear: { label: 'Belirsiz', help: 'Hesap durumunu veya yazıyı güvenle sınıflandıramıyorsun.' },
    } },
    schufa: { legend: 'Kredi veya Schufa konusunda ne oldu?', options: {
      essential: { label: 'Bugün temel ihtiyaç için para gerekli', help: 'Örneğin kira, enerji, yemek veya ilaç.' }, rejected: { label: 'Kredi veya sözleşme reddedildi', help: 'Schufa veya kredi notu neden gösterildi ya da tahmin ediliyor.' }, wrongData: { label: 'Bir Schufa kaydı yanlış görünüyor', help: 'Verileri kontrol veya düzelttirmek istiyorsun.' }, information: { label: 'Veri kopyası veya genel bilgi', help: 'Bilinen akut süre veya ihtiyaç açığı yok.' }, unclear: { label: 'Belirsiz', help: 'Neyin kayıtlı olduğunu veya red nedenini bilmiyorsun.' },
    } },
    debtCourt: { legend: 'Hangi yazı var?', options: {
      enforcement: { label: 'Vollstreckungsbescheid', help: 'Mahkemeden icra emri geldi.' }, courtOrder: { label: 'Mahnbescheid veya sarı mahkeme zarfı', help: 'Yazı bir mahkemeden geliyor.' }, inkasso: { label: 'Inkasso yazısı', help: 'Yazı bir tahsilat şirketinden geliyor.' }, reminder: { label: 'İhtar veya bilinmeyen talep', help: 'Gönderen olarak mahkeme görünmüyor.' }, unclear: { label: 'Belirsiz', help: 'Göndereni veya yazı türünü güvenle tanıyamıyorsun.' },
    } },
    family: { legend: 'Önce neyle ilgilenmek gerekiyor?', options: {
      danger: { label: 'Akut tehdit, şiddet veya çocuk güvenliği tehlikesi', help: 'Sen veya başka biri güvende olmayabilir.' }, childrenNoSupport: { label: 'Çocuklar etkileniyor ve destek yok', help: 'Bu durumda büyük ölçüde yalnızsın.' }, housing: { label: 'Konut durumu akut değişiyor', help: 'Taşınma, ayrılık veya konut kaybı yaklaşıyor.' }, transition: { label: 'Ayrılık, doğum, ölüm veya başka değişiklik', help: 'Bilinen doğrudan tehlike yok.' }, unclear: { label: 'Belirsiz', help: 'Önce neyin çözülmesi gerektiğini bilmiyorsun.' },
    } },
  },
};

const uk: QuickHelpTexts = {
  ...de,
  actionEyebrow: 'Перші хвилини важливі', actionHeading: 'Що можна зробити зараз', back: 'Обрати іншу ситуацію', callNow: 'Зателефонувати', changeAnswers: 'Змінити відповіді', continueDetails: 'Почати детальну консультацію',
  directContactEyebrow: 'Перевірені служби', directContactHeading: 'Тут можна отримати пряму допомогу', directContactIntro: 'Ці служби доступні по всій Німеччині або допоможуть знайти місцеву установу. Дзвінок чи повідомлення не зупиняє юридичний строк.',
  emergencyCall: 'Зателефонувати 112', emergencyHeading: 'Ви або інша людина зараз у безпосередній небезпеці?', emergencyPolice: 'Зателефонувати 110', emergencyText: 'За загрози життю або медичної невідкладної ситуації телефонуйте 112. За гострої загрози чи насильства — 110. Сама фінансова терміновість не є підставою для екстреного виклику.',
  eyebrow: 'Негайна допомога · близько 60 секунд', googleEyebrow: 'Резервний місцевий пошук', googleHeading: 'Шукати іншу допомогу через Google', googleNotice: 'Лише коли ви відкриєте посилання, вид допомоги та місто або індекс будуть передані Google як пошуковий запит. KlarKommen не завантажує Google автоматично й не передає інших даних справи.',
  heading: 'Що зараз найважливіше?', intro: 'Трьох коротких відповідей достатньо для перших кроків і прямих контактів. Якщо не знаєте, оберіть «Незрозуміло» — це не вважається відсутністю ризику.',
  locationHelp: 'Вкажіть лише поштовий індекс або місто, без вулиці чи імен. До відкриття зовнішнього посилання дані залишаються в цьому браузері.', locationLabel: 'Який поштовий індекс або місто?', locationPlaceholder: 'наприклад 04109 або Leipzig', newTab: 'відкриється в новій вкладці', noLocation: 'Продовжити без місця', requiredError: 'Вкажіть місце або оберіть «Продовжити без місця» та дайте відповідь на обидва питання. «Незрозуміло» — допустима відповідь.',
  resultEyebrow: 'Результат негайної допомоги', resultHeading: 'Що конкретно можна зробити зараз', resultIntro: 'Ця коротка перевірка — обережна первинна оцінка, а не юридичний чи медичний висновок. Можна відразу скористатися контактом або потім детальніше впорядкувати ситуацію.', source: 'Джерело', submit: 'Показати негайну допомогу', timingLegend: 'Що робить ситуацію терміновою?',
  timingOptions: {
    immediateNeeds: { label: 'Сьогодні бракує життєво необхідного', help: 'Наприклад, грошей чи доступу до їжі, житла, енергії, лікування або ліків.' }, today: { label: 'Строк минув або спливає сьогодні/завтра', help: 'Також оберіть, якщо сьогодні чи завтра буде засідання або відключення.' }, threeDays: { label: 'Строк через два-три дні', help: 'На реакцію залишилося не більше трьох днів.' }, week: { label: 'Строк через чотири-сім днів', help: 'Питання слід з’ясувати найближчими днями.' }, later: { label: 'Пізніше або без гострого строку', help: 'На вашу думку, реагувати протягом тижня не потрібно.' }, unclear: { label: 'Незрозуміло', help: 'Ви не знаєте, чи є строк або безпосередня нестача необхідного.' },
  }, verifiedOn: 'останню перевірку за джерелом здійснено', visitWebsite: 'Відкрити сайт',
  risks: {
    rent: { legend: 'Що вже сталося з житлом?', options: { eviction: { label: 'Позов або дата виселення', help: 'Є лист із суду або конкретна дата.' }, immediateTermination: { label: 'Отримано негайне розірвання договору', help: 'Письмове розірвання вже надійшло.' }, termination: { label: 'Отримано інше розірвання договору', help: 'Є розірвання, але позову про виселення немає.' }, arrears: { label: 'Борг за оренду або нагадування', help: 'Про розірвання чи позов невідомо.' }, unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити зміст листа або стан справи.' } } },
    energy: { legend: 'Який стан електрики або газу?', options: { blocked: { label: 'Уже відключено', help: 'Електрика або газ зараз відключені.' }, imminent: { label: 'Відключення зовсім скоро', help: 'Є дуже близька конкретна дата.' }, threatened: { label: 'Є попередження про відключення', help: 'Попередження є, але близької дати немає.' }, arrears: { label: 'Борг або нагадування без загрози відключення', help: 'Борг є, постачання триває.' }, unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити лист або стан постачання.' } } },
    jobcenter: { legend: 'Що зараз найтерміновіше щодо Jobcenter?', options: { noMoney: { label: 'Зараз немає коштів на життя', help: 'Їжа, житло або ліки не забезпечені.' }, stopped: { label: 'Виплату зменшено або зупинено', help: 'Наприклад, через санкцію або ненадходження коштів.' }, deadline: { label: 'Рішення або строк заперечення', help: 'Рішення потрібно швидко перевірити.' }, application: { label: 'Заява, продовження або загальне питання', help: 'Про гостру нестачу коштів невідомо.' }, unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити рішення або стан справи.' } } },
    health: { legend: 'Що сталося з медичним страхуванням?', options: { careAtRisk: { label: 'Лікування або ліки гостро під загрозою', help: 'Необхідна допомога зараз не забезпечена.' }, suspended: { label: 'Послуги призупинено або планують призупинити', help: 'Каса оголосила чи ввела обмеження.' }, warnings: { label: 'Борг за внесками або нагадування', help: 'Про обмеження послуг невідомо.' }, question: { label: 'Загальне питання страхування', help: 'Про гостре обмеження чи нагадування невідомо.' }, unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити страховий статус або лист.' } } },
    garnishment: { legend: 'Що сталося з рахунком?', options: { noAccess: { label: 'Арештовано й гроші недоступні', help: 'Немає доступу до коштів на життя.' }, noPAccount: { label: 'Арештовано, підтвердженого P-Konto немає', help: 'Перетворення ще не завершено.' }, pAccount: { label: 'Арештовано, P-Konto є', help: 'Усе одно є проблема з доступом або лімітом.' }, order: { label: 'Оголошено арешт або отримано постанову', help: 'Рахунок, можливо, ще не заблоковано.' }, unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити стан рахунку або лист.' } } },
    schufa: { legend: 'Що сталося з кредитом або Schufa?', options: { essential: { label: 'Гроші сьогодні потрібні на життєво необхідне', help: 'Наприклад, оренду, енергію, їжу або ліки.' }, rejected: { label: 'Кредит або договір відхилено', help: 'Причиною названо або підозрюють Schufa.' }, wrongData: { label: 'Запис Schufa здається неправильним', help: 'Ви хочете перевірити або виправити дані.' }, information: { label: 'Копія даних або загальна інформація', help: 'Про гострий строк або нестачу необхідного невідомо.' }, unclear: { label: 'Незрозуміло', help: 'Ви не знаєте, що збережено або чому відмовлено.' } } },
    debtCourt: { legend: 'Який лист ви отримали?', options: { enforcement: { label: 'Vollstreckungsbescheid', help: 'Надійшов судовий виконавчий наказ.' }, courtOrder: { label: 'Mahnbescheid або жовтий судовий конверт', help: 'Лист надійшов із суду.' }, inkasso: { label: 'Лист Inkasso', help: 'Лист надійшов від колекторської компанії.' }, reminder: { label: 'Нагадування або невідома вимога', help: 'Суд не вказаний як відправник.' }, unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити відправника або вид листа.' } } },
    family: { legend: 'Що потребує уваги насамперед?', options: { danger: { label: 'Гостра загроза, насильство або небезпека для дитини', help: 'Ви або інша людина можете бути не в безпеці.' }, childrenNoSupport: { label: 'Діти зачеплені, а підтримки немає', help: 'Ви значною мірою самі з цією ситуацією.' }, housing: { label: 'Житлова ситуація гостро змінюється', help: 'Наближається переїзд, розлучення або втрата житла.' }, transition: { label: 'Розлука, народження, смерть чи інша зміна', help: 'Про безпосередню небезпеку невідомо.' }, unclear: { label: 'Незрозуміло', help: 'Ви ще не знаєте, що потрібно вирішити насамперед.' } } },
  },
};

const ar: QuickHelpTexts = {
  ...de,
  actionEyebrow: 'الدقائق الأولى مهمة', actionHeading: 'خطوات يمكنك اتخاذها الآن', back: 'اختيار حالة أخرى', callNow: 'اتصل الآن', changeAnswers: 'تعديل الإجابات', continueDetails: 'بدء الاستشارة المفصلة',
  directContactEyebrow: 'جهات تم التحقق منها', directContactHeading: 'هنا يمكنك الحصول على مساعدة مباشرة', directContactIntro: 'هذه الجهات متاحة في كل ألمانيا أو تساعدك في الوصول إلى الجهة المحلية المختصة. الاتصال أو الرسالة لا يوقفان أي مهلة قانونية.',
  emergencyCall: 'اتصل بـ 112', emergencyHeading: 'هل أنت أو شخص آخر في خطر مباشر الآن؟', emergencyPolice: 'اتصل بـ 110', emergencyText: 'عند وجود خطر على الحياة أو حالة طبية طارئة اتصل بـ112. عند وجود تهديد أو عنف حاد اتصل بـ110. الضيق المالي وحده ليس سببا للاتصال بالطوارئ.',
  eyebrow: 'مساعدة فورية · نحو 60 ثانية', googleEyebrow: 'بحث محلي احتياطي', googleHeading: 'ابحث عن مساعدة أخرى عبر Google', googleNotice: 'فقط عندما تفتح رابطا، يُنقل نوع المساعدة والمدينة أو الرمز البريدي إلى Google كطلب بحث. لا يحمّل KlarKommen خدمات Google تلقائيا ولا يرسل أي تفاصيل أخرى عن حالتك.',
  heading: 'ما الأهم الآن؟', intro: 'تكفي ثلاث معلومات قصيرة للحصول على خطوات أولى وجهات اتصال مباشرة. إذا لم تعرف شيئا فاختر «غير واضح»؛ ولا يُعتبر ذلك علامة أمان.',
  locationHelp: 'أدخل الرمز البريدي أو المدينة فقط، بلا شارع أو أسماء. تبقى المعلومة في هذا المتصفح حتى تفتح رابطا خارجيا.', locationLabel: 'ما الرمز البريدي أو المدينة المختصة؟', locationPlaceholder: 'مثلا 04109 أو Leipzig', newTab: 'يفتح في علامة تبويب جديدة', noLocation: 'المتابعة بدون مكان', requiredError: 'أدخل مكانا أو اختر «المتابعة بدون مكان»، ثم أجب عن التقييمين. «غير واضح» إجابة صالحة.',
  resultEyebrow: 'نتيجة المساعدة الفورية', resultHeading: 'ما يمكنك فعله الآن بشكل ملموس', resultIntro: 'هذا الفحص السريع تقييم أولي حذر وليس تقييما قانونيا أو طبيا. يمكنك استخدام جهة اتصال فورا أو ترتيب حالتك بتفصيل بعد ذلك.', source: 'المصدر', submit: 'عرض المساعدة الفورية', timingLegend: 'ما الذي يجعل الوضع عاجلا زمنيا؟',
  timingOptions: {
    immediateNeeds: { label: 'هناك حاجة أساسية مفقودة اليوم', help: 'مثلا المال أو الوصول إلى الطعام أو السكن أو الطاقة أو العلاج أو الدواء.' }, today: { label: 'انتهت المهلة أو تنتهي اليوم/غدا', help: 'اختر أيضا إذا كان هناك موعد أو قطع خدمة اليوم أو غدا.' }, threeDays: { label: 'المهلة خلال يومين أو ثلاثة', help: 'تبقى ثلاثة أيام كحد أقصى للرد.' }, week: { label: 'المهلة خلال أربعة إلى سبعة أيام', help: 'ينبغي توضيح الأمر في الأيام القادمة.' }, later: { label: 'لاحقا أو لا توجد مهلة عاجلة', help: 'حسب علمك لا يلزم الرد خلال أسبوع.' }, unclear: { label: 'غير واضح', help: 'لا تعرف إن كانت هناك مهلة أو حاجة أساسية فورية.' },
  }, verifiedOn: 'آخر تحقق من المصدر', visitWebsite: 'فتح الموقع',
  risks: {
    rent: { legend: 'ماذا حدث بخصوص السكن؟', options: { eviction: { label: 'دعوى أو موعد إخلاء', help: 'توجد رسالة من المحكمة أو موعد محدد.' }, immediateTermination: { label: 'وصل إنهاء فوري للعقد', help: 'وصل الإنهاء كتابة بالفعل.' }, termination: { label: 'وصل إنهاء آخر للعقد', help: 'يوجد إنهاء دون دعوى إخلاء.' }, arrears: { label: 'متأخرات إيجار أو إنذار', help: 'لا يوجد إنهاء أو دعوى معروفة.' }, unclear: { label: 'غير واضح', help: 'لا تستطيع تصنيف الرسالة أو الوضع بثقة.' } } },
    energy: { legend: 'ما وضع الكهرباء أو الغاز؟', options: { blocked: { label: 'تم القطع بالفعل', help: 'الكهرباء أو الغاز مقطوع الآن.' }, imminent: { label: 'القطع وشيك جدا', help: 'يوجد موعد قطع قريب جدا.' }, threatened: { label: 'تم التهديد بالقطع', help: 'يوجد تهديد دون موعد وشيك.' }, arrears: { label: 'متأخرات أو إنذار دون تهديد بالقطع', help: 'يوجد دين والخدمة ما زالت مستمرة.' }, unclear: { label: 'غير واضح', help: 'لا تستطيع تصنيف الرسالة أو حالة الخدمة بثقة.' } } },
    jobcenter: { legend: 'ما الأكثر إلحاحا مع Jobcenter الآن؟', options: { noMoney: { label: 'المال اللازم للمعيشة مفقود الآن', help: 'الطعام أو السكن أو الدواء غير مؤمّن حاليا.' }, stopped: { label: 'تم خفض الدفعة أو إيقافها', help: 'مثلا بسبب عقوبة أو عدم وصول الدفعة.' }, deadline: { label: 'قرار أو مهلة اعتراض', help: 'ينبغي فحص قرار قريبا.' }, application: { label: 'طلب أو تجديد أو سؤال عام', help: 'لا توجد فجوة معيشية عاجلة معروفة.' }, unclear: { label: 'غير واضح', help: 'لا تستطيع تصنيف القرار أو الوضع بثقة.' } } },
    health: { legend: 'ماذا حدث في التأمين الصحي؟', options: { careAtRisk: { label: 'العلاج أو الدواء مهدد بشكل عاجل', help: 'الرعاية الضرورية غير مؤمّنة حاليا.' }, suspended: { label: 'الخدمات متوقفة أو ستتوقف', help: 'أعلنت شركة التأمين قيودا أو طبقتها.' }, warnings: { label: 'ديون اشتراكات أو إنذارات', help: 'لا توجد قيود خدمات معروفة.' }, question: { label: 'سؤال تأمين عام', help: 'لا توجد قيود أو إنذارات عاجلة معروفة.' }, unclear: { label: 'غير واضح', help: 'لا تستطيع تصنيف حالة التأمين أو الرسالة بثقة.' } } },
    garnishment: { legend: 'ماذا حدث للحساب؟', options: { noAccess: { label: 'الحساب محجوز والمال غير متاح', help: 'لا تستطيع الوصول إلى مال المعيشة.' }, noPAccount: { label: 'محجوز ولا يوجد P-Konto مؤكد', help: 'لم تكتمل عملية التحويل بعد.' }, pAccount: { label: 'محجوز ويوجد P-Konto', help: 'ما زالت هناك مشكلة في الوصول أو الحد المعفى.' }, order: { label: 'تم إعلان الحجز أو وصل قرار', help: 'قد لا يكون الحساب محظورا بعد.' }, unclear: { label: 'غير واضح', help: 'لا تستطيع تصنيف حالة الحساب أو الرسالة بثقة.' } } },
    schufa: { legend: 'ماذا حدث في موضوع الائتمان أو Schufa؟', options: { essential: { label: 'المال مطلوب اليوم لحاجة أساسية', help: 'مثلا الإيجار أو الطاقة أو الطعام أو الدواء.' }, rejected: { label: 'تم رفض قرض أو عقد', help: 'ذُكرت Schufa أو الجدارة الائتمانية أو يُشتبه بهما.' }, wrongData: { label: 'يبدو أن سجلا في Schufa خاطئ', help: 'تريد فحص البيانات أو تصحيحها.' }, information: { label: 'نسخة بيانات أو معلومات عامة', help: 'لا توجد مهلة أو فجوة معيشية عاجلة معروفة.' }, unclear: { label: 'غير واضح', help: 'لا تعرف ما هو مخزن أو سبب الرفض.' } } },
    debtCourt: { legend: 'أي رسالة لديك؟', options: { enforcement: { label: 'Vollstreckungsbescheid', help: 'وصل أمر تنفيذ قضائي.' }, courtOrder: { label: 'Mahnbescheid أو ظرف محكمة أصفر', help: 'الرسالة قادمة من محكمة.' }, inkasso: { label: 'رسالة Inkasso', help: 'الرسالة من شركة تحصيل ديون.' }, reminder: { label: 'إنذار أو مطالبة غير معروفة', help: 'لا تظهر محكمة كمرسل.' }, unclear: { label: 'غير واضح', help: 'لا تستطيع معرفة المرسل أو نوع الرسالة بثقة.' } } },
    family: { legend: 'ما الذي يحتاج الانتباه أولا؟', options: { danger: { label: 'تهديد أو عنف حاد أو خطر على طفل', help: 'قد لا تكون أنت أو شخص آخر بأمان.' }, childrenNoSupport: { label: 'الأطفال متأثرون ولا يوجد دعم', help: 'أنت وحدك إلى حد كبير مع هذا الوضع.' }, housing: { label: 'وضع السكن يتغير بشكل عاجل', help: 'انتقال أو انفصال أو فقدان للسكن وشيك.' }, transition: { label: 'انفصال أو ولادة أو وفاة أو تغيير آخر', help: 'لا يوجد خطر مباشر معروف.' }, unclear: { label: 'غير واضح', help: 'لا تعرف بعد ما الذي يجب توضيحه أولا.' } } },
  },
};

const quickTexts: Record<BaseLanguage, QuickHelpTexts> = { ar, de, tr, uk };

const austrianEmergency: Record<BaseLanguage, Pick<QuickHelpTexts, 'emergencyCall' | 'emergencyPolice' | 'emergencyText' | 'directContactIntro' | 'locationPlaceholder'>> = {
  de: {
    emergencyCall: 'Rettung 144 anrufen',
    emergencyPolice: 'Polizei 133 anrufen',
    emergencyText: 'Bei Lebensgefahr oder einem medizinischen Notfall rufe die Rettung 144. Bei akuter Bedrohung oder Gewalt rufe die Polizei 133. Der Euro-Notruf 112 funktioniert ebenfalls. Finanzielle Dringlichkeit allein ist kein Fall für den Notruf.',
    directContactIntro: 'Diese Stellen sind österreichweit erreichbar oder führen dich zu einer zuständigen Stelle vor Ort. Ein Anruf oder eine Nachricht wahrt keine rechtliche Frist.',
    locationPlaceholder: 'z. B. 1010 oder Wien',
  },
  tr: {
    emergencyCall: '144 ambulansı ara',
    emergencyPolice: '133 polisi ara',
    emergencyText: 'Hayati tehlike veya tıbbi acil durumda 144 ambulansı ara. Akut tehdit ya da şiddette 133 polisi ara. Avrupa acil numarası 112 de çalışır. Yalnızca mali aciliyet acil çağrı nedeni değildir.',
    directContactIntro: 'Bu kurumlara Avusturya genelinde ulaşılabilir veya seni yerel yetkili kuruma yönlendirirler. Arama ya da mesaj yasal süreyi durdurmaz.',
    locationPlaceholder: 'örn. 1010 veya Wien',
  },
  ar: {
    emergencyCall: 'اتصل بالإسعاف 144',
    emergencyPolice: 'اتصل بالشرطة 133',
    emergencyText: 'عند خطر على الحياة أو حالة طبية طارئة اتصل بالإسعاف 144. عند تهديد أو عنف حاد اتصل بالشرطة 133. يعمل أيضا رقم الطوارئ الأوروبي 112. الضيق المالي وحده ليس سببا للاتصال بالطوارئ.',
    directContactIntro: 'هذه الجهات متاحة في كل النمسا أو تساعدك في الوصول إلى الجهة المحلية المختصة. الاتصال أو الرسالة لا يوقفان أي مهلة قانونية.',
    locationPlaceholder: 'مثلا 1010 أو Wien',
  },
  uk: {
    emergencyCall: 'Зателефонувати 144',
    emergencyPolice: 'Зателефонувати 133',
    emergencyText: 'За загрози життю або медичної невідкладної ситуації телефонуйте 144. За гострої загрози чи насильства — 133. Європейський номер 112 також працює. Сама фінансова терміновість не є підставою для екстреного виклику.',
    directContactIntro: 'Ці служби доступні по всій Австрії або допоможуть знайти місцеву установу. Дзвінок чи повідомлення не зупиняє юридичний строк.',
    locationPlaceholder: 'наприклад 1010 або Wien',
  },
};

const austrianGermanRisks: Partial<Record<CategoryId, QuickRiskText>> = {
  jobcenter: {
    legend: 'Was ist bei Sozialhilfe oder AMS gerade am dringendsten?',
    options: {
      noMoney: { label: 'Geld für den Lebensunterhalt fehlt jetzt', help: 'Essen, Wohnen oder Medikamente sind aktuell nicht gesichert.' },
      stopped: { label: 'Leistung wurde gekürzt oder eingestellt', help: 'Zum Beispiel Sozialhilfe, Arbeitslosengeld oder Notstandshilfe.' },
      deadline: { label: 'Bescheid oder Beschwerdefrist', help: 'Bescheid und Rechtsmittelbelehrung müssen rasch geprüft werden.' },
      application: { label: 'Antrag oder allgemeine Frage', help: 'Keine akute Versorgungslücke bekannt.' },
      unclear: { label: 'Unklar', help: 'Du kannst den Bescheid oder den aktuellen Stand nicht sicher einordnen.' },
    },
  },
  garnishment: {
    legend: 'Was ist mit deinem Konto passiert?',
    options: {
      noAccess: { label: 'Gepfändet und kein Geld verfügbar', help: 'Du kommst nicht an Geld für den Lebensunterhalt.' },
      noPAccount: { label: 'Gepfändet, Schutz noch nicht geklärt', help: 'Unpfändbare Beträge oder das Existenzminimum sind noch nicht freigegeben.' },
      pAccount: { label: 'Gepfändet, Schutz wurde schon geprüft', help: 'Trotzdem gibt es ein Problem mit Zugriff oder Freigabe.' },
      order: { label: 'Exekution angekündigt oder bewilligt', help: 'Das Konto ist möglicherweise noch nicht blockiert.' },
      unclear: { label: 'Unklar', help: 'Du kannst Kontostatus oder Schreiben nicht sicher einordnen.' },
    },
  },
  schufa: {
    legend: 'Was ist beim Kredit- oder Bonitätsthema passiert?',
    options: {
      essential: { label: 'Geld wird heute für etwas Lebensnotwendiges gebraucht', help: 'Zum Beispiel Miete, Energie, Essen oder Medikamente.' },
      rejected: { label: 'Kredit oder Vertrag wurde abgelehnt', help: 'KSV1870, CRIF oder Bonität wurde als Grund genannt oder vermutet.' },
      wrongData: { label: 'Bonitätsdaten wirken falsch', help: 'Du möchtest Daten bei KSV1870 oder CRIF prüfen oder berichtigen lassen.' },
      information: { label: 'Kostenlose Selbstauskunft', help: 'Keine akute Frist oder Versorgungslücke bekannt.' },
      unclear: { label: 'Unklar', help: 'Du weißt noch nicht, was gespeichert ist oder warum etwas abgelehnt wurde.' },
    },
  },
  debtCourt: {
    legend: 'Welches Schreiben liegt vor?',
    options: {
      enforcement: { label: 'Rechtskräftiger Titel oder Exekution', help: 'Ein rechtskräftiger Zahlungsbefehl oder eine Exekution liegt nahe.' },
      courtOrder: { label: 'Bedingter Zahlungsbefehl', help: 'Das Schreiben kommt von einem österreichischen Gericht.' },
      inkasso: { label: 'Inkassoschreiben', help: 'Das Schreiben kommt von einem Inkassounternehmen.' },
      reminder: { label: 'Mahnung oder unbekannte Forderung', help: 'Kein Gericht als Absender erkennbar.' },
      unclear: { label: 'Unklar', help: 'Du kannst Absender oder Art des Schreibens nicht sicher erkennen.' },
    },
  },
};

const austrianRiskOverrides: Record<BaseLanguage, Partial<Record<CategoryId, QuickRiskText>>> = {
  de: austrianGermanRisks,
  tr: {
    jobcenter: { legend: 'Sosyal yardım veya AMS konusunda şu anda en acil olan ne?', options: {
      noMoney: { label: 'Geçim parası şimdi eksik', help: 'Yemek, konut veya ilaç şu anda güvence altında değil.' },
      stopped: { label: 'Ödeme azaltıldı veya durduruldu', help: 'Örneğin sosyal yardım, işsizlik parası veya Notstandshilfe.' },
      deadline: { label: 'Karar veya şikâyet süresi', help: 'Karar ve hukuk yolu açıklaması hızla kontrol edilmeli.' },
      application: { label: 'Başvuru veya genel soru', help: 'Bilinen akut ihtiyaç açığı yok.' },
      unclear: { label: 'Belirsiz', help: 'Kararı veya güncel durumu güvenle sınıflandıramıyorsun.' },
    } },
    garnishment: { legend: 'Hesabına ne oldu?', options: {
      noAccess: { label: 'Hacizli ve para kullanılamıyor', help: 'Geçim için gereken paraya ulaşamıyorsun.' },
      noPAccount: { label: 'Hacizli, koruma henüz net değil', help: 'Haczedilemez tutarlar veya geçim asgarisi serbest bırakılmadı.' },
      pAccount: { label: 'Hacizli, koruma incelendi', help: 'Yine de erişim veya serbest bırakma sorunu var.' },
      order: { label: 'İcra bildirildi veya onaylandı', help: 'Hesap henüz bloke olmamış olabilir.' },
      unclear: { label: 'Belirsiz', help: 'Hesap durumunu veya yazıyı güvenle sınıflandıramıyorsun.' },
    } },
    schufa: { legend: 'Kredi veya kredi verileri konusunda ne oldu?', options: {
      essential: { label: 'Bugün temel ihtiyaç için para gerekli', help: 'Örneğin kira, enerji, yemek veya ilaç.' },
      rejected: { label: 'Kredi veya sözleşme reddedildi', help: 'KSV1870, CRIF veya kredi notu neden gösterildi.' },
      wrongData: { label: 'Kredi verileri yanlış görünüyor', help: 'KSV1870 veya CRIF verilerini kontrol ya da düzelttirmek istiyorsun.' },
      information: { label: 'Ücretsiz öz bilgi', help: 'Bilinen akut süre veya ihtiyaç açığı yok.' },
      unclear: { label: 'Belirsiz', help: 'Neyin kayıtlı olduğunu veya red nedenini bilmiyorsun.' },
    } },
    debtCourt: { legend: 'Hangi yazı var?', options: {
      enforcement: { label: 'Kesinleşmiş belge veya icra', help: 'Kesinleşmiş ödeme emri ya da icra söz konusu olabilir.' },
      courtOrder: { label: 'Şartlı ödeme emri', help: 'Yazı Avusturya mahkemesinden geliyor.' },
      inkasso: { label: 'Tahsilat yazısı', help: 'Yazı bir tahsilat şirketinden geliyor.' },
      reminder: { label: 'İhtar veya bilinmeyen talep', help: 'Gönderen olarak mahkeme görünmüyor.' },
      unclear: { label: 'Belirsiz', help: 'Göndereni veya yazı türünü güvenle tanıyamıyorsun.' },
    } },
  },
  ar: {
    jobcenter: { legend: 'ما الأكثر إلحاحا في المساعدة الاجتماعية أو AMS؟', options: {
      noMoney: { label: 'مال المعيشة مفقود الآن', help: 'الطعام أو السكن أو الدواء غير مؤمّن حاليا.' },
      stopped: { label: 'تم خفض أو إيقاف المساعدة', help: 'مثلا المساعدة الاجتماعية أو بدل البطالة أو Notstandshilfe.' },
      deadline: { label: 'قرار أو مهلة شكوى', help: 'يجب فحص القرار وبيان طرق الطعن بسرعة.' },
      application: { label: 'طلب أو سؤال عام', help: 'لا توجد فجوة معيشية عاجلة معروفة.' },
      unclear: { label: 'غير واضح', help: 'لا تستطيع تصنيف القرار أو الوضع بثقة.' },
    } },
    garnishment: { legend: 'ماذا حدث للحساب؟', options: {
      noAccess: { label: 'الحساب محجوز والمال غير متاح', help: 'لا تستطيع الوصول إلى مال المعيشة.' },
      noPAccount: { label: 'الحساب محجوز والحماية غير واضحة', help: 'لم يتم الإفراج عن المبالغ غير القابلة للحجز أو الحد الأدنى للمعيشة.' },
      pAccount: { label: 'الحساب محجوز والحماية فُحصت', help: 'ما زالت هناك مشكلة في الوصول أو الإفراج.' },
      order: { label: 'تم إعلان التنفيذ أو الموافقة عليه', help: 'قد لا يكون الحساب محظورا بعد.' },
      unclear: { label: 'غير واضح', help: 'لا تستطيع تصنيف حالة الحساب أو الخطاب بثقة.' },
    } },
    schufa: { legend: 'ماذا حدث بخصوص القرض أو بيانات الائتمان؟', options: {
      essential: { label: 'المال مطلوب اليوم لحاجة أساسية', help: 'مثلا الإيجار أو الطاقة أو الطعام أو الدواء.' },
      rejected: { label: 'تم رفض قرض أو عقد', help: 'ذُكر KSV1870 أو CRIF أو تقييم الجدارة الائتمانية.' },
      wrongData: { label: 'تبدو بيانات الائتمان خاطئة', help: 'تريد فحص أو تصحيح البيانات لدى KSV1870 أو CRIF.' },
      information: { label: 'معلومات ذاتية مجانية', help: 'لا توجد مهلة أو فجوة معيشية عاجلة معروفة.' },
      unclear: { label: 'غير واضح', help: 'لا تعرف ما هو مخزن أو سبب الرفض.' },
    } },
    debtCourt: { legend: 'أي خطاب لديك؟', options: {
      enforcement: { label: 'سند نهائي أو تنفيذ', help: 'قد يوجد أمر دفع نهائي أو إجراء تنفيذ.' },
      courtOrder: { label: 'أمر دفع مشروط', help: 'الخطاب من محكمة نمساوية.' },
      inkasso: { label: 'خطاب تحصيل', help: 'الخطاب من شركة تحصيل.' },
      reminder: { label: 'إنذار أو مطالبة غير معروفة', help: 'لا تظهر محكمة كمرسل.' },
      unclear: { label: 'غير واضح', help: 'لا تستطيع معرفة المرسل أو نوع الخطاب بثقة.' },
    } },
  },
  uk: {
    jobcenter: { legend: 'Що найтерміновіше щодо соціальної допомоги або AMS?', options: {
      noMoney: { label: 'Зараз бракує коштів на життя', help: 'Їжа, житло або ліки не забезпечені.' },
      stopped: { label: 'Виплату зменшено або припинено', help: 'Наприклад соціальну допомогу, допомогу з безробіття або Notstandshilfe.' },
      deadline: { label: 'Рішення або строк скарги', help: 'Рішення й роз’яснення про оскарження треба швидко перевірити.' },
      application: { label: 'Заява або загальне питання', help: 'Про гостру нестачу коштів невідомо.' },
      unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити рішення або стан справи.' },
    } },
    garnishment: { legend: 'Що сталося з рахунком?', options: {
      noAccess: { label: 'Арештовано й гроші недоступні', help: 'Немає доступу до коштів на життя.' },
      noPAccount: { label: 'Арештовано, захист ще не з’ясовано', help: 'Недоторканні суми або прожитковий мінімум не розблоковано.' },
      pAccount: { label: 'Арештовано, захист уже перевірено', help: 'Усе одно є проблема з доступом або розблокуванням.' },
      order: { label: 'Виконання оголошено або дозволено', help: 'Рахунок, можливо, ще не заблоковано.' },
      unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити стан рахунку або лист.' },
    } },
    schufa: { legend: 'Що сталося з кредитом або кредитними даними?', options: {
      essential: { label: 'Гроші сьогодні потрібні на життєво необхідне', help: 'Наприклад оренду, енергію, їжу або ліки.' },
      rejected: { label: 'Кредит або договір відхилено', help: 'Причиною названо KSV1870, CRIF або кредитну оцінку.' },
      wrongData: { label: 'Кредитні дані здаються неправильними', help: 'Ви хочете перевірити або виправити дані KSV1870 чи CRIF.' },
      information: { label: 'Безкоштовна власна інформація', help: 'Про гострий строк або нестачу необхідного невідомо.' },
      unclear: { label: 'Незрозуміло', help: 'Ви не знаєте, що збережено або чому відмовлено.' },
    } },
    debtCourt: { legend: 'Який лист ви отримали?', options: {
      enforcement: { label: 'Остаточний документ або виконання', help: 'Можливий остаточний платіжний наказ або виконання.' },
      courtOrder: { label: 'Умовний платіжний наказ', help: 'Лист надійшов від австрійського суду.' },
      inkasso: { label: 'Лист інкасо', help: 'Лист надійшов від інкасо-компанії.' },
      reminder: { label: 'Нагадування або невідома вимога', help: 'Суд не вказаний як відправник.' },
      unclear: { label: 'Незрозуміло', help: 'Ви не можете впевнено визначити відправника або вид листа.' },
    } },
  },
};

export function getQuickHelpTexts(language: Language, country: Country = 'de') {
  const baseLanguage = isBaseLanguage(language) ? language : 'de';
  const texts = quickTexts[baseLanguage];
  if (country === 'de') return texts;
  if (country === 'ch') return getSwissQuickHelpTexts(texts, language);
  const adapted = adaptTextForAustria(texts, baseLanguage);
  return {
    ...adapted,
    ...austrianEmergency[baseLanguage],
    risks: { ...adapted.risks, ...austrianRiskOverrides[baseLanguage] },
  };
}
