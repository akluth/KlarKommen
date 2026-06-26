import { useEffect, useId, useState } from 'react';

interface TaskListProps {
  title: string;
  items: string[];
  eyebrow?: string;
}

export default function TaskList({ title, items, eyebrow }: TaskListProps) {
  const id = useId();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCheckedItems({});
  }, [items]);

  const toggleItem = (item: string) => {
    setCheckedItems((current) => ({
      ...current,
      [item]: !current[item],
    }));
  };

  return (
    <section className="panel task-list">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => {
          const inputId = `${id}-${index}`;
          const isChecked = Boolean(checkedItems[item]);

          return (
            <li key={item} className={isChecked ? 'task-done' : undefined}>
              <input
                id={inputId}
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(item)}
              />
              <label htmlFor={inputId}>{item}</label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
