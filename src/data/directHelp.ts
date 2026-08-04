import { isBaseLanguage, type BaseLanguage, type Language } from '../i18n';
import type { Answers, CategoryId, Country } from '../types';
import { buildAustrianDirectHelpContacts } from './directHelpAustria';
import { buildSwissDirectHelpContacts } from './directHelpSwitzerland';

export interface DirectHelpContact {
  availability: string;
  description: string;
  id: string;
  lastVerifiedAt: string;
  limitation: string;
  name: string;
  phoneDisplay?: string;
  phoneHref?: string;
  sourceUrl: string;
  websiteUrl: string;
}

interface ContactCore {
  lastVerifiedAt: string;
  phoneDisplay?: string;
  phoneHref?: string;
  sourceUrl: string;
  websiteUrl: string;
}

interface ContactCopy {
  availability: string;
  description: string;
  limitation: string;
  name: string;
}

const verifiedAt = '2026-07-13';

const core = {
  publicService115: {
    phoneDisplay: '115',
    phoneHref: 'tel:115',
    websiteUrl: 'https://www.115.de/',
    sourceUrl: 'https://www.115.de/',
    lastVerifiedAt: verifiedAt,
  },
  socialPlatform: {
    websiteUrl: 'https://sozialplattform.de/inhalt/beratungsstellenfinder',
    sourceUrl: 'https://sozialplattform.de/informationsseite-fuer-beratungsstellen',
    lastVerifiedAt: verifiedAt,
  },
  debtHelpline: {
    phoneDisplay: '0800 503 58 51',
    phoneHref: 'tel:08005035851',
    websiteUrl: 'https://www.schuldenhelpline.de/',
    sourceUrl: 'https://www.schuldenhelpline.de/unser-service/seiten/telefonberatung/',
    lastVerifiedAt: verifiedAt,
  },
  energyAgency: {
    phoneDisplay: '0228 14 15 16',
    phoneHref: 'tel:+49228141516',
    websiteUrl: 'https://www.bundesnetzagentur.de/DE/Vportal/AnfragenBeschwerden/Beschwerde_Energie/artikel.html',
    sourceUrl: 'https://www.bundesnetzagentur.de/DE/Vportal/AnfragenBeschwerden/Beschwerde_Energie/artikel.html',
    lastVerifiedAt: verifiedAt,
  },
  consumerAdvice: {
    websiteUrl: 'https://www.verbraucherzentrale.de/beratung',
    sourceUrl: 'https://www.verbraucherzentrale.de/beratung',
    lastVerifiedAt: verifiedAt,
  },
  jobcenterFinder: {
    phoneDisplay: '0800 4 5555 00',
    phoneHref: 'tel:08004555500',
    websiteUrl: 'https://web.arbeitsagentur.de/portal/metasuche/suche/dienststellen?in=jobcenter',
    sourceUrl: 'https://www.arbeitsagentur.de/service-bereich/so-erreichen-sie-uns',
    lastVerifiedAt: verifiedAt,
  },
  bmasPhone: {
    phoneDisplay: '030 221 911 003',
    phoneHref: 'tel:+4930221911003',
    websiteUrl: 'https://www.bmas.de/DE/Service/Kontakt/Buergertelefon/buergertelefon.html',
    sourceUrl: 'https://www.bmas.de/DE/Service/Kontakt/Buergertelefon/buergertelefon.html',
    lastVerifiedAt: verifiedAt,
  },
  patientAdvice: {
    phoneDisplay: '0800 011 77 22',
    phoneHref: 'tel:08000117722',
    websiteUrl: 'https://patientenberatung.de/',
    sourceUrl: 'https://patientenberatung.de/',
    lastVerifiedAt: verifiedAt,
  },
  healthMinistryPhone: {
    phoneDisplay: '030 340 60 66-01',
    phoneHref: 'tel:+4930340606601',
    websiteUrl: 'https://www.bundesgesundheitsministerium.de/service/buergertelefon',
    sourceUrl: 'https://www.bundesgesundheitsministerium.de/service/buergertelefon',
    lastVerifiedAt: verifiedAt,
  },
  pAccountJustice: {
    websiteUrl: 'https://service.justiz.de/kontopfaendung/pkonto/antrag/start',
    sourceUrl: 'https://service.justiz.de/kontopfaendung/pkonto',
    lastVerifiedAt: verifiedAt,
  },
  debtDirectory: {
    websiteUrl: 'https://www.meine-schulden.de/hilfe-finden/stellensuche',
    sourceUrl: 'https://www.meine-schulden.de/kontakt',
    lastVerifiedAt: verifiedAt,
  },
  bafinPhone: {
    phoneDisplay: '0800 2 100 500',
    phoneHref: 'tel:08002100500',
    websiteUrl: 'https://www.bafin.de/DE/Verbraucher/BeschwerdenStreitschlichtung/BeiBaFinbeschweren/BeiBaFinbeschweren_node.html',
    sourceUrl: 'https://www.bafin.de/DE/Verbraucher/BeschwerdenStreitschlichtung/BeiBaFinbeschweren/BeiBaFinbeschweren_node.html',
    lastVerifiedAt: verifiedAt,
  },
  schufaCopy: {
    phoneDisplay: '+49 611 92780',
    phoneHref: 'tel:+4961192780',
    websiteUrl: 'https://www.meineschufa.de/dakobs/',
    sourceUrl: 'https://astro.pro-pkp.aws.schufa.de/service/datenkopie',
    lastVerifiedAt: verifiedAt,
  },
  dataProtectionHesse: {
    phoneDisplay: '0611 1408-0',
    phoneHref: 'tel:+4961114080',
    websiteUrl: 'https://datenschutz.hessen.de/service/beschwerde-uebermitteln',
    sourceUrl: 'https://datenschutz.hessen.de/',
    lastVerifiedAt: verifiedAt,
  },
  inkassoCheck: {
    websiteUrl: 'https://www.verbraucherzentrale.de/inkasso-check-start',
    sourceUrl: 'https://www.verbraucherzentrale.de/inkasso-check-start',
    lastVerifiedAt: verifiedAt,
  },
  dunningCourts: {
    websiteUrl: 'https://www.mahngerichte.de/verfahrensueberblick/verfahrensablauf/widerspruch/',
    sourceUrl: 'https://www.mahngerichte.de/verfahrensueberblick/verfahrensablauf/widerspruch/',
    lastVerifiedAt: verifiedAt,
  },
  telephoneCounselling: {
    phoneDisplay: '116 123',
    phoneHref: 'tel:116123',
    websiteUrl: 'https://www.telefonseelsorge.de/',
    sourceUrl: 'https://www.telefonseelsorge.de/',
    lastVerifiedAt: verifiedAt,
  },
  familyDirectory: {
    websiteUrl: 'https://www.dajeb.de/beratungsfuehrer-online/beratung-in-ihrer-naehe',
    sourceUrl: 'https://www.dajeb.de/beratungsfuehrer-online/fuer-beratungsstellen/',
    lastVerifiedAt: verifiedAt,
  },
  parentPhone: {
    phoneDisplay: '0800 111 0 550',
    phoneHref: 'tel:08001110550',
    websiteUrl: 'https://www.nummergegenkummer.de/elternberatung/',
    sourceUrl: 'https://www.nummergegenkummer.de/elternberatung/',
    lastVerifiedAt: verifiedAt,
  },
} satisfies Record<string, ContactCore>;

type ContactId = keyof typeof core;

const de = {
  publicService115: { name: 'Behördennummer 115', description: 'Findet die zuständige lokale Behörde, etwa Sozialamt, Wohnraumsicherung oder Jobcenter.', availability: 'Montag bis Freitag, 8–18 Uhr; normale Telefonkosten.', limitation: 'Allgemeine Behördenauskunft, keine Rechtsberatung und keine Fristwahrung.' },
  socialPlatform: { name: 'Sozialplattform – Beratungsstellenfinder', description: 'Findet kostenfreie Schuldnerberatung und Wohnungsnotfallhilfe nach Ort oder PLZ.', availability: 'Online jederzeit nutzbar.', limitation: 'Der Datenbestand ist noch nicht vollständig; kein Treffer bedeutet nicht, dass es keine Hilfe gibt.' },
  debtHelpline: { name: 'Schuldenhelpline', description: 'Bundesweite vertrauliche Ersthilfe bei Schulden, Pfändung und Inkasso.', availability: 'Mittwoch und Freitag 10–13 Uhr, Donnerstag 15–18 Uhr; kostenlos.', limitation: 'Erstorientierung, keine Garantie für laufende Vertretung oder Hilfe bei einer Frist am selben Tag.' },
  energyAgency: { name: 'Bundesnetzagentur – Verbraucherservice Energie', description: 'Erklärt Rechte, Pflichten und Beschwerdewege bei Strom und Gas.', availability: 'Montag bis Freitag, 8–20 Uhr; normale Telefonkosten.', limitation: 'Stoppt keine Sperre und übernimmt keine Schulden.' },
  consumerAdvice: { name: 'Verbraucherzentrale – Beratung vor Ort', description: 'Unabhängige Beratung zu Energie, Bank, Schufa, Inkasso und Versicherungen.', availability: 'Angebot, Termine und Kosten unterscheiden sich je Bundesland.', limitation: 'Nicht jede Beratung ist kostenlos; Bedingungen vor der Buchung prüfen.' },
  jobcenterFinder: { name: 'Bundesagentur für Arbeit – Jobcenter-Finder', description: 'Findet das zuständige Jobcenter und führt zu den Online-Diensten für Grundsicherungsgeld.', availability: 'Telefon Montag–Donnerstag 8–18 Uhr, Freitag 8–14 Uhr; kostenlos.', limitation: 'Kommunale Jobcenter können eigene Kontaktdaten haben; ein Anruf ersetzt keinen Widerspruch.' },
  bmasPhone: { name: 'BMAS-Bürgertelefon Grundsicherung', description: 'Beantwortet allgemeine Fragen zur Grundsicherung für Arbeitsuchende.', availability: 'Montag–Donnerstag 8–17 Uhr, Freitag 8–12 Uhr; normale Telefonkosten.', limitation: 'Prüft oder ändert keinen konkreten Jobcenter-Bescheid.' },
  patientAdvice: { name: 'Unabhängige Patientenberatung Deutschland', description: 'Unabhängige Beratung zu Krankenversicherung und Patientenrechten.', availability: 'Kostenlos; aktuelle Telefonzeiten stehen auf der Anbieterwebsite.', limitation: 'Trifft keine Entscheidung der Krankenkasse und reguliert keine Schulden.' },
  healthMinistryPhone: { name: 'BMG-Bürgertelefon Krankenversicherung', description: 'Allgemeine Information zu gesetzlicher und privater Krankenversicherung.', availability: 'Montag–Mittwoch 8–16 Uhr, Donnerstag 8–18 Uhr, Freitag 8–12 Uhr.', limitation: 'Das Ministerium bewertet oder entscheidet keinen konkreten Einzelfall.' },
  pAccountJustice: { name: 'Justiz-Services – P-Konto-Antrag', description: 'Offizieller kostenloser Assistent für das Schreiben zur P-Konto-Umwandlung.', availability: 'Online jederzeit; Eingaben werden spätestens nach 24 Stunden gelöscht.', limitation: 'Kein Ersatz für Beratung. Bei Pfändung die Bank sofort kontaktieren und nicht auf einen Termin warten.' },
  debtDirectory: { name: 'Meine Schulden – Beratungsstellensuche', description: 'Findet anerkannte Schuldner- und Insolvenzberatung sowie Stellen für P-Konto-Bescheinigungen.', availability: 'Online jederzeit; Kosten und Zuständigkeit stehen beim jeweiligen Treffer.', limitation: 'Der Fachverband berät nicht selbst; Filter „kostenfrei“ und regionale Zuständigkeit prüfen.' },
  bafinPhone: { name: 'BaFin-Verbrauchertelefon', description: 'Allgemeine Orientierung bei Problemen mit Banken, etwa einer verweigerten P-Konto-Umwandlung.', availability: 'Montag bis Freitag, 8–18 Uhr; kostenlos.', limitation: 'Löst keinen Individualstreit und verschafft keinen Kredit oder Kontozugriff.' },
  schufaCopy: { name: 'SCHUFA – kostenlose Datenkopie', description: 'Zeigt die gespeicherten Daten und ermöglicht anschließend eine gezielte Korrektur.', availability: 'Online bestellbar; Telefon Montag bis Freitag, 8–19 Uhr.', limitation: 'SCHUFA ist das verantwortliche Unternehmen, keine unabhängige Beratung. Die Datenkopie enthält sensible Daten und ist nicht für Vermieter bestimmt.' },
  dataProtectionHesse: { name: 'Hessischer Datenschutzbeauftragter', description: 'Zuständige Datenschutzaufsicht für Beschwerden über SCHUFA, wenn eine Korrektur verweigert wird.', availability: 'Beschwerdeformular online jederzeit; kostenlos.', limitation: 'Zuerst SCHUFA und meldendes Unternehmen zur Korrektur auffordern; Bearbeitung kann dauern.' },
  inkassoCheck: { name: 'Verbraucherzentrale – Inkasso-Check', description: 'Prüft Forderung und Inkassokosten kostenlos und erstellt eine passende erste Antwort.', availability: 'Online jederzeit; kostenlos.', limitation: 'Nur Ersteinschätzung. Ein Brief an Inkasso stoppt kein Gerichtsverfahren.' },
  dunningCourts: { name: 'Mahngerichte.de – Widerspruch', description: 'Offizielle Justizinformation zum gerichtlichen Mahnbescheid und zum Widerspruch.', availability: 'Online jederzeit; zuständiges Gericht steht auf dem Bescheid.', limitation: 'Bei Zustellung laufen regelmäßig kurze gerichtliche Fristen. Sofort prüfen, nicht auf eine Antwort des Inkassos warten.' },
  telephoneCounselling: { name: 'TelefonSeelsorge', description: 'Anonymes Gespräch bei Überforderung, Verlust, Einsamkeit oder Krise.', availability: 'Tag und Nacht; kostenlos und anonym.', limitation: 'Bei unmittelbarer Selbst- oder Fremdgefährdung 112 oder 110 rufen.' },
  familyDirectory: { name: 'DAJEB – Beratung in Ihrer Nähe', description: 'Findet kostenfreie Familien-, Lebens-, Trennungs- und Krisenberatung nach PLZ.', availability: 'Online jederzeit; Kontaktdaten und Zeiten stehen beim Treffer.', limitation: 'Keine zentrale Akutberatung; örtlich können Wartezeiten bestehen.' },
  parentPhone: { name: 'Nummer gegen Kummer – Elterntelefon', description: 'Anonyme Beratung für Eltern und Erziehende bei Sorgen, Überforderung und Familienkrisen.', availability: 'Montag/Mittwoch/Freitag 9–17 Uhr, Dienstag/Donnerstag 9–19 Uhr; kostenlos.', limitation: 'Für Eltern und Erziehende; kein Ersatz für Polizei, Rettungsdienst oder Rechtsberatung.' },
} satisfies Record<ContactId, ContactCopy>;

const tr: Record<ContactId, ContactCopy> = Object.fromEntries(
  Object.entries(de).map(([id, item]) => [id, { ...item }]),
) as Record<ContactId, ContactCopy>;
Object.assign(tr, {
  publicService115: { name: '115 Resmî Kurum Hattı', description: 'Sozialamt, konut koruma veya Jobcenter gibi yerel yetkili kurumu bulur.', availability: 'Pazartesi–Cuma 8–18; normal telefon ücreti.', limitation: 'Genel bilgi verir; hukuk danışması değildir ve süreyi durdurmaz.' },
  socialPlatform: { name: 'Sozialplattform – danışma yeri arama', description: 'Şehir veya posta koduna göre ücretsiz borç ve konut acil danışmasını bulur.', availability: 'Her zaman çevrimiçi.', limitation: 'Liste henüz eksiksiz değildir; sonuç olmaması yardım olmadığı anlamına gelmez.' },
  debtHelpline: { name: 'Schuldenhelpline', description: 'Borç, haciz ve Inkasso için Almanya genelinde gizli ilk yardım.', availability: 'Çarşamba/Cuma 10–13, Perşembe 15–18; ücretsiz.', limitation: 'İlk yönlendirmedir; sürekli temsil veya aynı gün süresi için garanti vermez.' },
  energyAgency: { name: 'Bundesnetzagentur – Enerji Tüketici Hizmeti', description: 'Elektrik ve gazda hakları, yükümlülükleri ve şikâyet yollarını açıklar.', availability: 'Pazartesi–Cuma 8–20; normal telefon ücreti.', limitation: 'Kesintiyi durdurmaz ve borcu ödemez.' },
  consumerAdvice: { name: 'Verbraucherzentrale – yerel danışma', description: 'Enerji, banka, Schufa, Inkasso ve sigorta için bağımsız danışma.', availability: 'Teklif, randevu ve ücret eyalete göre değişir.', limitation: 'Her danışma ücretsiz değildir; önce koşulları kontrol et.' },
  jobcenterFinder: { name: 'Bundesagentur für Arbeit – Jobcenter arama', description: 'Yetkili Jobcenter’ı ve Grundsicherungsgeld çevrimiçi hizmetlerini bulur.', availability: 'Pzt–Per 8–18, Cuma 8–14; ücretsiz.', limitation: 'Belediye Jobcenter’larının farklı iletişim bilgileri olabilir; arama itiraz yerine geçmez.' },
  bmasPhone: { name: 'BMAS Grundsicherung bilgi hattı', description: 'İş arayanlar için temel güvence hakkında genel soruları yanıtlar.', availability: 'Pzt–Per 8–17, Cuma 8–12; normal telefon ücreti.', limitation: 'Somut Jobcenter kararını incelemez veya değiştirmez.' },
  patientAdvice: { name: 'Bağımsız Hasta Danışması Almanya', description: 'Sağlık sigortası ve hasta hakları konusunda bağımsız danışma.', availability: 'Ücretsiz; güncel saatler sağlayıcı sitesinde.', limitation: 'Sigorta adına karar vermez ve borç düzenlemez.' },
  healthMinistryPhone: { name: 'BMG Sağlık Sigortası Bilgi Hattı', description: 'Yasal ve özel sağlık sigortası hakkında genel bilgi.', availability: 'Pzt–Çar 8–16, Per 8–18, Cuma 8–12.', limitation: 'Bakanlık somut vakayı değerlendirmez veya karara bağlamaz.' },
  pAccountJustice: { name: 'Justiz-Services – P-Konto başvurusu', description: 'P-Konto dönüşüm yazısı için resmî ücretsiz araç.', availability: 'Her zaman çevrimiçi; veriler en geç 24 saatte silinir.', limitation: 'Danışma yerine geçmez. Hacizde bankayı hemen ara; randevuyu bekleme.' },
  debtDirectory: { name: 'Meine Schulden – danışma yeri arama', description: 'Tanınmış borç danışmasını ve P-Konto belgesi veren yerleri bulur.', availability: 'Her zaman çevrimiçi; ücret ve yetki her kayıtta.', limitation: 'Dernek kendisi danışmaz; “kostenfrei” filtresini ve bölgesel yetkiyi kontrol et.' },
  bafinPhone: { name: 'BaFin Tüketici Hattı', description: 'Bankalarla, örneğin reddedilen P-Konto dönüşümüyle ilgili genel yönlendirme.', availability: 'Pazartesi–Cuma 8–18; ücretsiz.', limitation: 'Bireysel uyuşmazlığı çözmez, kredi veya para erişimi sağlamaz.' },
  schufaCopy: { name: 'SCHUFA – ücretsiz veri kopyası', description: 'Kayıtlı verileri gösterir ve yanlışların hedefli düzeltilmesini sağlar.', availability: 'Çevrimiçi; telefon Pzt–Cuma 8–19.', limitation: 'SCHUFA bağımsız danışma değildir. Kopya hassas veri içerir ve ev sahibine verilmemelidir.' },
  dataProtectionHesse: { name: 'Hessen Veri Koruma Kurumu', description: 'SCHUFA düzeltmeyi reddederse veri koruma şikâyetini alır.', availability: 'Çevrimiçi form her zaman; ücretsiz.', limitation: 'Önce SCHUFA ve bildiren şirketten düzeltme iste; işlem sürebilir.' },
  inkassoCheck: { name: 'Verbraucherzentrale – Inkasso-Check', description: 'Talebi ve tahsilat masraflarını ücretsiz kontrol eder, ilk yanıt oluşturur.', availability: 'Her zaman çevrimiçi; ücretsiz.', limitation: 'Yalnız ilk değerlendirme; Inkasso’ya mektup mahkeme sürecini durdurmaz.' },
  dunningCourts: { name: 'Mahngerichte.de – itiraz', description: 'Mahkeme ödeme emri ve itiraz hakkında resmî adalet bilgisi.', availability: 'Her zaman çevrimiçi; yetkili mahkeme kararda yazılıdır.', limitation: 'Teslimden sonra kısa mahkeme süreleri işler; hemen kontrol et.' },
  telephoneCounselling: { name: 'TelefonSeelsorge', description: 'Bunalmışlık, kayıp, yalnızlık veya krizde anonim görüşme.', availability: 'Gece gündüz; ücretsiz ve anonim.', limitation: 'Doğrudan kendine veya başkasına zarar tehlikesinde 112 ya da 110.' },
  familyDirectory: { name: 'DAJEB – yakınında danışma', description: 'Posta koduna göre ücretsiz aile, yaşam, ayrılık ve kriz danışmasını bulur.', availability: 'Her zaman çevrimiçi; bilgiler sonuçta.', limitation: 'Merkezi acil danışma değildir; yerel bekleme olabilir.' },
  parentPhone: { name: 'Nummer gegen Kummer – Ebeveyn Hattı', description: 'Ebeveyn ve bakım verenler için endişe, bunalmışlık ve aile krizinde anonim danışma.', availability: 'Pzt/Çar/Cuma 9–17, Salı/Per 9–19; ücretsiz.', limitation: 'Ebeveyn ve bakım verenler içindir; polis, acil servis veya hukuk danışması değildir.' },
});

const uk: Record<ContactId, ContactCopy> = Object.fromEntries(
  Object.entries(de).map(([id, item]) => [id, { ...item }]),
) as Record<ContactId, ContactCopy>;
Object.assign(uk, {
  publicService115: { name: 'Єдина служба органів влади 115', description: 'Допомагає знайти місцевий Sozialamt, житлову службу або Jobcenter.', availability: 'Пн–Пт 8–18; звичайна вартість дзвінка.', limitation: 'Загальна інформація, не юридична консультація й не зупинення строку.' },
  socialPlatform: { name: 'Sozialplattform – пошук консультацій', description: 'Шукає безкоштовну боргову та житлову екстрену допомогу за містом чи індексом.', availability: 'Онлайн цілодобово.', limitation: 'База ще неповна; відсутність результату не означає відсутність допомоги.' },
  debtHelpline: { name: 'Schuldenhelpline', description: 'Конфіденційна первинна допомога з боргами, арештом та Inkasso по всій Німеччині.', availability: 'Ср/Пт 10–13, Чт 15–18; безкоштовно.', limitation: 'Первинна орієнтація, без гарантії постійного представництва чи допомоги того ж дня.' },
  energyAgency: { name: 'Bundesnetzagentur – служба споживачів енергії', description: 'Пояснює права, обов’язки й скарги щодо електрики та газу.', availability: 'Пн–Пт 8–20; звичайна вартість дзвінка.', limitation: 'Не зупиняє відключення й не сплачує борг.' },
  consumerAdvice: { name: 'Verbraucherzentrale – місцева консультація', description: 'Незалежна консультація щодо енергії, банків, Schufa, Inkasso та страхування.', availability: 'Послуги, час і ціна залежать від землі.', limitation: 'Не всі консультації безкоштовні; перевірте умови.' },
  jobcenterFinder: { name: 'Bundesagentur für Arbeit – пошук Jobcenter', description: 'Знаходить відповідний Jobcenter і онлайн-послуги Grundsicherungsgeld.', availability: 'Пн–Чт 8–18, Пт 8–14; безкоштовно.', limitation: 'Муніципальний Jobcenter може мати інші контакти; дзвінок не замінює заперечення.' },
  bmasPhone: { name: 'Інфолінія BMAS щодо Grundsicherung', description: 'Відповідає на загальні питання про базове забезпечення шукачів роботи.', availability: 'Пн–Чт 8–17, Пт 8–12; звичайна вартість дзвінка.', limitation: 'Не перевіряє й не змінює конкретне рішення Jobcenter.' },
  patientAdvice: { name: 'Незалежна консультація пацієнтів Німеччини', description: 'Незалежна допомога щодо медичного страхування і прав пацієнтів.', availability: 'Безкоштовно; актуальний час на сайті.', limitation: 'Не приймає рішення каси й не врегульовує борги.' },
  healthMinistryPhone: { name: 'Інфолінія BMG з медичного страхування', description: 'Загальна інформація про державне і приватне страхування.', availability: 'Пн–Ср 8–16, Чт 8–18, Пт 8–12.', limitation: 'Міністерство не оцінює й не вирішує конкретну справу.' },
  pAccountJustice: { name: 'Justiz-Services – заява на P-Konto', description: 'Офіційний безкоштовний помічник для листа про перетворення на P-Konto.', availability: 'Онлайн цілодобово; дані видаляються максимум за 24 години.', limitation: 'Не замінює консультацію. За арешту негайно зверніться до банку.' },
  debtDirectory: { name: 'Meine Schulden – пошук консультацій', description: 'Знаходить визнану боргову допомогу та установи для довідки P-Konto.', availability: 'Онлайн цілодобово; ціна й компетенція у кожному результаті.', limitation: 'Об’єднання саме не консультує; перевірте фільтр “kostenfrei” і регіон.' },
  bafinPhone: { name: 'Споживча лінія BaFin', description: 'Загальна орієнтація щодо проблем із банком, наприклад відмови у P-Konto.', availability: 'Пн–Пт 8–18; безкоштовно.', limitation: 'Не вирішує індивідуальний спір і не надає кредит чи доступ до коштів.' },
  schufaCopy: { name: 'SCHUFA – безкоштовна копія даних', description: 'Показує збережені дані, щоб цілеспрямовано виправити помилки.', availability: 'Онлайн; телефон Пн–Пт 8–19.', limitation: 'SCHUFA не є незалежною консультацією. Копія містить чутливі дані й не призначена для орендодавця.' },
  dataProtectionHesse: { name: 'Уповноважений із захисту даних Гессену', description: 'Приймає скаргу на SCHUFA, якщо виправлення відхилено.', availability: 'Онлайн-форма цілодобово; безкоштовно.', limitation: 'Спершу вимагайте виправлення у SCHUFA та компанії; розгляд може тривати.' },
  inkassoCheck: { name: 'Verbraucherzentrale – Inkasso-Check', description: 'Безкоштовно перевіряє вимогу й витрати та формує першу відповідь.', availability: 'Онлайн цілодобово; безкоштовно.', limitation: 'Лише первинна оцінка; лист до Inkasso не зупиняє судовий процес.' },
  dunningCourts: { name: 'Mahngerichte.de – заперечення', description: 'Офіційна судова інформація про Mahnbescheid і заперечення.', availability: 'Онлайн цілодобово; відповідний суд вказано в документі.', limitation: 'Після вручення діють короткі судові строки; перевірте негайно.' },
  telephoneCounselling: { name: 'TelefonSeelsorge', description: 'Анонімна розмова при перевантаженні, втраті, самотності або кризі.', availability: 'Цілодобово; безкоштовно й анонімно.', limitation: 'За безпосередньої небезпеки собі чи іншим телефонуйте 112 або 110.' },
  familyDirectory: { name: 'DAJEB – консультація поруч', description: 'Шукає безкоштовну сімейну, життєву, розлучну й кризову допомогу за індексом.', availability: 'Онлайн цілодобово; контакти в результаті.', limitation: 'Не центральна екстрена служба; місцево можливе очікування.' },
  parentPhone: { name: 'Nummer gegen Kummer – телефон для батьків', description: 'Анонімна допомога батькам і опікунам при тривогах, перевантаженні й сімейній кризі.', availability: 'Пн/Ср/Пт 9–17, Вт/Чт 9–19; безкоштовно.', limitation: 'Для батьків і опікунів; не заміна поліції, швидкої чи юриста.' },
});

const ar: Record<ContactId, ContactCopy> = Object.fromEntries(
  Object.entries(de).map(([id, item]) => [id, { ...item }]),
) as Record<ContactId, ContactCopy>;
Object.assign(ar, {
  publicService115: { name: 'رقم الجهات الحكومية 115', description: 'يساعد في إيجاد Sozialamt أو خدمة حماية السكن أو Jobcenter المختص محليا.', availability: 'الاثنين–الجمعة 8–18؛ تكلفة الاتصال العادية.', limitation: 'معلومات عامة وليست استشارة قانونية ولا توقف المهلة.' },
  socialPlatform: { name: 'Sozialplattform – البحث عن استشارة', description: 'يجد استشارة ديون ومساعدة طوارئ سكنية مجانية حسب المدينة أو الرمز البريدي.', availability: 'متاح عبر الإنترنت دائما.', limitation: 'البيانات ليست كاملة بعد؛ عدم وجود نتيجة لا يعني عدم وجود مساعدة.' },
  debtHelpline: { name: 'Schuldenhelpline', description: 'مساعدة أولى سرية في الديون والحجز وInkasso في كل ألمانيا.', availability: 'الأربعاء/الجمعة 10–13، الخميس 15–18؛ مجانا.', limitation: 'توجيه أولي بلا ضمان تمثيل مستمر أو مساعدة لمهلة في اليوم نفسه.' },
  energyAgency: { name: 'Bundesnetzagentur – خدمة مستهلكي الطاقة', description: 'تشرح الحقوق والواجبات ومسارات الشكاوى في الكهرباء والغاز.', availability: 'الاثنين–الجمعة 8–20؛ تكلفة الاتصال العادية.', limitation: 'لا توقف القطع ولا تتحمل الدين.' },
  consumerAdvice: { name: 'Verbraucherzentrale – استشارة محلية', description: 'استشارة مستقلة في الطاقة والبنوك وSchufa وInkasso والتأمين.', availability: 'العرض والمواعيد والتكلفة تختلف حسب الولاية.', limitation: 'ليست كل الاستشارات مجانية؛ تحقق من الشروط.' },
  jobcenterFinder: { name: 'Bundesagentur für Arbeit – البحث عن Jobcenter', description: 'يجد Jobcenter المختص وخدمات Grundsicherungsgeld الإلكترونية.', availability: 'الاثنين–الخميس 8–18، الجمعة 8–14؛ مجانا.', limitation: 'قد يكون لـJobcenter البلدي اتصال مختلف؛ المكالمة لا تعوض الاعتراض.' },
  bmasPhone: { name: 'هاتف BMAS لمعلومات Grundsicherung', description: 'يجيب عن الأسئلة العامة حول الدعم الأساسي للباحثين عن عمل.', availability: 'الاثنين–الخميس 8–17، الجمعة 8–12؛ تكلفة عادية.', limitation: 'لا يفحص أو يغير قرار Jobcenter محددا.' },
  patientAdvice: { name: 'الاستشارة المستقلة للمرضى في ألمانيا', description: 'استشارة مستقلة حول التأمين الصحي وحقوق المرضى.', availability: 'مجانا؛ الأوقات الحالية على موقع الجهة.', limitation: 'لا تتخذ قرار شركة التأمين ولا تنظم الديون.' },
  healthMinistryPhone: { name: 'هاتف BMG للتأمين الصحي', description: 'معلومات عامة عن التأمين الصحي القانوني والخاص.', availability: 'الاثنين–الأربعاء 8–16، الخميس 8–18، الجمعة 8–12.', limitation: 'الوزارة لا تقيّم أو تقرر الحالة الفردية.' },
  pAccountJustice: { name: 'Justiz-Services – طلب P-Konto', description: 'مساعد رسمي مجاني لكتابة طلب تحويل الحساب إلى P-Konto.', availability: 'متاح دائما؛ تحذف البيانات خلال 24 ساعة كحد أقصى.', limitation: 'لا يعوض الاستشارة. عند الحجز اتصل بالبنك فورا ولا تنتظر موعدا.' },
  debtDirectory: { name: 'Meine Schulden – البحث عن استشارة', description: 'يجد استشارة ديون معترف بها وجهات إصدار شهادة P-Konto.', availability: 'متاح دائما؛ التكلفة والاختصاص في كل نتيجة.', limitation: 'الاتحاد لا يستشير بنفسه؛ افحص مرشح “kostenfrei” والاختصاص المحلي.' },
  bafinPhone: { name: 'هاتف مستهلكي BaFin', description: 'توجيه عام في مشاكل البنوك مثل رفض التحويل إلى P-Konto.', availability: 'الاثنين–الجمعة 8–18؛ مجانا.', limitation: 'لا يحل نزاعا فرديا ولا يوفر قرضا أو وصولا للمال.' },
  schufaCopy: { name: 'SCHUFA – نسخة البيانات المجانية', description: 'تعرض البيانات المخزنة لتصحيح الأخطاء بصورة محددة.', availability: 'عبر الإنترنت؛ الهاتف الاثنين–الجمعة 8–19.', limitation: 'SCHUFA ليست استشارة مستقلة. النسخة حساسة وليست لتسليمها للمالك.' },
  dataProtectionHesse: { name: 'مفوض حماية البيانات في هيسن', description: 'يستقبل شكوى عن SCHUFA إذا رُفض التصحيح.', availability: 'النموذج متاح دائما؛ مجانا.', limitation: 'اطلب التصحيح أولا من SCHUFA والشركة المبلغة؛ قد تستغرق المعالجة وقتا.' },
  inkassoCheck: { name: 'Verbraucherzentrale – Inkasso-Check', description: 'يفحص المطالبة وتكاليف التحصيل مجانا وينشئ ردا أوليا.', availability: 'متاح دائما؛ مجانا.', limitation: 'تقييم أولي فقط؛ الرسالة إلى Inkasso لا توقف إجراء المحكمة.' },
  dunningCourts: { name: 'Mahngerichte.de – الاعتراض', description: 'معلومات قضائية رسمية عن Mahnbescheid والاعتراض.', availability: 'متاح دائما؛ المحكمة المختصة مذكورة في القرار.', limitation: 'بعد الاستلام تسري مهل قضائية قصيرة؛ افحص فورا.' },
  telephoneCounselling: { name: 'TelefonSeelsorge', description: 'محادثة مجهولة عند الضغط أو الفقد أو الوحدة أو الأزمة.', availability: 'ليلا ونهارا؛ مجانا ومجهول.', limitation: 'عند خطر مباشر على النفس أو الآخرين اتصل بـ112 أو 110.' },
  familyDirectory: { name: 'DAJEB – استشارة قريبة', description: 'يجد استشارة أسرية وحياتية وانفصال وأزمات مجانية حسب الرمز البريدي.', availability: 'متاح دائما؛ الاتصالات في النتيجة.', limitation: 'ليست خدمة طوارئ مركزية؛ قد توجد أوقات انتظار محلية.' },
  parentPhone: { name: 'Nummer gegen Kummer – هاتف الوالدين', description: 'استشارة مجهولة للوالدين ومقدمي الرعاية عند القلق والضغط والأزمات الأسرية.', availability: 'الاثنين/الأربعاء/الجمعة 9–17، الثلاثاء/الخميس 9–19؛ مجانا.', limitation: 'للوالدين ومقدمي الرعاية؛ لا يعوض الشرطة أو الإسعاف أو المحامي.' },
});

const copy: Record<BaseLanguage, Record<ContactId, ContactCopy>> = { ar, de, tr, uk };

const contactOrder: Record<CategoryId, ContactId[]> = {
  rent: ['publicService115', 'socialPlatform', 'debtHelpline'],
  energy: ['energyAgency', 'publicService115', 'consumerAdvice'],
  jobcenter: ['jobcenterFinder', 'publicService115', 'bmasPhone'],
  health: ['patientAdvice', 'healthMinistryPhone', 'debtHelpline'],
  garnishment: ['pAccountJustice', 'debtDirectory', 'bafinPhone'],
  schufa: ['schufaCopy', 'consumerAdvice', 'dataProtectionHesse'],
  debtCourt: ['dunningCourts', 'inkassoCheck', 'debtHelpline'],
  family: ['telephoneCounselling', 'familyDirectory', 'parentPhone'],
};

export function buildDirectHelpContacts(
  categoryId: CategoryId,
  language: Language,
  answers: Answers = {},
  country: Country = 'de',
): DirectHelpContact[] {
  const baseLanguage = isBaseLanguage(language) ? language : 'de';
  if (country === 'at') return buildAustrianDirectHelpContacts(categoryId, baseLanguage, answers);
  if (country === 'ch') return buildSwissDirectHelpContacts(categoryId, language, answers);
  let ids = [...contactOrder[categoryId]];

  if (categoryId === 'schufa' && answers.basicNeedsAtRisk === 'ja') {
    ids = ['publicService115', 'debtHelpline', 'consumerAdvice'];
  }

  return ids.map((id) => ({ id, ...core[id], ...copy[baseLanguage][id] }));
}
