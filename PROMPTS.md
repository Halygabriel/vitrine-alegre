# AI Prompts and Instructions Used

This file records the meaningful AI instructions that materially influenced the implementation. It intentionally omits conversational filler.

## 1. Master implementation brief

The primary instruction was the full **MASTER IMPLEMENTATION PROMPT — VITRINE ALEGRE** supplied with the assignment package. It defined the execution order, source-of-truth rules, React/Vite constraints, DummyJSON integration, routing, cart behavior, URL state, error handling, responsiveness, accessibility, documentation, QA, and final ZIP requirements.

**Used for:** the complete project scope, technical architecture, validation checklist, and definition of done.

## 2. Source hierarchy instruction

The PDF was designated as the authoritative functional specification and the supplied PNG mockups as the authoritative visual reference. The DOCX was required as a comparison source.

**Used for:** deciding behavior when prose and visuals had different levels of detail, extracting the palette/dimensions, and performing screen-by-screen visual implementation.

## 3. English-interface override

The implementation brief explicitly required every user-facing application string to be English while preserving the brand name **Vitrine Alegre** and retaining BRL currency formatting.

**Used for:** route labels, buttons, search, errors, empty states, detail labels, cart labels, 404 content, accessibility labels, and documentation.

## 4. URL-state and search instruction

The storefront was required to represent search, category, and page state in the URL and to debounce search updates by approximately 400 ms, with page resets when search/category changes.

**Used for:** `useSearchParams` architecture, the reusable `useDebouncedValue` hook, Back/Forward behavior, shared/bookmarkable URLs, and page validation.

## 5. API and cancellation instruction

All DummyJSON communication had to live in `src/services/api.js`, validate HTTP failures, use actual API fields/response shapes, and cancel obsolete requests with `AbortController`.

**Used for:** the API abstraction, request/error classes, list/detail/category validation, cancellation cleanup, and API-focused tests.

## 6. Cart architecture instruction

The cart had to be shared globally with React Context, merge duplicate product additions, persist in `localStorage`, and derive totals rather than storing synchronized total state.

**Used for:** `CartContext`, compact stored product snapshots, quantity operations, header badge, cart calculations, and refresh persistence design.

## 7. Strict visual-reproduction instruction

The implementation was explicitly told not to redesign the supplied interface or introduce an unrelated design system.

**Used for:** the four-column desktop grid, 282×444 card target, 24 px grid rhythm, brand/accent treatment, product detail split, order summary panel, mobile header, mobile stacked detail page, and fixed mobile cart summary.

## 8. Final packaging instruction

The final ZIP was required to contain project files directly at archive root, never inside a redundant second `vitrine-alegre/` folder.

**Used for:** final archive layout and extraction validation procedure.
