# Due Diligence Page

## Purpose

The due-diligence page is a client-side dashboard for reviewing venture due diligence readiness and process status. It loads ventures from the local ventures API, maps them into due diligence item records, groups those items back into venture-level summaries, generates checklist rows, calculates progress, GEDSI, readiness, risk, and operational metrics, then renders overview, timeline, checklist, documents, reports, and AI insight views.

Expected users are internal MIV dashboard users who review ventures during administrative, investment-readiness, and pipeline-review workflows. The page itself does not enforce role-specific behavior.

## Current Route

- Source file: `miv/app/dashboard/(g3-admin-review-readiness)/due-diligence/page.tsx`
- Public route: `/dashboard/due-diligence`
- Route group: `(g3-admin-review-readiness)` is a Next.js route group and is not part of the URL.

The previously referenced folder `miv/app/dashboard/due-diligence/` does not exist in the current app structure. Keep this feature in the current route-group folder unless there is a separate routing migration.

## Current Architecture

The page has been refactored from a single large client component into a feature-local architecture:

```text
due-diligence/
|-- page.tsx
|-- README.md
|-- components/
|   |-- due-diligence-analytics.tsx
|   |-- due-diligence-header.tsx
|   |-- due-diligence-states.tsx
|   |-- due-diligence-summary.tsx
|   |-- due-diligence-tabs.tsx
|   |-- item-filters.tsx
|   |-- venture-overview-grid.tsx
|   |-- timeline-section.tsx
|   |-- checklist-section.tsx
|   |-- documents-section.tsx
|   |-- reports-section.tsx
|   |-- insights-section.tsx
|   |-- desktop/
|   |   |-- due-diligence-items-table.tsx
|   |   `-- due-diligence-pagination.tsx
|   |-- dialogs/
|   |   |-- item-edit-dialog.tsx
|   |   |-- item-view-dialog.tsx
|   |   |-- new-due-diligence-dialog.tsx
|   |   `-- report-config-dialog.tsx
|   `-- mobile/
|       |-- due-diligence-mobile.tsx
|       |-- mobile-filter-panel.tsx
|       |-- mobile-item-card.tsx
|       `-- mobile-venture-card.tsx
|-- constants/
|   `-- due-diligence.constants.ts
|-- hooks/
|   `-- use-due-diligence.ts
|-- lib/
|   |-- due-diligence-calculations.ts
|   |-- due-diligence-filters.ts
|   |-- due-diligence-formatters.tsx
|   |-- due-diligence-mappers.ts
|   `-- due-diligence-reports.ts
`-- types/
    `-- due-diligence.types.ts
```

## Component Responsibilities

- `page.tsx`: thin client route container; calls `useDueDiligence`, renders loading/error gates, summary sections, tabs, and dialogs.
- `due-diligence-header.tsx`: title, subtitle, venture/items view toggle, New Due Diligence action, and selected-venture breadcrumb.
- `due-diligence-states.tsx`: loading and error state presentation.
- `due-diligence-summary.tsx`: top summary metric cards.
- `due-diligence-analytics.tsx`: high priority, overdue, and category progress cards.
- `due-diligence-tabs.tsx`: tab shell and tab content composition.
- `venture-overview-grid.tsx`: venture-level overview cards; preserves desktop card grid and delegates to mobile venture cards below `md`.
- `item-filters.tsx`: desktop/tablet filter card and wrapper for the mobile filter panel.
- `desktop/due-diligence-items-table.tsx`: desktop due diligence item table, bulk actions, empty state, and mobile item-card list mounting.
- `desktop/due-diligence-pagination.tsx`: desktop numbered pagination and compact mobile pagination.
- `mobile/mobile-venture-card.tsx`: mobile venture summary card.
- `mobile/mobile-item-card.tsx`: mobile replacement for the wide item table row.
- `mobile/mobile-filter-panel.tsx`: touch-friendly mobile filter controls.
- `mobile/due-diligence-mobile.tsx`: mobile tab viewport helper.
- `timeline-section.tsx`: due diligence timeline tab.
- `checklist-section.tsx`: generated checklist tab.
- `documents-section.tsx`: current document-management placeholder tab.
- `reports-section.tsx`: report type buttons and report-generation explanation.
- `insights-section.tsx`: static AI insights, performance metrics, and recommendation cards.
- `dialogs/*`: report configuration, new due diligence, item view, and item edit dialogs.

## State and Data Responsibilities

- `hooks/use-due-diligence.ts`: owns fetch lifecycle, loading/error state, raw ventures, mapped due diligence items, grouped venture summaries, checklist items, filters, sorting, pagination, selection, dialogs, report configuration, and demo action handlers.
- `types/due-diligence.types.ts`: feature model types, raw venture DTO subset, filter state, pagination result, report section types, and hook return type.
- `constants/due-diligence.constants.ts`: categories, stages, checklist templates, assigned analyst mapping, report section options, and default pagination size.
- `lib/due-diligence-calculations.ts`: category completion, checklist completion, due dates, last-activity text, overall progress, GEDSI average, completion-time progress, and on-time rate.
- `lib/due-diligence-mappers.ts`: raw venture to due diligence items, venture grouping, GEDSI debug logging, assigned analyst lookup, and checklist generation.
- `lib/due-diligence-filters.ts`: search, filters, sort behavior, and pagination slicing.
- `lib/due-diligence-reports.ts`: report section defaults, customized report content, preserved legacy report templates, and browser download helper.
- `lib/due-diligence-formatters.tsx`: status icons, status badges, priority badges, and GEDSI display color classes.

## Current Data Sources

Page request:

- `GET /api/ventures?limit=100`
- Called once on mount by `useDueDiligence`.
- Response is expected to contain `{ ventures: Venture[], pagination, isMobile }`.
- The page reads only `data.ventures`; `pagination` and `isMobile` are ignored.

Route handler:

- `miv/app/api/(g3-venture-pipeline)/ventures/route.ts`
- Public endpoint: `/api/ventures`
- Supported query params include `page`, `limit`, `search`, `sector`, `stage`, and `status`.
- This page only sends `limit=100`; all due diligence filtering, sorting, and pagination are client-side after load.

Important backend behavior:

- Mobile user agents are capped to `limit=5` by the ventures API route when requesting more than 5 records. This can make the due-diligence page show fewer ventures on real mobile devices even though the frontend asks for 100.
- The non-mobile API response includes richer relation data such as GEDSI metrics, recent documents, recent activities, and capital activities. The mobile response excludes some of that data.

Important raw venture fields consumed:

- `id`, `name`, `stage`, `createdAt`, `updatedAt`
- `assignedTo.name`, `createdBy.name`
- `_count.documents`, `_count.activities`
- `revenue`, `fundingRaised`, `lastValuation`
- `operationalReadiness.legalStructure`, `operationalReadiness.businessPlan`
- `contactEmail`, `contactPhone`, `website`, `teamSize`, `pitchSummary`
- `targetMarket`, `revenueModel`
- `gedsiMetrics`, `gedsiScore`, `founderTypes`, `inclusionFocus`, `aiAnalysis`, `gedsiMetricsSummary`

## Current Data Flow

1. `page.tsx` calls `useDueDiligence()`.
2. `useDueDiligence` runs `fetchDueDiligenceData()` on mount.
3. The browser fetches `/api/ventures?limit=100`.
4. The hook reads `data.ventures || []`.
5. Raw ventures are stored in hook state for performance metrics and GEDSI calculations.
6. `mapVenturesToDueDiligenceItems` creates four due diligence items per venture: Financial, Legal, Technical, and Market.
7. `groupItemsByVenture` groups those items back into venture-level summaries and calculates overall progress, status, priority, risk, total documents, total comments, and GEDSI score.
8. `generateChecklistFromVentures` creates standard checklist rows for each venture.
9. `filterSortPaginateItems` derives filtered and paginated item collections from hook state.
10. `page.tsx` composes header, summaries, analytics, tabs, and dialogs from the hook return object.
11. Desktop and mobile presentations consume the same data and callbacks.

## Business Rules and Calculations

Generated due diligence item categories:

- `Financial`
- `Legal`
- `Technical`
- `Market`

Generated stage labels:

- `Financial` -> `Financial Review`
- `Legal` -> `Legal Review`
- `Technical` -> `Technical Assessment`
- `Market` -> `Market Analysis`

Priority rules:

- `DUE_DILIGENCE` -> `high`
- `INVESTMENT_READY` -> `high`
- `SERIES_A` or `SERIES_B` -> `medium`
- Any other stage -> `low`

Status rules:

- Completion `100` -> `completed`
- Completion above `70` -> `in_progress`
- Completion above `0` -> `in_progress`
- Completion `0` -> `not_started`
- `blocked` is supported by the UI and venture grouping logic, but current item generation does not create blocked items.

Financial completion:

- `revenue`: +25
- `fundingRaised`: +25
- `lastValuation`: +25
- at least 2 documents: +25

Legal completion:

- `operationalReadiness.legalStructure`: +50
- at least 1 document: +30
- `contactEmail` and `contactPhone`: +20

Technical completion:

- `operationalReadiness.businessPlan`: +30
- `website`: +20
- `teamSize > 3`: +30
- `pitchSummary.length > 100`: +20

Market completion:

- `targetMarket`: +30
- `revenueModel`: +30
- positive `revenue`: +40

Compliance completion exists in calculations for checklist/compliance support:

- GEDSI metrics present: +40
- `gedsiScore > 70`: +30
- `inclusionFocus`: +30

Due date rules:

- Default due date is 30 days from current time.
- `DUE_DILIGENCE` and `INVESTMENT_READY` use 14 days.
- `SERIES_A` and `SERIES_B` use 30 days.
- Financial multiplies the stage duration by `0.8`.
- Legal multiplies the stage duration by `1.2`.
- Dates depend on `Date.now()` and therefore change over time.

Venture summary rules:

- Overall progress is the rounded average of category item completion.
- Overall status precedence is all completed, then blocked, then in progress, else not started.
- Venture priority is the highest priority across category items.
- Risk is high when more than one category is overdue or overall progress is below 30.
- Risk is medium when one category is overdue or overall progress is below 60.
- Risk is low otherwise.

Checklist rules:

- Six standard checklist rows are generated for each venture: Financial Statements Review, Legal Structure Analysis, Technology Stack Assessment, Market Size Validation, Team Background Assessment, and GEDSI Compliance Review.
- Checklist completion is derived from raw venture fields and remains display-only in the UI.

## Filters, Search, Sorting, and Pagination

Search matches:

- due diligence item company
- due diligence item id
- assigned analyst

Filters:

- Category
- Stage
- Status
- Priority
- Due date from/to

Quick filters:

- In Progress toggles status `in_progress`.
- High Priority toggles priority `high`.
- Overdue sets date range ending today.
- Due This Week sets date range from today to seven days from today.

Sorting:

- Default sort is due date ascending.
- Sort options are due date, completion, company, priority, and last updated.
- `sortOrder` exists in hook state and defaults to `asc`, but there is currently no visible UI control to change it.
- Last-updated sorting still attempts to parse relative text like `2 hours ago` as dates, preserving the previous behavior.

Pagination:

- Client-side pagination uses 10 items per page.
- Desktop shows previous, next, and up to five page number buttons.
- Mobile shows previous, next, and compact page summary.

## Desktop Layout

Desktop keeps the existing dashboard structure:

- Header with title, subtitle, view toggle, and New Due Diligence button.
- Breadcrumb card when drilling into a venture.
- Four summary cards.
- Three analytics cards.
- Six tabs: Overview, Timeline, Checklist, Documents, Reports, AI Insights.
- Venture overview card grid.
- Filter card and desktop item table in item mode.
- Numbered pagination.
- Timeline, checklist, documents, reports, and insights sections.
- Report configuration, new due diligence, item view, and item edit dialogs.

The desktop table and venture card grid remain desktop/tablet presentation and are not replaced at `md` and above.

## Mobile Layout

Mobile uses separate presentation where dense desktop UI would otherwise overflow:

- Header title/actions stack on narrow screens.
- Breadcrumb wraps long venture names and stacks controls.
- Tabs sit inside a horizontal overflow viewport.
- Venture overview uses mobile venture cards below `md`.
- Item mode uses a dedicated mobile filter panel below `md`.
- The wide desktop table is hidden below `md`.
- Due diligence items render as mobile cards with selection, metadata, progress, status, due date, and all row actions.
- Pagination becomes Previous/Next with a page summary below `md`.
- Dialogs use viewport-constrained widths and one-column grids on mobile.
- Timeline, checklist, and document actions wrap or stack to reduce horizontal overflow.

Desktop and mobile share the same hook state, derived data, calculations, filters, pagination metadata, and action handlers.

## Dialogs and Actions

Actions available:

- Retry failed load.
- Toggle By Venture / By Items view.
- Open New Due Diligence dialog.
- View details for a venture, which switches to item mode and filters by venture name.
- Back to Ventures, which clears venture-specific filters and returns to venture mode.
- Search and filter items.
- Select individual item rows/cards.
- Select all visible paginated desktop rows.
- Bulk Update demo alert.
- Export Selected demo alert.
- View item dialog.
- Edit item dialog.
- Comment demo alert.
- More actions prompt demo.
- Open report configuration for financial, legal, technical, or market report.
- Generate customized report with a simulated 3-second delay and browser download.

Dialogs:

- Report Config Dialog:
  - Selects hard-coded venture scope.
  - Selects report format.
  - Selects report sections.
  - Generates a simulated report file.
- New Due Diligence Dialog:
  - Demo-only setup form.
  - Contains hard-coded venture options.
  - Create button remains disabled.
- Item View Dialog:
  - Shows selected item metadata, progress, status, assignment, documents, and comments.
  - Provides edit and comment actions.
- Item Edit Dialog:
  - Demo-only disabled form.
  - Save button remains disabled.

## Loading, Empty, Error, and Success States

Loading:

- Shows a card with spinner and text `Loading due diligence data from database...`.
- Main content is hidden while loading.

Error:

- Shows an alert with `Error: Failed to load due diligence data: ...`.
- Retry calls `fetchDueDiligenceData`.
- Main content is hidden while `error` is set.

Empty:

- Venture overview shows `No Ventures Found` when no venture summaries exist.
- Item mode shows `No Due Diligence Items Found` when filters or empty data produce zero items.
- Checklist tab shows `No Checklist Items` when no checklist rows exist.
- Insights performance card shows `No Performance Data Available` when there are no raw ventures.
- Documents tab remains a placeholder with `No documents uploaded yet`.

Success:

- Main content renders after `loading` is false and `error` is null.
- Report buttons show `Generating...` during simulated report generation.

## Preserved Behaviour

- Public route remains `/dashboard/due-diligence`.
- API endpoint remains `GET /api/ventures?limit=100`.
- Backend code and API route contracts were not changed.
- Venture-to-item mapping still generates four items per venture.
- Completion, checklist, due date, risk, status, GEDSI, and performance calculations were preserved.
- Filter, search, sorting, pagination, selection, and dialog behavior were preserved.
- Report configuration flow, section defaults, simulated delay, filenames, MIME behavior, and download side effect were preserved.
- Demo-only actions remain demo-only.
- Existing mojibake strings were not cleaned up as part of the structural refactor.

## Validation Results

- `npm run typecheck`: blocked by local PowerShell execution policy for `npm.ps1`.
- `npm.cmd run typecheck`: failed due to existing repository-wide TypeScript errors outside this feature, including Prisma enum/type mismatches, missing `@/hooks/use-performance-analytics-data`, dashboard typing issues, and seed script errors.
- Filtered compiler review: `npx tsc --noEmit --pretty false` produced no errors containing `due-diligence`.
- `npm.cmd exec eslint -- "app/dashboard/(g3-admin-review-readiness)/due-diligence"`: passed with no errors or warnings.
- `npm.cmd run lint`: passed with 0 errors and 7 warnings outside this feature.
- `npm.cmd run build`: failed due to unrelated existing issues:
  - Missing module `@/hooks/use-performance-analytics-data` imported by `app/dashboard/(g1-impact-analytics)/performance-analytics/page.tsx`.
  - Network/font fetch failures for Google-hosted `Geist` and `Geist Mono` in `app/layout.tsx`.

## Known Remaining Issues

- Full repository typecheck is currently not a reliable gate because unrelated TypeScript errors exist elsewhere.
- Full production build is blocked by unrelated missing module and font-fetch issues.
- The ventures API caps mobile user-agent responses to 5 ventures, which can make real mobile data volume differ from desktop.
- Date-dependent due dates, overdue states, and risk levels vary with `Date.now()`.
- Report output remains simulated.
- PDF/docx/excel report options are not true binary exports; non-PDF formats still download text content as `.txt`.
- Report configuration venture options are hard-coded and not loaded from current ventures.
- New Due Diligence venture options are hard-coded.
- New Due Diligence creation is demo-only and does not call an API.
- Edit dialog is demo-only and does not save changes.
- Checklist checkboxes are display-only and do not update state.
- AI insights and recommendations are static text, not generated from loaded ventures.
- Some strings contain mojibake/encoding-corrupted characters inherited from the previous implementation.
- `sortOrder` exists in state but has no user-facing control.
- Last-updated sort parses relative text as dates, which may produce unstable ordering.

## Things To Take Note

- Keep all due-diligence changes feature-local unless a shared utility already exists and is actively used elsewhere.
- Do not change `/api/ventures?limit=100` or introduce a new due diligence endpoint without a separate API contract task.
- Do not alter completion, checklist, risk, GEDSI, readiness, report, filter, sorting, pagination, or status logic during UI-only work.
- Preserve desktop table/card layout when changing components. Mobile can use separate presentation, but desktop should remain visually stable.
- Use `useDueDiligence` as the feature state boundary. New UI sections should receive explicit props or consume values from the hook at composition boundaries.
- Desktop and mobile should share the same data, filters, pagination, and action handlers. Do not duplicate business logic in mobile components.
- If adding persistence for checklist, edit, create, comments, documents, or report generation, treat that as a separate backend/API task.
- If fixing mojibake copy, report format behavior, static insight text, or hard-coded venture options, do it as a separate behavior/copy cleanup task.
- When running checks on Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Future Improvements

- Resolve repository-wide TypeScript errors so full typecheck/build can be used as a reliable regression gate.
- Add unit tests for due diligence calculations, mappers, filters, pagination, and report content generation.
- Add interaction tests for view toggles, venture drilldown, filters, selection, pagination, report generation, and dialogs.
- Add browser viewport checks for 360px, 375px, 390px, 430px, tablet, and desktop.
- Replace hard-coded report and New Due Diligence venture options with loaded venture data after product approval.
- Implement real checklist state updates if checklist completion becomes editable.
- Implement real create/edit/comment/report/document APIs only after contracts are defined.
- Decide whether the ventures API mobile cap should apply to dashboard pages that need full portfolio data.
- Replace simulated/static AI insight and report content with real derived or backend-generated content when requirements are clear.
- Consider exposing a sort order control or removing `sortOrder` state after product clarification.
