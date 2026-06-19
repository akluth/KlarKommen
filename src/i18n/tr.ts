import type { Answers, Category, CategoryId, Question, ResultContent } from '../types';

const has = (answers: Answers, key: string, value: string) => answers[key] === value;
const filled = (answers: Answers, key: string) => Boolean(answers[key]?.trim());

const line = (value?: string, fallback = '[lütfen tamamlayın]') => value?.trim() || fallback;

const formatMoney = (value?: string) => {
  if (!value) return 'tutar belirtilmedi';
  const number = Number(value);
  if (Number.isNaN(number)) return `${value} Euro`;
  return `${number.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} Euro`;
};

const amountText = (answers: Answers) => {
  const value = answers.amount?.trim();
  return value ? `${value} Euro` : '[tutarı ekleyin]';
};

const deadlineText = (answers: Answers) => {
  if (filled(answers, 'deadlineDate')) return `son tarih: ${answers.deadlineDate}`;
  if (has(answers, 'writtenDeadline', 'ja')) return 'yazılı süre var, tarihi kontrol edin';
  return 'net bir yazılı süre belirtilmedi';
};

const templateDeadlineText = (answers: Answers) => {
  if (answers.deadlineDate) return answers.deadlineDate;
  if (answers.writtenDeadline === 'ja') return '[son tarih tarihini ekleyin]';
  return '[varsa tarihi ekleyin]';
};

const senderBlock = (answers: Answers) => `Gönderen:
[İsim]
[Adres]
${answers.city ? answers.city : '[Posta kodu Şehir]'}

`;

const closing = `Bu mesajın ulaştığını yazılı olarak onaylamanızı rica ederim.

Saygılarımla
[İsim]`;

const commonHelp = (city?: string) => [
  `Borç danışmanlığı${city ? ` (${city})` : ''}`,
  `Sosyal danışmanlık${city ? ` (${city})` : ''}`,
  'Tüketici danışma merkezi',
  'Dava, karar yazısı veya süre varsa hukuki danışmanlık',
];

const commonAvoid = [
  'Mektupları açmadan bekletmeyin.',
  'Gerçekçi olmayan taksit sözü vermeyin.',
  'Telefon görüşmelerini kısa bir yazıyla doğrulayın. Böylece kanıt olur.',
  'Asıl belgeleri vermeyin, sadece kopya gönderin.',
];

const sharedToday = [
  'Tüm yazıları fotoğraflayın veya tarayın ve tarihe göre sıralayın.',
  'Bugün kısa bir yazılı mesaj gönderin ve yazılı onay isteyin.',
  'Gelir, hesap, kira ve açık tutarlara ait belgeleri hazırlayın.',
];

const sharedTomorrow = [
  'Uygun bir danışma yerinden randevu isteyin.',
  'Bürgergeld / temel geçim desteği, sosyal yardım, kira yardımı veya borç desteği mümkün mü kontrol edin.',
  'Gerçekçi bir ödeme planı veya süre uzatma talebi hazırlayın.',
];

const installmentParagraph = (answers: Answers) =>
  `Gerçekçi bir taksit planı rica ediyorum. Açık olan ${amountText(
    answers,
  )} tutarını aylık taksitlerle ödemek istiyorum. Gelir ve giderlerimi kontrol ettikten sonra kısa süre içinde somut bir teklif sunabilirim.`;

const extensionParagraph = (answers: Answers) =>
  `En az ${templateDeadlineText(
    answers,
  )} tarihine kadar süre uzatımı rica ediyorum. Belgelerimi düzenlemek, danışmanlık almak ve uygulanabilir bir çözüm önermek istiyorum.`;

const appointmentParagraph = (category: Category) =>
  `Kısa süre içinde bir danışma randevusu rica ediyorum. Konu: ${category.title}. Belgelerimi düzenlemek ve sonraki adımları konuşmak istiyorum.`;

const categoryOpening: Record<CategoryId, string> = {
  rent:
    'ödenmemiş kira nedeniyle yazıyorum. Evimi koruyacak bir çözüm bulmak istiyorum.',
  energy:
    'ödenmemiş enerji borçları ve yaklaşan ya da yapılmış bir kesinti nedeniyle yazıyorum.',
  jobcenter:
    'Jobcenter veya Sosyal Yardım Dairesi ile ilgili bir konu nedeniyle yazıyorum.',
  health:
    'sağlık sigortası prim borçları nedeniyle yazıyorum. Sigorta durumumu netleştirmek istiyorum.',
  garnishment:
    'hesap haczi veya P-Konto (haciz korumalı hesap) üzerinden koruma nedeniyle yazıyorum.',
  schufa:
    'maddi bir sıkışma ve olası Schufa / kredi geçmişi sorunu nedeniyle yazıyorum.',
};

const recipientByCategory: Record<CategoryId, string> = {
  rent: 'Ev sahibi / bina yönetimi',
  energy: 'Enerji sağlayıcısı',
  jobcenter: 'Jobcenter / Sosyal Yardım Dairesi',
  health: 'Sağlık sigortası',
  garnishment: 'Banka',
  schufa: 'Borç danışmanlığı',
};

export const tr = {
  languageName: 'Türkçe',
  disclaimer:
    'KlarKommen hukuki danışmanlığın yerine geçmez. Buradaki bilgiler durumunu toparlamana yardımcı olur. Süreler, fesihler, hacizler veya mahkeme yazıları varsa mümkün olduğunca hızlı profesyonel destek almalısın.',
  ui: {
    back: 'Geri',
    next: 'Devam',
    print: 'Yazdır',
    copied: 'Kopyalandı',
    copyText: 'Metni kopyala',
    reset: 'Yeni durumu kontrol et',
    languageLabel: 'Dil',
    heroEyebrow: 'Sakin kal. Bugün başla.',
    heroClaim:
      'Kira, elektrik, Jobcenter, sağlık sigortası, hesap veya Schufa fazla geldiğinde ilk yönlendirme.',
    important: 'Önemli:',
    helpPreviewEyebrow: 'Yalnız kalma',
    helpPreviewTitle: 'Ne zaman gerçek destek almalısın?',
    helpPreviewText:
      'Süreler, mahkeme yazıları, kesintiler veya hacizler söz konusuysa doğrudan destek önemlidir. KlarKommen hazırlık yapmana yardım eder, kişisel danışmanlığın yerine geçmez.',
    showAllHelp: 'Tüm uyarıları göster',
    categoryStep: 'Adım 1',
    categoryHeading: 'Hangi durum sana en yakın?',
    questionStep: 'Adım 2',
    questionHeading: 'Birkaç bilgiyi sıraya koyalım',
    progressLabel: (current: number, total: number) => `${current} / ${total}`,
    progressAria: (progress: number) => `İlerleme yüzde ${progress}`,
    showResults: 'Sonucu göster',
    resultStep: 'Adım 3 · Sonuç',
    resultHeading: 'Durumun toparlandı.',
    resultIntro:
      'Bu hukuki değerlendirme değildir. Bugün başlayabilmen için sakin bir çalışma listesidir.',
    copyAll: 'Tüm sonuçları kopyala',
    situationTitle: 'Durumun kısa özeti',
    todayTitle: 'Bugün yapman gerekenler',
    tomorrowTitle: 'Yarın yapman gerekenler',
    helpTitle: 'Bu yerler yardımcı olabilir',
    avoidTitle: 'Kaçınman gereken hatalar',
    templatesEyebrow: 'Şablonlar',
    templatesTitle: 'Uygun metinler',
    resultExportTitle: (categoryTitle: string) => `KlarKommen sonucu - ${categoryTitle}`,
    templatesExportTitle: 'Metin şablonları:',
    footerNavAria: 'Yasal bilgiler ve yardım',
    imprint: 'Künye',
    privacy: 'Gizlilik',
    realHelp: 'Ne zaman gerçek destek?',
    localDataNotice: 'Tüm bilgiler bu tarayıcıda kalır. Backend ve giriş yoktur.',
    backToStart: 'Başlangıca dön',
    legalEyebrow: 'Yasal bilgiler',
    imprintDetails: 'TMG § 5 uyarınca bilgiler',
    contact: 'İletişim',
    note: 'Not',
    privacyTitle: 'Gizlilik açıklaması',
    privacyLead:
      'Bu açıklama KlarKommen uygulamasının verilerle nasıl çalıştığını anlatır. Uygulama bilinçli olarak giriş, backend ve kişisel durum verileri için sunucu kaydı olmadan yapılmıştır.',
    realHelpEyebrow: 'Önemli',
    realHelpTitle: 'Ne zaman gerçek destek almalısın?',
    realHelpLead:
      'KlarKommen durumu toparlamaya ve hazırlanmaya yardımcı olur. Bazı durumlarda tek başına devam etmemek, doğrudan danışma merkezi, resmi kurum, avukat veya hukuki destekle iletişime geçmek gerekir.',
    realHelpSignalsTitle: 'Şu durumlarda hızlı destek ara...',
    urgentContactsTitle: 'Olası sonraki iletişim yerleri',
  },
  categories: [
    {
      id: 'rent',
      title: 'Kira borcu / fesih',
      shortTitle: 'Kira',
      description: 'Ödenmemiş kira, ihtar, fesih veya tahliye riskini sıraya koy.',
      primaryContact: 'Ev sahibi veya bina yönetimi',
    },
    {
      id: 'energy',
      title: 'Elektrik kesintisi / enerji borcu',
      shortTitle: 'Enerji',
      description: 'Yaklaşan veya yapılmış kesinti, aylık ödeme ve taksit planını düzenle.',
      primaryContact: 'Enerji sağlayıcısı',
    },
    {
      id: 'jobcenter',
      title: 'Bürgergeld / Jobcenter',
      shortTitle: 'Jobcenter',
      description: 'Başvuru, devam onayı, yaptırım, geri ödeme veya kararı anlamlandır.',
      primaryContact: 'Jobcenter veya Sosyal Yardım Dairesi',
    },
    {
      id: 'health',
      title: 'Sağlık sigortası / prim borcu',
      shortTitle: 'Sağlık sigortası',
      description: 'İhtarlar, prim borçları ve hizmetlerin durdurulması riskini düzenle.',
      primaryContact: 'Sağlık sigortası',
    },
    {
      id: 'garnishment',
      title: 'Haciz / P-Konto',
      shortTitle: 'P-Konto',
      description:
        'Hesap haczi, korunan tutar, P-Konto ve geçim için gerekli parayı sıraya koy.',
      primaryContact: 'Banka',
    },
    {
      id: 'schufa',
      title: 'Schufa / kredi reddi',
      shortTitle: 'Schufa',
      description: 'Ret, aciliyet, alternatifler ve danışma ihtiyacını değerlendir.',
      primaryContact: 'Borç danışmanlığı',
    },
  ] as Category[],
  commonQuestions: [
    {
      id: 'city',
      text: 'Hangi şehirde yaşıyorsun?',
      type: 'text',
      placeholder: 'örn. Leipzig',
      required: true,
    },
    {
      id: 'writtenDeadline',
      text: 'Yazılı bir süre var mı?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Evet' },
        { value: 'nein', label: 'Hayır' },
        { value: 'unklar', label: 'Belirsiz' },
      ],
      required: true,
    },
    {
      id: 'deadlineDate',
      text: 'Süre hangi tarihe kadar?',
      help: 'Tarih yoksa alanı boş bırak.',
      type: 'date',
    },
    {
      id: 'amount',
      text: 'Açık tutar ne kadar?',
      type: 'number',
      placeholder: 'Euro olarak tutar',
    },
    {
      id: 'income',
      text: 'Gelirin var mı?',
      type: 'select',
      options: [
        { value: 'regelmäßig', label: 'Evet, düzenli' },
        { value: 'unregelmäßig', label: 'Evet, düzensiz' },
        { value: 'nein', label: 'Hayır' },
      ],
    },
    {
      id: 'benefits',
      text: 'Bürgergeld / temel geçim desteği veya sosyal yardım alıyor musun?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Evet' },
        { value: 'nein', label: 'Hayır' },
        { value: 'beantragt', label: 'Başvuruldu' },
        { value: 'unklar', label: 'Belirsiz' },
      ],
    },
    {
      id: 'officialLetter',
      text: 'Resmi bir yazı var mı?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Evet' },
        { value: 'nein', label: 'Hayır' },
        { value: 'unklar', label: 'Belirsiz' },
      ],
    },
    {
      id: 'contacted',
      text: 'Daha önce iletişime geçtin mi?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Evet' },
        { value: 'nein', label: 'Hayır' },
        { value: 'versucht', label: 'Denedim, cevap yok' },
      ],
    },
  ] as Question[],
  categoryQuestions: {
    rent: [
      {
        id: 'rentTerminated',
        category: 'rent',
        text: 'Fesih bildirimi geldi mi?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'angedroht', label: 'Sadece tehdit edildi' },
        ],
      },
      {
        id: 'immediateTermination',
        category: 'rent',
        text: 'Konu süresiz / hemen fesih mi?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'evictionClaim',
        category: 'rent',
        text: 'Tahliye davası açıldı mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'openRentMonths',
        category: 'rent',
        text: 'Kaç aylık kira açık?',
        type: 'number',
        placeholder: 'örn. 2',
      },
      {
        id: 'landlordInstallments',
        category: 'rent',
        text: 'Ev sahibi taksit ödemesine açık mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Henüz net değil' },
        ],
      },
    ],
    energy: [
      {
        id: 'energyBlockStatus',
        category: 'energy',
        text: 'Kesinti duyuruldu mu, yoksa yapıldı mı?',
        type: 'select',
        options: [
          { value: 'angedroht', label: 'Duyuruldu' },
          { value: 'durchgeführt', label: 'Yapıldı' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'children',
        category: 'energy',
        text: 'Evde 18 yaşından küçük çocuk var mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
        ],
      },
      {
        id: 'healthReasons',
        category: 'energy',
        text: 'Kesintiye karşı önemli sağlık nedenleri var mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'energyInstallmentsOffered',
        category: 'energy',
        text: 'Taksit ödemesi teklif edildi mi?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'abgelehnt', label: 'Evet, ama reddedildi' },
        ],
      },
    ],
    jobcenter: [
      {
        id: 'jobcenterIssue',
        category: 'jobcenter',
        text: 'Konu nedir?',
        type: 'select',
        options: [
          { value: 'Erstantrag', label: 'İlk başvuru' },
          { value: 'Weiterbewilligung', label: 'Devam onayı' },
          { value: 'Sanktion', label: 'Yaptırım' },
          { value: 'Rückforderung', label: 'Geri ödeme talebi' },
        ],
      },
      {
        id: 'decisionAvailable',
        category: 'jobcenter',
        text: 'Bir karar yazısı var mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
        ],
      },
      {
        id: 'decisionDate',
        category: 'jobcenter',
        text: 'Karar ne zaman geldi?',
        type: 'date',
      },
      {
        id: 'objectionDeadline',
        category: 'jobcenter',
        text: 'İtiraz süresini biliyor musun?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'abgelaufen', label: 'Muhtemelen geçti' },
        ],
      },
    ],
    health: [
      {
        id: 'insuranceType',
        category: 'health',
        text: 'Yasal mı özel mi sigortalısın?',
        type: 'select',
        options: [
          { value: 'gesetzlich', label: 'Yasal' },
          { value: 'privat', label: 'Özel' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'healthWarnings',
        category: 'health',
        text: 'İhtar geldi mi?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'benefitsSuspendedThreat',
        category: 'health',
        text: 'Sağlık hizmetlerinin durdurulacağı söylendi mi?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'healthIncomeDetails',
        category: 'health',
        text: 'Şu an hangi gelirlerin var?',
        type: 'textarea',
        placeholder: 'örn. maaş, Bürgergeld, serbest çalışma, gelir yok',
      },
    ],
    garnishment: [
      {
        id: 'pAccount',
        category: 'garnishment',
        text: 'P-Konto (haciz korumalı hesap) var mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'beantragt', label: 'Başvuruldu' },
        ],
      },
      {
        id: 'accountGarnished',
        category: 'garnishment',
        text: 'Hesabına haciz geldi mi?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'angekündigt', label: 'Duyuruldu' },
        ],
      },
      {
        id: 'garnishmentOrder',
        category: 'garnishment',
        text: 'Haciz ve ödeme emri kararı var mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'moneyOnAccount',
        category: 'garnishment',
        text: 'Maaş, Bürgergeld veya emekli maaşı bu hesaba mı geliyor?',
        type: 'select',
        options: [
          { value: 'Gehalt', label: 'Maaş' },
          { value: 'Bürgergeld', label: 'Bürgergeld' },
          { value: 'Rente', label: 'Emekli maaşı' },
          { value: 'Mehreres', label: 'Birden fazla' },
          { value: 'nein', label: 'Hayır' },
        ],
      },
    ],
    schufa: [
      {
        id: 'moneyPurpose',
        category: 'schufa',
        text: 'Para ne için gerekli?',
        type: 'textarea',
        placeholder: 'örn. kira borcu, elektrik, araba, taşınma',
      },
      {
        id: 'urgency',
        category: 'schufa',
        text: 'Ne kadar acil?',
        type: 'select',
        options: [
          { value: 'heute', label: 'Bugün veya yarın' },
          { value: 'woche', label: 'Bu hafta' },
          { value: 'monat', label: 'Bu ay' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
      {
        id: 'regularIncome',
        category: 'schufa',
        text: 'Düzenli gelirin var mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unregelmäßig', label: 'Düzensiz' },
        ],
      },
      {
        id: 'creditRejected',
        category: 'schufa',
        text: 'Kredi Schufa nedeniyle reddedildi mi?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'vermutlich', label: 'Muhtemelen' },
        ],
      },
      {
        id: 'acuteDeadline',
        category: 'schufa',
        text: 'Acil bir süre var mı?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Evet' },
          { value: 'nein', label: 'Hayır' },
          { value: 'unklar', label: 'Belirsiz' },
        ],
      },
    ],
  } as Record<CategoryId, Question[]>,
  legal: {
    realHelpSignals: [
      'Tahliye davası, mahkeme tarihi veya mahkemeden yazı geldi.',
      'Elektrik, gaz veya su kesildi ya da kesinti çok yakın.',
      'Hesabına haciz geldi ve kira, yemek veya ilaç için paraya ulaşamıyorsun.',
      'İtiraz süresi devam eden bir karar aldın ve ne anlama geldiğinden emin değilsin.',
      'Sağlık sigortası, tedavi veya önemli ilaçlar acil risk altında.',
      'Kendini çok bunalmış, tehdit altında veya güvende hissetmiyorsun.',
    ],
    urgentContacts: [
      'Acil tehlikede: 112 acil çağrı veya 110 polis.',
      'Mahkeme yazılarında: hemen danışma merkezi, avukat veya hukuki destekle iletişime geç.',
      'Kira veya enerji borçlarında: şehirdeki Sosyal Yardım Dairesi, Jobcenter veya borç danışmanlığına sor.',
      'Hesap haczinde: P-Konto ve korunan tutarlar için banka ve borç danışmanlığıyla görüş.',
    ],
    privacySections: [
      {
        title: 'Kısa özet',
        text: 'KlarKommen bilgilerini yalnızca tarayıcında işler. Backend, giriş ve durum bilgilerin için veritabanı yoktur.',
      },
      {
        title: 'Sorumlu kişi',
        text: 'Alexander Kluth, Kaistraße 2, 40221 Düsseldorf, Almanya. E-posta: alex@denkwerk-kluth.de',
      },
      {
        title: 'Hangi veriler işlenir?',
        text: 'Uygulama durumuna dair kategori, süreler, tutarlar veya iletişim durumu gibi bilgiler sorar. Bu bilgiler sadece tarayıcıda yerel olarak öneriler ve metin şablonları oluşturmak için kullanılır.',
      },
      {
        title: 'Sunucuda kayıt yok',
        text: 'Girilen durum bilgileri KlarKommen sunucusuna gönderilmez ve sunucuda saklanmaz. Sayfa yenilenirse veya uygulama sıfırlanırsa girişler kaybolabilir.',
      },
      {
        title: 'Hosting ve teknik erişimler',
        text: 'Web sitesi Cloudflare üzerinden sunulur. Sayfa açıldığında IP adresi, erişim zamanı, tarayıcı bilgileri ve istenen dosyalar gibi teknik olarak gerekli erişim verileri işlenebilir.',
      },
      {
        title: 'İletişim',
        text: 'E-posta veya telefonla iletişime geçersen, ilettiğin bilgiler talebini yanıtlamak için kullanılır.',
      },
      {
        title: 'Hakların',
        text: 'Yasal kurallar çerçevesinde bilgi alma, düzeltme, silme, işlemeyi kısıtlama ve itiraz haklarını kullanabilirsin. Ayrıca veri koruma denetim kurumuna şikayet edebilirsin.',
      },
    ],
  },
  buildRecommendations(categoryId: CategoryId, answers: Answers): ResultContent {
    const city = answers.city;
    const amount = formatMoney(answers.amount);
    const deadline = deadlineText(answers);

    switch (categoryId) {
      case 'rent':
        return {
          situation: [
            `Kira borcu tutarı: ${amount}.`,
            `Süre bilgisi: ${deadline}.`,
            has(answers, 'rentTerminated', 'ja')
              ? 'Fesih bildirimi geldi. Bu zaman açısından kritiktir.'
              : 'Fesih henüz net değil veya sadece duyuruldu.',
            has(answers, 'evictionClaim', 'ja')
              ? 'Tahliye davası güçlü bir uyarı işaretidir. Hemen danışmanlık al.'
              : 'Tahliye davası belirtilmedi.',
          ],
          today: [
            ...sharedToday,
            'Ev sahibine veya bina yönetimine yazılı olarak taksit veya süre uzatma isteği gönderin.',
            'Jobcenter veya Sosyal Yardım Dairesine kira borcunun borç olarak üstlenilip üstlenilemeyeceğini sorun.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Kiracılar derneği, konut acil yardım birimi veya sosyal danışmanlıkla iletişime geçin.',
            'Dava varsa mahkeme yazısındaki süreleri hemen kontrol ettirin.',
          ],
          help: [
            ...commonHelp(city),
            'Kiracılar derneği',
            'Şehir veya belediyenin konut acil yardım birimi',
            'Kira borcu desteği için Jobcenter veya Sosyal Yardım Dairesi',
          ],
          avoid: [
            ...commonAvoid,
            'Sonuçlarını danışmadan evi boşaltmayın veya anahtarı teslim etmeyin.',
            'Yazılı onay olmadan sözlü anlaşmalara güvenmeyin.',
          ],
        };
      case 'energy':
        return {
          situation: [
            `Enerji borcu tutarı: ${amount}.`,
            `Süre bilgisi: ${deadline}.`,
            has(answers, 'energyBlockStatus', 'durchgeführt')
              ? 'Kesinti yapılmış. Şimdi hızlı şekilde yeniden açılması önemlidir.'
              : 'Kesinti duyuruldu veya belirsiz. Hızlı yazılı tepki önemlidir.',
            has(answers, 'children', 'ja') || has(answers, 'healthReasons', 'ja')
              ? 'Çocuklar veya sağlık nedenleri kesintiyi önlemek için önemli olabilir.'
              : 'Özel hane veya sağlık nedeni belirtilmedi.',
          ],
          today: [
            ...sharedToday,
            'Enerji sağlayıcısına yazılı olarak kesintinin durdurulmasını, taksit planını ve güncel borç dökümünü isteyin.',
            'Çocuklar veya tıbbi cihazlar etkileniyorsa bunu hemen yazın ve kanıt hazırlayın.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Jobcenter veya Sosyal Yardım Dairesine enerji borcu için destek sorun.',
            'Tüketici danışma merkezi veya enerji borcu danışmanlığıyla iletişime geçin.',
          ],
          help: [
            ...commonHelp(city),
            'Enerji sağlayıcısının kesinti hattı',
            'Jobcenter veya Sosyal Yardım Dairesi',
            'Tüketici danışma merkezi enerji danışmanlığı',
          ],
          avoid: [
            ...commonAvoid,
            'Sayaç veya bağlantılara kendiniz müdahale etmeyin.',
            'Hemen yeniden borç yaratacak kadar yüksek aylık ödemeyi kabul etmeyin.',
          ],
        };
      case 'jobcenter':
        return {
          situation: [
            `Konu: ${answers.jobcenterIssue || 'belirtilmedi'}.`,
            `Süre bilgisi: ${deadline}.`,
            has(answers, 'decisionAvailable', 'ja')
              ? 'Bir karar yazısı var. Tarih ve itiraz bilgisi önemlidir.'
              : 'Karar yazısı yok. Yazılı durum sorgusu mantıklı olabilir.',
            has(answers, 'objectionDeadline', 'abgelaufen')
              ? 'İtiraz süresi geçmiş olabilir. Yine de kontrol yolları olabilir.'
              : 'İtiraz süresi dikkatlice kontrol edilmeli.',
          ],
          today: [
            ...sharedToday,
            'Karar, başvuru veya ödeme talebini tarihe göre sıralayın.',
            'Jobcenter’a yazılı olarak durum, süre uzatma veya kontrol talebi gönderin.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Sosyal danışmanlık, işsiz danışmanlığı veya danışma yardımıyla hukuki destek seçeneklerini kontrol edin.',
            'Yaşamak için para yoksa Jobcenter’da acil başvuru veya avans konusunu sorun.',
          ],
          help: [
            ...commonHelp(city),
            'İşsiz danışmanlığı',
            'Çok acil durumlarda sosyal mahkemenin başvuru birimi',
            'Jobcenter giriş bölümü, yazılı teslim onayıyla',
          ],
          avoid: [
            ...commonAvoid,
            'Yazılı tepki vermeden süreleri kaçırmayın.',
            'Belgeleri kopyasız veya teslim onaysız vermeyin.',
          ],
        };
      case 'health':
        return {
          situation: [
            `Sigorta: ${answers.insuranceType || 'belirtilmedi'}.`,
            `Açık tutar: ${amount}.`,
            has(answers, 'benefitsSuspendedThreat', 'ja')
              ? 'Hizmetlerin durdurulacağı duyuruldu. Bu hızlı netleşmeli.'
              : 'Hizmetlerin durdurulması net belirtilmedi.',
            filled(answers, 'healthIncomeDetails')
              ? `Güncel gelirler: ${answers.healthIncomeDetails}.`
              : 'Güncel gelirler henüz açıklanmadı.',
          ],
          today: [
            ...sharedToday,
            'Sağlık sigortasına yazılı olarak borç dökümü ve taksit planı isteyin.',
            'Gelir düşükse kanıtları hazırlayın ve prim kontrolü isteyin.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Danışma merkezi veya bağımsız hasta danışmanlığıyla iletişime geçin.',
            'Acil tedavide borçlara rağmen hangi hizmetlerin korunduğunu netleştirin.',
          ],
          help: [
            ...commonHelp(city),
            'Sağlık sigortası prim bölümü',
            'Bağımsız hasta danışmanlığı',
            'Gelir yoksa Sosyal Yardım Dairesi veya Jobcenter',
          ],
          avoid: [
            ...commonAvoid,
            'Sağlık sigortasını kendiniz iptal etmeyin veya görmezden gelmeyin.',
            'Acil şikayetlerde borç korkusuyla doktor randevusunu ertelemeyin.',
          ],
        };
      case 'garnishment':
        return {
          situation: [
            has(answers, 'accountGarnished', 'ja')
              ? 'Hesap hacizli. Korunan paraya erişim hızlı güvenceye alınmalı.'
              : 'Hesap haczi net aktif değil veya sadece duyuruldu.',
            has(answers, 'pAccount', 'ja')
              ? 'P-Konto mevcut.'
              : 'P-Konto henüz güvenli şekilde kurulmuş görünmüyor.',
            `Hesaba gelen ödeme: ${answers.moneyOnAccount || 'belirtilmedi'}.`,
            `Süre bilgisi: ${deadline}.`,
          ],
          today: [
            ...sharedToday,
            'Bankadan yazılı olarak P-Konto’ya çevirme veya P-Konto onayı isteyin.',
            'Çocuklar veya sosyal yardımlar varsa daha yüksek korunan tutar için belge seçeneklerini kontrol edin.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Borç danışmanlığına P-Konto belgesi ve alacaklıyla iletişim konusunu sorun.',
            'Para bloke kalırsa icra mahkemesine koruma başvurusu seçeneklerini sorun.',
          ],
          help: [
            ...commonHelp(city),
            'Banka şubesi veya hesap servisi',
            'Tanınırlığı olan borç danışmanlığı',
            'İcra mahkemesi',
          ],
          avoid: [
            ...commonAvoid,
            'Birden fazla P-Konto açmayın.',
            'Koruma yoksa para girişlerini hacizli hesaba kontrolsüz bırakmayın.',
          ],
        };
      case 'schufa':
        return {
          situation: [
            has(answers, 'creditRejected', 'ja') || has(answers, 'creditRejected', 'vermutlich')
              ? 'Kredi muhtemelen kredi değerliliği veya Schufa nedeniyle reddedildi.'
              : 'Net bir Schufa reddi belirtilmedi.',
            `Aciliyet: ${answers.urgency || 'belirtilmedi'}.`,
            filled(answers, 'moneyPurpose')
              ? `Para ihtiyacı: ${answers.moneyPurpose}.`
              : 'Paranın amacı henüz açıklanmadı.',
            has(answers, 'acuteDeadline', 'ja')
              ? 'Acil bir süre var. Öncelik asıl sorunu doğrudan çözmek.'
              : 'Acil bir süre net belirtilmedi.',
          ],
          today: [
            ...sharedToday,
            'Asıl alacaklıdan veya sözleşme partnerinden süre uzatma ya da taksit isteyin.',
            'Alternatifler kontrol edilmeden pahalı hızlı kredi almayın.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Kredi kayıt kuruluşlarından ücretsiz veri kopyasını kontrol edin ve yanlış kayıtları itiraz edin.',
            'Yeni kredi yerine güvenli alternatifler için borç danışmanlığına sorun.',
          ],
          help: [
            ...commonHelp(city),
            'Borç danışmanlığı',
            'Tüketici danışma merkezi',
            'Sürenin olduğu doğrudan sözleşme partneri',
          ],
          avoid: [
            ...commonAvoid,
            'Sözde garantili krediler için ön ödeme yapmayın.',
            'Sadece eski süreleri kısa süre gizlemek için yeni borç almayın.',
          ],
        };
    }
  },
  buildAllTemplates(category: Category, answers: Answers) {
    const subject = `Açıklama ve destek talebi - ${category.shortTitle}`;
    const baseContext = `Yer: ${line(answers.city)}
Açık tutar: ${amountText(answers)}
Süre: ${templateDeadlineText(answers)}
Daha önce iletişim kuruldu: ${line(answers.contacted, 'belirtilmedi')}`;

    const mainTemplate = `${senderBlock(answers)}Kime:
${recipientByCategory[category.id]}

Konu: ${subject}

Sayın yetkili,

${categoryOpening[category.id]}

Benim bilgime göre açık tutar ${amountText(answers)}. ${
      answers.writtenDeadline === 'ja'
        ? `Elimde ${templateDeadlineText(answers)} tarihine kadar yazılı bir süre var.`
        : 'Şu anda net bir yazılı süre yok veya benim için belirsiz.'
    }

${installmentParagraph(answers)}

${extensionParagraph(answers)}

${closing}`;

    return [
      {
        label: 'Ana şablon',
        text: mainTemplate,
      },
      {
        label: 'Taksit talebi',
        text: `${senderBlock(answers)}Konu: Taksit talebi

Sayın yetkili,

${installmentParagraph(answers)}

Arka plan:
${baseContext}

${closing}`,
      },
      {
        label: 'Süre uzatma talebi',
        text: `${senderBlock(answers)}Konu: Süre uzatma talebi

Sayın yetkili,

${extensionParagraph(answers)}

Arka plan:
${baseContext}

${closing}`,
      },
      {
        label: 'Danışma randevusu talebi',
        text: `${senderBlock(answers)}Konu: Kısa süre içinde danışma randevusu talebi

Sayın yetkili,

${appointmentParagraph(category)}

Arka plan:
${baseContext}

${closing}`,
      },
    ];
  },
};
