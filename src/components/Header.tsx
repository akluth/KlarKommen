import { DISCLAIMER } from '../data/disclaimer';

interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
}

export default function Header({ onReset, showReset }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand" aria-label="KlarKommen">
        <span className="brand-mark">K</span>
        <div>
          <strong>KlarKommen</strong>
          <small>Erste Orientierung in Notlagen</small>
        </div>
      </div>
      {showReset && (
        <button className="ghost-button" type="button" onClick={onReset}>
          Neue Situation prüfen
        </button>
      )}
      <p className="header-disclaimer">{DISCLAIMER}</p>
    </header>
  );
}
