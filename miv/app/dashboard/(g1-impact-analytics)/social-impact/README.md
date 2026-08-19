# Social Impact

Post-refactor handoff for the Social Impact route.

## Route

- URL: `/dashboard/social-impact`
- Route file: `miv/app/dashboard/(g1-impact-analytics)/social-impact/page.tsx`
- Next.js route group: `(g1-impact-analytics)` is not part of the URL.
- Parent dashboard layout: `miv/app/dashboard/layout.tsx`

This folder implements a client-side dashboard for reviewing social outcomes, GEDSI progress, and community engagement across portfolio ventures. The feature reads venture data from the existing ventures API and derives summary cards, GEDSI metrics, sector views, venture cards, and analytics in the browser.

## Refactor Status

The route is now a thin composition layer. `page.tsx` only renders `SocialImpactPage`, while the feature implementation is split into focused components, a data hook, feature-local types, and pure helper functions.

The page currently behaves as a read-only analytics view. It fetches live venture records, computes display aggregates locally, and provides local filtering and refresh behavior. It does not create, update, or persist social impact records from this route.

## Current Folder Structure

```text
social-impact/
  page.tsx
  README.md
  components/
    gedsi-metrics-section.tsx
    impact-analytics-section.tsx
    impact-highlights.tsx
    impact-overview-section.tsx
    impact-stat-cards.tsx
    social-impact-filters.tsx
    social-impact-header.tsx
    social-impact-page.tsx
    social-impact-states.tsx
    venture-impact-section.tsx
  hooks/
    use-social-impact-data.ts
  lib/
    social-impact-calculations.ts
    social-impact-filters.ts
    social-impact-formatters.ts
  types/
    social-impact.ts
```

## Main Responsibilities

### `page.tsx`

Thin route composition only. It imports and renders `SocialImpactPage`.

Avoid moving data fetching, filtering, or aggregation logic back into this file.

### `components/social-impact-page.tsx`

Owns the top-level client-side page composition:

- calls `useSocialImpactData()`
- owns local filter state
- derives portfolio totals and GEDSI metrics
- derives filtered ventures and filtered metrics
- renders loading, error, empty, and tabbed content states

The main tabs are:

- Impact Overview
- GEDSI Metrics
- Venture Impact
- Analytics

### `hooks/use-social-impact-data.ts`

Owns the browser-side data fetch cycle:

- `GET /api/ventures?limit=100`

It validates that the response's `ventures` field is either absent or an array, stores the resulting venture list, exposes loading and refreshing state, and aborts in-flight requests when a newer request starts or the component unmounts.

### `types/social-impact.ts`

Contains feature-local types for the venture fields and GEDSI metric fields this page reads.

Important distinction:

- `SocialImpactVenture` describes the subset of venture API fields used by this page.
- `GedsiMetric` describes nested GEDSI metric objects as consumed by the UI.
- `SocialImpactTotals` and `SocialImpactFilters` are UI-specific types for local aggregate and filter state.

### `lib/social-impact-calculations.ts`

Contains pure helpers for:

- aggregating beneficiaries, jobs, locations, women empowered, disability inclusion, and youth engagement totals
- flattening GEDSI metrics from ventures
- calculating metric progress
- determining completion status
- calculating GEDSI completion rate
- parsing `founderTypes` from either an array or JSON string

### `lib/social-impact-filters.ts`

Contains pure helpers for:

- searching ventures by name, sector, or inclusion focus
- filtering by sector and status
- deriving sector/status filter options from fetched ventures
- detecting whether filters are active

### `lib/social-impact-formatters.ts`

Contains small display helpers for count and label formatting.

### `components/*`

Presentation components are split by dashboard section:

- `social-impact-header.tsx`: title, refresh action, and Track Impact link to `/dashboard/gedsi-tracker`.
- `impact-stat-cards.tsx`: portfolio-level summary cards.
- `impact-highlights.tsx`: secondary impact highlight metrics.
- `impact-overview-section.tsx`: impact by sector and GEDSI category progress.
- `gedsi-metrics-section.tsx`: metric-level GEDSI tracking list.
- `venture-impact-section.tsx`: venture cards with beneficiaries, GEDSI counts, founder types, team size, and stage.
- `impact-analytics-section.tsx`: portfolio social performance and top impact drivers.
- `social-impact-filters.tsx`: local venture search, sector filter, status filter, and clear action.
- `social-impact-states.tsx`: loading, error, and empty states.

## What Was Achieved

- The route entrypoint is small and only delegates to the feature component.
- Data fetching is isolated in `useSocialImpactData`.
- Aggregate calculations and filter behavior are pure helpers under `lib`.
- Feature-local TypeScript types document the API fields this dashboard expects.
- Loading, error, empty, and filtered-empty states are explicit.
- The refresh button reuses the same data-loading path while exposing a separate refreshing state.
- The Track Impact action routes users to the GEDSI tracker instead of attempting writes from this dashboard.

## Preserved Behavior

These behaviors exist now and should be treated as intentional unless changed in a dedicated feature update:

- The page reads only `/api/ventures?limit=100`.
- All totals are derived client-side from the returned ventures.
- Filters are client-local and reset on page refresh.
- The analytics tab uses the currently filtered venture list.
- Impact ranking is based on `socialImpactScore`, defaulting missing scores to `0`.
- Location count is based on the first comma-separated part of each venture location.
- Negative, non-finite, or missing numeric impact values are treated as `0`.
- GEDSI completion treats only `VERIFIED` and `COMPLETED` as complete.
- The dashboard does not persist filters, calculations, or user preferences.

## Known Remaining Issues

Fix these as explicit follow-up changes, not silently during unrelated cleanup.

1. This page assumes GEDSI metrics are nested on each venture as `gedsiMetrics`; it does not fetch `/api/gedsi-metrics` directly.
2. `founderTypes` parsing supports arrays and JSON strings, but non-JSON string values are ignored.
3. `venture-impact-section.tsx` has a local `formatLabel` helper that only replaces hyphens, while `social-impact-formatters.ts` replaces underscores. Consolidate if label formatting needs to be consistent.
4. The route has no direct create/edit workflow for social impact metrics; users are sent to `/dashboard/gedsi-tracker` for tracking.
5. The analytics view is card-based only and does not currently render charts.
6. Full interactive browser verification has not been recorded in this README.

## API Contract Notes

Current endpoint assumptions:

| Endpoint | Current use | Status |
| --- | --- | --- |
| `/api/ventures?limit=100` | Reads `ventures[]` and optional `pagination`/`isMobile` fields | Working assumption |

Venture fields currently consumed by the page:

- `id`
- `name`
- `sector`
- `location`
- `stage`
- `status`
- `teamSize`
- `inclusionFocus`
- `founderTypes`
- `gedsiMetrics`
- `socialImpactScore`
- `totalBeneficiaries`
- `jobsCreated`
- `womenEmpowered`
- `disabilityInclusive`
- `youthEngaged`

When changing the ventures API shape, update `types/social-impact.ts`, `hooks/use-social-impact-data.ts`, and the relevant calculation or display helpers together.

## Development Guidance

- Keep `page.tsx` as a route wrapper only.
- Keep fetch orchestration inside `hooks/use-social-impact-data.ts`.
- Keep pure transformations in `lib`.
- Keep React components out of `lib`.
- Do not add persistence or mutation behavior inside this folder without confirming the backend contract.
- Avoid widening feature types with `any`; add explicit optional fields when the API contract is partial.
- If the GEDSI tracker becomes the canonical write path, keep this dashboard read-only and link outward for write actions.
- If you fix a preserved limitation, update this README in the same change.

## Suggested Next Work

1. Confirm whether `gedsiMetrics` should continue to be nested on ventures or fetched from a dedicated GEDSI endpoint.
2. Consolidate label formatting for founder types and GEDSI categories/statuses.
3. Add chart visualizations to the analytics view if social performance trends are required.
4. Add tests for aggregate calculations, filtering, and invalid ventures API responses.
5. Add browser-level verification for loading, refresh, filters, tabs, error state, and mobile layout.

## Validation Notes

No validation command was run as part of creating this README. This change is documentation-only.
