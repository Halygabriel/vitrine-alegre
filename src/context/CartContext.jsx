import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './CartContext.css';

const STORAGE_KEY = 'vitrine-alegre-cart-v1';
const CartContext = createContext(null);

function normalizeStoredItem(item) {
  if (!item || !Number.isFinite(Number(item.id))) return null;
  const quantity = Math.max(1, Number.parseInt(item.quantity, 10) || 1);
  const product = item.product;
  if (!product || Number(product.id) !== Number(item.id)) return null;
  return { id: Number(item.id), product, quantity };
}

function readInitialItems() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeStoredItem).filter(Boolean);
  } catch {
    return [];
  }
}

function snapshotProduct(product) {
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    discountPercentage: product.discountPercentage,
    thumbnail: product.thumbnail,
    stock: product.stock,
  };
}

function clampQuantity(quantity, stock) {
  const parsed = Math.max(1, Number.parseInt(quantity, 10) || 1);
  const max = Math.max(1, Number.parseInt(stock, 10) || 99);
  return Math.min(parsed, max);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialItems);
  const [notice, setNotice] = useState(null);
  const noticeTimerRef = useRef(null);

  const showNotice = useCallback((message, kind = 'success') => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    setNotice({ message, kind });
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 2600);
  }, []);

  useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // A storage quota/privacy failure should not break cart behavior in memory.
    }
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    if (!product || !Number.isFinite(Number(product.id))) return;
    const alreadyInCart = items.some((item) => item.id === Number(product.id));
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === Number(product.id));
      if (existing) {
        return currentItems.map((item) => (
          item.id === Number(product.id)
            ? {
                ...item,
                product: snapshotProduct(product),
                quantity: clampQuantity(item.quantity + quantity, product.stock),
              }
            : item
        ));
      }
      return [
        ...currentItems,
        {
          id: Number(product.id),
          product: snapshotProduct(product),
          quantity: clampQuantity(quantity, product.stock),
        },
      ];
    });
    showNotice(alreadyInCart ? 'Product is already in the cart. Quantity updated.' : 'Product added to cart.');
  }, [items, showNotice]);

  const removeItem = useCallback((productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== Number(productId)));
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    setItems((currentItems) => currentItems.map((item) => (
      item.id === Number(productId)
        ? { ...item, quantity: clampQuantity(quantity, item.product.stock) }
        : item
    )));
  }, []);

  const incrementItem = useCallback((productId) => {
    setItems((currentItems) => currentItems.map((item) => (
      item.id === Number(productId)
        ? { ...item, quantity: clampQuantity(item.quantity + 1, item.product.stock) }
        : item
    )));
  }, []);

  const decrementItem = useCallback((productId) => {
    setItems((currentItems) => currentItems.map((item) => (
      item.id === Number(productId)
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    )));
  }, []);

  const totalItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(() => ({
    items,
    totalItemCount,
    addItem,
    removeItem,
    setQuantity,
    incrementItem,
    decrementItem,
  }), [
    items,
    totalItemCount,
    addItem,
    removeItem,
    setQuantity,
    incrementItem,
    decrementItem,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {notice ? (
        <div className={`cart-toast cart-toast--${notice.kind}`} role="status" aria-live="polite">
          <span className="cart-toast__icon" aria-hidden="true">✓</span>
          <span>{notice.message}</span>
        </div>
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider.');
  return context;
}
