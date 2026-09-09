import './Rating.css';

export default function Rating({ value = 0, showValue = true, reviewCount, compact = false }) {
  const numeric = Math.max(0, Math.min(5, Number(value) || 0));
  const rounded = Math.round(numeric);
  return (
    <div className={`rating ${compact ? 'rating--compact' : ''}`} aria-label={`${numeric.toFixed(2)} out of 5 stars`}>
      <span className="rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < rounded ? 'rating__star rating__star--filled' : 'rating__star'}>★</span>
        ))}
      </span>
      {showValue ? <span className="rating__value">{numeric.toFixed(2).replace('.', ',')}</span> : null}
      {Number.isFinite(reviewCount) ? <span className="rating__reviews">· {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span> : null}
    </div>
  );
}
