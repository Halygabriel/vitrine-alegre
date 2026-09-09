import { useEffect, useId, useState } from 'react';
import { SearchIcon, CloseIcon } from './Icons.jsx';
import './SearchField.css';

export default function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search products...',
  ariaLabel = 'Search products',
}) {
  const inputId = useId();
  const controlled = typeof value === 'string';
  const [internalValue, setInternalValue] = useState(value ?? '');

  useEffect(() => {
    if (controlled) setInternalValue(value);
  }, [controlled, value]);

  const currentValue = controlled ? value : internalValue;
  const updateValue = (nextValue) => {
    if (!controlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <form
      className="search-field"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(currentValue.trim());
      }}
    >
      <SearchIcon className="search-field__icon" size={19} />
      <label className="visually-hidden" htmlFor={inputId}>{ariaLabel}</label>
      <input
        id={inputId}
        type="search"
        value={currentValue}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {currentValue ? (
        <button
          className="search-field__clear"
          type="button"
          onClick={() => updateValue('')}
          aria-label="Clear search"
        >
          <CloseIcon size={18} />
        </button>
      ) : null}
    </form>
  );
}
