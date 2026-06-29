import type { Answers, Category, CategoryId, Question, ResultContent } from '../types';

const has = (answers: Answers, key: string, value: string) => answers[key] === value;
const filled = (answers: Answers, key: string) => Boolean(answers[key]?.trim());

const line = (value?: string, fallback = '[будь ласка, доповніть]') =>
  value?.trim() || fallback;

const formatMoney = (value?: string) => {
  if (!value) return 'сума не вказана';
  const number = Number(value);
  if (Number.isNaN(number)) return `${value} євро`;
  return `${number.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} євро`;
};

const amountText = (answers: Answers) => {
  const value = answers.amount?.trim();
  return value ? `${value} євро` : '[додайте суму]';
};

const deadlineText = (answers: Answers) => {
  if (filled(answers, 'deadlineDate')) return `строк до ${answers.deadlineDate}`;
  if (has(answers, 'writtenDeadline', 'ja')) return 'є письмовий строк, перевірте дату';
  return 'чіткий письмовий строк не вказано';
};

const templateDeadlineText = (answers: Answers) => {
  if (answers.deadlineDate) return answers.deadlineDate;
  if (answers.writtenDeadline === 'ja') return '[додайте дату строку]';
  return '[якщо є: додайте дату]';
};

const senderBlock = (answers: Answers) => `Відправник/відправниця:
[Ім'я]
[Адреса]
${answers.city ? answers.city : '[Індекс Місто]'}

`;

const closing = `Будь ласка, письмово підтвердьте отримання цього повідомлення.

З повагою
[Ім'я]`;

const commonHelp = (city?: string) => [
  `Консультація з боргів${city ? ` у ${city}` : ''}`,
  `Соціальна консультація${city ? ` у ${city}` : ''}`,
  'Центр захисту прав споживачів',
  'Юридична консультація, якщо вже є позов, рішення або строк',
];

const commonAvoid = [
  'Не залишайте листи нерозкритими.',
  'Не погоджуйтеся на платежі, які реально не зможете сплачувати.',
  'Коротко підтверджуйте телефонні розмови письмово, щоб мати доказ.',
  'Не віддавайте оригінали документів, надсилайте лише копії.',
];

const sharedToday = [
  'Сфотографуйте або відскануйте всі листи й розкладіть їх за датою.',
  'Сьогодні надішліть коротке письмове повідомлення і попросіть підтвердження.',
  'Підготуйте документи про дохід, рахунок, оренду та відкриті суми.',
];

const sharedTomorrow = [
  'Запитайте про запис у відповідну консультаційну службу.',
  'Перевірте, чи можливі Bürgergeld / базова допомога на проживання, соціальна допомога, Wohngeld або позика.',
  'Підготуйте реалістичне прохання про оплату частинами або продовження строку.',
];

const installmentParagraph = (answers: Answers) =>
  `Прошу про реалістичну оплату частинами. Пропоную сплачувати відкриту суму ${amountText(
    answers,
  )} щомісячними платежами. Конкретну пропозицію можу надати найближчим часом після перевірки моїх доходів і витрат.`;

const extensionParagraph = (answers: Answers) =>
  `Прошу продовжити строк щонайменше до ${templateDeadlineText(
    answers,
  )}, щоб я міг/могла впорядкувати документи, отримати консультацію і запропонувати надійне рішення.`;

const appointmentParagraph = (category: Category) =>
  `Прошу про найближчий консультаційний термін. Йдеться про ${category.title}. Я хочу впорядкувати документи та обговорити наступні кроки.`;

const categoryOpening: Record<CategoryId, string> = {
  rent:
    'звертаюся через відкриті орендні платежі й хочу знайти рішення, щоб житло залишалося захищеним.',
  energy:
    'звертаюся через відкриті витрати за енергію та загрозу відключення або вже здійснене відключення.',
  jobcenter:
    'звертаюся через питання з Jobcenter або соціальною службою.',
  health:
    'звертаюся через борги зі внесків і хочу прояснити моє медичне страхування.',
  garnishment:
    'звертаюся через арешт рахунку або через захист через P-Konto (рахунок із захистом від арешту).',
  schufa:
    'звертаюся через фінансову скруту та можливу проблему зі Schufa / кредитною історією.',
  debtCourt:
    'ich melde mich wegen einer Inkasso-Forderung beziehungsweise eines gerichtlichen Mahnverfahrens.',
  family:
    'звертаюся через сімейну зміну і хочу спокійно впорядкувати наступні кроки.',
};

const recipientByCategory: Record<CategoryId, string> = {
  rent: 'Орендодавець / управління будинком',
  energy: 'Постачальник енергії',
  jobcenter: 'Jobcenter / соціальна служба',
  health: 'Медична страхова каса',
  garnishment: 'Банк',
  schufa: 'Консультація з боргів',
  debtCourt: 'Inkassounternehmen / Gläubiger / Mahngericht',
  family: 'Соціальна консультація / сімейна консультація',
};

export const uk = {
  languageName: 'Українська',
  disclaimer:
    'KlarKommen не замінює юридичну консультацію. Ці підказки допомагають упорядкувати ситуацію. Якщо є строки, розірвання договору, арешти або листи з суду, варто якнайшвидше отримати професійну допомогу.',
  ui: {
    back: 'Назад',
    next: 'Далі',
    print: 'Друк',
    copied: 'Скопійовано',
    copyText: 'Скопіювати текст',
    reset: 'Перевірити нову ситуацію',
    languageLabel: 'Мова',
    heroEyebrow: 'Спокійно впорядкувати. Почати сьогодні.',
    heroClaim:
      'Перша орієнтація, коли оренда, електрика, Jobcenter, медична каса, рахунок або Schufa стають занадто важкими.',
    important: 'Важливо:',
    helpPreviewEyebrow: 'Не залишайтеся наодинці',
    helpPreviewTitle: 'Коли варто шукати реальну допомогу',
    helpPreviewText:
      'Якщо йдеться про строки, судові листи, відключення або арешти, важлива пряма підтримка. KlarKommen допомагає підготуватися, але не замінює особисту консультацію.',
    showAllHelp: 'Показати всі підказки',
    categoryStep: 'Крок 1',
    categoryHeading: 'Яка ситуація найбільше підходить?',
    questionStep: 'Крок 2',
    questionHeading: 'Впорядкуємо кілька даних',
    progressLabel: (current: number, total: number) => `${current} / ${total}`,
    progressAria: (progress: number) => `Прогрес ${progress} відсотків`,
    showResults: 'Показати результат',
    resultStep: 'Крок 3 · Результат',
    resultHeading: 'Ваша ситуація впорядкована.',
    resultIntro:
      'Це не юридична оцінка. Це спокійний робочий список, щоб ви могли почати сьогодні.',
    copyAll: 'Скопіювати всі результати',
    situationTitle: 'Короткий підсумок ситуації',
    todayTitle: 'Що варто зробити сьогодні',
    tomorrowTitle: 'Що варто зробити завтра',
    helpTitle: 'Ці місця можуть допомогти',
    avoidTitle: 'Помилки, яких варто уникати',
    templatesEyebrow: 'Шаблони',
    templatesTitle: 'Відповідні тексти',
    resultExportTitle: (categoryTitle: string) => `Результат KlarKommen - ${categoryTitle}`,
    templatesExportTitle: 'Текстові шаблони:',
    footerNavAria: 'Правова інформація та допомога',
    imprint: 'Імпресум',
    privacy: 'Захист даних',
    realHelp: 'Коли шукати реальну допомогу?',
    localDataNotice: 'Усі дані залишаються в цьому браузері. Немає backend і входу.',
    backToStart: 'Повернутися на старт',
    legalEyebrow: 'Правова інформація',
    imprintDetails: 'Дані відповідно до § 5 TMG',
    contact: 'Контакт',
    note: 'Примітка',
    privacyTitle: 'Заява про захист даних',
    privacyLead:
      'Ця заява описує, як KlarKommen працює з даними. Додаток свідомо створений без входу, backend і серверного зберігання персональних даних про ситуацію.',
    realHelpEyebrow: 'Важливо',
    realHelpTitle: 'Коли варто шукати реальну допомогу',
    realHelpLead:
      'KlarKommen може допомогти впорядкувати й підготуватися. Але в деяких ситуаціях не варто продовжувати самостійно, а краще напряму звернутися до консультації, органу, адвокатки або адвоката.',
    realHelpSignalsTitle: 'Шукайте швидку підтримку, якщо...',
    urgentContactsTitle: 'Можливі наступні контакти',
  },
  categories: [
    {
      id: 'rent',
      title: 'Борги за оренду / розірвання',
      shortTitle: 'Оренда',
      description: 'Впорядкувати відкриту оренду, нагадування, розірвання або загрозу виселення.',
      primaryContact: 'Орендодавець або управління будинком',
    },
    {
      id: 'energy',
      title: 'Відключення електрики / борги за енергію',
      shortTitle: 'Енергія',
      description: 'Спланувати загрозу або вже здійснене відключення, авансові платежі та розстрочку.',
      primaryContact: 'Постачальник енергії',
    },
    {
      id: 'jobcenter',
      title: 'Bürgergeld / Jobcenter',
      shortTitle: 'Jobcenter',
      description: 'Розібратися із заявою, продовженням, санкцією, поверненням коштів або рішенням.',
      primaryContact: 'Jobcenter або соціальна служба',
    },
    {
      id: 'health',
      title: 'Медична каса / борги зі внесків',
      shortTitle: 'Медична каса',
      description: 'Структурувати нагадування, заборгованість зі внесків і можливе обмеження послуг.',
      primaryContact: 'Медична страхова каса',
    },
    {
      id: 'garnishment',
      title: 'Арешт / P-Konto',
      shortTitle: 'P-Konto',
      description: 'Впорядкувати арешт рахунку, захищену суму, P-Konto і гроші для проживання.',
      primaryContact: 'Банк',
    },
    {
      id: 'schufa',
      title: 'Schufa / відмова в кредиті',
      shortTitle: 'Schufa',
      description: 'Зважити відмову, терміновість, альтернативи та потребу в консультації.',
      primaryContact: 'Консультація з боргів',
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
      title: 'Сімʼя / життєва зміна',
      shortTitle: 'Сімʼя',
      description: 'Спокійно впорядкувати смерть, народження, розставання, розлучення або батьківство.',
      primaryContact: 'Соціальна або сімейна консультація',
    },
  ] as Category[],
  commonQuestions: [
    {
      id: 'city',
      text: 'У якому місті ви живете?',
      type: 'text',
      placeholder: 'наприклад, Leipzig',
      required: true,
    },
    {
      id: 'writtenDeadline',
      text: 'Чи є письмовий строк?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Так' },
        { value: 'nein', label: 'Ні' },
        { value: 'unklar', label: 'Незрозуміло' },
      ],
      required: true,
    },
    {
      id: 'deadlineDate',
      text: 'До коли триває строк?',
      help: 'Якщо дати немає, залиште поле порожнім.',
      type: 'date',
    },
    {
      id: 'amount',
      text: 'Яка сума відкрита?',
      type: 'number',
      placeholder: 'Сума в євро',
    },
    {
      id: 'income',
      text: 'Чи маєте дохід?',
      type: 'select',
      options: [
        { value: 'regelmäßig', label: 'Так, регулярний' },
        { value: 'unregelmäßig', label: 'Так, нерегулярний' },
        { value: 'nein', label: 'Ні' },
      ],
    },
    {
      id: 'benefits',
      text: 'Чи отримуєте Bürgergeld / базову допомогу на проживання або соціальну допомогу?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Так' },
        { value: 'nein', label: 'Ні' },
        { value: 'beantragt', label: 'Подано заяву' },
        { value: 'unklar', label: 'Незрозуміло' },
      ],
    },
    {
      id: 'officialLetter',
      text: 'Чи є офіційний лист?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Так' },
        { value: 'nein', label: 'Ні' },
        { value: 'unklar', label: 'Незрозуміло' },
      ],
    },
    {
      id: 'contacted',
      text: 'Чи ви вже виходили на контакт?',
      type: 'select',
      options: [
        { value: 'ja', label: 'Так' },
        { value: 'nein', label: 'Ні' },
        { value: 'versucht', label: 'Пробував/пробувала, але відповіді немає' },
      ],
    },
  ] as Question[],
  categoryQuestions: {
    rent: [
      {
        id: 'rentTerminated',
        category: 'rent',
        text: 'Чи вже було розірвання договору?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'angedroht', label: 'Лише погрожували' },
        ],
      },
      {
        id: 'immediateTermination',
        category: 'rent',
        text: 'Йдеться про розірвання без строку?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'evictionClaim',
        category: 'rent',
        text: 'Чи вже є позов про виселення?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'openRentMonths',
        category: 'rent',
        text: 'Скільки місяців оренди відкрито?',
        type: 'number',
        placeholder: 'наприклад, 2',
      },
      {
        id: 'landlordInstallments',
        category: 'rent',
        text: 'Чи орендодавець готовий до оплати частинами?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Ще не з’ясовано' },
        ],
      },
    ],
    energy: [
      {
        id: 'energyBlockStatus',
        category: 'energy',
        text: 'Відключення лише погрожують чи вже зробили?',
        type: 'select',
        options: [
          { value: 'angedroht', label: 'Погрожують' },
          { value: 'durchgeführt', label: 'Вже зробили' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'children',
        category: 'energy',
        text: 'Чи живуть у домогосподарстві неповнолітні діти?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
        ],
      },
      {
        id: 'healthReasons',
        category: 'energy',
        text: 'Чи є медичні причини проти відключення?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'energyInstallmentsOffered',
        category: 'energy',
        text: 'Чи вже пропонували оплату частинами?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'abgelehnt', label: 'Так, але відхилили' },
        ],
      },
    ],
    jobcenter: [
      {
        id: 'jobcenterIssue',
        category: 'jobcenter',
        text: 'Про що йдеться?',
        type: 'select',
        options: [
          { value: 'Erstantrag', label: 'Перша заява' },
          { value: 'Weiterbewilligung', label: 'Продовження виплат' },
          { value: 'Sanktion', label: 'Санкція' },
          { value: 'Rückforderung', label: 'Вимога повернення коштів' },
        ],
      },
      {
        id: 'decisionAvailable',
        category: 'jobcenter',
        text: 'Чи є рішення?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
        ],
      },
      {
        id: 'decisionDate',
        category: 'jobcenter',
        text: 'Коли надійшло рішення?',
        type: 'date',
      },
      {
        id: 'objectionDeadline',
        category: 'jobcenter',
        text: 'Чи знаєте строк для заперечення?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'abgelaufen', label: 'Можливо, вже минув' },
        ],
      },
    ],
    health: [
      {
        id: 'insuranceType',
        category: 'health',
        text: 'Ви застраховані в державній чи приватній касі?',
        type: 'select',
        options: [
          { value: 'gesetzlich', label: 'Державна' },
          { value: 'privat', label: 'Приватна' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'healthWarnings',
        category: 'health',
        text: 'Чи були нагадування / попередження?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'benefitsSuspendedThreat',
        category: 'health',
        text: 'Чи погрожували обмеженням послуг?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'healthIncomeDetails',
        category: 'health',
        text: 'Які доходи маєте зараз?',
        type: 'textarea',
        placeholder: 'наприклад, зарплата, Bürgergeld, самозайнятість, немає доходу',
      },
    ],
    garnishment: [
      {
        id: 'pAccount',
        category: 'garnishment',
        text: 'Чи вже маєте P-Konto?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'beantragt', label: 'Подано заяву' },
        ],
      },
      {
        id: 'accountGarnished',
        category: 'garnishment',
        text: 'Чи ваш рахунок арештовано?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'angekündigt', label: 'Оголошено' },
        ],
      },
      {
        id: 'garnishmentOrder',
        category: 'garnishment',
        text: 'Чи є рішення про арешт і переказ коштів?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'moneyOnAccount',
        category: 'garnishment',
        text: 'Чи надходить зарплата, Bürgergeld або пенсія на цей рахунок?',
        type: 'select',
        options: [
          { value: 'Gehalt', label: 'Зарплата' },
          { value: 'Bürgergeld', label: 'Bürgergeld' },
          { value: 'Rente', label: 'Пенсія' },
          { value: 'Mehreres', label: 'Кілька видів' },
          { value: 'nein', label: 'Ні' },
        ],
      },
    ],
    schufa: [
      {
        id: 'moneyPurpose',
        category: 'schufa',
        text: 'Для чого потрібні гроші?',
        type: 'textarea',
        placeholder: 'наприклад, борг за оренду, електрика, авто, переїзд',
      },
      {
        id: 'urgency',
        category: 'schufa',
        text: 'Наскільки це терміново?',
        type: 'select',
        options: [
          { value: 'heute', label: 'Сьогодні або завтра' },
          { value: 'woche', label: 'Цього тижня' },
          { value: 'monat', label: 'Цього місяця' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'regularIncome',
        category: 'schufa',
        text: 'Чи маєте регулярний дохід?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unregelmäßig', label: 'Нерегулярний' },
        ],
      },
      {
        id: 'creditRejected',
        category: 'schufa',
        text: 'Чи кредит відхилили через Schufa?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'vermutlich', label: 'Ймовірно' },
        ],
      },
      {
        id: 'acuteDeadline',
        category: 'schufa',
        text: 'Чи є гострий строк?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
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
        text: 'Про що зараз ідеться?',
        type: 'select',
        options: [
          { value: 'tod', label: 'Смерть / втрата' },
          { value: 'geburt', label: 'Народження / вагітність' },
          { value: 'trennung', label: 'Розставання' },
          { value: 'scheidung', label: 'Розлучення' },
          { value: 'elternschaft', label: 'Батьківство / опіка' },
          { value: 'mehreres', label: 'Кілька тем одночасно' },
        ],
      },
      {
        id: 'childrenAffected',
        category: 'family',
        text: 'Чи діти безпосередньо зачеплені?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'livingSituationChanged',
        category: 'family',
        text: 'Чи змінилася житлова ситуація або це скоро станеться?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'bald', label: 'Ймовірно скоро' },
        ],
      },
      {
        id: 'documentsNeeded',
        category: 'family',
        text: 'Чи є документи, які треба отримати або змінити?',
        help: 'Наприклад свідоцтво про народження, свідоцтво про смерть, опіка, аліменти, договір оренди або страхування.',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'nein', label: 'Ні' },
          { value: 'unklar', label: 'Незрозуміло' },
        ],
      },
      {
        id: 'supportNetwork',
        category: 'family',
        text: 'Чи є зараз надійна підтримка?',
        type: 'select',
        options: [
          { value: 'ja', label: 'Так' },
          { value: 'teilweise', label: 'Частково' },
          { value: 'nein', label: 'Ні' },
        ],
      },
      {
        id: 'familyNotes',
        category: 'family',
        text: 'Що обовʼязково треба врахувати?',
        type: 'textarea',
        placeholder: 'наприклад, зустрічі, догляд за дітьми, спадщина, аліменти, житло, опіка або контакти з дитиною',
      },
    ],
  } as Record<CategoryId, Question[]>,
  legal: {
    realHelpSignals: [
      'Ви отримали позов про виселення, дату суду або лист із суду.',
      'Електрику, газ або воду вже відключено або відключення ось-ось буде.',
      'Ваш рахунок арештовано, і ви не можете отримати гроші на оренду, їжу або ліки.',
      'Ви отримали рішення з поточним строком для заперечення і не впевнені, що воно означає.',
      'Медичне страхування, лікування або важливі ліки зараз під загрозою.',
      'Ви почуваєтеся перевантажено, під загрозою або небезпечно.',
    ],
    urgentContacts: [
      'При гострій небезпеці: швидка 112 або поліція 110.',
      'При судових листах: одразу зверніться до консультації, адвокатки або адвоката.',
      'При боргах за оренду або енергію: зверніться до соціальної служби, Jobcenter або консультації з боргів у вашому місті.',
      'При арешті рахунку: зверніться до банку та консультації з боргів щодо P-Konto і захищених сум.',
    ],
    privacySections: [
      {
        title: 'Коротко',
        text: 'KlarKommen обробляє ваші введені дані лише локально у вашому браузері. Немає backend, входу і бази даних для ваших даних.',
      },
      {
        title: 'Відповідальна особа',
        text: 'Alexander Kluth, Kaistraße 2, 40221 Düsseldorf, Deutschland. E-Mail: alex@denkwerk-kluth.de',
      },
      {
        title: 'Які дані обробляються?',
        text: 'Додаток запитує дані про вашу ситуацію, наприклад категорію, строки, суми або стан контакту. Ці дані використовуються лише локально у браузері для створення підказок і текстових шаблонів.',
      },
      {
        title: 'Немає серверного зберігання',
        text: 'Введені дані про ситуацію не передаються на сервер KlarKommen і не зберігаються на сервері. При перезавантаженні або скиданні додатка введені дані можуть зникнути.',
      },
      {
        title: 'Хостинг і технічні доступи',
        text: 'Сайт надається через Cloudflare. При відкритті сторінки можуть оброблятися технічно необхідні дані доступу, як-от IP-адреса, час запиту, інформація браузера і запитані файли, щоб сайт міг бути доставлений і захищений.',
      },
      {
        title: 'Контакт',
        text: 'Якщо ви звертаєтесь електронною поштою або телефоном, передані вами дані використовуються для обробки запиту.',
      },
      {
        title: 'Ваші права',
        text: 'У межах законодавства ви можете вимагати інформацію, виправлення, видалення, обмеження обробки та подавати заперечення. Також можна звернутися зі скаргою до наглядового органу із захисту даних.',
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
            `Йдеться про борги за оренду на суму ${amount}.`,
            `Щодо строку: ${deadline}.`,
            has(answers, 'rentTerminated', 'ja')
              ? 'Розірвання вже було оголошено. Це терміново.'
              : 'Розірвання ще не оголошено чітко або лише погрожували.',
            has(answers, 'evictionClaim', 'ja')
              ? 'Позов про виселення — сильний сигнал тривоги. Негайно отримайте консультацію.'
              : 'Позов про виселення не вказано.',
          ],
          today: [
            ...sharedToday,
            'Письмово попросіть орендодавця або управління будинком про оплату частинами або продовження строку.',
            'Запитайте Jobcenter або соціальну службу про можливе покриття боргу за оренду як позику.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Зв’яжіться з Mieterverein, допомогою при житловій кризі або соціальною консультацією.',
            'Якщо є позов: негайно перевірте строки з судового листа.',
          ],
          help: [
            ...commonHelp(city),
            'Mieterverein',
            'Житлова кризова допомога міста або громади',
            'Jobcenter або соціальна служба щодо можливого покриття боргів за оренду',
          ],
          avoid: [
            ...commonAvoid,
            'Не виїжджайте і не віддавайте ключі без консультації щодо наслідків.',
            'Не покладайтеся на усні домовленості без письмового підтвердження.',
          ],
        };
      case 'energy':
        return {
          situation: [
            `Йдеться про борги за енергію на суму ${amount}.`,
            `Щодо строку: ${deadline}.`,
            has(answers, 'energyBlockStatus', 'durchgeführt')
              ? 'Відключення вже здійснено. Тепер важливо швидко відновити постачання.'
              : 'Відключення загрожує або ситуація неясна. Зараз важлива швидка письмова реакція.',
            has(answers, 'children', 'ja') || has(answers, 'healthReasons', 'ja')
              ? 'Діти або медичні причини можуть бути важливими для запобігання відключенню.'
              : 'Особливі побутові або медичні причини не вказані.',
          ],
          today: [
            ...sharedToday,
            'Письмово попросіть постачальника енергії призупинити відключення, надати розстрочку і актуальний розрахунок боргу.',
            'Якщо зачеплені діти або медичні прилади: одразу вкажіть це і підготуйте докази.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Запитайте Jobcenter або соціальну службу про позику на борги за енергію.',
            'Зверніться до центру захисту споживачів або консультації щодо енергетичних боргів.',
          ],
          help: [
            ...commonHelp(city),
            'Гаряча лінія постачальника енергії щодо відключення',
            'Jobcenter або соціальна служба',
            'Енергетична консультація центру захисту споживачів',
          ],
          avoid: [
            ...commonAvoid,
            'Не втручайтеся самостійно в лічильники або підключення.',
            'Не погоджуйтеся на новий авансовий платіж, який одразу знову призведе до боргів.',
          ],
        };
      case 'jobcenter':
        return {
          situation: [
            `Тема: ${answers.jobcenterIssue || 'не вказано'}.`,
            `Щодо строку: ${deadline}.`,
            has(answers, 'decisionAvailable', 'ja')
              ? 'Рішення є. Дата і пояснення про право на заперечення важливі.'
              : 'Рішення немає. Тоді має сенс письмово запитати про стан справи.',
            has(answers, 'objectionDeadline', 'abgelaufen')
              ? 'Строк для заперечення міг минути. Але можливі інші шляхи перевірки.'
              : 'Строк для заперечення треба точно перевірити.',
          ],
          today: [
            ...sharedToday,
            'Розкладіть рішення, заяву або вимогу за датою.',
            'Письмово попросіть Jobcenter про стан справи, продовження строку або перевірку.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Перевірте соціальну консультацію, консультацію для безробітних або юридичну консультацію з Beratungshilfeschein.',
            'Якщо бракує грошей на життя: поговоріть з Jobcenter про термінову заяву або аванс.',
          ],
          help: [
            ...commonHelp(city),
            'Консультація для безробітних',
            'Правова приймальня соціального суду у дуже термінових випадках',
            'Приймальна зона Jobcenter із письмовим підтвердженням отримання',
          ],
          avoid: [
            ...commonAvoid,
            'Не пропускайте строки без письмової реакції.',
            'Не здавайте документи без копії або підтвердження отримання.',
          ],
        };
      case 'health':
        return {
          situation: [
            `Страхування: ${answers.insuranceType || 'не вказано'}.`,
            `Відкрита сума: ${amount}.`,
            has(answers, 'benefitsSuspendedThreat', 'ja')
              ? 'Було попередження про обмеження послуг. Це треба швидко прояснити.'
              : 'Обмеження послуг не вказано чітко.',
            filled(answers, 'healthIncomeDetails')
              ? `Поточні доходи: ${answers.healthIncomeDetails}.`
              : 'Поточні доходи ще не описані.',
          ],
          today: [
            ...sharedToday,
            'Письмово попросіть медичну касу про розрахунок боргу і оплату частинами.',
            'При низькому доході зберіть докази і попросіть перевірку внесків.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Зверніться до консультаційної служби або незалежної консультації пацієнтів.',
            'При гострому лікуванні з’ясуйте, які послуги залишаються захищеними попри борги.',
          ],
          help: [
            ...commonHelp(city),
            'Відділ внесків медичної каси',
            'Незалежна консультація пацієнтів',
            'Соціальна служба або Jobcenter при відсутності доходу',
          ],
          avoid: [
            ...commonAvoid,
            'Не скасовуйте медичне страхування і не ігноруйте його.',
            'Не відкладайте візити до лікаря при гострих скаргах через страх боргів.',
          ],
        };
      case 'garnishment':
        return {
          situation: [
            has(answers, 'accountGarnished', 'ja')
              ? 'Рахунок арештовано. Доступ до захищених грошей треба швидко забезпечити.'
              : 'Арешт рахунку не є чітко активним або лише оголошений.',
            has(answers, 'pAccount', 'ja')
              ? 'P-Konto вже є.'
              : 'P-Konto ще не налаштовано надійно.',
            `На рахунок надходить: ${answers.moneyOnAccount || 'не вказано'}.`,
            `Щодо строку: ${deadline}.`,
          ],
          today: [
            ...sharedToday,
            'Письмово попросіть банк перетворити рахунок на P-Konto або підтвердити P-Konto.',
            'Перевірте довідки для підвищених захищених сум, особливо при дітях або соціальних виплатах.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Запитайте консультацію з боргів про довідку P-Konto і контакт із кредитором.',
            'Запитайте виконавчий суд про заяви на захист, якщо гроші залишаються заблокованими.',
          ],
          help: [
            ...commonHelp(city),
            'Відділення банку або сервіс рахунків',
            'Визнана консультація з боргів',
            'Виконавчий суд',
          ],
          avoid: [
            ...commonAvoid,
            'Не відкривайте кілька P-Konto.',
            'Не залишайте надходження грошей на арештований рахунок без чіткого захисту.',
          ],
        };
      case 'schufa':
        return {
          situation: [
            has(answers, 'creditRejected', 'ja') || has(answers, 'creditRejected', 'vermutlich')
              ? 'Кредит, ймовірно, відхилили через платоспроможність або Schufa.'
              : 'Конкретну відмову через Schufa не вказано.',
            `Терміновість: ${answers.urgency || 'не вказано'}.`,
            filled(answers, 'moneyPurpose')
              ? `Потреба в грошах: ${answers.moneyPurpose}.`
              : 'Мету потреби в грошах ще не описано.',
            has(answers, 'acuteDeadline', 'ja')
              ? 'Є гострий строк. Пріоритет — пряме вирішення основної проблеми.'
              : 'Гострий строк не вказано чітко.',
          ],
          today: [
            ...sharedToday,
            'Попросіть основного кредитора або партнера за договором про продовження строку або оплату частинами.',
            'Не підписуйте дорогі швидкі кредити, поки не перевірені альтернативи.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Перевірте безкоштовну копію даних у бюро кредитної інформації і оскаржте неправильні записи.',
            'Запитайте консультацію з боргів про безпечні альтернативи новим кредитам.',
          ],
          help: [
            ...commonHelp(city),
            'Консультація з боргів',
            'Центр захисту прав споживачів',
            'Прямий партнер за договором, у якого триває строк',
          ],
          avoid: [
            ...commonAvoid,
            'Не сплачуйте передоплати за нібито гарантовані кредити.',
            'Не беріть нові борги, якщо вони лише коротко приховують старі строки.',
          ],
        };
      case 'debtCourt':
        return {
          situation: [
            `Тип листа: ${answers.debtLetterType || 'не вказано'}.`,
            `Відкрита сума: ${amount}.`,
            `Щодо строку: ${deadline}.`,
            has(answers, 'debtLetterType', 'mahnbescheid') ||
            has(answers, 'debtLetterType', 'vollstreckungsbescheid') ||
            has(answers, 'courtYellowEnvelope', 'ja')
              ? 'Лист із суду або судове наказне провадження є сильним попереджувальним сигналом.'
              : 'Чіткого листа із суду не вказано.',
          ],
          today: [
            ...sharedToday,
            'Перевірте, чи лист надійшов із суду, від колекторів або від кредитора.',
            'Якщо це судовий лист, запишіть дату вручення і негайно зверніться по консультацію.',
          ],
          tomorrow: [
            ...sharedTomorrow,
            'Зверніться до консультації з боргів або центру захисту прав споживачів.',
            'Письмово запросіть розрахунок вимоги, довіреність і докази.',
          ],
          help: [...commonHelp(city), 'Центр захисту прав споживачів', 'Суд у справах платіжних наказів або місцевий суд'],
          avoid: [
            ...commonAvoid,
            'Не ставтеся до судових платіжних наказів як до звичайних колекторських листів.',
            'Не визнавайте неясну вимогу поспіхом.',
          ],
        };
      case 'family':
        return {
          situation: [
            `Тема: ${answers.familyEvent || 'не вказано'}.`,
            `Щодо строку: ${deadline}.`,
            has(answers, 'childrenAffected', 'ja')
              ? 'Діти безпосередньо зачеплені. Варто рано врахувати догляд, аліменти, опіку або контакт із дитиною.'
              : 'Безпосередньо зачеплених дітей не вказано або це незрозуміло.',
            has(answers, 'livingSituationChanged', 'ja') || has(answers, 'livingSituationChanged', 'bald')
              ? 'Житлова ситуація змінюється або може скоро змінитися.'
              : 'Зміну житлової ситуації не вказано.',
            filled(answers, 'familyNotes')
              ? `Також важливо: ${answers.familyNotes}.`
              : 'Інші важливі пункти ще не описані.',
          ],
          today: [
            'Запишіть головні факти: що сталося, відколи, кого це стосується, які зустрічі або строки є?',
            'Збережіть наявні документи цифрово або як копії та розкладіть їх за темами.',
            'Якщо зачеплені діти: уточніть догляд на найближчі дні, школу/садок і важливих близьких людей.',
            'Попросіть довірену людину або консультацію допомогти з конкретним наступним кроком.',
          ],
          tomorrow: [
            'Зверніться до соціальної, сімейної або батьківської консультації.',
            'Перевірте, чи треба повідомити Standesamt, Jugendamt, сімейний суд, медичну касу, роботодавця або страхування.',
            'При розставанні або розлученні: окремо занотуйте аліменти, житло, рахунок, спільні договори та питання опіки/контакту.',
            'При смерті або народженні: крок за кроком зберіть потрібні свідоцтва, заяви, виплати та повідомлення.',
          ],
          help: [
            ...commonHelp(city),
            'Сімейна або батьківська консультація',
            'Jugendamt, особливо якщо зачеплені діти',
            'Standesamt при народженні або смерті',
            'Юридична консультація при розлученні, опіці, контакті, аліментах або спадщині',
            'Консультація з горя або кризова служба, якщо емоційно дуже гостро',
          ],
          avoid: [
            ...commonAvoid,
            'Не підписуйте важливі домовленості під тиском.',
            'Не використовуйте дітей як посередників або учасників конфлікту.',
            'Не змінюйте поспіхом спільні рахунки, договори або страхування, не перевіривши наслідки.',
            'При гострому насильстві або загрозі не чекайте, а одразу шукайте захист і допомогу.',
          ],
        };
    }
  },
  buildAllTemplates(category: Category, answers: Answers) {
    if (category.id === 'family') {
      const baseContext = `Місце: ${line(answers.city)}
Тема: ${line(answers.familyEvent, 'не вказано')}
Строк: ${templateDeadlineText(answers)}
Діти зачеплені: ${line(answers.childrenAffected, 'не вказано')}
Важливі пункти: ${line(answers.familyNotes, 'не вказано')}`;

      return [
        {
          label: 'Прохання про консультаційний термін',
          text: `${senderBlock(answers)}Кому:
${recipientByCategory[category.id]}

Тема: Прохання про найближчий консультаційний термін - ${category.shortTitle}

Шановні пані та панове,

${categoryOpening[category.id]}

Передумови:
${baseContext}

Прошу про найближчий термін або коротку відповідь, які документи треба підготувати.

${closing}`,
        },
        {
          label: 'Уточнення наступних кроків',
          text: `${senderBlock(answers)}Тема: Прохання уточнити наступні кроки

Шановні пані та панове,

Я хочу уточнити, які наступні кроки в моїй сімейній ситуації є доцільними та необхідними.

Передумови:
${baseContext}

Будь ласка, повідомте, яка установа відповідальна і які документи потрібні.

${closing}`,
        },
        {
          label: 'Повідомлення школі, садку або установі',
          text: `${senderBlock(answers)}Тема: Коротке повідомлення про сімейну ситуацію

Шановні пані та панове,

Повідомляю, що зараз є сімейна зміна. Якщо це вплине на зустрічі, догляд або домовленості, я найближчим часом надам додаткову інформацію.

Передумови:
${baseContext}

${closing}`,
        },
      ];
    }

    const subject = `Прохання про уточнення та підтримку - ${category.shortTitle}`;
    const baseContext = `Місце: ${line(answers.city)}
Відкрита сума: ${amountText(answers)}
Строк: ${templateDeadlineText(answers)}
Контакт уже був: ${line(answers.contacted, 'не вказано')}`;

    const mainTemplate = `${senderBlock(answers)}Кому:
${recipientByCategory[category.id]}

Тема: ${subject}

Шановні пані та панове,

${categoryOpening[category.id]}

За моїм оглядом зараз йдеться про відкриту суму ${amountText(answers)}. ${
      answers.writtenDeadline === 'ja'
        ? `У мене є письмовий строк до ${templateDeadlineText(answers)}.`
        : 'Чіткого письмового строку наразі немає або він мені не зрозумілий.'
    }

${installmentParagraph(answers)}

${extensionParagraph(answers)}

${closing}`;

    return [
      {
        label: 'Основний шаблон',
        text: mainTemplate,
      },
      {
        label: 'Прохання про оплату частинами',
        text: `${senderBlock(answers)}Тема: Прохання про оплату частинами

Шановні пані та панове,

${installmentParagraph(answers)}

Передумови:
${baseContext}

${closing}`,
      },
      {
        label: 'Прохання про продовження строку',
        text: `${senderBlock(answers)}Тема: Прохання про продовження строку

Шановні пані та панове,

${extensionParagraph(answers)}

Передумови:
${baseContext}

${closing}`,
      },
      {
        label: 'Прохання про консультаційний термін',
        text: `${senderBlock(answers)}Тема: Прохання про найближчий консультаційний термін

Шановні пані та панове,

${appointmentParagraph(category)}

Передумови:
${baseContext}

${closing}`,
      },
    ];
  },
};
