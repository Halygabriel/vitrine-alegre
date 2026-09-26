import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { DetailSkeleton, ProductGridSkeleton } from '../components/LoadingSkeleton.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import QuantitySelector from '../components/QuantitySelector.jsx';
import Rating from '../components/Rating.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getProduct, listProducts } from '../services/api.js';
import { formatBRL } from '../utils/currency.js';
import { getDiscountLabel, getFinalBrlPrice, getOriginalBrlPrice, getSavingsBrl, shouldShowDiscount } from '../utils/pricing.js';
import './ProductDetails.css';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB').format(date);
}

function dimensionsText(dimensions) {
  if (!dimensions) return 'Not available';
  const parts = [dimensions.width, dimensions.height, dimensions.depth].filter((value) => Number.isFinite(Number(value)));
  return parts.length ? `${parts.join(' × ')} cm` : 'Not available';
}

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem, items } = useCart();
  const [state, setState] = useState({ product: null, loading: true, error: null });
  const [quantity, setQuantity] = useState(1);
  const [retryVersion, setRetryVersion] = useState(0);
  const [relatedState, setRelatedState] = useState({ products: [], loading: false, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ product: null, loading: true, error: null });
    setQuantity(1);
    setRelatedState({ products: [], loading: false, error: null });
    window.scrollTo({ top: 0, behavior: 'auto' });

    getProduct(id, { signal: controller.signal })
      .then((product) => {
        if (!controller.signal.aborted) setState({ product, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ product: null, loading: false, error });
      });

    return () => controller.abort();
  }, [id, retryVersion]);

  useEffect(() => {
    if (!state.product?.category) return undefined;

    const controller = new AbortController();
    setRelatedState({ products: [], loading: true, error: null });

    listProducts({
      page: 1,
      category: state.product.category,
      sort: 'rating-desc',
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        const relatedProducts = data.products
          .filter((candidate) => Number(candidate.id) !== Number(state.product.id))
          .slice(0, 4);
        setRelatedState({ products: relatedProducts, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setRelatedState({ products: [], loading: false, error });
        }
      });

    return () => controller.abort();
  }, [state.product]);

  const product = state.product;
  const isInCart = product ? items.some((item) => item.id === Number(product.id)) : false;
  const images = useMemo(() => {
    if (!product) return [];
    const candidates = [...(Array.isArray(product.images) ? product.images : []), product.thumbnail].filter(Boolean);
    return [...new Set(candidates)];
  }, [product]);

  const addToCart = () => {
    addItem(product, quantity);
  };

  if (state.loading) {
    return (
      <div className="app-shell">
        <Header mobileTitle="Product details" />
        <main className="app-main"><div className="container detail-loading-wrap"><DetailSkeleton /></div></main>
        <Footer />
      </div>
    );
  }

  if (state.error) {
    const notFound = state.error.status === 404;
    return (
      <div className="app-shell">
        <Header mobileTitle="Product details" />
        <main className="app-main container detail-state-wrap">
          {notFound ? (
            <EmptyState type="search" title="Product not found." message="This product does not exist or is no longer available." actionLabel="Back to store" to="/" />
          ) : (
            <ErrorState title="We couldn't load this product." message="Check your connection and try again." onRetry={() => setRetryVersion((value) => value + 1)} />
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const originalPrice = getOriginalBrlPrice(product);
  const finalPrice = getFinalBrlPrice(product);
  const savings = getSavingsBrl(product);
  const discounted = shouldShowDiscount(product);
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const stock = Math.max(0, Number.parseInt(product.stock, 10) || 0);

  return (
    <div className="app-shell">
      <Header mobileTitle={product.title} />
      <main className="app-main product-detail-page">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>›</span>
            <Link to={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span>›</span>
            <strong>{product.title}</strong>
          </nav>

          <section className="product-detail-card">
            <ProductGallery images={images} title={product.title} />
            <div className="product-info">
              <div className="product-info__category">{product.category}</div>
              <h1>{product.title}</h1>
              <p className="product-info__meta">
                {product.brand ? <>Brand: {product.brand} · </> : null}SKU: {product.sku || `VA-${product.id}`}
              </p>
              <Rating value={product.rating} reviewCount={reviews.length} />

              <div className="product-info__divider" />

              <div className="product-price-block">
                {discounted ? (
                  <div className="product-price-block__saving">
                    <span className="product-price-block__original">{formatBRL(originalPrice)}</span>
                    <strong>save {formatBRL(savings)}</strong>
                  </div>
                ) : null}
                <div className="product-price-block__row">
                  <strong className="product-price-block__final">{formatBRL(finalPrice)}</strong>
                  {discounted ? <span className="discount-badge product-price-block__badge">{getDiscountLabel(product)}</span> : null}
                </div>
                <p>up to 12x {formatBRL(finalPrice / 12)} interest-free</p>
              </div>

              <p className={`stock-line ${stock > 0 ? 'stock-line--available' : 'stock-line--out'}`}>
                <span className="stock-line__dot" aria-hidden="true" />
                <strong>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</strong>
                {product.availabilityStatus ? <span>· {product.availabilityStatus}</span> : null}
              </p>

              <div className="product-info__actions">
                <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(1, stock)} ariaLabel={`Quantity of ${product.title}`} />
                <button type="button" className="primary-button product-info__add" onClick={addToCart} disabled={stock < 1}>Add to cart</button>
              </div>
              {isInCart ? (
                <p className="product-info__announcement" role="status">Produto já adicionado no carrinho</p>
              ) : null}

              <div className="fulfillment-grid">
                <div><span>Shipping</span><strong>{product.shippingInformation || 'Standard shipping'}</strong></div>
                <div><span>Warranty</span><strong>{product.warrantyInformation || 'Warranty information unavailable'}</strong></div>
                <div><span>Returns</span><strong>{product.returnPolicy || 'Return policy unavailable'}</strong></div>
              </div>
            </div>
          </section>

          <div className="product-lower-grid">
            <section className="detail-section detail-section--description">
              <h2>Description</h2>
              <div className="detail-panel">
                <p>{product.description}</p>
                {Array.isArray(product.tags) && product.tags.length ? <p className="tag-line">{product.tags.map((tag) => `#${String(tag).replaceAll(' ', '-')}`).join(' ')}</p> : null}
              </div>
            </section>

            <section className="detail-section detail-section--specs">
              <h2>Specifications</h2>
              <dl className="detail-panel specs-list">
                <div><dt>Weight</dt><dd>{Number.isFinite(Number(product.weight)) ? `${product.weight} g` : 'Not available'}</dd></div>
                <div><dt>Dimensions</dt><dd>{dimensionsText(product.dimensions)}</dd></div>
                <div><dt>Stock</dt><dd>{stock} units</dd></div>
                <div><dt>Minimum order</dt><dd>{product.minimumOrderQuantity || 1} unit{Number(product.minimumOrderQuantity) === 1 ? '' : 's'}</dd></div>
              </dl>
            </section>
          </div>

          <section className="reviews-section">
            <h2>Reviews ({reviews.length})</h2>
            {reviews.length ? (
              <div className="reviews-grid">
                {reviews.map((review, index) => (
                  <article className="review-card" key={`${review.reviewerEmail || review.reviewerName || 'review'}-${index}`}>
                    <div className="review-card__header">
                      <span className="review-card__avatar" aria-hidden="true">{(review.reviewerName || 'R').slice(0, 1).toUpperCase()}</span>
                      <div><strong>{review.reviewerName || 'Customer'}</strong><Rating value={review.rating} showValue={false} compact /></div>
                      <time dateTime={review.date || undefined}>{formatDate(review.date)}</time>
                    </div>
                    <p>{review.comment || 'No written comment.'}</p>
                  </article>
                ))}
              </div>
            ) : <div className="detail-panel no-reviews">No reviews yet.</div>}
          </section>

          <section className="related-products-section" aria-labelledby="related-products-heading">
            <div className="related-products-section__heading">
              <div>
                <h2 id="related-products-heading">Related products</h2>
                <p>More products from {product.category}</p>
              </div>
              <Link to={`/?category=${encodeURIComponent(product.category)}`} className="related-products-section__view-all">View all</Link>
            </div>

            {relatedState.loading ? (
              <ProductGridSkeleton count={4} />
            ) : relatedState.products.length ? (
              <ProductGrid products={relatedState.products} />
            ) : relatedState.error ? (
              <div className="related-products-section__empty">Related products could not be loaded right now.</div>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
