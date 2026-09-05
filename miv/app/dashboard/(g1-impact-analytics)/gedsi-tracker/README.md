# GEDSI Tracker

The GEDSI Tracker is the G1 Impact Analytics dashboard page for monitoring Gender Equality, Disability, and Social Inclusion metrics across ventures.

## Refactor Issue

Ganesh-D9 created several files and folders inside this `gedsi-tracker` route folder, but the live page was still wired to the old monolithic component:

```tsx
import { GEDSITracker } from "@/components/gedsi-tracker"
```

Because of that, the refactor was not actually active. The App Router page rendered `miv/components/gedsi-tracker.tsx`, while the new files in this folder were mostly unused. Some of the pre-created files also had incomplete imports, such as references to a non-existent global GEDSI hook.

## Fix Applied

The live GEDSI tracker was moved into this route folder and split into route-local modules, following the same pattern used by `deal-flow`.

The page now imports local GEDSI tracker modules:

```tsx
import { GedsiTrackerContent } from "./components/gedsi-tracker-content"
import { useGedsiData } from "./hooks/use-gedsi-data"
```

The old global component at `miv/components/gedsi-tracker.tsx` was removed, and stale/incomplete placeholder files were replaced with working route-local components.

## Current Structure

```text
gedsi-tracker/
  page.tsx
  README.md
  components/
    filters-bar.tsx
    gedsi-insights-card.tsx
    gedsi-tracker-content.tsx
    gedsi-tracker-header.tsx
    gedsi-tracker-tabs.tsx
    overview-cards.tsx
    dialogs/
      add-metric-form.tsx
  constants/
    gedsi-tracker.constants.ts
  hooks/
    use-gedsi-data.ts
  lib/
    gedsi-tracker-utils.tsx
  types/
    gedsi-tracker.types.ts
```

## Module Responsibilities

- `page.tsx`: Small route entrypoint. Creates GEDSI tracker state with `useGedsiData` and renders `GedsiTrackerContent`.
- `hooks/use-gedsi-data.ts`: Owns fetching ventures, GEDSI metrics, AI insights, filtering, export, add metric, and update metric actions.
- `components/gedsi-tracker-content.tsx`: Composes the page layout, loading state, header, overview, insights, filters, and tabs.
- `components/gedsi-tracker-header.tsx`: Page title, export action, AI insights button, and add-metric dialog.
- `components/gedsi-tracker-tabs.tsx`: Main tabbed sections for metrics, venture performance, Washington Group, and analytics charts.
- `components/dialogs/add-metric-form.tsx`: Add metric form with IRIS+ metric search.
- `components/filters-bar.tsx`: Venture, category, and status filters.
- `components/overview-cards.tsx`: GEDSI category and overall progress cards.
- `components/gedsi-insights-card.tsx`: AI/UN standards insight summary cards.
- `types/gedsi-tracker.types.ts`: Shared GEDSI tracker types.
- `constants/gedsi-tracker.constants.ts`: Shared categories, chart colors, Washington Group questions, and development fallback data.
- `lib/gedsi-tracker-utils.tsx`: API metric mapping and status display helpers.

## Mobile UX Notes

The desktop layout should stay unchanged where possible. Mobile-specific improvements are handled with responsive classes inside the existing route-local components.

- The page title uses black text instead of the earlier gradient title treatment.
- Header actions stay in one compact row with three buttons.
- `Add Metric` is the primary action: black background with white text.
- `UN Standards Report` and `AI Insights` are secondary actions: outlined buttons.
- The export label shortens to `Export` on small screens so the header row fits.
- The metrics table remains the desktop format from `md` and up.
- On mobile, metrics render as cards instead of a table, showing venture, metric code/name, status, current value, target value, and progress.
- Venture performance rows stack on mobile so the progress bar and action button do not squeeze the venture text.
- The add-metric form stacks fields on mobile and only uses two columns from `md` and up.

## Validation Notes

After the refactor, searches confirmed there are no remaining imports of the old `@/components/gedsi-tracker` component. Project-wide `npm.cmd run typecheck` still fails due to unrelated existing TypeScript errors outside this module, but no errors remain under this `gedsi-tracker` route folder.
