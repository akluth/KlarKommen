import { DISCLAIMER } from '../data/disclaimer';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>{DISCLAIMER}</p>
      <p>Alle Angaben bleiben in diesem Browser. Es gibt kein Backend und keine Anmeldung.</p>
    </footer>
  );
}
