import type { Language } from './index';
import { adaptTextForSwitzerland } from './switzerland';
import type { CategoryId } from '../types';
import type { QuickHelpTexts, QuickRiskText } from './quickHelp';

const emergency: Record<Language, Pick<QuickHelpTexts, 'emergencyCall' | 'emergencyPolice' | 'emergencyText' | 'directContactIntro' | 'locationPlaceholder'>> = {
  de: { emergencyCall: '144 anrufen', emergencyPolice: '117 anrufen', emergencyText: 'Bei Lebensgefahr oder einem medizinischen Notfall rufe 144. Bei akuter Bedrohung oder Gewalt rufe 117. Der europäische Notruf 112 funktioniert ebenfalls. Finanzielle Dringlichkeit allein ist kein Notfall.', directContactIntro: 'Diese Stellen sind schweizweit erreichbar oder führen dich zur zuständigen kantonalen oder kommunalen Stelle. Ein Kontakt wahrt keine rechtliche Frist.', locationPlaceholder: 'z. B. 8001 oder Zürich' },
  fr: { emergencyCall: 'Appeler le 144', emergencyPolice: 'Appeler le 117', emergencyText: 'En cas de danger vital ou d’urgence médicale, appelez le 144. En cas de menace ou de violence, appelez le 117. Le numéro européen 112 fonctionne aussi. Une urgence financière seule ne justifie pas un appel d’urgence.', directContactIntro: 'Ces services sont disponibles dans toute la Suisse ou vous orientent vers le service cantonal ou communal compétent. Une prise de contact ne suspend aucun délai.', locationPlaceholder: 'p. ex. 1003 ou Lausanne' },
  gsw: { emergencyCall: '144 aalüüte', emergencyPolice: '117 aalüüte', emergencyText: 'Bi Läbesgfahr oder eme medizinische Notfall rüef 144 aa. Bi akuter Bedrohig oder Gwalt rüef 117 aa. De europäisch Notruf 112 funktioniert au. Finanzielle Dringlichkeit allei isch kei Notfall.', directContactIntro: 'Die Stelle sind i de ganze Schwiiz erreichbar oder bringed di zur zuständige kantonale oder kommunale Stell. En Kontakt wahrt kei rechtlichi Frist.', locationPlaceholder: 'z. B. 8001 oder Züri' },
  tr: { emergencyCall: '144’ü ara', emergencyPolice: '117’yi ara', emergencyText: 'Hayati tehlike veya tıbbi acil durumda 144’ü ara. Akut tehdit ya da şiddette 117’yi ara. Avrupa acil numarası 112 de çalışır. Yalnız mali aciliyet acil çağrı nedeni değildir.', directContactIntro: 'Bu kurumlara İsviçre genelinde ulaşılabilir veya seni kanton/belediye kurumuna yönlendirirler. İletişim kurmak yasal süreyi durdurmaz.', locationPlaceholder: 'örn. 8001 veya Zürich' },
  ar: { emergencyCall: 'اتصل بـ144', emergencyPolice: 'اتصل بالشرطة 117', emergencyText: 'عند خطر على الحياة أو طارئ طبي اتصل بـ144. عند تهديد أو عنف اتصل بالشرطة 117. يعمل أيضا الرقم الأوروبي 112. الضيق المالي وحده ليس حالة طوارئ.', directContactIntro: 'هذه الجهات متاحة في كل سويسرا أو توجهك إلى الجهة الكانتونية أو البلدية المختصة. التواصل لا يوقف المهلة القانونية.', locationPlaceholder: 'مثلا 8001 أو Zürich' },
  uk: { emergencyCall: 'Зателефонувати 144', emergencyPolice: 'Зателефонувати 117', emergencyText: 'За загрози життю або медичної невідкладної ситуації телефонуйте 144. За гострої загрози чи насильства — 117. Європейський номер 112 також працює. Фінансова терміновість сама по собі не є екстреним випадком.', directContactIntro: 'Ці служби доступні по всій Швейцарії або скерують до кантональної чи муніципальної установи. Звернення не зупиняє юридичний строк.', locationPlaceholder: 'наприклад 8001 або Zürich' },
};

const frRisks: Record<CategoryId, QuickRiskText> = {
  rent: { legend: 'Que s’est-il déjà passé pour le logement ?', options: { eviction: { label: 'Procédure ou date d’expulsion', help: 'Un courrier officiel ou une date concrète existe.' }, immediateTermination: { label: 'Résiliation extraordinaire reçue', help: 'La résiliation a été reçue par écrit.' }, termination: { label: 'Autre résiliation reçue', help: 'Il y a une résiliation, sans expulsion connue.' }, arrears: { label: 'Loyer impayé ou rappel', help: 'Aucune résiliation connue pour l’instant.' }, unclear: { label: 'Pas clair', help: 'Vous ne pouvez pas classer la situation avec certitude.' } } },
  energy: { legend: 'Où en est la situation de l’électricité ou du gaz ?', options: { blocked: { label: 'Déjà coupé', help: 'L’approvisionnement est actuellement interrompu.' }, imminent: { label: 'Coupure imminente', help: 'Une date concrète est très proche.' }, threatened: { label: 'Coupure annoncée', help: 'Une menace existe, sans date imminente.' }, arrears: { label: 'Impayé ou rappel sans menace', help: 'La fourniture fonctionne encore.' }, unclear: { label: 'Pas clair', help: 'Vous ne connaissez pas précisément le statut.' } } },
  jobcenter: { legend: 'Qu’est-ce qui est le plus urgent avec l’ORP, la caisse de chômage ou l’aide sociale ?', options: { noMoney: { label: 'Plus d’argent pour vivre', help: 'Nourriture, logement ou médicaments ne sont pas assurés.' }, stopped: { label: 'Prestation réduite ou suspendue', help: 'Un versement a été réduit ou arrêté.' }, deadline: { label: 'Décision ou délai de recours', help: 'Une décision doit être vérifiée rapidement.' }, application: { label: 'Inscription, demande ou question', help: 'Aucune pénurie immédiate connue.' }, unclear: { label: 'Pas clair', help: 'Vous ne pouvez pas classer la décision.' } } },
  health: { legend: 'Que s’est-il passé avec l’assurance-maladie ?', options: { careAtRisk: { label: 'Traitement ou médicaments menacés', help: 'Des soins nécessaires ne sont pas assurés.' }, suspended: { label: 'Restriction annoncée ou appliquée', help: 'La caisse a annoncé ou appliqué une restriction.' }, warnings: { label: 'Primes impayées ou rappels', help: 'Aucune restriction de soins connue.' }, question: { label: 'Question générale', help: 'Aucun rappel ou risque immédiat connu.' }, unclear: { label: 'Pas clair', help: 'Le statut de l’assurance n’est pas clair.' } } },
  garnishment: { legend: 'Que s’est-il passé avec le compte ou le salaire ?', options: { noAccess: { label: 'Saisi et aucun argent disponible', help: 'L’argent nécessaire pour vivre est bloqué.' }, noPAccount: { label: 'Saisi, minimum vital pas clarifié', help: 'La libération des montants nécessaires reste ouverte.' }, pAccount: { label: 'Saisi, minimum vital déjà examiné', help: 'L’accès ou le calcul pose encore problème.' }, order: { label: 'Saisie annoncée ou procès-verbal reçu', help: 'Le compte n’est peut-être pas encore bloqué.' }, unclear: { label: 'Pas clair', help: 'Le statut de la saisie n’est pas clair.' } } },
  schufa: { legend: 'Que s’est-il passé avec le crédit ou les données de solvabilité ?', options: { essential: { label: 'Argent nécessaire aujourd’hui pour l’essentiel', help: 'Par exemple loyer, énergie, nourriture ou médicaments.' }, rejected: { label: 'Crédit ou contrat refusé', help: 'ZEK, IKO, CRIF ou la solvabilité ont été évoqués.' }, wrongData: { label: 'Données probablement fausses', help: 'Vous voulez consulter ou rectifier les données.' }, information: { label: 'Demande de renseignements', help: 'Aucun délai urgent connu.' }, unclear: { label: 'Pas clair', help: 'Vous ignorez ce qui est enregistré.' } } },
  debtCourt: { legend: 'Quel document avez-vous reçu ?', options: { enforcement: { label: 'Continuation ou saisie', help: 'La poursuite est déjà à un stade avancé.' }, courtOrder: { label: 'Commandement de payer', help: 'Le document vient de l’office des poursuites.' }, inkasso: { label: 'Lettre de recouvrement', help: 'Le document vient d’une société de recouvrement.' }, reminder: { label: 'Rappel ou créance inconnue', help: 'Aucun office des poursuites n’est identifiable.' }, unclear: { label: 'Pas clair', help: 'Vous ne reconnaissez pas le document.' } } },
  family: { legend: 'Qu’est-ce qui demande d’abord votre attention ?', options: { danger: { label: 'Menace, violence ou enfant en danger', help: 'Une personne n’est peut-être pas en sécurité.' }, childrenNoSupport: { label: 'Enfants concernés, sans soutien', help: 'Vous êtes largement seul·e face à la situation.' }, housing: { label: 'Logement en changement urgent', help: 'Départ, séparation ou perte du logement approche.' }, transition: { label: 'Séparation, naissance, décès ou changement', help: 'Aucun danger immédiat connu.' }, unclear: { label: 'Pas clair', help: 'Vous ne savez pas quoi régler en premier.' } } },
};

function swissGermanRisks(value: Record<CategoryId, QuickRiskText>) {
  const pairs: Array<[string, string]> = [
    ['Was ist', 'Was isch'], ['Welche', 'Weli'], ['deinem', 'dim'], ['dein ', 'din '],
    ['Du kannst', 'Du chasch'], ['Du kommst', 'Du chunsch'], ['Du weißt', 'Du weisch'],
    ['Es gibt', 'Es git'], [' bereits ', ' scho '], [' nicht ', ' nöd '], [' erhalten', ' übercho'],
    [' wurde ', ' isch '], [' ist ', ' isch '], [' gerade ', ' grad '], [' unklar', ' unklar'],
  ];
  const rewrite = (item: unknown): unknown => {
    if (typeof item === 'string') return pairs.reduce((text, [from, to]) => text.split(from).join(to), item);
    if (Array.isArray(item)) return item.map(rewrite);
    if (typeof item === 'object' && item !== null) return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, rewrite(child)]));
    return item;
  };
  return rewrite(adaptTextForSwitzerland(value, 'gsw')) as Record<CategoryId, QuickRiskText>;
}

export function getSwissQuickHelpTexts(base: QuickHelpTexts, language: Language): QuickHelpTexts {
  if (language !== 'fr' && language !== 'gsw') return { ...adaptTextForSwitzerland(base, language), ...emergency[language] };
  const isFr = language === 'fr';
  return {
    ...base,
    ...emergency[language],
    actionEyebrow: isFr ? 'Les premières minutes comptent' : 'Die erschte Minute zähled',
    actionHeading: isFr ? 'Ce que vous pouvez faire maintenant' : 'Das chasch du jetzt mache',
    back: isFr ? 'Choisir une autre situation' : 'Anderi Situation wähle',
    callNow: isFr ? 'Appeler maintenant' : 'Jetzt aalüüte',
    changeAnswers: isFr ? 'Modifier les réponses' : 'Aagabe ändere',
    continueDetails: isFr ? 'Commencer le conseil détaillé' : 'Usführlichi Beratig starte',
    directContactEyebrow: isFr ? 'Services vérifiés' : 'Prüefti Aalaufstelle',
    directContactHeading: isFr ? 'Obtenir directement de l’aide' : 'Da bechunsch direkt Hilf',
    eyebrow: isFr ? 'Aide immédiate · environ 60 secondes' : 'Soforthilf · öppe 60 Sekunde',
    googleEyebrow: isFr ? 'Recherche locale externe' : 'Lokali externi Suechi',
    googleHeading: isFr ? 'Chercher une autre aide locale' : 'Witeri Hilf i de Nöchi sueche',
    googleNotice: isFr ? 'Les termes et le lieu ne sont transmis à Google que si vous ouvrez un lien. KlarKommen ne charge pas Google automatiquement.' : 'Erscht wenn du en Link öffnisch, werded Hilfsart und Ort a Google übermittelt. KlarKommen ladet Google nöd automatisch.',
    heading: isFr ? 'Qu’est-ce qui est important tout de suite ?' : 'Was isch jetzt grad wichtig?',
    intro: isFr ? 'Trois indications suffisent pour obtenir de premières étapes et des contacts directs. Choisissez « Pas clair » en cas de doute.' : 'Drei churzi Aagabe länged für erschte Schritt und direkti Kontakt. Wenn du unsicher bisch, wähl « Unklar ».',
    locationHelp: isFr ? 'Indiquez seulement le NPA ou la localité, sans rue ni nom.' : 'Gib nume PLZ oder Ort aa, kei Strass und kei Name.',
    locationLabel: isFr ? 'Quel NPA ou quelle localité est compétent ?' : 'Weli PLZ oder welä Ort isch zuständig?',
    newTab: isFr ? 's’ouvre dans un nouvel onglet' : 'öffnet i mene neue Tab',
    noLocation: isFr ? 'Continuer sans lieu' : 'Ohni Ort wiitermache',
    requiredError: isFr ? 'Indiquez un lieu ou continuez sans lieu, puis répondez aux deux évaluations.' : 'Gib en Ort aa oder mach ohni Ort wiiter und beantwort beidi Iischätzige.',
    resultEyebrow: isFr ? 'Résultat de l’aide immédiate' : 'Soforthilf-Ergebnis',
    resultHeading: isFr ? 'Ce que vous pouvez faire concrètement' : 'Das chasch du jetzt konkret mache',
    resultIntro: isFr ? 'Cette vérification est une première orientation prudente, pas une évaluation juridique ou médicale.' : 'Die Churzprüefig isch e vorsichtigi Erstiischätzig, kei rechtlichi oder medizinischi Beurteilig.',
    source: isFr ? 'Source' : 'Quälle', submit: isFr ? 'Afficher l’aide immédiate' : 'Soforthilf aazeige',
    timingLegend: isFr ? 'Qu’est-ce qui rend la situation urgente ?' : 'Was macht d Situation ziitlich dringend?',
    timingOptions: isFr ? {
      immediateNeeds: { label: 'Il manque aujourd’hui quelque chose d’essentiel', help: 'Par exemple nourriture, logement, énergie, soins ou médicaments.' },
      today: { label: 'Délai échu, aujourd’hui ou demain', help: 'Aussi si un rendez-vous ou une coupure est imminent.' },
      threeDays: { label: 'Délai dans deux ou trois jours', help: 'Il reste au maximum trois jours.' },
      week: { label: 'Délai dans quatre à sept jours', help: 'La situation doit être réglée ces prochains jours.' },
      later: { label: 'Plus tard ou aucun délai urgent', help: 'Aucune réaction nécessaire dans la semaine selon vous.' },
      unclear: { label: 'Pas clair', help: 'Vous ignorez s’il existe un délai ou un manque immédiat.' },
    } : {
      immediateNeeds: { label: 'Hüt fehlt öppis Läbesnotwendigs', help: 'Zum Biispil Esse, Wohnig, Energie, Behandlig oder Medikament.' },
      today: { label: 'Frist abgloffe, hüt oder morn', help: 'Au wenn en Termin oder e Abschaltig unmittelbar bevorstaht.' },
      threeDays: { label: 'Frist i zwei bis drei Täg', help: 'Es bliibed höchstens drei Täg zum Reagiere.' },
      week: { label: 'Frist i vier bis sibe Täg', help: 'D Sach sött i de nöchste Täg klärt werde.' },
      later: { label: 'Spöter oder kei akuti Frist', help: 'Us diner Sicht muesch nöd innert ere Wuche reagiere.' },
      unclear: { label: 'Unklar', help: 'Du weisch nöd, ob e Frist oder e unmittelbari Lücke bestaht.' },
    },
    verifiedOn: isFr ? 'dernière vérification selon la source' : 'zletscht anhand vo de Quälle prüeft',
    visitWebsite: isFr ? 'Ouvrir le site' : 'Websiite öffne',
    risks: isFr ? frRisks : swissGermanRisks(base.risks),
  };
}
