import type { Category } from '../types';

interface CategorySelectProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export default function CategorySelect({ categories, onSelect }: CategorySelectProps) {
  return (
    <section className="category-section" aria-labelledby="category-heading">
      <div className="section-heading">
        <p className="eyebrow">Schritt 1</p>
        <h2 id="category-heading">Welche Situation passt am ehesten?</h2>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            className="category-card"
            key={category.id}
            type="button"
            onClick={() => onSelect(category)}
          >
            <span>{category.shortTitle}</span>
            <strong>{category.title}</strong>
            <p>{category.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
