import { useState } from 'react';

interface TemplateBoxProps {
  title: string;
  text: string;
}

export default function TemplateBox({ title, text }: TemplateBoxProps) {
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
          {copied ? 'Kopiert' : 'Text kopieren'}
        </button>
      </div>
      <pre>{text}</pre>
    </section>
  );
}
