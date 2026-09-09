import './QuantitySelector.css';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, ariaLabel = 'Quantity' }) {
  const decreaseDisabled = value <= min;
  const increaseDisabled = value >= max;
  return (
    <div className="quantity-selector" role="group" aria-label={ariaLabel}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={decreaseDisabled} aria-label="Decrease quantity">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={increaseDisabled} aria-label="Increase quantity">+</button>
    </div>
  );
}
