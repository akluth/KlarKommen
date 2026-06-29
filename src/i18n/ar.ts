import type { Answers, Category, CategoryId, Question, ResultContent } from '../types';

const has = (answers: Answers, key: string, value: string) => answers[key] === value;
const filled = (answers: Answers, key: string) => Boolean(answers[key]?.trim());

const line = (value?: string, fallback = '[يرجى الإضافة]') => value?.trim() || fallback;

const formatMoney = (value?: string) => {
  if (!value) return 'لم يتم ذكر مبلغ';
  const number = Number(value);
  if (Number.isNaN(number)) return `${value} يورو`;
  return `${number.toLocaleString('ar-DE', { maximumFractionDigits: 2 })} يورو`;
};

const amountText = (answers: Answers) => {
  const value = answers.amount?.trim();
  return value ? `${value} يورو` : '[أضف المبلغ]';
};

const deadlineText = (answers: Answers) => {
  if (filled(answers, 'deadlineDate')) return `المهلة حتى ${answers.deadlineDate}`;
  if (has(answers, 'writtenDeadline', 'ja')) return 'توجد مهلة مكتوبة، يرجى التحقق من التاريخ';
  return 'لم يتم ذكر مهلة مكتوبة واضحة';
};

const templateDeadlineText = (answers: Answers) => {
  if (answers.deadlineDate) return answers.deadlineDate;
  if (answers.writtenDeadline === 'ja') return '[أضف تاريخ المهلة]';
  return '[أضف التاريخ إن وجد]';
};

const senderBlock = (answers: Answers) => `المرسل/المرسلة:
[الاسم]
[العنوان]
${answers.city ? answers.city : '[الرمز البريدي والمدينة]'}

`;

const closing = `أرجو تأكيد استلام هذه الرسالة خطيا.

مع التحية
[الاسم]`;

const commonHelp = (city?: string) => [
  `استشارة الديون${city ? ` في ${city}` : ''}`,
  `استشارة اجتماعية${city ? ` في ${city}` : ''}`,
  'مركز حماية المستهلك',
  'استشارة قانونية إذا كان هناك دعوى، قرار رسمي أو مهلة جارية',
];

const commonAvoid = [
  'لا تترك الرسائل دون فتح.',
  'لا توافق على أقساط لا يمكنك دفعها بشكل واقعي.',
  'أكد المكالمات الهاتفية برسالة قصيرة حتى يكون لديك إثبات.',
  'لا تسلم النسخ الأصلية من المستندات. أرسل نسخا فقط.',
];

const sharedToday = [
  'صوّر أو امسح كل الرسائل ورتبها حسب التاريخ.',
  'أرسل اليوم رسالة قصيرة مكتوبة واطلب تأكيد الاستلام.',
  'جهز مستندات الدخل، الحساب البنكي، الإيجار والمبالغ المفتوحة.',
];

const sharedTomorrow = [
  'اطلب موعدا من جهة استشارة مناسبة.',
  'تحقق هل يمكن الحصول على Bürgergeld / دعم المعيشة الأساسي، مساعدة اجتماعية، بدل سكن أو قرض مساعدة.',
  'حضّر طلبا واقعيا للتقسيط أو تمديد المهلة.',
];

const installmentParagraph = (answers: Answers) =>
  `أطلب خطة تقسيط واقعية. أقترح دفع المبلغ المفتوح وهو ${amountText(
    answers,
  )} على أقساط شهرية. يمكنني تقديم اقتراح محدد قريبا بعد مراجعة دخلي ومصاريفي.`;

const extensionParagraph = (answers: Answers) =>
  `أطلب تمديد المهلة على الأقل حتى ${templateDeadlineText(
    answers,
  )}، حتى أتمكن من ترتيب المستندات وطلب الاستشارة واقتراح حل قابل للتنفيذ.`;

const appointmentParagraph = (category: Category) =>
  `أطلب موعد استشارة قريب. الموضوع هو ${category.title}. أريد ترتيب مستنداتي ومناقشة الخطوات التالية.`;

const categoryOpening: Record<CategoryId, string> = {
  rent: 'أتواصل بسبب مدفوعات إيجار مفتوحة وأريد إيجاد حل حتى يبقى السكن آمنا.',
  energy: 'أتواصل بسبب تكاليف طاقة مفتوحة وقطع خدمة مهدد أو تم بالفعل.',
  jobcenter: 'أتواصل بسبب موضوع مع Jobcenter أو مكتب الشؤون الاجتماعية.',
  health: 'أتواصل بسبب ديون اشتراكات التأمين الصحي وأريد توضيح وضعي التأميني.',
  garnishment: 'أتواصل بسبب حجز على الحساب أو بسبب الحماية عبر P-Konto (حساب محمي من الحجز).',
  schufa: 'أتواصل بسبب ضائقة مالية ومشكلة محتملة مع Schufa / سجل الائتمان.',
  debtCourt:
    'ich melde mich wegen einer Inkasso-Forderung beziehungsweise eines gerichtlichen Mahnverfahrens.',
  family: 'أتواصل بسبب تغيير عائلي وأريد ترتيب الخطوات التالية بهدوء.',
};

const recipientByCategory: Record<CategoryId, string> = {
  rent: 'المؤجر / إدارة العقار',
  energy: 'شركة الطاقة',
  jobcenter: 'Jobcenter / مكتب الشؤون الاجتماعية',
  health: 'شركة التأمين الصحي',
  garnishment: 'البنك',
  schufa: 'استشارة الديون',
  debtCourt: 'Inkassounternehmen / Gläubiger / Mahngericht',
  family: 'استشارة اجتماعية / استشارة عائلية',
};

export const ar = {
  languageName: 'العربية',
  disclaimer:
    'KlarKommen لا يحل محل الاستشارة القانونية. هذه المعلومات تساعدك على ترتيب وضعك. إذا كانت هناك مهل، فسخ عقد، حجز أو رسائل من المحكمة، فمن الأفضل طلب مساعدة مهنية بأسرع وقت ممكن.',
  ui: {
    back: 'رجوع',
    next: 'متابعة',
    print: 'طباعة',
    copied: 'تم النسخ',
    copyText: 'نسخ النص',
    reset: 'فحص وضع جديد',
    languageLabel: 'اللغة',
    heroEyebrow: 'اهدأ قليلا. ابدأ اليوم.',
    heroClaim:
      'توجيه أولي عندما تصبح مواضيع الإيجار، الكهرباء، Jobcenter، التأمين الصحي، الحساب البنكي أو Schufa كثيرة ومربكة.',
    important: 'مهم:',
    helpPreviewEyebrow: 'لا تبق وحدك',
    helpPreviewTitle: 'متى يجب طلب مساعدة حقيقية؟',
    helpPreviewText:
      'عندما تكون هناك مهل، رسائل من المحكمة، قطع خدمات أو حجز، فالدعم المباشر مهم. KlarKommen يساعدك على التحضير، لكنه لا يحل محل الاستشارة الشخصية.',
    showAllHelp: 'عرض كل التنبيهات',
    categoryStep: 'الخطوة 1',
    categoryHeading: 'أي وضع يناسب حالتك أكثر؟',
    questionStep: 'الخطوة 2',
    questionHeading: 'لنرتب بعض المعلومات',
    progressLabel: (current: number, total: number) => `${current} / ${total}`,
    progressAria: (progress: number) => `التقدم ${progress} بالمئة`,
    showResults: 'عرض النتيجة',
    resultStep: 'الخطوة 3 · النتيجة',
    resultHeading: 'تم ترتيب وضعك.',
    resultIntro:
      'هذا ليس تقييما قانونيا. إنها قائمة عمل هادئة حتى يمكنك البدء اليوم.',
    copyAll: 'نسخ كل النتائج',
    situationTitle: 'ملخص قصير للوضع',
    todayTitle: 'ما يجب فعله اليوم',
    tomorrowTitle: 'ما يجب فعله غدا',
    helpTitle: 'هذه الجهات قد تساعد',
    avoidTitle: 'أخطاء يجب تجنبها',
    templatesEyebrow: 'نماذج',
    templatesTitle: 'نصوص مناسبة',
    resultExportTitle: (categoryTitle: string) => `نتيجة KlarKommen - ${categoryTitle}`,
    templatesExportTitle: 'نماذج نصية:',
    footerNavAria: 'معلومات قانونية ومساعدة',
    imprint: 'بيانات الموقع',
    privacy: 'حماية البيانات',
    realHelp: 'متى تطلب مساعدة حقيقية؟',
    localDataNotice: 'كل البيانات تبقى في هذا المتصفح. لا يوجد Backend ولا تسجيل دخول.',
    backToStart: 'العودة إلى البداية',
    legalEyebrow: 'معلومات قانونية',
    imprintDetails: 'بيانات وفقا للمادة 5 TMG',
    contact: 'التواصل',
    note: 'تنبيه',
    privacyTitle: 'بيان حماية البيانات',
    privacyLead:
      'يوضح هذا البيان كيف يتعامل KlarKommen مع البيانات. التطبيق مصمم بدون تسجيل دخول، بدون Backend وبدون تخزين بيانات شخصية عن الوضع على الخادم.',
    realHelpEyebrow: 'مهم',
    realHelpTitle: 'متى يجب طلب مساعدة حقيقية؟',
    realHelpLead:
      'يمكن لـ KlarKommen أن يساعد في الترتيب والتحضير. في بعض الحالات لا ينبغي المتابعة وحدك، بل التواصل مباشرة مع مركز استشارة، جهة رسمية، محامية أو محام.',
    realHelpSignalsTitle: 'اطلب دعما سريعا إذا...',
    urgentContactsTitle: 'جهات تواصل محتملة بعد ذلك',
  },
  categories: [
    {
      id: 'rent',
      title: 'ديون الإيجار / فسخ العقد',
      shortTitle: 'الإيجار',
      description: 'ترتيب الإيجار المفتوح، الإنذار، الفسخ أو خطر الإخلاء.',
      primaryContact: 'المؤجر أو إدارة العقار',
    },
    {
      id: 'energy',
      title: 'قطع الكهرباء / ديون الطاقة',
      shortTitle: 'الطاقة',
      description: 'تنظيم القطع المهدد أو الحاصل، الدفعات الشهرية وخطة التقسيط.',
      primaryContact: 'شركة الطاقة',
    },
    {
      id: 'jobcenter',
      title: 'Bürgergeld / Jobcenter',
      shortTitle: 'Jobcenter',
      description: 'فهم الطلب، التجديد، العقوبة، طلب الاسترداد أو القرار الرسمي.',
      primaryContact: 'Jobcenter أو مكتب الشؤون الاجتماعية',
    },
    {
      id: 'health',
      title: 'التأمين الصحي / ديون الاشتراكات',
      shortTitle: 'التأمين الصحي',
      description: 'ترتيب الإنذارات، ديون الاشتراكات واحتمال تعليق بعض الخدمات.',
      primaryContact: 'شركة التأمين الصحي',
    },
    {
      id: 'garnishment',
      title: 'الحجز / P-Konto',
      shortTitle: 'P-Konto',
      description: 'ترتيب حجز الحساب، المبلغ المحمي، P-Konto والمدفوعات الضرورية للمعيشة.',
      primaryContact: 'البنك',
    },
    {
      id: 'schufa',
      title: 'Schufa / رفض القرض',
      shortTitle: 'Schufa',
      description: 'تقييم الرفض، الاستعجال، البدائل والحاجة إلى استشارة.',
      primaryContact: 'استشارة الديون',
    },
    {
      id: 'debtCourt',
      title: 'Inkasso / Mahnbescheid',
      shortTitle: 'Inkasso',
      description:
        'Inkassoschreiben, Forderung, gerichtlichen Mahnbescheid oder Vollstreckungsbescheid sortieren.',
      primaryContact: 'Inkassounternehmen, Gläubiger oder Mahngericht',
    },
    {
      id: 'family',
      title: 'العائلة / تغيير في الحياة',
      shortTitle: 'العائلة',
      description: 'ترتيب الوفاة، الولادة، الانفصال، الطلاق أو الأبوة والأمومة بهدوء.',
      primaryContact: 'استشارة اجتماعية أو عائلية',
    },
  ] as Category[],
  commonQuestions: [
    {
      id: 'city',
      text: 'في أي مدينة تسكن؟',
      type: 'text',
      placeholder: 'مثلا Leipzig',
      required: true,
    },
    {
      id: 'writtenDeadline',
      text: 'هل توجد مهلة مكتوبة؟',
      type: 'select',
      options: [
        { value: 'ja', label: 'نعم' },
        { value: 'nein', label: 'لا' },
        { value: 'unklar', label: 'غير واضح' },
      ],
      required: true,
    },
    {
      id: 'deadlineDate',
      text: 'حتى متى تستمر المهلة؟',
      help: 'إذا لم يكن لديك تاريخ، اترك الحقل فارغا.',
      type: 'date',
    },
    {
      id: 'amount',
      text: 'كم يبلغ المبلغ المفتوح؟',
      type: 'number',
      placeholder: 'المبلغ باليورو',
    },
    {
      id: 'income',
      text: 'هل لديك دخل؟',
      type: 'select',
      options: [
        { value: 'regelmäßig', label: 'نعم، منتظم' },
        { value: 'unregelmäßig', label: 'نعم، غير منتظم' },
        { value: 'nein', label: 'لا' },
      ],
    },
    {
      id: 'benefits',
      text: 'هل تحصل على Bürgergeld / دعم المعيشة الأساسي أو مساعدة اجتماعية؟',
      type: 'select',
      options: [
        { value: 'ja', label: 'نعم' },
        { value: 'nein', label: 'لا' },
        { value: 'beantragt', label: 'تم التقديم' },
        { value: 'unklar', label: 'غير واضح' },
      ],
    },
    {
      id: 'officialLetter',
      text: 'هل توجد رسالة رسمية؟',
      type: 'select',
      options: [
        { value: 'ja', label: 'نعم' },
        { value: 'nein', label: 'لا' },
        { value: 'unklar', label: 'غير واضح' },
      ],
    },
    {
      id: 'contacted',
      text: 'هل تواصلت بالفعل؟',
      type: 'select',
      options: [
        { value: 'ja', label: 'نعم' },
        { value: 'nein', label: 'لا' },
        { value: 'versucht', label: 'حاولت، لكن لا يوجد رد' },
      ],
    },
  ] as Question[],
  categoryQuestions: {
    rent: [
      {
        id: 'rentTerminated',
        category: 'rent',
        text: 'هل تم فسخ عقد الإيجار بالفعل؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'angedroht', label: 'تم التهديد فقط' },
        ],
      },
      {
        id: 'immediateTermination',
        category: 'rent',
        text: 'هل الموضوع فسخ فوري بدون مهلة؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'evictionClaim',
        category: 'rent',
        text: 'هل توجد دعوى إخلاء بالفعل؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'openRentMonths',
        category: 'rent',
        text: 'كم شهر إيجار مفتوح؟',
        type: 'number',
        placeholder: 'مثلا 2',
      },
      {
        id: 'landlordInstallments',
        category: 'rent',
        text: 'هل المؤجر مستعد للتقسيط؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'لم يتضح بعد' },
        ],
      },
    ],
    energy: [
      {
        id: 'energyBlockStatus',
        category: 'energy',
        text: 'هل تم التهديد بالقطع أم تم القطع بالفعل؟',
        type: 'select',
        options: [
          { value: 'angedroht', label: 'تم التهديد' },
          { value: 'durchgeführt', label: 'تم القطع بالفعل' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'children',
        category: 'energy',
        text: 'هل يعيش أطفال قاصرون في المنزل؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
        ],
      },
      {
        id: 'healthReasons',
        category: 'energy',
        text: 'هل توجد أسباب صحية ضد القطع؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'energyInstallmentsOffered',
        category: 'energy',
        text: 'هل عُرضت خطة تقسيط بالفعل؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'abgelehnt', label: 'نعم، لكنها رُفضت' },
        ],
      },
    ],
    jobcenter: [
      {
        id: 'jobcenterIssue',
        category: 'jobcenter',
        text: 'ما الموضوع؟',
        type: 'select',
        options: [
          { value: 'Erstantrag', label: 'طلب أول' },
          { value: 'Weiterbewilligung', label: 'تمديد الموافقة' },
          { value: 'Sanktion', label: 'عقوبة / تخفيض' },
          { value: 'Rückforderung', label: 'طلب استرداد' },
        ],
      },
      {
        id: 'decisionAvailable',
        category: 'jobcenter',
        text: 'هل يوجد قرار رسمي؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
        ],
      },
      {
        id: 'decisionDate',
        category: 'jobcenter',
        text: 'متى وصل القرار؟',
        type: 'date',
      },
      {
        id: 'objectionDeadline',
        category: 'jobcenter',
        text: 'هل تعرف مهلة الاعتراض؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'abgelaufen', label: 'ربما انتهت' },
        ],
      },
    ],
    health: [
      {
        id: 'insuranceType',
        category: 'health',
        text: 'هل أنت مؤمن قانونيا أم خاصا؟',
        type: 'select',
        options: [
          { value: 'gesetzlich', label: 'قانوني' },
          { value: 'privat', label: 'خاص' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'healthWarnings',
        category: 'health',
        text: 'هل وصلت إنذارات؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'benefitsSuspendedThreat',
        category: 'health',
        text: 'هل تم التهديد بتعليق الخدمات؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'healthIncomeDetails',
        category: 'health',
        text: 'ما الدخل الذي لديك حاليا؟',
        type: 'textarea',
        placeholder: 'مثلا راتب، Bürgergeld، عمل حر، لا يوجد دخل',
      },
    ],
    garnishment: [
      {
        id: 'pAccount',
        category: 'garnishment',
        text: 'هل لديك P-Konto (حساب محمي من الحجز)؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'beantragt', label: 'تم التقديم' },
        ],
      },
      {
        id: 'accountGarnished',
        category: 'garnishment',
        text: 'هل حسابك محجوز؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'angekündigt', label: 'تم الإعلان عنه' },
        ],
      },
      {
        id: 'garnishmentOrder',
        category: 'garnishment',
        text: 'هل يوجد قرار حجز وتحويل؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'moneyOnAccount',
        category: 'garnishment',
        text: 'هل يدخل الراتب، Bürgergeld أو التقاعد إلى هذا الحساب؟',
        type: 'select',
        options: [
          { value: 'Gehalt', label: 'راتب' },
          { value: 'Bürgergeld', label: 'Bürgergeld' },
          { value: 'Rente', label: 'تقاعد' },
          { value: 'Mehreres', label: 'أكثر من شيء' },
          { value: 'nein', label: 'لا' },
        ],
      },
    ],
    schufa: [
      {
        id: 'moneyPurpose',
        category: 'schufa',
        text: 'لماذا تحتاج المال؟',
        type: 'textarea',
        placeholder: 'مثلا دين إيجار، كهرباء، سيارة، انتقال سكن',
      },
      {
        id: 'urgency',
        category: 'schufa',
        text: 'ما مدى الاستعجال؟',
        type: 'select',
        options: [
          { value: 'heute', label: 'اليوم أو غدا' },
          { value: 'woche', label: 'هذا الأسبوع' },
          { value: 'monat', label: 'هذا الشهر' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'regularIncome',
        category: 'schufa',
        text: 'هل لديك دخل منتظم؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unregelmäßig', label: 'غير منتظم' },
        ],
      },
      {
        id: 'creditRejected',
        category: 'schufa',
        text: 'هل رُفض قرض بسبب Schufa؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'vermutlich', label: 'على الأغلب' },
        ],
      },
      {
        id: 'acuteDeadline',
        category: 'schufa',
        text: 'هل توجد مهلة عاجلة؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
    ],
    debtCourt: [
      {
        id: 'debtLetterType',
        category: 'debtCourt',
        text: 'Was liegt dir vor?',
        type: 'select',
        options: [
          { value: 'inkasso', label: 'Inkassoschreiben' },
          { value: 'mahnbrief', label: 'Mahnung vom Gläubiger' },
          { value: 'mahnbescheid', label: 'Gerichtlicher Mahnbescheid' },
          { value: 'vollstreckungsbescheid', label: 'Vollstreckungsbescheid' },
          { value: 'unklar', label: 'Unklar' },
        ],
      },
      {
        id: 'claimKnown',
        category: 'debtCourt',
        text: 'Kennst du die Forderung?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Ja' },
          { value: 'teilweise', label: 'Teilweise' },
          { value: 'nein', label: 'Nein' },
          { value: 'unklar', label: 'Unklar' },
        ],
      },
      {
        id: 'claimDisputed',
        category: 'debtCourt',
        text: 'Hältst du die Forderung für falsch oder zu hoch?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Ja' },
          { value: 'nein', label: 'Nein' },
          { value: 'teilweise', label: 'Teilweise' },
          { value: 'unklar', label: 'Unklar' },
        ],
      },
      {
        id: 'courtYellowEnvelope',
        category: 'debtCourt',
        text: 'Kam ein gelber Umschlag vom Gericht?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Ja' },
          { value: 'nein', label: 'Nein' },
          { value: 'unklar', label: 'Unklar' },
        ],
      },
    ],
    family: [
      {
        id: 'familyEvent',
        category: 'family',
        text: 'ما الموضوع الآن؟',
        type: 'select',
        options: [
          { value: 'tod', label: 'وفاة / حزن' },
          { value: 'geburt', label: 'ولادة / حمل' },
          { value: 'trennung', label: 'انفصال' },
          { value: 'scheidung', label: 'طلاق' },
          { value: 'elternschaft', label: 'أبوة وأمومة / رعاية' },
          { value: 'mehreres', label: 'عدة أمور في الوقت نفسه' },
        ],
      },
      {
        id: 'childrenAffected',
        category: 'family',
        text: 'هل الأطفال متأثرون بشكل مباشر؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'livingSituationChanged',
        category: 'family',
        text: 'هل تغير وضع السكن أو قد يتغير قريبا؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'bald', label: 'ربما قريبا' },
        ],
      },
      {
        id: 'documentsNeeded',
        category: 'family',
        text: 'هل توجد وثائق يجب استخراجها أو تغييرها؟',
        help: 'مثلا شهادة ميلاد، شهادة وفاة، حضانة، نفقة، عقد إيجار أو تأمين.',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'nein', label: 'لا' },
          { value: 'unklar', label: 'غير واضح' },
        ],
      },
      {
        id: 'supportNetwork',
        category: 'family',
        text: 'هل لديك دعم موثوق الآن؟',
        type: 'select',
        options: [
          { value: 'ja', label: 'نعم' },
          { value: 'teilweise', label: 'جزئيا' },
          { value: 'nein', label: 'لا' },
        ],
      },
      {
        id: 'familyNotes',
        category: 'family',
        text: 'ما الذي يجب أخذه بالحسبان بالتأكيد؟',
        type: 'textarea',
        placeholder: 'مثلا مواعيد، رعاية أطفال، ميراث، نفقة، سكن، حضانة أو تواصل مع الأطفال',
      },
    ],
  } as Record<CategoryId, Question[]>,
  legal: {
    realHelpSignals: [
      'وصلتك دعوى إخلاء، موعد محكمة أو رسالة من المحكمة.',
      'الكهرباء، الغاز أو الماء مقطوع بالفعل أو القطع قريب جدا.',
      'حسابك محجوز ولا تستطيع الوصول إلى المال للإيجار، الطعام أو الدواء.',
      'وصل قرار مع مهلة اعتراض جارية ولا تعرف ماذا يعني.',
      'التأمين الصحي، العلاج أو أدوية مهمة في خطر عاجل.',
      'تشعر بأن الوضع يفوق قدرتك، أو أنك مهدد أو غير آمن.',
    ],
    urgentContacts: [
      'في خطر عاجل: اتصل بالإسعاف 112 أو الشرطة 110.',
      'عند رسائل المحكمة: تواصل فورا مع مركز استشارة، محامية أو محام.',
      'عند ديون الإيجار أو الطاقة: اسأل مكتب الشؤون الاجتماعية، Jobcenter أو استشارة الديون في مدينتك.',
      'عند حجز الحساب: تواصل مع البنك واستشارة الديون بسبب P-Konto والمبالغ المحمية.',
    ],
    privacySections: [
      {
        title: 'ملخص قصير',
        text: 'يعالج KlarKommen إدخالاتك محليا فقط في متصفحك. لا يوجد Backend، لا تسجيل دخول ولا قاعدة بيانات لمعلوماتك.',
      },
      {
        title: 'المسؤول',
        text: 'Alexander Kluth, Kaistraße 2, 40221 Düsseldorf, Deutschland. البريد الإلكتروني: alex@denkwerk-kluth.de',
      },
      {
        title: 'ما البيانات التي تتم معالجتها؟',
        text: 'يسأل التطبيق عن معلومات تخص وضعك، مثل الفئة، المهل، المبالغ أو حالة التواصل. تستخدم هذه المعلومات فقط لإنشاء إرشادات ونماذج نصية محليا في المتصفح.',
      },
      {
        title: 'لا تخزين على الخادم',
        text: 'لا تُرسل بيانات الوضع المدخلة إلى خادم KlarKommen ولا يتم تخزينها على الخادم. عند إعادة تحميل الصفحة أو إعادة ضبط التطبيق قد تضيع الإدخالات.',
      },
      {
        title: 'الاستضافة والوصول التقني',
        text: 'يتم توفير الموقع عبر Cloudflare. عند فتح الصفحة قد تتم معالجة بيانات وصول تقنية ضرورية مثل عنوان IP، وقت الوصول، معلومات المتصفح والملفات المطلوبة حتى يتم عرض الموقع وحمايته.',
      },
      {
        title: 'التواصل',
        text: 'إذا تواصلت عبر البريد الإلكتروني أو الهاتف، تُستخدم البيانات التي ترسلها لمعالجة الطلب.',
      },
      {
        title: 'حقوقك',
        text: 'ضمن القواعد القانونية يمكنك طلب المعلومات، التصحيح، الحذف، تقييد المعالجة والاعتراض. كما يمكنك تقديم شكوى إلى جهة رقابة حماية البيانات.',
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
            `الموضوع هو ديون إيجار بقيمة ${amount}.`,
            `بخصوص المهلة: ${deadline}.`,
            has(answers, 'rentTerminated', 'ja')
              ? 'تم فسخ العقد بالفعل. هذا أمر حساس من ناحية الوقت.'
              : 'لم يتم فسخ العقد بشكل واضح بعد أو تم التهديد فقط.',
            has(answers, 'evictionClaim', 'ja')
              ? 'دعوى الإخلاء إشارة تحذير قوية. اطلب استشارة فورا.'
              : 'لم يتم ذكر دعوى إخلاء.',
          ],
          today: [
            ...sharedToday,
            'اطلب من المؤجر أو إدارة العقار كتابة تقسيط أو تمديد مهلة.',
            'اسأل Jobcenter أو مكتب الشؤون الاجتماعية عن إمكانية تحمل ديون الإيجار كقرض.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'تواصل مع جمعية المستأجرين، مساعدة الطوارئ السكنية أو استشارة اجتماعية.',
            'إذا كانت هناك دعوى: افحص مهل رسالة المحكمة فورا.',
          ],
          help: [
            ...commonHelp(city),
            'جمعية المستأجرين',
            'مساعدة الطوارئ السكنية في المدينة أو البلدية',
            'Jobcenter أو مكتب الشؤون الاجتماعية بسبب احتمال تحمل ديون الإيجار',
          ],
          avoid: [
            ...commonAvoid,
            'لا تترك السكن أو تسلم المفاتيح دون استشارة حول العواقب.',
            'لا تعتمد على اتفاقات شفهية دون تأكيد مكتوب.',
          ],
        };
      case 'energy':
        return {
          situation: [
            `الموضوع هو ديون طاقة بقيمة ${amount}.`,
            `بخصوص المهلة: ${deadline}.`,
            has(answers, 'energyBlockStatus', 'durchgeführt')
              ? 'تم القطع بالفعل. الآن المهم هو إعادة الخدمة بسرعة.'
              : 'القطع مهدد أو غير واضح. الرد المكتوب السريع مهم الآن.',
            has(answers, 'children', 'ja') || has(answers, 'healthReasons', 'ja')
              ? 'وجود أطفال أو أسباب صحية قد يكون مهما لمنع القطع.'
              : 'لم يتم ذكر أسباب خاصة بالمنزل أو الصحة.',
          ],
          today: [
            ...sharedToday,
            'اطلب من شركة الطاقة كتابة تعليق القطع، تقسيطا وكشفا حديثا بالمطالبة.',
            'إذا كان الأطفال أو أجهزة طبية متأثرة: اذكر ذلك فورا وجهز الإثباتات.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'اسأل Jobcenter أو مكتب الشؤون الاجتماعية عن قرض لديون الطاقة.',
            'تواصل مع مركز حماية المستهلك أو استشارة ديون الطاقة.',
          ],
          help: [
            ...commonHelp(city),
            'خط الطوارئ الخاص بالقطع لدى شركة الطاقة',
            'Jobcenter أو مكتب الشؤون الاجتماعية',
            'استشارة الطاقة في مركز حماية المستهلك',
          ],
          avoid: [
            ...commonAvoid,
            'لا تعبث بالعدادات أو التوصيلات بنفسك.',
            'لا تقبل دفعة شهرية جديدة عالية لدرجة أنها تؤدي مباشرة إلى ديون جديدة.',
          ],
        };
      case 'jobcenter':
        return {
          situation: [
            `الموضوع: ${answers.jobcenterIssue || 'غير مذكور'}.`,
            `بخصوص المهلة: ${deadline}.`,
            has(answers, 'decisionAvailable', 'ja')
              ? 'يوجد قرار رسمي. التاريخ وتعليمات الاعتراض مهمان.'
              : 'لا يوجد قرار رسمي. لذلك قد يكون السؤال الكتابي عن الحالة مفيدا.',
            has(answers, 'objectionDeadline', 'abgelaufen')
              ? 'قد تكون مهلة الاعتراض انتهت. مع ذلك قد توجد طرق مراجعة ممكنة.'
              : 'يجب فحص مهلة الاعتراض بدقة.',
          ],
          today: [
            ...sharedToday,
            'رتب القرار، الطلب أو المطالبة حسب التاريخ.',
            'اطلب من Jobcenter كتابة توضيح الحالة، تمديد المهلة أو مراجعة القرار.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'افحص استشارة اجتماعية، استشارة للعاطلين أو استشارة قانونية عبر Beratungshilfeschein.',
            'إذا كان المال للمعيشة غير كاف: تحدث مع Jobcenter عن طلب عاجل أو سلفة.',
          ],
          help: [
            ...commonHelp(city),
            'استشارة للعاطلين عن العمل',
            'مكتب الطلبات القانونية في المحكمة الاجتماعية في الحالات العاجلة جدا',
            'منطقة استقبال Jobcenter مع تأكيد استلام مكتوب',
          ],
          avoid: [
            ...commonAvoid,
            'لا تدع المهل تمر دون رد مكتوب.',
            'لا تسلم مستندات دون نسخة أو تأكيد استلام.',
          ],
        };
      case 'health':
        return {
          situation: [
            `التأمين: ${answers.insuranceType || 'غير مذكور'}.`,
            `المبلغ المفتوح: ${amount}.`,
            has(answers, 'benefitsSuspendedThreat', 'ja')
              ? 'تم التهديد بتعليق الخدمات. يجب توضيح ذلك بسرعة.'
              : 'لم يتم ذكر تعليق الخدمات بشكل واضح.',
            filled(answers, 'healthIncomeDetails')
              ? `الدخل الحالي: ${answers.healthIncomeDetails}.`
              : 'لم يتم وصف الدخل الحالي بعد.',
          ],
          today: [
            ...sharedToday,
            'اطلب من شركة التأمين الصحي كتابة كشف المطالبة وخطة تقسيط.',
            'إذا كان الدخل منخفضا، اجمع الإثباتات واطلب مراجعة الاشتراكات.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'تواصل مع مركز استشارة أو استشارة مستقلة للمرضى.',
            'في العلاج العاجل، وضح أي خدمات تبقى مضمونة رغم الديون.',
          ],
          help: [
            ...commonHelp(city),
            'قسم الاشتراكات في شركة التأمين الصحي',
            'استشارة مستقلة للمرضى',
            'مكتب الشؤون الاجتماعية أو Jobcenter عند عدم وجود دخل',
          ],
          avoid: [
            ...commonAvoid,
            'لا تلغ التأمين الصحي ببساطة ولا تتجاهله.',
            'لا تؤجل مواعيد الطبيب عند أعراض عاجلة بسبب الخوف من الديون.',
          ],
        };
      case 'garnishment':
        return {
          situation: [
            has(answers, 'accountGarnished', 'ja')
              ? 'الحساب محجوز. يجب تأمين الوصول إلى المال المحمي بسرعة.'
              : 'حجز الحساب غير واضح النشاط أو تم الإعلان عنه فقط.',
            has(answers, 'pAccount', 'ja')
              ? 'يوجد P-Konto.'
              : 'لم يتم تأكيد وجود P-Konto بشكل آمن بعد.',
            `ما يدخل إلى الحساب: ${answers.moneyOnAccount || 'غير مذكور'}.`,
            `بخصوص المهلة: ${deadline}.`,
          ],
          today: [
            ...sharedToday,
            'اطلب من البنك كتابة تحويل الحساب إلى P-Konto أو تأكيد أنه P-Konto.',
            'افحص شهادات رفع المبلغ المحمي، خصوصا عند وجود أطفال أو مساعدات اجتماعية.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'اسأل استشارة الديون عن شهادة P-Konto والتواصل مع الدائن.',
            'اسأل محكمة التنفيذ عن طلبات حماية إذا بقي المال محجوزا.',
          ],
          help: [
            ...commonHelp(city),
            'فرع البنك أو خدمة الحسابات',
            'استشارة ديون معترف بها',
            'محكمة التنفيذ',
          ],
          avoid: [
            ...commonAvoid,
            'لا تفتح أكثر من P-Konto واحد.',
            'لا تترك الأموال تدخل إلى حساب محجوز دون حماية واضحة.',
          ],
        };
      case 'schufa':
        return {
          situation: [
            has(answers, 'creditRejected', 'ja') || has(answers, 'creditRejected', 'vermutlich')
              ? 'من المحتمل أن القرض رُفض بسبب الجدارة الائتمانية أو Schufa.'
              : 'لم يتم ذكر رفض واضح بسبب Schufa.',
            `الاستعجال: ${answers.urgency || 'غير مذكور'}.`,
            filled(answers, 'moneyPurpose')
              ? `سبب الحاجة للمال: ${answers.moneyPurpose}.`
              : 'لم يتم وصف سبب الحاجة للمال بعد.',
            has(answers, 'acuteDeadline', 'ja')
              ? 'توجد مهلة عاجلة. الأولوية هي حل المشكلة الأصلية مباشرة.'
              : 'لم يتم ذكر مهلة عاجلة بشكل واضح.',
          ],
          today: [
            ...sharedToday,
            'اطلب من الدائن أو طرف العقد الأساسي تمديد المهلة أو تقسيطا.',
            'لا توقع قروضا فورية مكلفة قبل فحص البدائل.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'افحص نسخة البيانات المجانية لدى مكاتب المعلومات الائتمانية واعترض على الإدخالات الخاطئة.',
            'اسأل استشارة الديون عن بدائل آمنة بدلا من قروض جديدة.',
          ],
          help: [
            ...commonHelp(city),
            'استشارة الديون',
            'مركز حماية المستهلك',
            'طرف العقد المباشر الذي تجري لديه المهلة',
          ],
          avoid: [
            ...commonAvoid,
            'لا تدفع رسوما مسبقة لقروض يقال إنها مضمونة.',
            'لا تأخذ ديونا جديدة إذا كانت فقط تخفي المهل القديمة لفترة قصيرة.',
          ],
        };
      case 'debtCourt':
        return {
          situation: [
            `نوع الخطاب: ${answers.debtLetterType || 'غير مذكور'}.`,
            `المبلغ المفتوح: ${amount}.`,
            `بخصوص المهلة: ${deadline}.`,
            has(answers, 'debtLetterType', 'mahnbescheid') ||
            has(answers, 'debtLetterType', 'vollstreckungsbescheid') ||
            has(answers, 'courtYellowEnvelope', 'ja')
              ? 'البريد من المحكمة أو إجراء أمر الدفع القضائي إشارة تحذير قوية.'
              : 'لم يتم ذكر بريد واضح من المحكمة.',
          ],
          today: [
            ...sharedToday,
            'تحقق هل الخطاب من المحكمة أو شركة تحصيل أو من الدائن.',
            'إذا كان البريد من المحكمة، دوّن تاريخ التبليغ واطلب استشارة فورا.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'تواصل مع استشارة الديون أو مركز حماية المستهلك.',
            'اطلب كشف المطالبة، والتوكيل، والأدلة كتابة.',
          ],
          help: [...commonHelp(city), 'مركز حماية المستهلك', 'محكمة أمر الدفع أو المحكمة المحلية'],
          avoid: [
            ...commonAvoid,
            'لا تتعامل مع أوامر الدفع القضائية كأنها رسائل تحصيل عادية.',
            'لا تعترف بسرعة بمطالبة غير واضحة.',
          ],
        };
      case 'family':
        return {
          situation: [
            `الموضوع: ${answers.familyEvent || 'غير مذكور'}.`,
            `بخصوص المهلة: ${deadline}.`,
            has(answers, 'childrenAffected', 'ja')
              ? 'الأطفال متأثرون بشكل مباشر. يجب التفكير مبكرا في الرعاية، النفقة، الحضانة أو التواصل.'
              : 'لم يتم ذكر أطفال متأثرين بشكل مباشر أو الأمر غير واضح.',
            has(answers, 'livingSituationChanged', 'ja') || has(answers, 'livingSituationChanged', 'bald')
              ? 'وضع السكن يتغير أو قد يتغير قريبا.'
              : 'لم يتم ذكر تغيير في وضع السكن.',
            filled(answers, 'familyNotes')
              ? `مهم أيضا: ${answers.familyNotes}.`
              : 'لم يتم وصف نقاط مهمة أخرى بعد.',
          ],
          today: [
            'اكتب أهم الحقائق: ماذا حدث، منذ متى، من المتأثر، وما المواعيد أو المهل الموجودة؟',
            'احفظ الوثائق الموجودة رقميا أو كنسخ ورتبها حسب الموضوع.',
            'إذا كان الأطفال متأثرين: وضح الرعاية للأيام القادمة، المدرسة/الحضانة والأشخاص المهمين القريبين.',
            'اطلب من شخص موثوق أو جهة استشارة خطوة تالية محددة.',
          ],
          tomorrow: [
            'تواصل مع استشارة اجتماعية، استشارة عائلية أو استشارة تربوية.',
            'تحقق هل يجب إبلاغ Standesamt، Jugendamt، محكمة الأسرة، التأمين الصحي، صاحب العمل أو شركة التأمين.',
            'عند الانفصال أو الطلاق: اكتب النفقة، السكن، الحساب، العقود المشتركة وقضايا الحضانة/التواصل بشكل منفصل.',
            'عند الوفاة أو الولادة: اجمع الشهادات، الطلبات، المساعدات والإبلاغات المطلوبة خطوة بخطوة.',
          ],
          help: [
            ...commonHelp(city),
            'استشارة عائلية أو تربوية',
            'Jugendamt، خاصة إذا كان الأطفال متأثرين',
            'Standesamt عند الولادة أو الوفاة',
            'استشارة قانونية عند الطلاق، الحضانة، التواصل، النفقة أو الميراث',
            'استشارة حزن أو خدمة أزمات إذا كان الوضع العاطفي حادا',
          ],
          avoid: [
            ...commonAvoid,
            'لا توقع اتفاقات مهمة تحت الضغط.',
            'لا تجعل الأطفال رسلا أو طرفا في النزاع.',
            'لا تغير الحسابات أو العقود أو التأمينات المشتركة بسرعة قبل فحص العواقب.',
            'عند وجود عنف أو تهديد حاد لا تنتظر، بل اطلب الحماية والمساعدة فورا.',
          ],
        };
    }
  },
  buildAllTemplates(category: Category, answers: Answers) {
    if (category.id === 'family') {
      const baseContext = `المكان: ${line(answers.city)}
الموضوع: ${line(answers.familyEvent, 'غير مذكور')}
المهلة: ${templateDeadlineText(answers)}
الأطفال متأثرون: ${line(answers.childrenAffected, 'غير مذكور')}
نقاط مهمة: ${line(answers.familyNotes, 'غير مذكور')}`;

      return [
        {
          label: 'طلب موعد استشارة',
          text: `${senderBlock(answers)}إلى:
${recipientByCategory[category.id]}

الموضوع: طلب موعد استشارة قريب - ${category.shortTitle}

السيدات والسادة المحترمون،

${categoryOpening[category.id]}

الخلفية:
${baseContext}

أطلب موعدا قريبا أو ردا قصيرا حول الوثائق التي يجب أن أجهزها.

${closing}`,
        },
        {
          label: 'طلب توضيح الخطوات التالية',
          text: `${senderBlock(answers)}الموضوع: طلب توضيح الخطوات التالية

السيدات والسادة المحترمون،

أريد توضيح الخطوات التالية المناسبة والضرورية في وضعي العائلي.

الخلفية:
${baseContext}

يرجى إبلاغي بالجهة المختصة والوثائق المطلوبة.

${closing}`,
        },
        {
          label: 'إبلاغ المدرسة أو الحضانة أو جهة أخرى',
          text: `${senderBlock(answers)}الموضوع: إبلاغ قصير عن وضع عائلي

السيدات والسادة المحترمون،

أود إبلاغكم بأن هناك تغييرا عائليا حاليا. إذا تأثرت المواعيد أو الرعاية أو الاتفاقات بذلك فسأرسل معلومات إضافية قريبا.

الخلفية:
${baseContext}

${closing}`,
        },
      ];
    }

    const subject = `طلب توضيح ودعم - ${category.shortTitle}`;
    const baseContext = `المكان: ${line(answers.city)}
المبلغ المفتوح: ${amountText(answers)}
المهلة: ${templateDeadlineText(answers)}
تم التواصل سابقا: ${line(answers.contacted, 'غير مذكور')}`;

    const mainTemplate = `${senderBlock(answers)}إلى:
${recipientByCategory[category.id]}

الموضوع: ${subject}

السيدات والسادة المحترمون،

${categoryOpening[category.id]}

حسب معلوماتي الحالية، يتعلق الأمر بمبلغ مفتوح قدره ${amountText(answers)}. ${
      answers.writtenDeadline === 'ja'
        ? `لدي مهلة مكتوبة حتى ${templateDeadlineText(answers)}.`
        : 'لا توجد لدي حاليا مهلة مكتوبة واضحة أو أنها غير واضحة بالنسبة لي.'
    }

${installmentParagraph(answers)}

${extensionParagraph(answers)}

${closing}`;

    return [
      {
        label: 'النموذج الرئيسي',
        text: mainTemplate,
      },
      {
        label: 'طلب تقسيط',
        text: `${senderBlock(answers)}الموضوع: طلب تقسيط

السيدات والسادة المحترمون،

${installmentParagraph(answers)}

الخلفية:
${baseContext}

${closing}`,
      },
      {
        label: 'طلب تمديد مهلة',
        text: `${senderBlock(answers)}الموضوع: طلب تمديد مهلة

السيدات والسادة المحترمون،

${extensionParagraph(answers)}

الخلفية:
${baseContext}

${closing}`,
      },
      {
        label: 'طلب موعد استشارة',
        text: `${senderBlock(answers)}الموضوع: طلب موعد استشارة قريب

السيدات والسادة المحترمون،

${appointmentParagraph(category)}

الخلفية:
${baseContext}

${closing}`,
      },
    ];
  },
};
