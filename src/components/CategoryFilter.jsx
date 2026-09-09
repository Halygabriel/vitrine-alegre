import { useEffect, useRef } from 'react';
import './CategoryFilter.css';

function humanizeCategory(category) {
  return category.replaceAll('-', ' ');
}

export default function CategoryFilter({ categories, activeCategory, onChange, loading = false }) {
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [activeCategory]);

  return (
    <div className="category-filter" aria-label="Product categories">
      <button
        ref={!activeCategory ? activeRef : undefined}
        type="button"
        className={`category-filter__pill ${!activeCategory ? 'category-filter__pill--active' : ''}`}
        onClick={() => onChange('')}
        aria-pressed={!activeCategory}
      >
        All
      </button>
      {loading && categories.length === 0 ? (
        Array.from({ length: 6 }, (_, index) => (
          <span key={index} className="category-filter__skeleton" aria-hidden="true" />
        ))
      ) : (
        categories.map((category) => (
          <button
            ref={activeCategory === category ? activeRef : undefined}
            type="button"
            key={category}
            className={`category-filter__pill ${activeCategory === category ? 'category-filter__pill--active' : ''}`}
            onClick={() => onChange(category)}
            aria-pressed={activeCategory === category}
            title={humanizeCategory(category)}
          >
            {humanizeCategory(category)}
          </button>
        ))
      )}
    </div>
  );
}
