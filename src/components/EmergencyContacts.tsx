import type { QuickHelpTexts } from '../i18n/quickHelp';

interface EmergencyContactsProps {
  danger?: boolean;
  headingId: string;
  texts: QuickHelpTexts;
}

export default function EmergencyContacts({ danger = false, headingId, texts }: EmergencyContactsProps) {
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
        <a className="emergency-link" href="tel:112">
          {texts.emergencyCall}
        </a>
        <a className="emergency-link police" href="tel:110">
          {texts.emergencyPolice}
        </a>
      </div>
    </aside>
  );
}
