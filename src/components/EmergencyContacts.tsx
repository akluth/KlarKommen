import type { QuickHelpTexts } from '../i18n/quickHelp';
import { useI18n } from '../i18n';

interface EmergencyContactsProps {
  danger?: boolean;
  headingId: string;
  texts: QuickHelpTexts;
}

export default function EmergencyContacts({ danger = false, headingId, texts }: EmergencyContactsProps) {
  const { country } = useI18n();
  const ambulanceNumber = country === 'de' ? '112' : '144';
  const policeNumber = country === 'at' ? '133' : country === 'ch' ? '117' : '110';
  return (
    <aside
      className={danger ? 'emergency-strip danger' : 'emergency-strip'}
      aria-labelledby={headingId}
    >
      <div>
        <strong id={headingId}>{texts.emergencyHeading}</strong>
        <p>{texts.emergencyText}</p>
      </div>
      <div className="emergency-actions">
        <a className="emergency-link" href={`tel:${ambulanceNumber}`}>
          {texts.emergencyCall}
        </a>
        <a className="emergency-link police" href={`tel:${policeNumber}`}>
          {texts.emergencyPolice}
        </a>
      </div>
    </aside>
  );
}
