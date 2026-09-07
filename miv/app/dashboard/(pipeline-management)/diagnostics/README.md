# Diagnostics Readiness Feature

This folder contains the route, components, and tests for the Diagnostics Readiness Tracker.

## Components

- `components/readiness-tracker.tsx` - owns checklist state and combines the feature.
- `components/readiness-summary.tsx` - displays completion count, percentage, progress bar, and review status.
- `components/readiness-checklist.tsx` - renders the checklist.
- `components/readiness-checklist-item.tsx` - renders one interactive checklist item.
- `components/readiness-data.ts` - temporary local checklist data.
- `components/readiness-utils.ts` - reusable readiness-progress calculations.
- `components/types.ts` - shared TypeScript types.

## Tests

- `tests/readiness-utils.int.spec.ts` - covers readiness-progress calculations.

## Data source

The tracker currently uses local data from `components/readiness-data.ts`.

A future API/database integration should provide readiness items to the tracker instead of relying on static data.
