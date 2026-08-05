# Advanced Reports

Post-refactor handoff for the Advanced Reports route.

## Route

- URL: `/dashboard/advanced-reports`
- Route file: `miv/app/dashboard/(g4-reporting-insights)/advanced-reports/page.tsx`
- Next.js route group: `(g4-reporting-insights)` is not part of the URL.
- Parent dashboard layout: `miv/app/dashboard/layout.tsx`

This folder implements a client-side reporting console for portfolio, GEDSI, workflow, user, dashboard, and analytics-style reporting. The feature currently behaves like a local reporting prototype: it reads live data from existing APIs to seed reports and charts, but generated reports, schedules, dashboard builder changes, and exports are not persisted as real backend records.

## Refactor Status

The original `page.tsx` was a large single-file implementation. The refactor has been completed and the page is now a thin composition layer that wires together:

- `useAdvancedReportsData()` for API fetches and seeded data.
- `useReportBuilder()` for report generator form state, scheduling fields, and export calls.
- `useDashboardBuilder()` for the dashboard builder scratch layout.
- `useViewport()` for desktop/mobile presentation selection.
- Separate desktop and mobile component trees.

The important behavior was intentionally preserved, including several known bugs and prototype limitations. Do not assume something is accidentally missing just because the new files are smaller; many missing backend behaviors were already absent before the refactor.

## Current Folder Structure

```text
advanced-reports/
  page.tsx
  README.md
  components/
    advanced-reports-header.tsx
    report-filters.tsx
    report-icons.ts
    report-summary.tsx
    charts/
      report-chart.tsx
    dashboard-builder/
      dashboard-canvas.tsx
      widget-palette.tsx
    desktop/
      advanced-reports-desktop.tsx
      desktop-analytics.tsx
      desktop-dashboard-builder.tsx
      desktop-report-generator.tsx
      desktop-reports-list.tsx
      desktop-scheduled-list.tsx
    dialogs/
      export-report-dialog.tsx
      schedule-report-dialog.tsx
    mobile/
      advanced-reports-mobile.tsx
      mobile-analytics.tsx
      mobile-dashboard-list.tsx
      mobile-filter-sheet.tsx
      mobile-report-builder.tsx
      mobile-report-card.tsx
      mobile-report-list.tsx
      mobile-scheduled-list.tsx
  constants/
    advanced-reports.constants.ts
  hooks/
    use-advanced-reports-data.ts
    use-dashboard-builder.ts
    use-report-builder.ts
    use-viewport.ts
  lib/
    format.ts
    report-calculations.ts
    report-export.ts
    report-filters.ts
    report-scheduling.ts
    report-validation.ts
  types/
    advanced-reports.types.ts
```

## Main Responsibilities

### `page.tsx`

Thin route composition only. It creates the data/report/dashboard hooks, shows the loading state, renders the shared header, and selects either `AdvancedReportsMobile` or `AdvancedReportsDesktop`.

Avoid moving business logic back into this file.

### `hooks/use-advanced-reports-data.ts`

Owns the feature's browser-side data fetch cycle:

- `GET /api/ventures?limit=100`
- `GET /api/gedsi-metrics?limit=200`
- `GET /api/users?limit=50`
- `GET /api/analytics`
- `GET /api/workflows?limit=50`

It stores raw venture/GEDSI/user arrays, builds the seeded reports, builds the seeded dashboard, and exposes `refetch`.

This hook also intentionally preserves three pre-existing data issues. They are documented in the hook comments and in the "Known Remaining Issues" section below.

### `hooks/use-report-builder.ts`

Owns Quick Report Generator state:

- report name and description
- report type
- chart type
- date range
- selected metrics
- schedule toggle/frequency/recipients
- `generateReport`
- `exportReport`

Generated reports are metadata-only objects added to local React state. They are lost on refresh.

### `hooks/use-dashboard-builder.ts`

Owns only the dashboard builder scratch state:

- open/closed builder state
- dragged widget id
- local `dashboardLayout`
- desktop drag/drop handlers
- mobile tap-to-add and up/down reorder handlers

This does not persist dashboards and does not update the seeded `dashboards` list.

### `types/advanced-reports.types.ts`

Contains feature-local types for API response fields this page reads and UI-only reporting concepts. Many of these are not Prisma models or persisted enums.

Important distinction:

- API types describe actual existing endpoint response fields where possible.
- Report, Dashboard, and Widget types are UI vocabulary for this page. They are not currently backed by database tables.

### `lib/*`

Pure or mostly-pure helpers extracted from the original page:

- `report-calculations.ts`: seed report/dashboard builders and portfolio/GEDSI/workflow calculations.
- `report-export.ts`: export payload preparation plus the browser download helper.
- `report-filters.ts`: search/status filtering.
- `report-scheduling.ts`: next-run date calculation.
- `report-validation.ts`: current report generator validity check.
- `format.ts`: shared date formatting.

Keep React components out of `lib/`. The one intentional browser API exception is `downloadExportPayload`.

### `components/desktop/*` and `components/mobile/*`

Desktop and mobile are separate presentation trees. This was intentional:

- Desktop keeps the original tabbed layout, wide report generator, report action toolbar, drag-and-drop dashboard canvas, and larger analytics cards.
- Mobile uses a step-based report builder, filter sheet, vertical report cards, export dialog, tap-to-add dashboard widgets, and explicit up/down reorder controls.

## What Was Achieved

- The former large `page.tsx` was split into focused hooks, typed helpers, constants, and presentation components.
- Desktop and mobile rendering are separated instead of being one oversized responsive tree.
- Report generation, export, filtering, scheduling fields, dashboard builder state, and chart rendering now have clearer ownership boundaries.
- Feature-local TypeScript types document both real API response shapes and UI-only data structures.
- Known API-contract mismatches were made explicit instead of being hidden in `any` code.
- The scheduling UI was moved into `ScheduleReportDialog`.
- Mobile export now uses `ExportReportDialog` instead of forcing the full desktop action row into a narrow card.
- The dashboard builder has mobile-specific tap/reorder interactions while preserving desktop's drag/drop prototype.
- Refactor validation previously found no TypeScript or ESLint errors inside this `advanced-reports` folder.

## Preserved Behavior

These behaviors existed before the refactor and still exist now:

- Five seeded reports are generated from fetched data on page load.
- One seeded "Executive Dashboard" is generated on page load.
- Manual report generation only creates local metadata; it does not create real report content.
- Generated reports, scheduled reports, and dashboard builder changes disappear after refresh.
- Scheduling is client-local only. There is no cron job, queue, API write, or persistence layer.
- Export creates metadata downloads. `pdf` and `excel` are not real PDF/XLSX files; they are JSON content with those file extensions/MIME types. CSV is metadata-only.
- Many action buttons are decorative and have no handlers, including View/Edit/Share/Settings/Pause/Delete-style controls.
- Chart rendering assumes specific data keys and is not a generic charting system.
- Report/dashboard/widget concepts are UI-only and should not be treated as database-backed records.

## Known Remaining Issues

Fix these as explicit follow-up changes, not silently during unrelated cleanup.

1. `useAdvancedReportsData` fetches `/api/analytics`, but the original code expected a top-level `analytics` field. The real endpoint does not provide that field, so the result is discarded.
2. `useAdvancedReportsData` fetches `/api/workflows`, but the original code expected a `workflows` array. The real endpoint returns `results`.
3. The original workflow report logic expects workflow items to have `status: "ACTIVE" | "COMPLETED"`, but the real workflow model uses `isActive` and does not have `status`.
4. Seed report copy for reports #1, #2, and #5 still reads stale pre-fetch React state for some display counts. This can produce zero-count wording even when the freshly fetched arrays contain data.
5. User activity calculations reference a `lastLogin` concept that is not declared on the real user API response type.
6. `generateGEDSIMetricsData` is preserved but not used. Its category mapping also needs product review before reuse.
7. Desktop dashboard drag/drop remains keyboard-inaccessible.
8. Dashboard create/edit/duplicate/delete/share persistence does not exist.
9. There is no real report preview or generated report body.
10. Full interactive browser verification was not completed in the previous validation pass.

## API Contract Notes

Current endpoint assumptions:

| Endpoint | Current use | Status |
| --- | --- | --- |
| `/api/ventures?limit=100` | Reads `ventures[]` | Working assumption |
| `/api/gedsi-metrics?limit=200` | Reads `metrics[]` | Working assumption |
| `/api/users?limit=50` | Reads `users[]` | Working assumption, but no `lastLogin` |
| `/api/analytics` | Fetched but discarded due to wrong expected key | Known issue |
| `/api/workflows?limit=50` | Wrong expected array key and wrong item status field | Known issue |

When fixing API behavior, update both `types/advanced-reports.types.ts` and `hooks/use-advanced-reports-data.ts` together.

## Development Guidance

- Keep `page.tsx` small. Put data orchestration in hooks, pure transformations in `lib`, constants in `constants`, and UI in `components`.
- Do not add new report/dashboard persistence inside this folder without first adding or confirming the backend contract.
- Do not treat decorative buttons as partially implemented features. Add handlers only when the underlying workflow is defined.
- Keep desktop and mobile interaction patterns separate where the UX differs materially.
- Avoid reintroducing `any`; this folder intentionally documents mismatches through explicit types and comments.
- If you fix a preserved bug, remove the corresponding warning from this README and from nearby code comments in the same change.

## Suggested Next Work

1. Decide whether Advanced Reports should remain a client-side prototype or become a persisted reporting feature.
2. Fix the analytics/workflows API contract mismatches.
3. Fix the stale-state seed report copy bug.
4. Replace fake PDF/Excel export with real export generation if those formats are product requirements.
5. Add real schedule persistence and background execution if scheduled reports are required.
6. Add browser-level verification for desktop and mobile flows after the next functional change.

## Validation Notes

Historical validation from the refactor pass:

- `npx tsc --noEmit -p .` from `miv/`: no TypeScript errors in `advanced-reports`; the wider repo had unrelated pre-existing errors.
- `npx eslint "app/dashboard/(g4-reporting-insights)/advanced-reports/**/*.{ts,tsx}" --format json`: no errors or warnings for this folder.
- Production build was blocked by the local Node version at the time: Next.js required Node `>=20.9.0`, while the environment used Node `18.20.8`.
- The route compiled under an already-running dev server and returned `200`, but full interactive/visual browser verification was not completed.
