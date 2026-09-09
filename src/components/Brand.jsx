import { Link } from 'react-router-dom';
import './Brand.css';

export default function Brand({ compact = false }) {
  return (
    <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="Vitrine Alegre storefront">
      <span className="brand__mark" aria-hidden="true">V</span>
      <span className="brand__name">Vitrine <strong>Alegre</strong></span>
    </Link>
  );
}
