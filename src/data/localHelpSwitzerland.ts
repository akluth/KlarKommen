import type { Language } from '../i18n';
import type { Answers, Category, CategoryId } from '../types';
import { formatCurrencyForLanguage, formatDateForLanguage } from '../utils/formatters';
import type { HelpSearchLink } from './localHelp';

const queries: Record<CategoryId, string[]> = {
  rent: ['Schlichtungsbehörde Mietsachen', 'Mieterberatung Mietzinsrückstand', 'Sozialdienst Mietschulden', 'Schuldenberatung Schweiz'],
  energy: ['Energieberatung Stromabschaltung', 'Sozialdienst Energieschulden', 'ElCom Beratung', 'Schuldenberatung Schweiz'],
  jobcenter: ['RAV Anmeldung', 'Arbeitslosenkasse Beratung', 'Sozialdienst Sozialhilfe', 'Rechtsberatung Sozialversicherungsrecht'],
  health: ['Prämienverbilligung Kanton', 'Ombudsstelle Krankenversicherung', 'Krankenkasse Prämienausstände Beratung', 'Schuldenberatung Schweiz'],
  garnishment: ['Betreibungsamt Existenzminimum', 'Schuldenberatung Pfändung', 'Lohnpfändung Beratung', 'Kontopfändung Beratung Schweiz'],
  schufa: ['ZEK IKO Selbstauskunft', 'CRIF Selbstauskunft Schweiz', 'EDÖB Kreditdaten Berichtigung', 'Schuldenberatung Bonitätsdaten'],
  debtCourt: ['Schuldenberatung Zahlungsbefehl Rechtsvorschlag', 'Betreibungsamt Rechtsvorschlag', 'Inkasso Forderung prüfen Schweiz', 'Rechtsberatung SchKG'],
  family: ['Familienberatung', 'KESB Beratung', 'Opferhilfe Schweiz', 'Sozialberatung Familie'],
};

const categoryLabels: Record<Language, Record<CategoryId, string>> = {
  de: { rent: 'Hilfe bei Mietproblemen', energy: 'Hilfe bei Energieschulden', jobcenter: 'RAV, Arbeitslosenkasse oder Sozialhilfe', health: 'Hilfe bei Krankenkassenprämien', garnishment: 'Hilfe bei Betreibung und Pfändung', schufa: 'ZEK-, IKO- oder CRIF-Daten prüfen', debtCourt: 'Hilfe bei Zahlungsbefehl oder Inkasso', family: 'Familien- und Krisenberatung' },
  fr: { rent: 'Aide pour les problèmes de loyer', energy: 'Aide pour les dettes d’énergie', jobcenter: 'ORP, caisse de chômage ou aide sociale', health: 'Aide pour les primes maladie', garnishment: 'Aide en cas de poursuite et de saisie', schufa: 'Vérifier les données ZEK, IKO ou CRIF', debtCourt: 'Aide pour commandement de payer ou recouvrement', family: 'Conseil familial et aide en cas de crise' },
  gsw: { rent: 'Hilf bi Mietproblem', energy: 'Hilf bi Energieschulde', jobcenter: 'RAV, Arbeitslosechasse oder Sozialhilf', health: 'Hilf bi Krankekasseprämie', garnishment: 'Hilf bi Betriibig und Pfändig', schufa: 'ZEK-, IKO- oder CRIF-Date prüefe', debtCourt: 'Hilf bi Zahligsbefehl oder Inkasso', family: 'Familie- und Kriseberatig' },
  tr: { rent: 'Kira sorunlarında yardım', energy: 'Enerji borcunda yardım', jobcenter: 'RAV, işsizlik kasası veya sosyal yardım', health: 'Sağlık sigortası primlerinde yardım', garnishment: 'Takip ve hacizde yardım', schufa: 'ZEK, IKO veya CRIF verilerini kontrol etme', debtCourt: 'Ödeme emri veya tahsilatta yardım', family: 'Aile ve kriz danışması' },
  ar: { rent: 'مساعدة في مشاكل الإيجار', energy: 'مساعدة في ديون الطاقة', jobcenter: 'RAV أو صندوق البطالة أو المساعدة الاجتماعية', health: 'مساعدة في أقساط التأمين الصحي', garnishment: 'مساعدة في التحصيل والحجز', schufa: 'فحص بيانات ZEK أو IKO أو CRIF', debtCourt: 'مساعدة في أمر الدفع أو التحصيل', family: 'استشارة أسرية وأزمات' },
  uk: { rent: 'Допомога з проблемами оренди', energy: 'Допомога з боргами за енергію', jobcenter: 'RAV, каса безробіття або соціальна допомога', health: 'Допомога з внесками медичного страхування', garnishment: 'Допомога при стягненні й арешті', schufa: 'Перевірка даних ZEK, IKO або CRIF', debtCourt: 'Допомога з платіжним наказом або інкасо', family: 'Сімейна та кризова консультація' },
};

const scripts: Record<Language, { opening: string; amount: string; deadline: string; documents: string; request: string }> = {
  de: { opening: 'Guten Tag, mein Name ist [Name]. Ich brauche kurzfristig Beratung zu', amount: 'Es geht um', deadline: 'Die Frist läuft bis', documents: 'Ich habe die Schreiben und Unterlagen gesammelt und kann sie senden oder mitbringen.', request: 'Bin ich bei Ihnen richtig, und wann ist ein kurzfristiger Termin möglich?' },
  fr: { opening: 'Bonjour, je m’appelle [nom]. J’ai besoin rapidement d’un conseil concernant', amount: 'Le montant concerné est de', deadline: 'Le délai court jusqu’au', documents: 'J’ai réuni les courriers et les documents et peux les envoyer ou les apporter.', request: 'Suis-je à la bonne adresse et quand un rendez-vous rapide est-il possible ?' },
  gsw: { opening: 'Guete Tag, ich heisse [Name]. Ich bruuche kurzfristig Beratig wäge', amount: 'Es gaht um', deadline: 'D Frist lauft bis', documents: 'Ich ha d Schriibe und Unterlage gsammlet und cha sie schicke oder mitbringe.', request: 'Bin ich bi Ihne richtig, und wenn wär en kurzfristige Termin möglich?' },
  tr: { opening: 'Merhaba, benim adım [Ad]. Şu konuda kısa sürede danışmanlık istiyorum:', amount: 'Söz konusu tutar', deadline: 'Son tarih', documents: 'Yazıları ve belgeleri topladım; gönderebilir veya getirebilirim.', request: 'Doğru yere mi başvurdum ve kısa sürede ne zaman randevu olabilir?' },
  ar: { opening: 'مرحبا، اسمي [الاسم]. أحتاج إلى استشارة قريبة بخصوص', amount: 'المبلغ المعني هو', deadline: 'تنتهي المهلة في', documents: 'جمعت الخطابات والمستندات ويمكنني إرسالها أو إحضارها.', request: 'هل أنا في الجهة الصحيحة ومتى يمكن الحصول على موعد قريب؟' },
  uk: { opening: 'Добрий день, мене звати [ім’я]. Мені швидко потрібна консультація щодо', amount: 'Сума становить', deadline: 'Строк спливає', documents: 'Я зібрав/зібрала листи й документи та можу їх надіслати або принести.', request: 'Чи я звернувся/звернулася правильно і коли можливий найближчий прийом?' },
};

export function buildSwissHelpSearchLinks(categoryId: CategoryId, answers: Answers, language: Language): HelpSearchLink[] {
  const city = answers.city?.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 80);
  return queries[categoryId].map((query, index) => {
    const fullQuery = [query, city].filter(Boolean).join(' ');
    return { label: `${categoryLabels[language][categoryId]} ${index + 1}${city ? ` — ${city}` : ''}`, query: fullQuery, url: `https://www.google.com/search?q=${encodeURIComponent(fullQuery)}` };
  });
}

export function buildSwissPhoneScript(category: Category, answers: Answers, language: Language) {
  const text = scripts[language];
  const amount = answers.amount ? formatCurrencyForLanguage(answers.amount, language, 'CHF') : (language === 'fr' ? 'un montant encore à clarifier' : language === 'gsw' ? 'en no unklare Betrag' : 'einen noch zu klärenden Betrag');
  const deadline = answers.deadlineDate ? `${text.deadline} ${formatDateForLanguage(answers.deadlineDate, language)}.` : '';
  return [`${text.opening} ${category.title}.`, `${text.amount} ${amount}. ${deadline}`.trim(), text.documents, text.request].join('\n');
}

export function buildSwissContactChecklist(language: Language) {
  const shared: Record<Language, string[]> = {
    de: ['Passende Anlaufstelle öffnen.', 'Anrufen oder eine kurze Nachricht senden.', 'Termin, Namen und Uhrzeit notieren.', 'Beratungspaket kopieren oder als PDF sichern.', 'Unterlagen bereitlegen.'],
    fr: ['Ouvrir le service approprié.', 'Téléphoner ou envoyer un bref message.', 'Noter le rendez-vous, le nom et l’heure.', 'Copier le dossier ou l’enregistrer en PDF.', 'Préparer les documents.'],
    gsw: ['Passendi Aalaufstell öffne.', 'Aalüüte oder e churzi Nachricht schicke.', 'Termin, Name und Ziit notiere.', 'Beratigspaket kopiere oder als PDF sichere.', 'Unterlage bereitmache.'],
    tr: ['Uygun başvuru yerini aç.', 'Ara veya kısa mesaj gönder.', 'Randevu, ad ve saati not et.', 'Danışma paketini kopyala veya PDF kaydet.', 'Belgeleri hazırla.'],
    ar: ['افتح جهة المساعدة المناسبة.', 'اتصل أو أرسل رسالة قصيرة.', 'دوّن الموعد والاسم والوقت.', 'انسخ حزمة الاستشارة أو احفظها PDF.', 'جهّز المستندات.'],
    uk: ['Відкрити відповідну установу.', 'Зателефонувати або надіслати коротке повідомлення.', 'Записати прийом, ім’я та час.', 'Скопіювати пакет або зберегти PDF.', 'Підготувати документи.'],
  };
  return shared[language];
}
