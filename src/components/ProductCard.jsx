import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatBRL } from '../utils/currency.js';
import { getDiscountLabel, getFinalBrlPrice, getOriginalBrlPrice, shouldShowDiscount } from '../utils/pricing.js';
import Rating from './Rating.jsx';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const originalPrice = getOriginalBrlPrice(product);
  const finalPrice = getFinalBrlPrice(product);
  const discounted = shouldShowDiscount(product);

  return (
    <article className="product-card">
      <Link className="product-card__image-link" to={`/products/${product.id}`} aria-label={`View ${product.title}`}>
        {discounted ? <span className="discount-badge">{getDiscountLabel(product)}</span> : null}
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </Link>
      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <Link className="product-card__title" to={`/products/${product.id}`}>{product.title}</Link>
        <div className="product-card__spacer" />
        <Rating value={product.rating} compact />
        <div className="product-card__prices">
          {discounted ? <span className="product-card__original">{formatBRL(originalPrice)}</span> : <span className="product-card__original product-card__original--hidden" aria-hidden="true">&nbsp;</span>}
          <strong>{formatBRL(finalPrice)}</strong>
        </div>
        <button type="button" className="primary-button product-card__add" onClick={() => addItem(product, 1)}>
          Add
        </button>
      </div>
    </article>
  );
}
