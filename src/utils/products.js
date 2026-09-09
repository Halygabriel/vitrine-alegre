export const PRODUCTS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating' },
  { value: 'title-asc', label: 'Name: A to Z' },
];

export function sortProducts(products, sort) {
  const copy = [...products];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'title-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy;
  }
}

export function getRemoteSort(sort) {
  switch (sort) {
    case 'price-asc':
      return { sortBy: 'price', order: 'asc' };
    case 'price-desc':
      return { sortBy: 'price', order: 'desc' };
    case 'rating-desc':
      return { sortBy: 'rating', order: 'desc' };
    case 'title-asc':
      return { sortBy: 'title', order: 'asc' };
    default:
      return null;
  }
}
