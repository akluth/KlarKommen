import type { Language } from '../i18n';
import { adaptTextForSwitzerland } from '../i18n/switzerland';
import type { CategoryId } from '../types';

const special: Record<'fr' | 'gsw', Record<CategoryId, string[]>> = {
  fr: {
    rent: ['Conservez le courrier et sa date de réception.', 'Contactez aujourd’hui le bailleur et l’autorité de conciliation; indiquez chaque délai.', 'Demandez rapidement conseil à une association de locataires ou au service social.'],
    energy: ['Demandez au fournisseur le statut de la coupure et le décompte par écrit.', 'Signalez immédiatement les enfants, appareils médicaux ou risques de santé.', 'Contactez le service social, ElCom ou le conseil en désendettement.'],
    jobcenter: ['Contactez aujourd’hui l’ORP, la caisse de chômage ou le service social compétent.', 'Si vous n’avez plus de quoi vivre, demandez clairement une aide urgente.', 'Conservez la décision et vérifiez immédiatement le délai d’opposition ou de recours.'],
    health: ['Demandez à la caisse le statut de l’assurance, des primes et de la poursuite.', 'Si des soins sont menacés, informez immédiatement la caisse et le prestataire.', 'Vérifiez la réduction de primes auprès du canton et proposez un paiement réaliste.'],
    garnishment: ['Contactez immédiatement l’office des poursuites et demandez le calcul du minimum vital.', 'Réunissez les justificatifs de revenus, loyer, famille et frais médicaux.', 'Demandez conseil à un service de désendettement avant tout accord.'],
    schufa: ['Traitez d’abord le besoin essentiel et évitez les crédits rapides coûteux.', 'Demandez vos données auprès de ZEK/IKO et CRIF.', 'Contestez les données fausses par écrit et conservez les preuves.'],
    debtCourt: ['Conservez le commandement de payer et notez sa date de réception.', 'Si vous contestez la créance, formez en principe opposition dans les 10 jours.', 'Faites vérifier rapidement la créance et les frais.'],
    family: ['En cas de danger, allez dans un lieu sûr et appelez le 117 ou le 144.', 'Notez ce qui doit être réglé aujourd’hui: sécurité, enfants, logement, argent et documents.', 'Contactez l’aide aux victimes 142, le 147, un conseil familial ou l’APEA.'],
  },
  gsw: {
    rent: ['Sicher s Schriibe und s Empfangsdatum.', 'Kontaktiere hüt de Vermieter und d Schlichtigsbehörde und nenn alli Friste.', 'Hol rasch Hilf bim Mieterverband oder Sozialdienst.'],
    energy: ['Verlang vom Versorger schriftlich de Abschaltstatus und d Abrechnig.', 'Meld Chind, medizinischi Grät oder Gsundheitsrisike sofort.', 'Kontaktiere de Sozialdienst, d ElCom oder d Schuldeberatig.'],
    jobcenter: ['Kontaktiere hüt s RAV, d Arbeitslosechasse oder de Sozialdienst.', 'Wenn s Gäld zum Läbe fehlt, frag klar nach dringender Hilf.', 'Sicher d Verfügung und prüef sofort d Einsprache- oder Rechtsmittelfrist.'],
    health: ['Verlang vo de Krankekasse de Status vo Versicherig, Prämie und Betriibig.', 'Wenn Behandlig oder Medikament gfährdet sind, meld das sofort.', 'Prüef d Prämieverbilligung bim Kanton und verlang en tragbare Zahligsplan.'],
    garnishment: ['Kontaktiere sofort s Betriibigsamt und verlang d Berechnig vom Existenzminimum.', 'Sammle Nachwiis zu Iikomme, Miete, Familie und Gsundheitschöste.', 'Hol Schuldeberatig, bevor du e Vereinbarig machsch.'],
    schufa: ['Lös zerscht s lebensnotwendige Problem und vermeid tüüri Sofortkredit.', 'Verlang dini Date bi ZEK/IKO und CRIF.', 'Beanstand falsch Date schriftlich und sicher d Nachwiis.'],
    debtCourt: ['Sicher de Zahligsbefehl und notier s Empfangsdatum.', 'Wenn du d Forderig bestriitsch, mach grundsätzlich innert 10 Täg Rechtsvorschlag.', 'Lah Forderig und Chöste rasch prüefe.'],
    family: ['Bi Gfahr gang a en sichere Ort und rüef 117 oder 144 aa.', 'Notier, was hüt zerscht glöst werde mues: Sicherheit, Chind, Wohnig, Gäld und Dokument.', 'Kontaktiere Opferhilf 142, 147, Familieberatig oder d KESB.'],
  },
};

export function buildSwissQuickActions(categoryId: CategoryId, language: Language, base: string[]) {
  if (language === 'fr' || language === 'gsw') return special[language][categoryId];
  return adaptTextForSwitzerland(base, language);
}
