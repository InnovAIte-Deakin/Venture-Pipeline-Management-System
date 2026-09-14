# Diagnostics Readiness Feature

This route folder contains the Diagnostics page and its readiness tracker internals.

## Components

- `page.tsx` - renders the dashboard diagnostics route.
- `components/readiness-tracker.tsx` - owns checklist state and combines the feature.
- `components/readiness-summary.tsx` - displays completion count, percentage, progress bar, and review status.
- `components/readiness-checklist.tsx` - renders the checklist.
- `components/readiness-checklist-item.tsx` - renders one interactive checklist item.
- `data/readiness-data.ts` - temporary local checklist data.
- `lib/readiness-utils.ts` - reusable readiness-progress calculations.
- `types/readiness.ts` - shared TypeScript types.

## Data source

The tracker currently uses local data from `data/readiness-data.ts`.

A future API/database integration should provide readiness items to the tracker instead of relying on static data.
