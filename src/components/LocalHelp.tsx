import { useState } from 'react';
import type { HelpSearchLink } from '../data/localHelp';
import type { ResultExtraTexts } from '../i18n/resultExtras';
import TaskList from './TaskList';

interface LocalHelpProps {
  checkedItems: Record<string, boolean>;
  links: HelpSearchLink[];
  onCheckedItemsChange: (checkedItems: Record<string, boolean>) => void;
  phoneScript: string;
  tasks: string[];
  texts: ResultExtraTexts;
}

export default function LocalHelp({
  checkedItems,
  links,
  onCheckedItemsChange,
  phoneScript,
  tasks,
  texts,
}: LocalHelpProps) {
  const [copied, setCopied] = useState(false);

  const copyScript = async () => {
    await navigator.clipboard.writeText(phoneScript);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="local-help-section" aria-labelledby="local-help-heading">
      <div className="panel local-help-card">
        <div>
          <p className="eyebrow">{texts.localHelpEyebrow}</p>
          <h3 id="local-help-heading">{texts.helpSearchTitle}</h3>
          <p>{texts.helpExternalNotice}</p>
        </div>
        <div className="search-link-grid">
          {links.map((link) => (
            <a key={link.query} className="search-link" href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="panel phone-script-card">
        <div className="template-head">
          <div>
            <p className="eyebrow">{texts.phoneEyebrow}</p>
            <h3>{texts.phoneHeading}</h3>
          </div>
          <button className="secondary-button compact" type="button" onClick={copyScript}>
            {copied ? texts.copied : texts.copyScript}
          </button>
        </div>
        <pre>{phoneScript}</pre>
      </div>

      <TaskList
        title={texts.contactTitle}
        eyebrow={texts.taskNextEyebrow}
        items={tasks}
        checkedItems={checkedItems}
        onCheckedItemsChange={onCheckedItemsChange}
      />
    </section>
  );
}
