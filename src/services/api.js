import { PRODUCTS_PER_PAGE, getRemoteSort, sortProducts } from '../utils/products.js';

const API_BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
  }
}

function appendSortParams(params, sort) {
  const remoteSort = getRemoteSort(sort);
  if (remoteSort) {
    params.set('sortBy', remoteSort.sortBy);
    params.set('order', remoteSort.order);
  }
}

async function requestJson(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ApiError("We couldn't reach the product service.", { cause: error });
  }

  if (!response.ok) {
    const message = response.status === 404
      ? 'The requested product was not found.'
      : `The product service returned HTTP ${response.status}.`;
    throw new ApiError(message, { status: response.status });
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('The product service returned an invalid response.', {
      status: response.status,
      cause: error,
    });
  }
}

function validateProductList(data) {
  if (!data || !Array.isArray(data.products) || !Number.isFinite(Number(data.total))) {
    throw new ApiError('The product service returned an unexpected list format.');
  }
  return {
    products: data.products,
    total: Number(data.total),
    skip: Number(data.skip) || 0,
    limit: Number(data.limit) || PRODUCTS_PER_PAGE,
  };
}

function paginateLocally(products, page) {
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  return products.slice(start, start + PRODUCTS_PER_PAGE);
}

/**
 * Lists products while keeping DummyJSON endpoint details out of components.
 * Search + category is handled by fetching the search result set once, then
 * applying the category filter locally because DummyJSON exposes those as
 * separate endpoints rather than one combined filter endpoint.
 */
export async function listProducts({
  page = 1,
  search = '',
  category = '',
  sort = 'relevance',
  signal,
} = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const normalizedSearch = search.trim();
  const normalizedCategory = category.trim();
  const skip = (safePage - 1) * PRODUCTS_PER_PAGE;
  const needsLocalCombination = Boolean(normalizedSearch && normalizedCategory);

  if (needsLocalCombination) {
    const params = new URLSearchParams({ q: normalizedSearch, limit: '0' });
    const data = validateProductList(await requestJson(`/products/search?${params}`, { signal }));
    const filtered = data.products.filter((product) => product.category === normalizedCategory);
    const sorted = sortProducts(filtered, sort);
    return {
      products: paginateLocally(sorted, safePage),
      total: sorted.length,
      skip,
      limit: PRODUCTS_PER_PAGE,
    };
  }

  const params = new URLSearchParams({
    limit: String(PRODUCTS_PER_PAGE),
    skip: String(skip),
  });
  appendSortParams(params, sort);

  let path = '/products';
  if (normalizedSearch) {
    params.set('q', normalizedSearch);
    path = '/products/search';
  } else if (normalizedCategory) {
    path = `/products/category/${encodeURIComponent(normalizedCategory)}`;
  }

  return validateProductList(await requestJson(`${path}?${params}`, { signal }));
}

export async function getProduct(id, { signal } = {}) {
  const normalizedId = String(id ?? '').trim();
  if (!/^\d+$/.test(normalizedId) || Number(normalizedId) < 1) {
    throw new ApiError('The requested product was not found.', { status: 404 });
  }

  const product = await requestJson(`/products/${encodeURIComponent(normalizedId)}`, { signal });
  if (!product || !Number.isFinite(Number(product.id))) {
    throw new ApiError('The product service returned an unexpected product format.');
  }
  return product;
}

export async function listCategories({ signal } = {}) {
  const categories = await requestJson('/products/category-list', { signal });
  if (!Array.isArray(categories) || !categories.every((category) => typeof category === 'string')) {
    throw new ApiError('The product service returned an unexpected category format.');
  }
  return categories;
}
