import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { CloseIcon } from '../components/Icons.jsx';
import QuantitySelector from '../components/QuantitySelector.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatBRL } from '../utils/currency.js';
import { getFinalBrlPrice, getOriginalBrlPrice } from '../utils/pricing.js';
import './Cart.css';

export default function Cart() {
  const { items, totalItemCount, removeItem, setQuantity } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const totals = useMemo(() => items.reduce((acc, item) => {
    acc.original += getOriginalBrlPrice(item.product) * item.quantity;
    acc.final += getFinalBrlPrice(item.product) * item.quantity;
    return acc;
  }, { original: 0, final: 0 }), [items]);
  const discount = Math.max(0, totals.original - totals.final);

  if (items.length === 0) {
    return (
      <div className="app-shell cart-shell">
        <Header mobileTitle="Your cart" />
        <main className="app-main container cart-empty-wrap">
          <EmptyState type="cart" title="Your cart is empty." message="Add products from the storefront to see them here." actionLabel="Back to store" to="/" />
        </main>
        <Footer />
      </div>
    );
  }

  const checkout = () => setCheckoutMessage('Checkout is not available in this academic demo.');

  return (
    <div className="app-shell cart-shell">
      <Header mobileTitle="Your cart" />
      <main className="app-main cart-page">
        <div className="container">
          <div className="cart-heading">
            <div className="cart-heading__title-row">
              <h1>Your cart</h1>
              <span>{items.length} {items.length === 1 ? 'product' : 'products'} · {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
            </div>
            <Link to="/">Continue shopping ›</Link>
          </div>

          <div className="cart-layout">
            <section className="cart-items" aria-label="Cart items">
              {items.map(({ id, product, quantity }) => {
                const unitPrice = getFinalBrlPrice(product);
                return (
                  <article className="cart-item" key={id}>
                    <Link className="cart-item__image" to={`/products/${id}`}>
                      <img src={product.thumbnail} alt={product.title} />
                    </Link>
                    <div className="cart-item__details">
                      <span>{product.category}</span>
                      <Link to={`/products/${id}`}>{product.title}</Link>
                      <p>{formatBRL(unitPrice)} each</p>
                    </div>
                    <div className="cart-item__quantity">
                      <QuantitySelector value={quantity} max={Math.max(1, product.stock || 99)} onChange={(value) => setQuantity(id, value)} ariaLabel={`Quantity of ${product.title}`} />
                    </div>
                    <strong className="cart-item__subtotal">{formatBRL(unitPrice * quantity)}</strong>
                    <button type="button" className="cart-item__remove" onClick={() => removeItem(id)} aria-label={`Remove ${product.title} from cart`}><CloseIcon size={19} /></button>
                  </article>
                );
              })}
            </section>

            <aside className="order-summary" aria-labelledby="order-summary-heading">
              <h2 id="order-summary-heading">Order summary</h2>
              <div className="order-summary__line"><span>Subtotal ({totalItemCount} items)</span><strong>{formatBRL(totals.original)}</strong></div>
              <div className="order-summary__line"><span>Discount</span><strong className="order-summary__success">− {formatBRL(discount)}</strong></div>
              <div className="order-summary__line"><span>Shipping</span><strong className="order-summary__success">Free</strong></div>
              <div className="order-summary__total">
                <span>Total</span>
                <div><strong>{formatBRL(totals.final)}</strong><small>in 12x {formatBRL(totals.final / 12)}</small></div>
              </div>
              <button type="button" className="primary-button order-summary__checkout" onClick={checkout}>Checkout</button>
              <p className="order-summary__message" role="status" aria-live="polite">{checkoutMessage}</p>
            </aside>
          </div>
        </div>
      </main>

      <div className="mobile-cart-summary" aria-label="Cart total">
        <div className="mobile-cart-summary__top"><span>Total ({totalItemCount} items)</span><strong>{formatBRL(totals.final)}</strong></div>
        <button type="button" className="primary-button" onClick={checkout}>Checkout</button>
        <span className="visually-hidden" role="status" aria-live="polite">{checkoutMessage}</span>
      </div>
      <Footer />
    </div>
  );
}
