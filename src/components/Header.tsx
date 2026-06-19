import { useI18n } from '../i18n';

interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
}

export default function Header({ onReset, showReset }: HeaderProps) {
  const { language, languageOptions, setLanguage, t } = useI18n();

  return (
    <header className="site-header">
      {showReset ? (
        <button className="ghost-button" type="button" onClick={onReset}>
          {t.ui.reset}
        </button>
      ) : (
        <span />
      )}
      <div className="language-switcher" aria-label={t.ui.languageLabel}>
        {languageOptions.map((option) => (
          <button
            className={language === option.code ? 'active' : ''}
            key={option.code}
            type="button"
            aria-pressed={language === option.code}
            onClick={() => setLanguage(option.code)}
          >
            <span className={`flag-icon flag-icon-${option.code}`} aria-hidden="true" />
            {option.label}
          </button>
        ))}
      </div>
    </header>
  );
}
