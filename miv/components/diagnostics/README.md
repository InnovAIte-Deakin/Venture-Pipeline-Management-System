# Diagnostics Readiness Feature

This folder contains the reusable components for the Diagnostics Readiness Tracker.

## Components

- `readiness-tracker.tsx` — owns checklist state and combines the feature.
- `readiness-summary.tsx` — displays completion count, percentage, progress bar, and review status.
- `readiness-checklist.tsx` — renders the checklist.
- `readiness-checklist-item.tsx` — renders one interactive checklist item.
- `readiness-data.ts` — temporary local checklist data.
- `readiness-utils.ts` — reusable readiness-progress calculations.
- `types.ts` — shared TypeScript types.

## Data source

The tracker currently uses local data from `readiness-data.ts`.

A future API/database integration should provide readiness items to the tracker instead of relying on static data.