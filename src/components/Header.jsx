import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Brand from './Brand.jsx';
import SearchField from './SearchField.jsx';
import { ArrowLeftIcon, CartIcon, MenuIcon } from './Icons.jsx';
import { useCart } from '../context/CartContext.jsx';
import './Header.css';

function getMobileTitle(pathname) {
  if (pathname.startsWith('/products/')) return 'Product details';
  if (pathname === '/cart') return 'Your cart';
  return '';
}

export default function Header({ searchValue = '', onSearchChange, onSearchSubmit, mobileTitle: mobileTitleOverride }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('vitrine-alegre-demo-auth') === '1';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isStorefront = location.pathname === '/';
  const mobileTitle = mobileTitleOverride || getMobileTitle(location.pathname);

  useEffect(() => {
    if (!signInOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSignInOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [signInOpen]);

  const submitSignIn = (event) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    window.localStorage.setItem('vitrine-alegre-demo-auth', '1');
    setSignedIn(true);
    setPassword('');
    setSignInOpen(false);
  };

  const signOut = () => {
    window.localStorage.removeItem('vitrine-alegre-demo-auth');
    setSignedIn(false);
    setEmail('');
    setPassword('');
    setSignInOpen(false);
  };

  const submitSearch = (term) => {
    if (isStorefront) {
      onSearchSubmit?.(term);
      return;
    }
    navigate(term ? `/?search=${encodeURIComponent(term)}` : '/');
  };

  return (
    <header className={`site-header ${isStorefront ? 'site-header--storefront' : ''}`}>
      <div className="site-header__bar">
        <div className="container site-header__inner">
          <div className="site-header__mobile-leading">
            {isStorefront ? (
              <button
                type="button"
                className="site-header__icon-button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                <MenuIcon size={23} />
              </button>
            ) : (
              <button
                type="button"
                className="site-header__icon-button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeftIcon size={23} />
              </button>
            )}
          </div>

          <div className="site-header__brand-wrap">
            <Brand />
            {mobileTitle ? <span className="site-header__mobile-title">{mobileTitle}</span> : null}
          </div>

          <div className="site-header__desktop-search">
            <SearchField
              value={searchValue}
              onChange={isStorefront ? onSearchChange : undefined}
              onSubmit={submitSearch}
            />
          </div>

          <button
            type="button"
            className="site-header__sign-in"
            onClick={() => setSignInOpen(true)}
            aria-haspopup="dialog"
          >
            {signedIn ? 'Account' : 'Sign in'}
          </button>

          <Link className="cart-button" to="/cart" aria-label={`Cart with ${totalItemCount} items`}>
            <span className="cart-button__icon-wrap">
              <CartIcon size={23} />
              {totalItemCount > 0 ? <span className="cart-button__badge">{totalItemCount > 99 ? '99+' : totalItemCount}</span> : null}
            </span>
            <span className="cart-button__label">Cart</span>
          </Link>
        </div>
      </div>

      {isStorefront ? (
        <div className="site-header__mobile-search">
          <div className="container">
            <SearchField value={searchValue} onChange={onSearchChange} onSubmit={submitSearch} />
          </div>
        </div>
      ) : null}

      {signInOpen ? (
        <div className="sign-in-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSignInOpen(false); }}>
          <section className="sign-in-dialog" role="dialog" aria-modal="true" aria-labelledby="sign-in-title">
            <button type="button" className="sign-in-dialog__close" onClick={() => setSignInOpen(false)} aria-label="Close sign in">×</button>
            <h2 id="sign-in-title">{signedIn ? 'Your account' : 'Sign in'}</h2>
            {signedIn ? (
              <>
                <p>You are signed in on this device.</p>
                <button type="button" className="primary-button sign-in-dialog__submit" onClick={signOut}>Sign out</button>
              </>
            ) : (
              <form onSubmit={submitSignIn}>
                <label>
                  <span>Email</span>
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required autoFocus />
                </label>
                <label>
                  <span>Password</span>
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
                </label>
                <button type="submit" className="primary-button sign-in-dialog__submit">Sign in</button>
                <p className="sign-in-dialog__note">Demo sign in only — no account data is sent to a server.</p>
              </form>
            )}
          </section>
        </div>
      ) : null}

      {menuOpen && isStorefront ? (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <div className="container mobile-menu__inner">
            <Link to="/" onClick={() => setMenuOpen(false)}>Storefront</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({totalItemCount})</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
