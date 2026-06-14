interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
}

export default function Header({ onReset, showReset }: HeaderProps) {
  if (!showReset) {
    return null;
  }

  return (
    <header className="site-header">
      <button className="ghost-button" type="button" onClick={onReset}>
        Neue Situation prüfen
      </button>
    </header>
  );
}
