import { Link } from 'react-router-dom';
import { CartIcon, SearchIcon } from './Icons.jsx';
import './States.css';

export default function EmptyState({ type = 'search', title, message, actionLabel, onAction, to }) {
  const Icon = type === 'cart' ? CartIcon : SearchIcon;
  const content = (
    <>
      <Icon size={38} />
    </>
  );
  return (
    <section className="state-panel state-panel--empty">
      <div className="state-panel__icon">{content}</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {to ? (
        <Link className="primary-button state-panel__button state-panel__link" to={to}>{actionLabel}</Link>
      ) : (
        <button type="button" className="secondary-button state-panel__button" onClick={onAction}>{actionLabel}</button>
      )}
    </section>
  );
}
