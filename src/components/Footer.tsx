import { DISCLAIMER } from '../data/disclaimer';

interface FooterProps {
  onNavigate: (page: 'imprint' | 'privacy' | 'help') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Rechtliches und Hilfe">
        <button type="button" onClick={() => onNavigate('imprint')}>
          Impressum
        </button>
        <button type="button" onClick={() => onNavigate('privacy')}>
          Datenschutz
        </button>
        <button type="button" onClick={() => onNavigate('help')}>
          Wann echte Hilfe suchen?
        </button>
      </nav>
      <p>{DISCLAIMER}</p>
      <p>Alle Angaben bleiben in diesem Browser. Es gibt kein Backend und keine Anmeldung.</p>
    </footer>
  );
}
