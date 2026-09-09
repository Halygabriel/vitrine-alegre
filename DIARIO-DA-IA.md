# AI Development Diary

The notes below document genuine implementation/debugging issues encountered while building Vitrine Alegre.

## Issue 1 — Search and category could not be represented by one native DummyJSON listing route

**1. What went wrong**  
The storefront requirements allow search and category to be active simultaneously, but DummyJSON exposes product search and category listing as separate endpoints rather than a single combined filter route.

**2. How the problem was detected**  
It became clear while designing `listProducts()` against the API contract and checking the required shared URL example.

**3. Why it happened**  
The assignment's storefront state is richer than the filtering combination offered by one DummyJSON endpoint.

**4. How it was corrected**  
`src/services/api.js` detects the combined search+category case, requests the complete search result set once (`limit=0`), filters by category locally, applies the selected local sort, and then slices the requested 12-item page. Components still call one clean service function and never know which endpoint strategy is used.

**5. What was learned**  
An API abstraction should represent the application's use cases, not merely mirror remote endpoint names one-for-one.

## Issue 2 — Two responsive search fields would have generated the same DOM ID

**1. What went wrong**  
The header renders a desktop search field and a mobile search field in the same component tree. The first version derived each input ID directly from the same accessibility label, creating duplicate IDs even though CSS hides one field at a time.

**2. How the problem was detected**  
The duplicate became visible during the accessibility review of the shared header component.

**3. Why it happened**  
The input ID was generated from a constant label instead of being unique per component instance.

**4. How it was corrected**  
`SearchField` now uses React's `useId()` and connects its `<label>` to that unique ID.

**5. What was learned**  
Responsive variants that coexist in the DOM still need globally valid accessibility relationships, even when one variant is visually hidden.

## Issue 3 — A bookmarked page number could become invalid after filters changed

**1. What went wrong**  
A user can open a URL such as `?page=17` and then apply a search/category combination whose result set has only one or two pages. Without correction, the UI can request a valid API call but display an artificial empty page.

**2. How the problem was detected**  
This appeared during the URL-state audit while checking refresh, Back/Forward, and filter/page interaction against the assignment rules.

**3. Why it happened**  
The current page comes from the URL and can outlive the result set that originally made it valid.

**4. How it was corrected**  
After each listing response, the storefront calculates the page count from `total`. If the requested page exceeds that count and there are results, it replaces the URL with the last valid page and lets the normal request effect reload that page.

**5. What was learned**  
URL state is user-editable input and should be normalized just like form input.

## Issue 4 — The mobile product header initially showed a generic title instead of the actual product title

**1. What went wrong**  
The first shared-header implementation returned `Product details` for every `/products/:id` mobile route, while the supplied mobile mockup uses the product name in the compact top bar.

**2. How the problem was detected**  
It was found during direct comparison with `05-responsivo-mobile.png`.

**3. Why it happened**  
The header only had route-level knowledge and did not accept loaded page data.

**4. How it was corrected**  
`Header` now accepts an optional `mobileTitle` override. `ProductDetails` passes `product.title` after the product loads and falls back to a generic loading title while the request is pending.

**5. What was learned**  
A reusable layout component should own presentation while allowing route pages to supply data-dependent labels.

## Issue 5 — The desktop cart summary could not simply shrink on mobile

**1. What went wrong**  
A responsive pass that only reduced desktop dimensions would leave the right-side order-summary panel competing with cart rows on a 360 px viewport, unlike the supplied reference.

**2. How the problem was detected**  
The mismatch was visible when comparing `03-carrinho.png` with the mobile cart in `05-responsivo-mobile.png`.

**3. Why it happened**  
The source design changes interaction structure on mobile: the summary is a fixed bottom action area, not a narrow desktop sidebar.

**4. How it was corrected**  
The desktop `order-summary` is hidden at the mobile breakpoint. A compact `mobile-cart-summary` is fixed to the bottom with the derived total and checkout button, while the cart page receives enough bottom padding to keep rows scrollable above it. The mobile cart footer is also suppressed so it does not compete with the fixed action area.

**5. What was learned**  
Responsive fidelity sometimes requires a layout mode change, not proportional shrinking.

## Issue 6 — The first mobile detail composition remained too tall and information-dense

**1. What went wrong**  
The desktop detail layout includes breadcrumb, SKU/brand metadata, three fulfillment cards, specifications, and reviews. Stacking every block unchanged made the 360 px page diverge from the much more focused supplied mobile reference.

**2. How the problem was detected**  
The issue emerged during the mobile visual checklist against the center phone in `05-responsivo-mobile.png`.

**3. Why it happened**  
Desktop information hierarchy was initially being treated as if responsive behavior meant only changing grid columns.

**4. How it was corrected**  
At the mobile breakpoint the gallery, title/rating/pricing/stock/actions, and description remain in the reference reading order; breadcrumb, desktop metadata divider, fulfillment cards, specifications, reviews, and tags are removed from the compact visual flow. The full information remains available on wider layouts.

**5. What was learned**  
Responsive implementation should preserve the source's hierarchy and task focus, not merely preserve every desktop block at a smaller width.

## Issue 7 — Making the entire product card one anchor would conflict with the Add button

**1. What went wrong**  
The card needs an obvious navigation target and an independent `Add` action. Wrapping the entire card in a link would place a button inside an anchor, creating invalid/ambiguous interactive markup.

**2. How the problem was detected**  
This was identified during the semantic HTML and keyboard accessibility review of `ProductCard`.

**3. Why it happened**  
The visual mockup makes the card feel like one unit, but HTML interaction semantics require separate controls.

**4. How it was corrected**  
The image and product title are explicit links to `/products/:id`; the Add action remains a sibling button inside the card. Hover/focus styling keeps the card visually cohesive.

**5. What was learned**  
Visual grouping and interactive semantics do not need to map to one giant clickable element.
