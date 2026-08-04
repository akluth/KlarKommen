import type { Language } from '../i18n';
import { adaptTextForSwitzerland } from '../i18n/switzerland';
import type { CategoryId } from '../types';
import type { UrgencyResult } from './preparation';

const documents: Record<'fr' | 'gsw', Record<CategoryId, string[]>> = {
  fr: {
    rent: ['Bail, rappels, résiliation et enveloppes', 'Décompte des loyers et preuve des paiements', 'Courriers du bailleur et de l’autorité de conciliation'],
    energy: ['Rappels et annonce de coupure', 'Numéro de client, compteur et dernière facture annuelle', 'Décompte de la dette et propositions de paiement'],
    jobcenter: ['Décision de l’ORP, de la caisse de chômage ou du service social', 'Preuves des dates de réception et de dépôt', 'Bail, relevés bancaires et justificatifs de revenu'],
    health: ['Courriers de la caisse et décompte des primes', 'Décision de réduction de primes ou demande', 'Carte d’assurance et numéro d’assuré'],
    garnishment: ['Commandement de payer, avis ou procès-verbal de saisie', 'Calcul du minimum vital par l’office des poursuites', 'Preuves de revenu, loyer, famille et frais médicaux'],
    schufa: ['Réponse ou extrait ZEK/IKO et CRIF', 'Refus de crédit ou de contrat', 'Preuves montrant quelles données sont fausses'],
    debtCourt: ['Lettre de recouvrement ou commandement de payer', 'Enveloppe et date de réception', 'Contrat, facture, résiliation et échanges antérieurs'],
    family: ['Certificats, décisions ou courriers officiels', 'Documents sur logement, comptes, assurances et contrats communs', 'Documents concernant enfants, garde, école ou accueil'],
  },
  gsw: {
    rent: ['Mietvertrag, Mahnige, Chündigung und Couvert', 'Mietzinsufstellig und Zahligsnachwiis', 'Schriibe vom Vermieter und vo de Schlichtigsbehörde'],
    energy: ['Mahnige und Aakündigung vo de Abschaltig', 'Chundenummer, Zähler und letschti Jahresrechnig', 'Ufstellig vo de Schuld und Zahligsvorschläg'],
    jobcenter: ['Verfügung vom RAV, vo de Arbeitslosechasse oder vom Sozialdienst', 'Nachwiis vo Empfangs- und Iigabedate', 'Mietvertrag, Kontoauszüg und Iikommensnachwiis'],
    health: ['Schriibe vo de Krankekasse und Prämieabrechnig', 'Verfügung oder Gsuech zur Prämieverbilligung', 'Versicherigschärtli und Versicherigsnummer'],
    garnishment: ['Zahligsbefehl, Pfändigsaakündigung oder Pfändigsurkunde', 'Berechnig vom Existenzminimum dur s Betriibigsamt', 'Nachwiis zu Iikomme, Miete, Familie und Gsundheitschöste'],
    schufa: ['Uskunft vo ZEK/IKO und CRIF', 'Ablehnig vo Kredit oder Vertrag', 'Nachwiis, weli Date falsch sind'],
    debtCourt: ['Inkassoschriibe oder Zahligsbefehl', 'Couvert und Empfangsdatum', 'Vertrag, Rechnig, Chündigung und früehere Schriibe'],
    family: ['Urkunde, Verfüegige oder amtlichi Schriibe', 'Unterlage zu Wohnig, Konto, Versicherige und gemeinsame Verträg', 'Unterlage zu Chind, Betreuig, Schuel oder Kita'],
  },
};

const sharedDocuments: Record<'fr' | 'gsw', string[]> = {
  fr: ['Pièce d’identité', 'Chronologie courte avec dates et délais', 'Liste des appels, messages et personnes de contact'],
  gsw: ['Uswiis', 'Churzi Chronologie mit Date und Friste', 'Liste vo Aarüef, Nachrichte und Kontaktpersone'],
};

const actions: Record<'fr' | 'gsw', Record<CategoryId, string[]>> = {
  fr: {
    rent: ['Demander par écrit une clarification ou un paiement échelonné au bailleur.', 'Contacter l’autorité de conciliation, le service social ou le conseil aux locataires.'],
    energy: ['Demander au fournisseur de suspendre la coupure et de fournir un décompte.', 'Demander au service social une aide urgente et réaliste.'],
    jobcenter: ['Classer décision et demande par date.', 'Demander par écrit l’état du dossier, une aide urgente ou un réexamen.'],
    health: ['Demander à la caisse le décompte et le statut de la couverture.', 'Vérifier la réduction de primes et un accord de paiement supportable.'],
    garnishment: ['Demander à l’office des poursuites le calcul du minimum vital.', 'Faire vérifier la saisie et les justificatifs par un conseil en désendettement.'],
    schufa: ['Demander les données ZEK/IKO et CRIF.', 'Demander par écrit la rectification aux responsables.'],
    debtCourt: ['Identifier s’il s’agit d’un commandement de payer ou d’une lettre de recouvrement.', 'En cas de contestation, vérifier immédiatement l’opposition de 10 jours.'],
    family: ['Noter les personnes, enfants, délais et responsabilités.', 'Contacter conseil familial, APEA ou aide aux victimes selon la situation.'],
  },
  gsw: {
    rent: ['Bitte de Vermieter schriftlich um Klärig oder e Ratezahlig.', 'Kontaktiere d Schlichtigsbehörde, de Sozialdienst oder d Mieterberatig.'],
    energy: ['Verlang vom Versorger en Ufschub und e vollständigi Ufstellig.', 'Frag de Sozialdienst nach schneller und tragbarer Hilf.'],
    jobcenter: ['Sortier Verfügung und Gsuech nach Datum.', 'Frag schriftlich nach em Stand, dringender Hilf oder ere Überprüefig.'],
    health: ['Verlang vo de Kasse d Abrechnig und de Versicherigsstatus.', 'Prüef Prämieverbilligung und en tragbare Zahligsplan.'],
    garnishment: ['Verlang vom Betriibigsamt d Berechnig vom Existenzminimum.', 'Lah d Pfändig und dini Nachwiis vo de Schuldeberatig prüefe.'],
    schufa: ['Verlang dini Date bi ZEK/IKO und CRIF.', 'Verlang schriftlich d Berichtigung bi de verantwortliche Stelle.'],
    debtCourt: ['Prüef, ob s en Zahligsbefehl oder es Inkassoschriibe isch.', 'Wenn du d Forderig bestriitsch, prüef sofort de Rechtsvorschlag innert 10 Täg.'],
    family: ['Notier Persone, Chind, Friste und Zuständigkeite.', 'Kontaktiere Familieberatig, KESB oder Opferhilf – je nach Situation.'],
  },
};

export function adaptSwissUrgency(result: UrgencyResult, language: Language): UrgencyResult {
  if (language !== 'fr' && language !== 'gsw') return adaptTextForSwitzerland(result, language);
  const fr = language === 'fr';
  const copy = {
    red: fr ? ['Rouge', 'Agir aujourd’hui', 'Il existe des signaux d’alerte clairs. Écrivez aujourd’hui et cherchez rapidement une aide personnelle.'] : ['Rot', 'Hüt handle', 'Es git deutligi Warnsignal. Schriib hüt und suech schnäll persönligi Hilf.'],
    yellow: fr ? ['Jaune', 'Agir dans les prochains jours', 'La situation demande une clarification rapide et documentée.'] : ['Gälb', 'I de nöchste Täg handle', 'D Situation brucht e raschi und dokumentierti Klärig.'],
    green: fr ? ['Vert', 'Préparer la prochaine étape', 'Aucun signal d’urgence direct n’apparaît, mais conservez les documents et fixez la prochaine étape.'] : ['Grüen', 'De nöchste Schritt vorbereite', 'Es zeigt sich kei direkts Notsignal. Sicher trotzdem d Unterlage und plan de nöchste Schritt.'],
  }[result.level];
  return { ...result, label: copy[0], headline: copy[1], summary: copy[2], reasons: [fr ? 'Évaluation fondée sur vos réponses et les délais indiqués.' : 'Iischätzig aufgrund vo dine Antwort und de aagehne Friste.'] };
}

export function buildSwissDocuments(categoryId: CategoryId, language: Language, base: string[]) {
  if (language === 'fr' || language === 'gsw') return [...documents[language][categoryId], ...sharedDocuments[language]];
  return adaptTextForSwitzerland(base, language);
}

export function buildSwissActionPlan(categoryId: CategoryId, language: Language, base: string[], hasDeadline: boolean) {
  if (language !== 'fr' && language !== 'gsw') return adaptTextForSwitzerland(base, language);
  const shared = language === 'fr'
    ? ['Photographier ou scanner les courriers importants.', 'Noter références et délais sur une page.', 'Envoyer aujourd’hui le modèle approprié par écrit.', 'Conserver réponses et preuves de réception.']
    : ['Wichtigi Schriibe fotografiere oder scanne.', 'Aktenzeiche und Friste uf einere Siite notiere.', 'Passendi Vorlag hüt schriftlich schicke.', 'Antworte und Empfangsbestätigunge sichere.'];
  if (hasDeadline) shared.unshift(language === 'fr' ? 'Vérifier et noter visiblement le délai.' : 'Frist prüefe und sichtbar notiere.');
  return [...shared, ...actions[language][categoryId]];
}
