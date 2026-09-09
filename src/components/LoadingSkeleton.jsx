import './LoadingSkeleton.css';

export function ProductCardSkeleton() {
  return (
    <div className="product-skeleton" aria-hidden="true">
      <div className="product-skeleton__image skeleton-pulse" />
      <div className="product-skeleton__body">
        <div className="product-skeleton__line product-skeleton__line--short skeleton-pulse" />
        <div className="product-skeleton__line skeleton-pulse" />
        <div className="product-skeleton__line product-skeleton__line--medium skeleton-pulse" />
        <div className="product-skeleton__line product-skeleton__line--short skeleton-pulse" />
        <div className="product-skeleton__button skeleton-pulse" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail-skeleton" aria-label="Loading product details">
      <div className="detail-skeleton__image skeleton-pulse" />
      <div className="detail-skeleton__info">
        <div className="product-skeleton__line product-skeleton__line--short skeleton-pulse" />
        <div className="detail-skeleton__title skeleton-pulse" />
        <div className="product-skeleton__line product-skeleton__line--medium skeleton-pulse" />
        <div className="detail-skeleton__price skeleton-pulse" />
        <div className="detail-skeleton__button skeleton-pulse" />
      </div>
    </div>
  );
}
