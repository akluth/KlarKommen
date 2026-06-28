import { useId } from 'react';

interface TaskListProps {
  title: string;
  items: string[];
  eyebrow?: string;
  checkedItems: Record<string, boolean>;
  onCheckedItemsChange: (checkedItems: Record<string, boolean>) => void;
}

export default function TaskList({
  title,
  items,
  eyebrow,
  checkedItems,
  onCheckedItemsChange,
}: TaskListProps) {
  const id = useId();

  const toggleItem = (item: string) => {
    onCheckedItemsChange({
      ...checkedItems,
      [item]: !checkedItems[item],
    });
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
