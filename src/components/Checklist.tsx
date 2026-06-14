interface ChecklistProps {
  title: string;
  items: string[];
  tone?: 'default' | 'warning';
}

export default function Checklist({ title, items, tone = 'default' }: ChecklistProps) {
  return (
    <section className={`panel checklist checklist-${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span aria-hidden="true">{tone === 'warning' ? '!' : '✓'}</span>
            <p>{item}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
