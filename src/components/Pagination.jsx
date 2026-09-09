import { ChevronLeftIcon, ChevronRightIcon } from './Icons.jsx';
import './Pagination.css';

function pageTokens(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, 'ellipsis-right', totalPages];
  if (page >= totalPages - 3) return [1, 'ellipsis-left', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, 'ellipsis-left', page - 1, page, page + 1, 'ellipsis-right', totalPages];
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const tokens = pageTokens(page, totalPages);
  return (
    <nav className="pagination" aria-label="Product pages">
      <button type="button" className="pagination__button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeftIcon size={15} />
      </button>
      {tokens.map((token) => (
        typeof token === 'number' ? (
          <button
            key={token}
            type="button"
            className={`pagination__button ${token === page ? 'pagination__button--active' : ''}`}
            onClick={() => onChange(token)}
            aria-current={token === page ? 'page' : undefined}
            aria-label={`Page ${token}`}
          >{token}</button>
        ) : <span className="pagination__ellipsis" key={token} aria-hidden="true">…</span>
      ))}
      <button type="button" className="pagination__button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRightIcon size={15} />
      </button>
    </nav>
  );
}
