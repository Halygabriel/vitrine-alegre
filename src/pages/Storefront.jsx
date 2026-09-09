import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { ProductGridSkeleton } from '../components/LoadingSkeleton.jsx';
import Pagination from '../components/Pagination.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import SortControl from '../components/SortControl.jsx';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { listCategories, listProducts } from '../services/api.js';
import { PRODUCTS_PER_PAGE, SORT_OPTIONS } from '../utils/products.js';
import './Storefront.css';

function readPositivePage(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function isKnownSort(value) {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export default function Storefront() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = readPositivePage(searchParams.get('page'));
  const requestedSort = searchParams.get('sort') ?? 'relevance';
  const sort = isKnownSort(requestedSort) ? requestedSort : 'relevance';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [productsState, setProductsState] = useState({ products: [], total: 0, loading: true, error: null });
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  const [categoryRetryVersion, setCategoryRetryVersion] = useState(0);

  const updateParams = useCallback((updates, { replace = false } = {}) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => {
        const removable = value === '' || value === null || value === undefined || (key === 'page' && Number(value) === 1) || (key === 'sort' && value === 'relevance');
        if (removable) next.delete(key);
        else next.set(key, String(value));
      });
      return next;
    }, { replace });
  }, [setSearchParams]);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const normalized = debouncedSearch.trim();
    if (normalized === urlSearch) return;
    updateParams({ search: normalized, page: 1 });
  }, [debouncedSearch, updateParams, urlSearch]);

  useEffect(() => {
    const controller = new AbortController();
    setCategoriesLoading(true);
    setCategoriesError(false);
    listCategories({ signal: controller.signal })
      .then((data) => setCategories(data))
      .catch((error) => {
        if (error.name !== 'AbortError') setCategoriesError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCategoriesLoading(false);
      });
    return () => controller.abort();
  }, [categoryRetryVersion]);

  useEffect(() => {
    const controller = new AbortController();
    setProductsState((current) => ({ ...current, loading: true, error: null }));

    listProducts({ page, search: urlSearch, category, sort, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        const totalPages = Math.max(1, Math.ceil(data.total / PRODUCTS_PER_PAGE));
        if (data.total > 0 && page > totalPages) {
          updateParams({ page: totalPages }, { replace: true });
          return;
        }
        setProductsState({ products: data.products, total: data.total, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setProductsState((current) => ({ ...current, loading: false, error }));
      });

    return () => controller.abort();
  }, [category, page, retryVersion, sort, updateParams, urlSearch]);

  const totalPages = Math.max(1, Math.ceil(productsState.total / PRODUCTS_PER_PAGE));
  const resultSummary = useMemo(() => {
    if (productsState.loading && productsState.products.length === 0) return 'Loading products';
    if (productsState.total === 0) return '0 products';
    return `${productsState.total} ${productsState.total === 1 ? 'product' : 'products'} · page ${page} of ${totalPages}`;
  }, [page, productsState.loading, productsState.products.length, productsState.total, totalPages]);

  const handleSearchSubmit = (term) => {
    const normalized = term.trim();
    setSearchInput(normalized);
    updateParams({ search: normalized, page: 1 });
  };

  const handleCategoryChange = (nextCategory) => updateParams({ category: nextCategory, page: 1 });
  const handleSortChange = (nextSort) => updateParams({ sort: nextSort, page: 1 });
  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <Header searchValue={searchInput} onSearchChange={setSearchInput} onSearchSubmit={handleSearchSubmit} />

      <main className="app-main storefront-main">
        <section className="storefront-toolbar" aria-label="Storefront filters">
          <div className="container storefront-toolbar__inner">
            <CategoryFilter categories={categories} activeCategory={category} onChange={handleCategoryChange} loading={categoriesLoading} />
            <SortControl value={sort} onChange={handleSortChange} />
          </div>
          {categoriesError ? (
            <div className="container storefront-toolbar__category-error" role="status">
              <span>Categories could not be loaded.</span>
              <button type="button" onClick={() => setCategoryRetryVersion((value) => value + 1)}>Try again</button>
            </div>
          ) : null}
        </section>

        <section className="container page-section storefront-content" aria-labelledby="results-heading">
          <h1 id="results-heading" className="visually-hidden">Products</h1>
          <div className="storefront-result-count" aria-live="polite">{resultSummary}</div>

          {productsState.error ? (
            <ErrorState onRetry={() => setRetryVersion((value) => value + 1)} />
          ) : productsState.loading ? (
            <ProductGridSkeleton count={8} />
          ) : productsState.products.length === 0 ? (
            <EmptyState
              type="search"
              title="No products found for your search."
              message="Try a different search term or choose another category."
              actionLabel="Clear filters"
              onAction={() => {
                setSearchInput('');
                setSearchParams({});
              }}
            />
          ) : (
            <>
              <ProductGrid products={productsState.products} />
              <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
