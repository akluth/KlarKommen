import { useState } from 'react';
import { useI18n } from '../i18n';

interface TemplateBoxProps {
  title: string;
  text: string;
}

export default function TemplateBox({ title, text }: TemplateBoxProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="panel template-box">
      <div className="template-head">
        <h3>{title}</h3>
        <button className="secondary-button compact" type="button" onClick={copy}>
          {copied ? t.ui.copied : t.ui.copyText}
        </button>
      </div>
      <pre>{text}</pre>
    </section>
  );
}
