import { AlertIcon } from './Icons.jsx';
import './States.css';

export default function ErrorState({ title = "We couldn't load the products.", message = 'Check your connection and try again.', onRetry, actionLabel = 'Try again' }) {
  return (
    <section className="state-panel" role="alert">
      <div className="state-panel__icon state-panel__icon--error"><AlertIcon size={34} /></div>
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry ? <button type="button" className="primary-button state-panel__button" onClick={onRetry}>{actionLabel}</button> : null}
    </section>
  );
}
