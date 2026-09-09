import { SORT_OPTIONS } from '../utils/products.js';
import './SortControl.css';

export default function SortControl({ value, onChange }) {
  return (
    <label className="sort-control">
      <span>Sort:</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label="Sort products">
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
