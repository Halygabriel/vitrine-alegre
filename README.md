# Vitrine Alegre

Vitrine Alegre is a responsive academic storefront built with React and Vite from the supplied assignment specification and visual mockups. It consumes the DummyJSON Products API, keeps storefront filters in the URL, converts discounted USD prices to BRL using the assignment's fixed exchange rate, and provides product details plus a persistent shopping cart.

## Technologies

- React 18
- Vite 5
- React Router DOM 6
- Modern JavaScript and React Hooks
- Native CSS only
- Fetch API with `AbortController`
- Browser `localStorage`
- Node's built-in test runner for focused logic tests

No CSS framework, component library, global state library, or data-fetching library is used.

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- Internet access while installing dependencies and while using the live DummyJSON API

## Install and run

```bash
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production bundle is generated in `dist/`.

## Tests

```bash
npm test
```

The focused tests cover pricing, discount rules, non-mutating sorting, DummyJSON response handling, combined search/category behavior, HTTP failures, invalid product IDs, and category validation.

## Routes

- `/` — storefront and product listing
- `/products/:id` — product details loaded directly from the route parameter
- `/cart` — shared shopping cart
- any other route — controlled 404 page with a return action

`public/_redirects` and `vercel.json` provide SPA fallbacks for common static hosts so direct route refreshes can resolve to `index.html`.

## API

All external product API communication is centralized in `src/services/api.js`.

The service exposes:

- `listProducts({ page, search, category, sort, signal })`
- `getProduct(id, { signal })`
- `listCategories({ signal })`

The implementation validates `response.ok`, validates important response shapes, uses `data.products` for listings, preserves the API-provided `total`, and reports controlled English error messages.

DummyJSON exposes search and category listing as separate routes. When both a search term and category are active, the service fetches the complete search result set once, applies the category filter and selected sort locally, and then paginates the combined result. This keeps the behavior represented by the shared storefront URL without scattering endpoint knowledge across components.

## Storefront URL state

Storefront state is represented with query parameters instead of existing only in transient component state. Examples:

```text
/?search=phone
/?category=smartphones&page=2
/?search=phone&category=smartphones&sort=price-asc&page=2
```

Supported parameters:

- `search`
- `category`
- `page`
- `sort`

Search uses a 400 ms debounce before the URL is updated. Changing the search term, category, or sort resets the current page to page 1. Browser Back, Forward, refresh, bookmarks, and shared URLs therefore preserve storefront state. If filters make a previously valid page number exceed the new page count, the URL is safely replaced with the last valid page.

## Pagination

The listing uses 12 products per page:

```js
skip = (page - 1) * 12
```

The page count is calculated from the API `total`, never from the length of the current page's product array.

## Pricing

Pricing helpers live in `src/utils/pricing.js` and `src/utils/currency.js`.

```text
final USD price = price × (1 - discountPercentage / 100)
BRL exchange rate = 5.20
```

BRL values use `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` as required by the assignment. A discount badge is displayed only when `discountPercentage >= 5`.

## Cart architecture

`src/context/CartContext.jsx` is the single shared cart source for the header, product cards, product details, and cart page.

The context supports:

- adding a product;
- merging repeated additions into the same row;
- removing an item;
- incrementing/decrementing safely through quantity controls;
- setting a quantity while respecting stock;
- deriving the total quantity badge;
- persisting the item list in `localStorage`.

The cart stores only the item quantity and a compact product snapshot. Subtotal, discount, and total are always derived from the current cart items and are not kept as separately synchronized state.

The checkout action is intentionally limited to an explanatory in-page status message because real checkout/payment integration is outside the assignment scope; the button is not left inert.

## Responsive behavior

The same React component tree adapts with CSS to the supplied responsive model:

- desktop: four product columns;
- tablet: two product columns;
- mobile: one product column;
- compact mobile header with menu/back control and cart badge;
- mobile product detail with stacked gallery/content;
- mobile cart rows with a fixed bottom total/checkout area.

Primary QA widths are 360 px, 768 px, and 1440 px. Layout rules avoid horizontal overflow by allowing content columns to shrink, truncating long labels where appropriate, and making category pills horizontally scrollable on small screens.

## Loading, error, and empty states

The application includes:

- product-card skeletons while the storefront is loading;
- a product-detail skeleton;
- controlled network error panels with functional `Try again` actions;
- a no-search-results state distinct from network failure;
- an empty-cart state with a route back to the store;
- a controlled product-not-found state for invalid IDs;
- a 404 route.

Applicable requests are cancelled with `AbortController` when parameters change or a component unmounts, preventing stale responses from replacing newer results.

## Accessibility extensions

The implementation includes practical accessibility without changing the reference design:

- semantic headings, navigation, sections, articles, lists/definitions where useful;
- real buttons for actions and real links for navigation;
- unique form control IDs;
- descriptive image alternatives;
- visible `:focus-visible` states;
- labels for icon-only controls;
- live status text for cart additions and checkout feedback;
- keyboard-operable product gallery thumbnails, including Left/Right Arrow navigation;
- active pagination/category semantics with `aria-current` and `aria-pressed`.

## Main project structure

```text
src/
  components/          shared visual and interactive components
  context/
    CartContext.jsx    global cart state + persistence
  hooks/
    useDebouncedValue.js
  pages/
    Storefront.jsx
    ProductDetails.jsx
    Cart.jsx
    NotFound.jsx
  services/
    api.js             all DummyJSON requests
  styles/
    global.css
  utils/
    currency.js
    pricing.js
    products.js
  App.jsx
  main.jsx
tests/
  api.test.js
  pricing.test.js
```

## Implemented assignment extensions

1. Cart persistence with `localStorage`.
2. `AbortController` request cancellation.
3. Accessibility and keyboard improvements.
4. Reusable custom debounce hook for storefront search.

## Design decisions

- The supplied palette is implemented as CSS custom properties and reused throughout the application.
- Product cards preserve the reference's image/body split, compact metadata hierarchy, rating, original/final price treatment, discount badge, and green primary action.
- Image/title regions navigate to details while `Add` remains a separate button. This deliberately avoids invalid nested interactive elements such as a button inside an anchor.
- The mobile cart uses the reference's compact card rows and fixed bottom action area rather than shrinking the desktop order-summary panel.
- UI copy is English as required by the implementation brief, while monetary formatting remains BRL/`pt-BR` as required by the source assignment.

## Deployment

Any static host that supports SPA rewrites can serve the built `dist/` directory. Netlify can use the included `public/_redirects`; Vercel can use the included `vercel.json`. For another host, configure unknown application paths to return `index.html` so `/products/:id` and `/cart` refresh correctly.
