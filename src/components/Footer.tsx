import { useI18n } from '../i18n';

interface FooterProps {
  onNavigate: (page: 'imprint' | 'privacy' | 'help') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label={t.ui.footerNavAria}>
        <button type="button" onClick={() => onNavigate('imprint')}>
          {t.ui.imprint}
        </button>
        <button type="button" onClick={() => onNavigate('privacy')}>
          {t.ui.privacy}
        </button>
        <button type="button" onClick={() => onNavigate('help')}>
          {t.ui.realHelp}
        </button>
      </nav>
      <p>{t.disclaimer}</p>
      <p>{t.ui.localDataNotice}</p>
    </footer>
  );
}
