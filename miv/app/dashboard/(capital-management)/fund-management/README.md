# Fund Management

## Overview

The Fund Management feature provides the dashboard view for fund operations under `/dashboard/fund-management`. It supports fund overview tracking, limited partner management, capital calls, distributions, operational tasks, and fund reports/documents.

This refactor keeps the existing desktop content and behavior while moving the implementation out of a single page file into smaller route-local modules. Mobile now uses the same data-backed content as desktop, with responsive cards and compact controls instead of a separate hardcoded mock UI.

## What It Does

- Shows portfolio-level fund management summary cards.
- Lists and filters funds by status, type, and search text.
- Shows limited partner records, KYC status, commitments, and LP detail dialogs.
- Tracks capital calls with response progress, due dates, status, and purpose.
- Tracks distributions with amount, type, tax reporting, source, LP payment status, and payment method.
- Provides operations task views with priority filtering and completion state.
- Shows reports and documents with search, report actions, and document actions.
- Fetches fund management data from `/api/fund-management?includeCapitalActivities=true&includeLPs=true`.
- Falls back to route-local mock data if the API request fails.

## Structure

```text
fund-management/
  page.tsx
  README.md
  components/
    overview-cards.tsx
    funds-section.tsx
    fund-grid.tsx
    fund-mobile-card.tsx
    fund-detail-dialog.tsx
    lps-section.tsx
    lp-dialog.tsx
    lp-summary.tsx
    capital-calls-section.tsx
    capital-call-mobile-card.tsx
    distributions-section.tsx
    distribution-mobile-card.tsx
    operations-section.tsx
    reports-documents-section.tsx
    responsive-list.tsx
    tabs-section.tsx
  data/
    fund-management.ts
  hooks/
    useFundManagementData.ts
  tests/
    fund-management.test.ts
    operations.test.ts
  types/
    fund-management.ts
```

## Route Placement

The feature belongs inside:

```text
app/dashboard/(capital-management)/fund-management
```

The earlier PR placed the refactor files in:

```text
app/dashboard/fund-management
```

That location was invalid for this route because the actual `page.tsx` imports sibling folders like `./components`, `./hooks`, `./types`, and `./data`. Keeping those folders outside the route group breaks the route imports. The refactor folders were moved into the route group and the stray top-level folder was removed.

## Responsive Behavior

Desktop keeps the established dashboard layout:

- Overview cards.
- Tabbed sections.
- Desktop card grids and tables.
- Existing actions and dialogs.

Mobile now uses the same feature data and tab sections:

- No hardcoded mobile-only fund content.
- No content differences between desktop and mobile.
- Mobile-specific cards are used where available.
- Desktop grids/tables are hidden on small screens to avoid duplicate content.

## Validation

Focused validation passed for this route:

```text
npx.cmd eslint "app/dashboard/(capital-management)/fund-management/**/*.{ts,tsx}"
```

```text
npx.cmd vitest run --config ./vitest.fund-management.config.mts
```

The focused Vitest run passed with 2 test files and 57 tests. A temporary config was used because the repository Vitest config only includes `tests/int/**/*.int.spec.ts`, so colocated route tests are not discovered by the default config.

## Remaining Issues

- Repository-wide `npm.cmd run typecheck` still fails because of unrelated existing TypeScript errors in API routes, seed scripts, auth hooks, and social-impact tests.
- The fund-management route had no remaining typecheck errors after fixing the local mock data issues.
- The colocated fund-management tests are valid, but they are not picked up by the default `vitest.config.mts` include pattern. If these tests should run in CI, update the main Vitest config or move these tests into an included test directory.
