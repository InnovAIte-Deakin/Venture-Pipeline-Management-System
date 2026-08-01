# Advanced Reports Page

> **Update:** the sections below the "Testing Checklist" (starting at "Implemented Structure") document the actual refactor that was carried out on top of this analysis. Everything above is kept as-written — it's still an accurate description of the *original* 1393-line `page.tsx` and the behaviour that was preserved during extraction.
>
> Original analysis note (no longer current): "Analysis document. No production code was changed while writing this file."
> Target file (now the thin route composition, 59 lines): `miv/app/dashboard/(g4-reporting-insights)/advanced-reports/page.tsx`.
>
> **Path note:** the task brief referenced `miv/app/dashboard/advanced-reports/page.tsx`. That path does not exist in this repo. The real file lives under the `(g4-reporting-insights)` **route group** — a Next.js App Router folder that groups routes without appearing in the URL. The route itself is `/dashboard/advanced-reports`, confirmed below.

## Purpose

A single-page "reporting console" that lets a signed-in user generate ad-hoc reports about the venture portfolio (funding, GEDSI impact, workflows, users), view/search a list of previously generated reports, mark reports as scheduled, export a report's metadata as a file, and assemble a very basic custom dashboard from a fixed widget catalog. The page is one of several dashboard sections; it fetches its own data independently of any other page.

## Current Route

- URL: `/dashboard/advanced-reports`
- File: `miv/app/dashboard/(g4-reporting-insights)/advanced-reports/page.tsx`
- Layout: `miv/app/dashboard/layout.tsx` wraps every `/dashboard/*` route with a sidebar/mobile-nav shell. Its `isAuthenticated` check is hardcoded `true` in this build ("Development authentication bypass" comment).
- Middleware: `miv/proxy.ts` (Next.js middleware, exported as `proxy`) additionally short-circuits auth for `/dashboard/*` and `/user-dashboard/*` whenever `NODE_ENV !== 'production'`. In production it would require a `payload-token` cookie or redirect to `/auth/login`.
- **Net effect today:** in development, this page has no authentication or role gate at either layer.

## Intended Users

No role check exists anywhere in this file, its layout, or the middleware, so "intended users" can only be inferred from content, not confirmed from enforcement:

- The report catalog (GEDSI Impact, Financial Analytics, Compliance Report, Risk Assessment, Sector/Geographic distribution) reads as internal MIV staff / portfolio & impact-investment analysts, not founders.
- The `User` model (via `/api/users`) has a `role` field, but this page fetches users only to compute a headcount and never reads `role` for gating or personalization.
- **Mark as uncertain:** whether ADMIN vs non-ADMIN should see different tabs/actions here is not decided anywhere in the current code.

## Current Responsibilities

### Imports

| Import | Source | Why |
|---|---|---|
| `React, { useState, useEffect }` | react | Local state + mount-time fetch |
| `Card*`, `Button`, `Input`, `Badge`, `Progress` (unused), `Tabs*`, `Select*`, `Checkbox`, `Label` | `@/components/ui/*` | shadcn primitives for the whole page |
| Two commented-out imports (`DatePicker`, `Separator`) | — | Explicit TODOs; page uses raw `<input type="date">` instead of a real date picker |
| `BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area` | `recharts` | Chart primitives used inside `renderChart` |
| ~25 icons | `lucide-react` | Decorative icons on buttons/cards/tabs |

`Progress` is imported but never referenced anywhere in the file — dead import.

### Local types (module scope, not exported, not shared with any other file)

- `Report` — id, name, type, description, lastGenerated, status (`'draft'|'published'|'archived'`), metrics: string[], filters: `Record<string, any>`, optional schedule fields (`schedule`, `isScheduled`, `scheduleFrequency`, `nextRun`, `recipients`, `autoGenerate`).
- `Dashboard` — id, name, description, widgets: `Widget[]`, isDefault, createdAt, updatedAt.
- `Widget` — id, type (`'chart'|'metric'|'table'|'list'`), title, `data: any`, `position: {x,y,w,h}`, `config: Record<string, any>`.

No interface is imported from or exported to a shared `types/` module — everything is defined and consumed only in this file.

### Module-level constants

- `reportTypes` — 10 entries (`venture-performance`, `gedsi-impact`, `financial-analytics`, `workflow-analysis`, `user-analytics`, `geographic-distribution`, `sector-analysis`, `compliance-report`, `risk-assessment`, `custom`), each `{ value, label, icon }`.
- `chartTypes` — 4 entries (`bar`, `line`, `pie`, `area`).
- `COLORS` — fixed 6-color palette for pie-chart cells.
- `generateVenturePerformanceData(ventures)` — pure function, described under Business Rules.
- `generateGEDSIMetricsData(gedsiMetrics)` — pure function, **defined but never called anywhere in the file** (dead code).
- `generateSectorDistributionData(ventures)` — pure function, used in the Analytics tab.

### State variables (all in `AdvancedReportsPage`, 22 total)

| State | Initial | Purpose |
|---|---|---|
| `reports` | `[]` | List rendered in Reports/Scheduled tabs |
| `dashboards` | `[]` | List rendered in Dashboards tab ("Existing Dashboards") |
| `ventures`, `gedsiMetrics`, `users` | `[]` | Raw API data reused for calculations and the Analytics tab |
| `selectedReportType` | `''` | Quick Report Generator form field |
| `selectedChartType` | `''` | Quick Report Generator form field (captured but never used to render a preview) |
| `dateRange` | `null` | `{from, to}` Date objects from the two date inputs |
| `selectedMetrics` | `[]` | Checkbox multi-select from `availableMetrics` |
| `selectedFilters` | `{}` | Declared and spread into a generated report's `filters`, but **no UI control ever calls `setSelectedFilters`** — always `{}` in practice |
| `reportName`, `reportDescription` | `''` | Form text inputs |
| `loading` | `true` | Gates the entire page behind a spinner |
| `activeTab` | `'reports'` | Controls the `Tabs` component (`reports`/`scheduled`/`dashboards`/`analytics`) |
| `searchQuery`, `statusFilter` | `''`, `'all'` | Reports-tab search/filter bar |
| `isScheduled` | `false` | Toggles the scheduling sub-form |
| `scheduleFrequency` | `'weekly'` | `daily/weekly/monthly/quarterly` |
| `reportRecipients` | `[]` | Comma-separated emails, no format validation |
| `isDashboardBuilderOpen` | `false` | Expands/collapses the Dashboard Builder card body |
| `draggedWidget` | `null` | HTML5 drag-and-drop payload (widget id being dragged) |
| `dashboardLayout` | `[]` | Widgets dropped onto the builder canvas (separate from `dashboards`) |

### Effects

- Exactly one `useEffect(() => { fetchData() }, [])` — runs once on mount. No refetch on filter/tab change (everything downstream of the fetch is filtered client-side).

### API requests (all issued together in `fetchData`, browser-side `fetch`, no auth headers, no abort/retry)

1. `GET /api/ventures?limit=100`
2. `GET /api/gedsi-metrics?limit=200`
3. `GET /api/users?limit=50`
4. `GET /api/analytics`
5. `GET /api/workflows?limit=50`

Issued via `Promise.all` — none depends on another's result. Each response is checked with `res.ok` and degraded to an empty-array shape on a non-2xx status; only a thrown exception (e.g. malformed JSON, network failure) hits the outer `catch`.

## Current Data Sources

For each source: **API → normalization → calculation → UI**.

### Ventures
- `GET /api/ventures?limit=100` → route: `app/api/(g3-venture-pipeline)/ventures/route.ts`.
- Response shape (confirmed from the route): `{ ventures: Venture[], pagination: {page,limit,total,pages}, isMobile: boolean }`.
- Page reads `venturesData.ventures || []` — **matches**.
- Normalization: none beyond the `|| []` fallback; raw Prisma venture objects (with relations) flow straight into state as `any[]`.
- Calculations: `totalFunding`, `fundedVentures`, `avgFunding`, sector list, stage list, `successRate` (via `generateVenturePerformanceData`), sector distribution (`generateSectorDistributionData`). All pure functions, all depend only on the `ventures` argument (not on React state directly), located in module scope — natural candidates for a `lib`/util file.
- UI: seeds report #1 ("Venture Performance Report"), the Executive Dashboard's line-chart widget and "Total Ventures" metric widget, the Analytics tab's line and pie sample charts, and the AI Insights risk-alert text.

### GEDSI metrics
- `GET /api/gedsi-metrics?limit=200` → route: `app/api/(g1-impact-analytics)/gedsi-metrics/route.ts`.
- Response shape: `{ metrics: GEDSIMetric[], pagination }`. Page reads `gedsiData.metrics || []` — **matches**.
- Prisma enum `GEDSICategory` = `GENDER | DISABILITY | SOCIAL_INCLUSION | CROSS_CUTTING`; `MetricStatus` = `NOT_STARTED | IN_PROGRESS | VERIFIED | COMPLETED`.
- Calculations: `verifiedGedsiMetrics` (status `VERIFIED`), completion rate using `['COMPLETED','VERIFIED']` (valid enum values), verification rate for report #2's filters.
- `generateGEDSIMetricsData` buckets into UI labels `['Gender','Equity','Disability','Social Inclusion']` — **`Equity` has no corresponding enum value.** The function remaps `SOCIAL_INCLUSION` metrics into the `Equity` bucket and `CROSS_CUTTING` metrics into the `Social Inclusion` bucket. This is confusing even on its own terms, and moot in practice because **the function is never called**.
- UI: seeds report #2, the "GEDSI Metrics" count widget on the Executive Dashboard, and the AI Insights "Performance Insight" text.

### Users
- `GET /api/users?limit=50` → route: `app/api/(g5-user-support-settings)/users/route.ts`.
- Response shape: `{ users: User[], pagination }`. Page reads `usersData.users || []` — **matches**.
- Calculation: `activeUsers` (last login within 30 days) computed inline for report #5's `filters` only.
- UI: seeds report #5 ("User Activity & Engagement Report"); `users` state is otherwise unused in JSX.

### Analytics
- `GET /api/analytics` → route: `app/api/(g1-impact-analytics)/analytics/route.ts`.
- Real response shape: `{ period, dateRange, overview: {...}, isMobile, performance, workflows, insights }` — **there is no top-level `analytics` key**.
- Page code: `const analyticsData = analyticsRes.ok ? await analyticsRes.json() : { analytics: [] }` then `const analytics = analyticsData.analytics || []`.
- **Confirmed bug:** because the real response has no `.analytics` field, `analytics` is **always `[]`**, and it is never read again after that line. The entire analytics fetch is wired up, executed on every page load, and then discarded. This is dead work, not just dead code.

### Workflows
- `GET /api/workflows?limit=50` → route: `app/api/(g5-platform-operations)/workflows/route.ts`.
- Real response shape: `{ results: Workflow[], total, page, limit }` — **the array is under `results`, not `workflows`**.
- Page code: `const workflows = workflowsData.workflows || []`.
- **Confirmed bug:** `workflows` is **always `[]`**, so `activeWorkflows`/`completedWorkflows` are always empty and report #4 ("Workflow Efficiency Report") always renders as `0 workflows with 0 active and 0 completed`, completion rate `0%`, regardless of real data.
- **Second, independent confirmed bug:** even if the key were fixed, the filters used are `w.status === 'ACTIVE'` / `w.status === 'COMPLETED'`. Prisma's `Workflow` model (`prisma/schema.prisma`) has **no `status` field** — it has `isActive: Boolean`. So this business rule references a field that does not exist on the model at all.

## API Contracts

| Endpoint | Method | Query params used here | Response fields the page relies on | Status |
|---|---|---|---|---|
| `/api/ventures` | GET | `limit=100` | `ventures[]`, (`pagination`, `isMobile` unused here) | Confirmed correct |
| `/api/gedsi-metrics` | GET | `limit=200` | `metrics[]` | Confirmed correct |
| `/api/users` | GET | `limit=50` | `users[]` | Confirmed correct |
| `/api/analytics` | GET | none | expects `analytics[]` | **Broken — field doesn't exist; always `[]`, result unused anyway** |
| `/api/workflows` | GET | `limit=50` | expects `workflows[]` with per-item `status` | **Broken — real key is `results`; real model field is `isActive`, not `status`** |

Report/chart/dashboard "contracts" that exist only inside this file (not backed by any API or schema) and must be treated as **UI-only vocabulary, not persisted enums**:
- Report `type` values: the 10 `reportTypes` entries — only `venture-performance`, `gedsi-impact`, `financial-analytics`, `workflow-analysis`, `user-analytics` have any generation logic (the `fetchData` seed reports). The other 5 (`geographic-distribution`, `sector-analysis`, `compliance-report`, `risk-assessment`, `custom`) are selectable in the generator dropdown but produce a generic report with no dedicated metrics/chart/data mapping anywhere in the file.
- Report `status`: `'draft' | 'published' | 'archived'` — set programmatically (seed data) or defaulted to `'draft'` on manual generation; there is no UI action that transitions a report between statuses.
- Chart `type` values: `bar | line | pie | area`, handled by `renderChart`'s switch.
- Schedule `frequency` values: `daily | weekly | monthly | quarterly`.
- Export `format` values: `pdf | excel | csv` (see Export Workflow — none of these produce real files of that format).

## Current Data Flow

```
ventures API ─┐
gedsi API ────┼─► fetchData() ─► setVentures/setGedsiMetrics/setUsers (raw, typed any[])
users API ────┘         │
                         ├─► inline calculations (totalFunding, avgFunding, successRate, ...)
                         ├─► generateVenturePerformanceData(ventures)   ─► Executive Dashboard chart, Analytics tab chart
                         ├─► generateSectorDistributionData(ventures)   ─► Analytics tab pie chart
                         └─► 5 hardcoded Report objects + 1 hardcoded Dashboard object ─► setReports/setDashboards

analytics API ─► fetched, decoded, assigned to `analytics`, then never read again (dead)
workflows API ─► fetched, decoded under the wrong key, always [] (dead in effect)

selectedReportType/selectedMetrics/selectedFilters/dateRange/... (form state)
        │
        ▼
generateReport() ─► builds one new Report object locally ─► prepended to `reports` state (never sent to any API)

report.id ─► exportReport(id, format) ─► reads from local `reports` state only ─► Blob ─► browser download (no server round-trip)

draggedWidget/dashboardLayout (form/DnD state) ─► dashboard builder canvas only, never merged into `dashboards`
```

Every transformation:

| Transform | Location | Input → Output | Pure? | Depends on React state? | Suggested home |
|---|---|---|---|---|---|
| `generateVenturePerformanceData` | module scope | `any[]` ventures → 6-point trend array | Yes | No (takes ventures as arg) | `lib/report-calculations.ts` |
| `generateGEDSIMetricsData` (dead) | module scope | `any[]` metrics → 4-category array | Yes | No | delete, or `lib/report-calculations.ts` if revived |
| `generateSectorDistributionData` | module scope | `any[]` ventures → pie-slice array | Yes | No | `lib/report-calculations.ts` |
| `getNextRunTime` | inside `generateReport` | frequency string → Date | Yes | No | `lib/report-scheduling.ts` |
| totalFunding/avgFunding/successRate/etc. | inline in `fetchData` | ventures/gedsi/workflows arrays → numbers | Yes | No, but currently written inline against component-scope `const`s | `lib/report-calculations.ts` |
| `filteredReports` | render body | `reports` + `searchQuery` + `statusFilter` → filtered array | Yes | Yes (reads state directly) | hook (`useReportFilters`) or keep as a `useMemo` in a presentation component |
| `renderChart` | component method | `(data, type, config)` → JSX | No (returns JSX) | No | presentation component, not a util |
| `formatDate` | component method | ISO string → localized string | Yes | No | `lib/format.ts` or shared util |

## Report Generation Workflow

Actual flow implemented: **user selects report type → (optionally) fills name/description/chart type/date range/metrics/schedule → clicks "Generate Report" → a new row appears at the top of the Reports tab.** There is **no preview step** and **no export/schedule step chained off generation** — export and scheduling are separate, independent actions available per-report afterward.

- Required field: `selectedReportType` only (`Generate Report` button is `disabled={!selectedReportType}`).
- Defaults: name falls back to `"${reportType.label} Report"`; description falls back to `"Generated ${type} report with custom parameters"`; status is always `'draft'`.
- Validation: none beyond the disabled-button gate. No email-format validation on `reportRecipients` (comma-split/trim/filter(Boolean) only). No check that `dateRange.from <= dateRange.to`.
- Report generation is **simulated, not real**: the new `Report` object carries only metadata (name, type, description, filters, schedule info) — it has no attached chart data, computed metrics values, or content of any kind. `selectedChartType`, `selectedMetrics`, and `dateRange` are stored on the object but never used to compute or filter anything.
- Scheduling is **captured but not persisted anywhere** beyond the in-memory `reports` array: `isScheduled`, `scheduleFrequency`, and `nextRun` (computed client-side via `getNextRunTime`) are set on the object and never sent to a backend job/queue. A page refresh calls `fetchData()` again, which replaces `reports` with the 5 hardcoded seed reports — **any manually generated or scheduled report is lost on reload.**
- Export formats offered: `pdf`, `excel`, `csv` — see Export Workflow below; **none of them are real files of that format.**
- Failure handling: `generateReport` has no try/catch (it's synchronous state manipulation, nothing can throw); `exportReport` wraps the Blob/download logic in try/catch and only `console.error`s on failure — no user-visible error state.

## Report Scheduling Workflow

- Entirely client-local. Enabling "Schedule automatic report generation" reveals a frequency `Select` and a recipients `Input`.
- `nextRun` is computed once at generation time from the current wall clock (`getNextRunTime`) and never recalculated or ticked forward.
- The "Scheduled" tab simply filters the in-memory `reports` array for `isScheduled === true`. Its Settings/Pause/Delete icon buttons have **no `onClick` handlers** — fully decorative.
- **There is no server-side scheduler, cron job, or queue backing this feature anywhere in the inspected code.** Mark as demo-only.

## Export Workflow

`exportReport(reportId, format)`:
- Builds a plain metadata object (`reportName, reportType, description, lastGenerated, status, metrics, filters, exportedAt, format`) — **not** the report's underlying chart/series data (which doesn't exist on the Report object anyway).
- `pdf` case: filename `*.pdf`, mimeType `application/pdf`, but `content = JSON.stringify(exportData, null, 2)` — the downloaded bytes are plain JSON text mislabeled as a PDF. Comment in code: `// In real app, generate PDF`.
- `excel` case: same pattern, `.xlsx` filename/mimetype with JSON content. Comment: `// In real app, generate Excel`.
- `csv` case: this one is genuinely CSV-shaped, but only a single header+row of report metadata (name/type/description/lastGenerated/status) — it does not include any metric values or chart series.
- Delivery: `Blob` → `URL.createObjectURL` → programmatic `<a download>` click → `revokeObjectURL`. No network request; nothing server-side is involved.
- **Conclusion: export is real for CSV metadata only; PDF/Excel are simulated (wrong content type entirely).** Must not be presented as "already working" PDF/Excel export in any refactor without a corresponding backend/library addition, which is out of scope here.

## Dashboard Builder Workflow

Two separate, **unconnected** concepts share the tab:

1. **"Existing Dashboards"** — renders the `dashboards` state (always exactly the one synthetic "Executive Dashboard" produced fresh in `fetchData` on every load; never created, edited, duplicated, deleted, or persisted by the user). Its widgets are rendered for real via `renderChart` (chart widgets) or a value/change text block (metric widgets). Its header Edit/Share buttons have **no handlers**.
2. **Dashboard Builder canvas** (toggled open/closed by `isDashboardBuilderOpen`) — a drag-and-drop scratch area:
   - Widget palette: 7 hardcoded entries in `availableWidgets` (`metric-card, bar-chart, line-chart, pie-chart, area-chart, data-table, alert-panel`), each a plain `<div draggable>`.
   - `handleDragStart` → sets `draggedWidget`. `handleDragOver` → `preventDefault()` only. `handleDrop` → creates a new `Widget` with `data: {}` (**no real data ever attached**) and a **hardcoded drop position** `{x:0,y:0,w:4,h:3}` (the single canvas `onDrop` handler always passes the same literal object — there is no per-cell target, so drag position is cosmetic).
   - Canvas rendering ignores `widget.position` entirely: widgets are laid out with a static `grid-cols-12` / `col-span-6 lg:col-span-4` CSS grid, not the widget's stored `x/y/w/h`.
   - Dropped widgets render only a placeholder (`"{widget.type} widget placeholder"`) — never a real chart/table preview.
   - `updateWidgetPosition` is **defined but never called** — no resize/move UI exists, so "layout" cannot actually be rearranged after drop.
   - `removeWidget` works (wired to the trash icon). The per-widget Settings gear icon has **no handler**.
   - "Clear Layout" button resets `dashboardLayout` to `[]` — affects only the scratch canvas, not `dashboards`.
   - **Nothing built in the canvas can be saved into `dashboards`, an API, or localStorage.** Closing the builder or reloading the page discards it.

**Conclusion: the Dashboard Builder is a non-functional prototype (drag works, but data attachment, real preview, repositioning, and persistence are all absent or stubbed).**

## Business Rules and Calculations

- **Venture success rate:** `stage ∈ {FUNDED, SERIES_A, SERIES_B, SERIES_C}` counts as "successful". This exact stage list is duplicated between this page (`generateVenturePerformanceData`) and `app/api/(g1-impact-analytics)/analytics/route.ts`'s `getTopSectors()` — both use valid `VentureStage` enum values, so the rule itself is consistent, but it exists in two independent places.
- **`generateVenturePerformanceData` produces a fabricated 6-month trend**, not real historical data: it takes portfolio-wide totals (`totalVentures`, `totalFunding`, `successRate`) and multiplies each by hand-picked per-month coefficients (`0.6 + index*0.08`, `0.5 + index*0.1`, `0.8 + index*0.04`) to fake a growth curve. Ventures do carry real `createdAt` timestamps from the API but they are not used. **Do not treat this chart as reflecting real monthly history.**
- **GEDSI category bucketing (`generateGEDSIMetricsData`, dead code):** UI labels `Gender/Equity/Disability/Social Inclusion` do not line up 1:1 with the real `GEDSICategory` enum (`GENDER/DISABILITY/SOCIAL_INCLUSION/CROSS_CUTTING`); `Equity` has no backing enum value and metrics get double-remapped. Flagged as a pre-existing bug in unreachable code — do not silently "fix" the mapping when reviving this function; confirm the intended taxonomy with product first.
- **Workflow "active"/"completed" counts are computed against a `status` field that does not exist on the `Workflow` Prisma model** (it has `isActive: Boolean` instead), compounding the `/api/workflows` key-name bug above. The resulting counts are always `0` today regardless of real data.
- **Analytics tab "Report Views" and "Exports" stat tiles are fabricated:** `reports.length * 50` and `reports.length * 10` respectively — arbitrary constants with no underlying tracking/telemetry.
- **"AI-Powered Insights" panel (Analytics tab) is not AI-generated** despite the label, Zap icon, and "Beta" badge: the three insight cards are simple string templates driven by `if/else` thresholds on `gedsiMetrics.length`/`ventures.length` (e.g. `< 5`, `< 3`, `* 0.2`). The codebase does have a real `lib/ai-services.ts` used elsewhere (venture creation flow), but this page never calls it.
- **GEDSI verification rate / completion:** uses valid `MetricStatus` enum values (`VERIFIED`, `COMPLETED`) — this one is correct against schema.
- **Sector distribution:** percentage-of-total per sector, rounded, sorted descending, colors cycle through a fixed 6-entry palette (repeats past 6 sectors — not flagged as urgent, just a visual limitation).

## State Management

Flat `useState` per field (22 states, no reducer, no context, no external store). All derived values (`filteredReports`, `availableMetrics`, `availableWidgets`) are recomputed on every render without memoization — acceptable at current data volumes (reports list is at most a handful of items) but would not scale if `reports`/`dashboards` grew large or if this logic moved into a shared hook consumed by multiple components.

## Filters and Date Ranges

- Reports-tab filters: free-text `searchQuery` (matches report name/description/type, case-insensitive substring) + `statusFilter` (`all/published/draft/archived`). "More Filters" button exists with **no handler** (decorative). "Clear Filters" resets both.
- Quick Report Generator "filters": `selectedFilters` state exists and is spread into the generated report's `filters` object, but **no control in the UI ever sets it** — it is always `{}`.
- Date range: two native `<input type="date">` (from/to), stored as `Date` objects in `dateRange`. No validation (`from <= to` not checked). Stored on the generated report as descriptive metadata only — **never used to actually filter which ventures/metrics feed into a report's content.**

## Chart Types and Chart Data

`renderChart(data, type, config)` supports `bar | line | pie | area` via a `switch`, using `recharts`. It is **not generic** despite the `data: any[]` signature: the bar/line/area branches hardcode `dataKey="month"` plus `"ventures"`/`"funding"` series, and the pie branch hardcodes `dataKey="value"` with a `name` label — i.e. it only actually works for the two shapes produced by `generateVenturePerformanceData` (month/ventures/funding) and `generateSectorDistributionData` (name/value/color). It is called from three places: the Executive Dashboard's chart widget (`widget.config.type`), the Analytics tab's two "Sample Charts", and (indirectly) any future dashboard-builder widget that reached `data`/`type` — though today dropped widgets never get chart-shaped data, so this path is unreachable there. `selectedChartType` chosen in the Quick Report Generator is stored but never passed into `renderChart` — there is no chart preview at generation time.

## Dialogs and Actions

**There are zero `Dialog`, `Sheet`, `Popover`, or `DropdownMenu` components anywhere in this file.** All actions are inline buttons. Buttons with **no `onClick` handler** (decorative/non-functional today):

- Header: `Templates`, `Settings`, `New Report`
- Report row toolbar: `Eye` (View), `Share2` (Share), `Edit`
- Scheduled tab row: `Settings`, `Pause`, `Trash2` (Delete)
- Dashboard card: `Edit`, `Share2`
- Dashboard-builder canvas widget: `Settings` gear
- Search bar: `More Filters`

Buttons that **are** wired: Export PDF/Excel/CSV (`exportReport`), tab switching, search/status filter inputs, "Clear Filters", "Open/Close Builder", "Clear Layout", canvas widget delete (`removeWidget`), the Quick Report Generator's "Generate Report".

## Loading, Empty, Error, and Success States

- **Loading:** single boolean gates the *entire* page (header, generator form, tabs) behind a centered spinner + "Loading reports..." text. No skeleton, no partial render.
- **Error:** only the outer `try/catch` in `fetchData` (thrown exceptions, not per-API `!res.ok`, which is already handled inline) sets one fallback `Report` (`id:'error-1', type:'system-error'`) and clears `dashboards`. It renders as an ordinary-looking report card — there is no distinct error banner, toast, or retry affordance, so a real failure is easy to miss.
- **Partial API failure:** each of the 5 fetches degrades independently to an empty-array shape via `res.ok` checks — the page does not crash, but silently produces zero-filled reports (compounded by the two confirmed key-mismatch bugs above, which behave identically to a permanent partial failure).
- **Empty states present:** Scheduled tab (explicit "No scheduled reports found" message); Dashboard Builder canvas (explicit "Drag widgets here to build your dashboard").
- **Empty states missing:** Reports tab renders an empty `<div className="grid gap-4">` with no message when `filteredReports` is empty (e.g., after a search with no matches); "Existing Dashboards" list has no empty-state message if `dashboards` were ever `[]`.
- **Success feedback:** none beyond the UI updating (new row appearing, console.log). No toast/snackbar confirms "Report generated" or "Export succeeded" — easy to miss if the user isn't looking at the Reports tab when they click Generate.

## Desktop Behaviour

- Wide multi-column grids throughout (`md:grid-cols-2 lg:grid-cols-4` in the generator's basic fields; `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` in Analytics stat tiles).
- Dashboard-builder canvas assumes a mouse: native HTML5 Drag-and-Drop (`draggable`, `onDragStart/onDragOver/onDrop`).
- Report-row header packs a title, 2 badges, and 6 icon buttons into one `flex items-center justify-between` row with no `flex-wrap` — relies on desktop width to avoid crowding.
- Charts render at a fixed `height={300}` via `ResponsiveContainer width="100%"`, which reads fine at desktop widget widths (`col-span-6 lg:col-span-4` inside a 12-col grid on a ≥1024px canvas).

## Mobile Problems in the Current Page

- **HTML5 native drag-and-drop is not reliably usable on touch devices** (iOS Safari in particular does not support the `draggable` attribute's drag gestures the same way a desktop mouse does) — the entire widget palette in the Dashboard Builder is effectively non-functional on phones/tablets. This must **not** be "fixed" by just adding Tailwind responsive classes; it needs a separate, tap-based add-widget flow on mobile.
- Fixed `height={300}` recharts containers do not shrink for narrow widget cards — on a narrow screen a `col-span-6` chart widget can end up rendering axes/legend/tooltip in a very cramped box.
- The 6-icon report-row toolbar (`Eye/Download/FileText/BarChart3/Share2/Edit`) plus title+badges in one unwrapped flex row is a concrete overflow/crowding risk under ~400px — needs to be re-tested, not assumed fixed, at 360px (see Testing Checklist).
- Two side-by-side native `<input type="date">` fields (`flex items-center space-x-2`, no wrap) risk overflow on very narrow viewports, since native date inputs have a browser-enforced minimum width.
- The metrics checkbox grid uses an internal `max-h-32 overflow-y-auto` scroll region nested inside the page's own scroll — a common touch-scroll friction point (scroll gets "captured" by the inner box).
- The Quick Report Generator is one long, single-column form on mobile (name → type → chart type → date range → description → 20 metric checkboxes → scheduling → generate) with no step/section breakdown — a lot of scrolling before reaching the primary action.
- No bottom-sheet/modal pattern exists anywhere, so "generate" and its result (a new card at the top of the Reports tab, which might be on a different tab than the one currently active) can be far apart with no built-in wayfinding back to it.

## Accessibility Risks

- Icon-only buttons largely lack `aria-label`: the report-row toolbar has `title="..."` attributes (partial help, not equivalent to `aria-label` for all AT), but the Scheduled-tab, Dashboard-card, and canvas-widget icon buttons (Settings/Pause/Trash2/Edit/Share2) have **no `title` or `aria-label` at all**.
- Most top-of-form `<label>` elements (Report Name, Report Type, Chart Type, Date Range, Description) are plain text with no `htmlFor`, and their paired `Input`/`Select` have no matching `id` — not programmatically associated for screen readers. (The metrics checklist is the one place this is done correctly, via `<Label htmlFor={metric}>` + `<Checkbox id={metric}>`.)
- The Dashboard Builder's expand/collapse toggle button has no `aria-expanded` reflecting `isDashboardBuilderOpen`.
- Drag palette items are plain `<div draggable>` with no `role="button"`, no `tabIndex`, and no keyboard handlers — entirely unreachable and unusable via keyboard.
- Status is conveyed with a `Badge` that includes text (not color-only), which is fine.

## Refactor Goals

1. Preserve every existing behavior documented above **exactly**, including the two confirmed data-contract bugs — do not silently fix `/api/analytics` or `/api/workflows` wiring as a side effect of moving code; call it out separately for a product/eng decision.
2. Split the 1393-line file into data (hooks), calculation (`lib`), and presentation layers, with a genuine desktop/mobile split for the two heaviest interactive surfaces (Quick Report Generator, Dashboard Builder) rather than Tailwind-only responsiveness.
3. Do not invent functionality for the currently-dead buttons (View/Edit/Share/Settings/Pause/Delete) — extract them as-is (no-op) unless the user separately asks to implement them.
4. Remove genuinely dead code only if explicitly authorized (unused `Progress` import, unused `generateGEDSIMetricsData`, the `analytics` fetch/variable) — flagged here, not removed in this pass.

## Proposed Folder Structure

```
advanced-reports/
├── page.tsx                                  # thin: renders Desktop/Mobile shell via a viewport hook
├── README.md
├── components/
│   ├── advanced-reports-header.tsx            # title + Templates/Settings/New Report buttons
│   ├── report-summary.tsx                     # "Showing N of M reports" bar (small; consider inlining instead — see note)
│   ├── report-filters.tsx                     # search input + status select + Clear Filters
│   ├── desktop/
│   │   ├── advanced-reports-desktop.tsx        # tab shell + layout for ≥lg
│   │   ├── desktop-report-generator.tsx        # "Quick Report Generator" card (side-by-side fields)
│   │   ├── desktop-reports-list.tsx            # Reports tab card list
│   │   ├── desktop-scheduled-list.tsx          # Scheduled tab
│   │   └── desktop-dashboard-builder.tsx       # Builder card: palette + canvas + Existing Dashboards
│   ├── mobile/
│   │   ├── advanced-reports-mobile.tsx         # step/tab shell for <lg
│   │   ├── mobile-report-generator.tsx         # step-based generator (one section at a time)
│   │   ├── mobile-report-card.tsx              # vertical report card, no 6-icon row
│   │   ├── mobile-scheduled-list.tsx
│   │   ├── mobile-filter-sheet.tsx             # search/status filters inside a Sheet instead of inline row
│   │   └── mobile-dashboard-list.tsx           # compact dashboard cards; builder canvas replaced by a tap-to-add list (see below)
│   ├── charts/
│   │   └── report-chart.tsx                    # the existing renderChart switch, extracted as one component (bar/line/pie/area share one file today; no need for 4 files — see note)
│   └── dashboard-builder/
│       ├── widget-palette.tsx                  # availableWidgets grid (desktop: draggable; mobile: tappable)
│       └── dashboard-canvas.tsx                # dashboardLayout rendering + remove/clear (position/resize logic stays a known gap, not silently added)
├── hooks/
│   ├── use-advanced-reports-data.ts            # fetchData: ventures/gedsi/users/analytics/workflows + derived reports/dashboards
│   └── use-report-generator.ts                 # all Quick Report Generator form state + generateReport + exportReport
├── lib/
│   ├── report-calculations.ts                  # generateVenturePerformanceData, generateSectorDistributionData, (generateGEDSIMetricsData kept but marked dead/unused pending a product decision)
│   ├── report-export.ts                        # exportReport's Blob/download logic (kept simulated as-is; comments preserved)
│   └── report-scheduling.ts                    # getNextRunTime
├── types/
│   └── advanced-reports.types.ts               # Report, Dashboard, Widget
└── constants/
    └── advanced-reports.constants.ts           # reportTypes, chartTypes, COLORS, availableMetrics, availableWidgets
```

**Deliberately omitted from the template proposal, with reasons:**
- `dialogs/` (schedule/export/dashboard-editor/delete dialogs) — none exist today; every one of those actions is currently either absent or a plain inline click. Introducing dialogs would be adding UI, not extracting it. Propose only if a follow-up task asks to wire up the dead buttons.
- Separate `report-bar-chart.tsx` / `report-line-chart.tsx` / `report-pie-chart.tsx` / `report-area-chart.tsx` files — the current code has one ~70-line switch, not four independent implementations; splitting it into four files today would be premature (three similar branches is not enough to justify four files each smaller than the switch itself).
- `report-preview.tsx` / `report-empty-state.tsx` / `desktop-report-preview.tsx` / `mobile-report-preview.tsx` — there is no preview step in the current workflow at all (see Report Generation Workflow). Do not create a preview component that has no current behavior to extract; note it as a gap instead.
- `report-workspace.tsx`, `report-configuration.tsx` — the template's names for what's really just `desktop-report-generator.tsx` / `mobile-report-generator.tsx`; kept as one generator component per platform rather than splitting configuration from workspace, since today they're the same card.
- `report-filters.tsx` is listed once at top level (shared shape) rather than duplicated per platform, since desktop renders it inline and mobile would render the same fields inside a `Sheet` — the *fields* are shared, only the *container* differs (handled by `mobile-filter-sheet.tsx` wrapping the shared filter fields).
- `report-mappers.ts` / `chart-data-mappers.ts` — no separate mapping logic exists beyond what's already covered by `report-calculations.ts`; would be an empty file today.

## Responsibility of Each Proposed File

- `hooks/use-advanced-reports-data.ts` — owns `fetchData`, the 5 API calls, and all the state currently named `reports/dashboards/ventures/gedsiMetrics/users/loading`. Returns data + `loading` + a `refetch`. This is the only place that should know the (currently broken) `/api/analytics` and `/api/workflows` response shapes.
- `hooks/use-report-generator.ts` — owns every Quick Report Generator field (`selectedReportType` … `reportRecipients`), `generateReport`, and `exportReport`. Both desktop and mobile generator components consume this one hook so behavior (including the "no real content, metadata only" limitation) stays identical.
- `lib/report-calculations.ts` — the three pure `generate*Data` functions, unit-testable in isolation, no React dependency.
- `lib/report-export.ts` — the Blob/filename/mimetype branching from `exportReport`, extracted as a pure-ish function `(report, format) => {filename, mimeType, content}` that the hook calls before triggering the download.
- `lib/report-scheduling.ts` — `getNextRunTime`.
- `types/advanced-reports.types.ts` — `Report`, `Dashboard`, `Widget`, shared by every component/hook above instead of being redefined per file.
- `constants/advanced-reports.constants.ts` — the four hardcoded arrays/objects (`reportTypes`, `chartTypes`, `COLORS`, `availableMetrics`, `availableWidgets`).
- `components/charts/report-chart.tsx` — the existing `renderChart` switch, unchanged in behavior (including its non-generic `dataKey` assumptions — do not generalize it silently).
- `components/dashboard-builder/widget-palette.tsx` + `dashboard-canvas.tsx` — the existing drag-and-drop scratch canvas, unchanged in behavior (still no persistence, no real widget data, no position/resize) on desktop; on mobile the palette becomes tap-to-add (a new interaction, not present today — call out explicitly as new behavior if implemented, since drag-and-drop cannot be ported to touch as-is).

## Shared Logic Between Desktop and Mobile

- `use-advanced-reports-data` (all 5 fetches + derived reports/dashboards)
- `use-report-generator` (form state, `generateReport`, `exportReport`)
- `lib/report-calculations.ts`, `lib/report-export.ts`, `lib/report-scheduling.ts`
- `types/advanced-reports.types.ts`, `constants/advanced-reports.constants.ts`
- `components/charts/report-chart.tsx` (chart rendering itself, just placed in a differently-sized container per platform)
- Filter field definitions (`searchQuery`/`statusFilter` state + the actual filtering predicate) — container differs (inline row vs. `Sheet`), logic doesn't.

## Separate Desktop and Mobile Presentation Strategy

**Desktop keeps:**
- Side-by-side multi-column Quick Report Generator (`grid-cols-4`) with all fields visible at once.
- The 6-icon inline report-row toolbar.
- The native HTML5 drag-and-drop Dashboard Builder canvas exactly as it works today.
- `grid-cols-12` canvas layout and `lg:grid-cols-4` Analytics tiles.

**Mobile must use a different structure, not Tailwind-only shrinking:**
- Step-based Quick Report Generator (name+type → chart+dates → metrics → schedule → review), one section visible at a time, matching the "no required horizontal scrolling" and "one section at a time" requirements.
- Vertical report cards with a condensed action set (e.g., a single overflow affordance instead of 6 inline icon buttons) rather than shrinking the same 6-icon row.
- Search/status filters inside a `Sheet` (`mobile-filter-sheet.tsx`) instead of an inline row competing for width.
- Dashboard Builder: **the desktop drag canvas must not be reused on mobile.** Native HTML5 DnD is not touch-reliable; a mobile equivalent needs a tap-based "Add widget" list/sheet plus a vertical, single-column widget stack — this is new interaction design, not a port, and should be scoped as its own follow-up rather than assumed to "just work" responsively.
- Full-width chart previews (no fixed 300px height fighting a narrow container — chart height should be governed by the mobile container, not copied from desktop).

**Desktop interactions that cannot safely be copied to mobile:**
- HTML5 `draggable` widget palette (touch support is unreliable, especially iOS Safari).
- Any layout depending on `col-span-6 lg:col-span-4` grid math without a mobile-specific single-column equivalent.
- The unwrapped 6-button toolbar row.
- Two inline side-by-side native date inputs.

## Behaviour That Must Not Change

- The five hardcoded seed reports and their exact copy/derivation formulas in `fetchData`.
- The one hardcoded "Executive Dashboard" and its 3 widgets.
- `generateReport`'s "metadata only, no real content" behavior and its complete loss on page refresh (not persisted).
- `exportReport`'s PDF/Excel-as-JSON and CSV-metadata-only behavior, including exact filenames/mimetypes.
- The `/api/analytics` and `/api/workflows` mismatches — preserve as-is unless a separate task explicitly asks to fix them.
- All currently-dead buttons remain dead (no `onClick`) unless explicitly asked to be wired up.
- `renderChart`'s non-generic `dataKey` assumptions.
- The exact report type/chart type/schedule frequency/export format string values (`reportTypes[].value`, `'bar'|'line'|'pie'|'area'`, `'daily'|'weekly'|'monthly'|'quarterly'`, `'pdf'|'excel'|'csv'`).

## Known Risks and Uncertainties

- **Confirmed bug (not to silently fix):** `/api/analytics` response has no `.analytics` field; the fetch result is always discarded.
- **Confirmed bug (not to silently fix):** `/api/workflows` response array is under `results`, read as `.workflows`; always `[]`. Compounded by filtering on a `status` field the `Workflow` Prisma model doesn't have (`isActive: Boolean` is the real field).
- **Uncertain:** whether "intended users" should be role-restricted — no code answers this today; both the page and the dev-mode middleware bypass auth entirely.
- **Uncertain:** whether `Report`/`Dashboard`/`Widget` should ever become real backend-persisted entities (there's no Prisma model for any of the three) — out of scope to assume during a pure extraction refactor.
- **Uncertain:** the product intent behind the `Equity`/`Social Inclusion` GEDSI category remap in the dead `generateGEDSIMetricsData` — needs a product decision before reviving, not a unilateral fix.

## Suggested Implementation Order

1. Extract `types/` and `constants/` (zero behavior risk, pure data).
2. Extract `lib/report-calculations.ts`, `lib/report-scheduling.ts`, `lib/report-export.ts` (pure functions, easy to unit test against current output before/after).
3. Extract `hooks/use-advanced-reports-data.ts`, preserving the two confirmed bugs verbatim; add a regression test asserting `analytics`/`workflows` values match today's (broken) behavior so a future intentional fix is a visible, reviewed change.
4. Extract `hooks/use-report-generator.ts`.
5. Build `components/charts/report-chart.tsx` as a direct lift of `renderChart`.
6. Build desktop components first (`desktop-report-generator.tsx`, `desktop-reports-list.tsx`, `desktop-scheduled-list.tsx`, `desktop-dashboard-builder.tsx`), verifying pixel/behavior parity against the current single-file page at ≥1024px.
7. Design and build mobile components last, since they require new layout decisions (step flow, Sheet-based filters, tap-based widget add) rather than a direct lift.
8. Wire `page.tsx` to pick desktop vs. mobile presentation and delete the now-unused code from the monolith.

## Testing Checklist

- [ ] `GET /api/ventures?limit=100` succeeds → reports/dashboard reflect real venture counts/funding
- [ ] `GET /api/gedsi-metrics?limit=200` succeeds → report #2 reflects real metric counts
- [ ] `GET /api/users?limit=50` succeeds → report #5 reflects real user counts
- [ ] `GET /api/analytics` succeeds → confirm current behavior is unchanged (result still discarded) unless intentionally fixed
- [ ] `GET /api/workflows?limit=50` succeeds → confirm current behavior is unchanged (report #4 still shows 0/0) unless intentionally fixed
- [ ] Loading state: spinner shown until all 5 fetches settle
- [ ] Partial API failure (one of five endpoints returns non-2xx): page still renders, degraded fields show zero/empty, no crash
- [ ] Full API failure (thrown exception, e.g. offline): single fallback "Error Loading Reports" report shown, `dashboards` empty
- [ ] Empty ventures (`ventures: []`): seed reports render with 0-based copy, sector chart shows the "No Data" fallback slice, dashboard chart widget shows the flat 0-value 6-month series
- [ ] Empty reports (search/filter yields nothing): confirm current behavior (blank grid, no message) is preserved or intentionally improved
- [ ] Report type selection: all 10 options selectable; Generate button disabled until one is chosen
- [ ] Filters: search box matches name/description/type substrings; status filter narrows correctly; Clear Filters resets both
- [ ] Date range: from/to inputs update `dateRange`; confirm it still has no effect on generated content (unless intentionally changed)
- [ ] Metric selection: checkboxes toggle `selectedMetrics`; confirm stored-but-unused-elsewhere behavior is preserved
- [ ] Chart type selection: confirm still has no preview effect (unless intentionally changed)
- [ ] Report generation: new report appears at top of Reports tab with correct defaults/name/description fallback logic
- [ ] Report preview: confirm there is still no preview step (unless a preview is explicitly added as new scope)
- [ ] Export PDF: downloads `.pdf` file containing JSON (confirm mislabeling preserved unless intentionally fixed)
- [ ] Export Excel: downloads `.xlsx` file containing JSON (same)
- [ ] Export CSV: downloads single-row CSV with report metadata only
- [ ] Scheduling: enabling schedule reveals frequency + recipients fields; generated report carries `nextRun`; confirm it's still lost on refresh (unless intentionally persisted)
- [ ] Dashboard creation: confirm there is still no way to save the builder canvas into `dashboards` (unless intentionally added)
- [ ] Dashboard editing: confirm Edit button on a dashboard card is still a no-op (unless intentionally wired)
- [ ] Dashboard duplication: confirm no duplicate action exists anywhere (unless intentionally added)
- [ ] Dashboard deletion: confirm no delete action exists anywhere (unless intentionally added)
- [ ] Widget selection: dragging (desktop) or the mobile equivalent adds a widget to the canvas
- [ ] Widget configuration: confirm the gear icon is still a no-op (unless intentionally wired)
- [ ] Dashboard layout behaviour: confirm dropped widgets still ignore `position` and render in the static grid order (unless intentionally fixed); confirm `updateWidgetPosition` is still unused (unless intentionally wired)
- [ ] Desktop viewport (≥1024px): 4-column generator fields, 6-icon report toolbar, drag-and-drop canvas all functional
- [ ] Tablet viewport (~768px): grids collapse to 2 columns as expected, no overlap
- [ ] Mobile viewport (~390px and 360px): step-based generator (if implemented) or confirm current single-column form is scrollable without horizontal overflow
- [ ] Keyboard navigation: every interactive control (including any newly added mobile "add widget" affordance) reachable and operable via Tab/Enter/Space; confirm the current drag palette remains keyboard-unreachable if desktop DnD is preserved as-is
- [ ] Screen-reader labels: icon-only buttons have `aria-label`/`title`; form labels are associated via `htmlFor`/`id` (currently only true for the metrics checklist — verify scope of any fix)
- [ ] No horizontal overflow at 360px: report-row toolbar row, date-range inputs row, tab list, dashboard canvas grid

---

## Implemented Structure

```
advanced-reports/
├── page.tsx                                    # 59 lines — route composition only
├── README.md
├── components/
│   ├── advanced-reports-header.tsx
│   ├── report-summary.tsx
│   ├── report-filters.tsx                      # shared search+status fields (inline on desktop, inside a Sheet on mobile)
│   ├── report-icons.ts                         # iconName string -> lucide component map
│   ├── charts/
│   │   └── report-chart.tsx                    # direct lift of `renderChart`
│   ├── dashboard-builder/
│   │   ├── widget-palette.tsx                  # desktop-only HTML5 drag palette
│   │   └── dashboard-canvas.tsx                # desktop-only drop canvas
│   ├── dialogs/
│   │   ├── schedule-report-dialog.tsx          # shared by desktop + mobile generators
│   │   └── export-report-dialog.tsx            # used by mobile report cards (desktop keeps its inline 3-button export)
│   ├── desktop/
│   │   ├── advanced-reports-desktop.tsx        # tab shell, ≥1024px
│   │   ├── desktop-report-generator.tsx
│   │   ├── desktop-reports-list.tsx
│   │   ├── desktop-scheduled-list.tsx
│   │   ├── desktop-dashboard-builder.tsx
│   │   └── desktop-analytics.tsx
│   └── mobile/
│       ├── advanced-reports-mobile.tsx         # tab shell, <1024px
│       ├── mobile-report-builder.tsx           # 5-step generator
│       ├── mobile-report-list.tsx
│       ├── mobile-report-card.tsx
│       ├── mobile-filter-sheet.tsx
│       ├── mobile-scheduled-list.tsx
│       ├── mobile-dashboard-list.tsx           # tap-to-add + up/down reorder, NOT the desktop canvas
│       └── mobile-analytics.tsx
├── hooks/
│   ├── use-advanced-reports-data.ts
│   ├── use-report-builder.ts
│   ├── use-dashboard-builder.ts
│   └── use-viewport.ts                         # new — no shared viewport hook existed in the repo before this
├── lib/
│   ├── report-calculations.ts
│   ├── report-scheduling.ts
│   ├── report-export.ts
│   ├── report-filters.ts
│   ├── report-validation.ts
│   └── format.ts
├── types/
│   └── advanced-reports.types.ts
└── constants/
    └── advanced-reports.constants.ts
```

**Deviations from the task brief's proposed tree, and why** (the brief said to follow the README's analysis where it shows a more accurate boundary — the "Proposed Folder Structure" section above already argued each of these; the deviations below are the same reasoning applied during implementation):

- No `report-workspace.tsx` / `report-configuration.tsx` / `report-preview.tsx` / `report-empty-state.tsx`. There is still no preview step and no empty-state message gap to fill (both preserved as documented gaps below); inventing components with no behaviour to extract would be new UI, not extraction.
- Chart components are one `report-chart.tsx`, not four `report-bar/line/pie/area-chart.tsx` files. The original is one ~70-line switch; four files would each be smaller than the switch itself.
- `dashboard-editor-dialog.tsx` / `delete-dashboard-dialog.tsx` were **not** built. Dashboard Edit/Share/Delete have no handlers anywhere in the original and no task instruction asked to implement them — building dialogs for them would be inventing functionality, which rule 15/"Refactor Goals #3" explicitly disallows.
- `dashboard-builder/` stays 2 files (`widget-palette.tsx`, `dashboard-canvas.tsx`) for desktop; there's no catalog/editor/widget-preview/deletion-confirmation behaviour today to split into `dashboard-catalog.tsx`, `dashboard-card.tsx`, `dashboard-editor.tsx`, `dashboard-widget.tsx`, `widget-preview.tsx`. Mobile's equivalent lives in `mobile/mobile-dashboard-list.tsx` since its interaction model (tap list + reorder) is different enough from desktop's palette/canvas pair to not share a container name.
- `report-mappers.ts` / `chart-data-mappers.ts` / `dashboard-layout.ts` were not created as separate files — there is no mapping logic beyond what already lives in `report-calculations.ts` (chart-data generation) and `use-dashboard-builder.ts` (layout array mutation); empty files were not manufactured to match the template.
- `use-advanced-reports.ts` is named `use-advanced-reports-data.ts` (README's original naming, kept for clarity — "data" distinguishes it from the two other hooks at a glance).
- Two files exist that aren't in the brief's tree: `components/report-icons.ts` (icon-name → lucide-component lookup, needed once constants stopped storing component references directly) and `lib/format.ts` (`formatDate`, shared by 3+ card components — small but genuinely reused, not a one-off).
- `components/desktop/desktop-analytics.tsx` / `components/mobile/mobile-analytics.tsx` aren't in the brief's tree either, but the Analytics tab is a real 4th tab in the original with real (if fabricated) content — it needed the same per-tab component treatment as Reports/Scheduled/Dashboards, so it got one.

## Component Responsibilities

| Component | Owns |
|---|---|
| `advanced-reports-header.tsx` | Title + Templates/Settings/New Report buttons (all three remain decorative) |
| `report-summary.tsx` | "Showing N of M reports" + Clear Filters |
| `report-filters.tsx` | Search input + status select fields, shared by desktop's inline row and mobile's Sheet |
| `charts/report-chart.tsx` | `bar/line/pie/area` rendering from already-computed chart data; no calculations, no fetches |
| `dashboard-builder/widget-palette.tsx`, `dashboard-canvas.tsx` | Desktop-only HTML5 drag-and-drop scratch canvas, unchanged prototype behaviour |
| `dialogs/schedule-report-dialog.tsx` | Frequency/recipients fields, relocated from an inline section into a Dialog |
| `dialogs/export-report-dialog.tsx` | Format picker + download trigger, used where a 6-icon row doesn't fit (mobile) |
| `desktop/*` | ≥1024px layout: 4-column generator, 6-icon report toolbar, drag-and-drop builder, 4-column analytics grid |
| `mobile/*` | <1024px layout: step generator, filter Sheet, vertical cards, tap-to-add + reorder builder, 2-column analytics grid |

## Data Hook

`hooks/use-advanced-reports-data.ts` — owns the 5 `Promise.all` fetches, `reports`/`dashboards`/`ventures`/`gedsiMetrics`/`users` state, and `requestState: { isLoading, hasFatalError }`. Exposes `refetch` (new capability requested by the task; not wired to any UI control, since no "Refresh" affordance existed in the original and inventing one wasn't asked for). Preserves three bugs verbatim — see "Preserved Behaviour" below.

## Report Builder Hook

`hooks/use-report-builder.ts` — owns every Quick Report Generator field, `generateReport`, and `exportReport`. Takes `reports`/`setReports` from the data hook as parameters (rather than owning its own copy) so both hooks stay in sync with a single source of truth for the reports list. Calls `lib/report-validation.ts`, `lib/report-scheduling.ts`, and `lib/report-export.ts` for pure logic.

## Dashboard Builder Hook

`hooks/use-dashboard-builder.ts` — owns only the scratch-canvas state (`isDashboardBuilderOpen`, `draggedWidget`, `dashboardLayout`) and its mutators. Does not touch the persisted `dashboards` list (that stays in the data hook) or any report-generation state. Adds `addWidgetByTap` and `moveWidget` for mobile — both are new, task-authorized capabilities (see "Dashboard Builder" below), not present in the original.

## Calculation and Mapping Modules

- `lib/report-calculations.ts` — `generateVenturePerformanceData`, `generateSectorDistributionData`, `generateGEDSIMetricsData` (dead, preserved), `calculatePortfolioSummary`, `calculateGedsiSummary`, `calculateActiveUsers`, `calculateWorkflowCounts`, `buildSeedReports`, `buildSeedDashboards`, `buildFallbackReport`.
- `lib/report-scheduling.ts` — `getNextRunTime`.
- `lib/report-export.ts` — `prepareExportPayload` (pure) + `downloadExportPayload` (the one browser-API touchpoint in `lib/`).
- `lib/report-filters.ts` — `filterReports` (search + status predicate).
- `lib/report-validation.ts` — `isReportConfigurationValid` (the single `!selectedReportType` check).
- `lib/format.ts` — `formatDate`.

All are pure, typed, `React`-free, and fetch-free (per rule 8), except `downloadExportPayload`, which is explicitly the export-specific browser-API exception the task allows.

## Desktop Layout

Visually unchanged from the original at ≥1024px: 4-column Quick Report Generator, 6-icon-per-row report cards, 4-tab `Tabs`, HTML5 drag-and-drop Dashboard Builder canvas, 4-column Analytics grid. The one structural change is scheduling moving from an inline collapsible section into `ScheduleReportDialog` (task rule 12).

## Mobile Layout

Genuinely separate presentation, not responsive classes on the desktop tree:

- `MobileReportBuilder` — 5-step wizard (Report type → Date range → Metrics & chart → Review → Generate), one section visible at a time.
- `MobileReportList` / `MobileReportCard` — vertical cards; the 6-icon toolbar collapses to one "Export" button (opens `ExportReportDialog`) + 3 decorative icons, instead of shrinking all 6 into a row.
- `MobileFilterSheet` — search/status fields inside a `Sheet` instead of competing for width inline.
- `MobileDashboardList` — **not** the desktop canvas. Widgets are added by tapping a card (`addWidgetByTap`) instead of HTML5 drag, and reordered with explicit ↑/↓ buttons (`moveWidget`) instead of drag positioning. Both are new interaction design for mobile, explicitly authorized by task rule 11/14 ("use explicit reorder controls... where needed") — not a port of the existing (non-functional) drag prototype.
- Charts render at `height={220}` instead of the desktop `300`, inside full-width cards.

## Report Generation

Unchanged: `generateReport` still produces metadata-only `Report` objects (no attached chart data or computed values), still resets the form on submit, and is still lost on page refresh (report state lives only in `useAdvancedReportsData`'s in-memory `reports`, replaced by the 5 seed reports on the next `fetchData`). The only new validation is `MobileReportBuilder` gating "Next" past step 0 on `isValid` — a minor step-flow guard, not a new business rule (the underlying `isReportConfigurationValid` check is identical on both platforms).

## Scheduling and Export

**Scheduling is confirmed local-only / simulated**, not persisted — see original "Report Scheduling Workflow" section above; this refactor does not change that. `ScheduleReportDialog` relocates the existing fields into a Dialog; Cancel and Save both just close the dialog because the fields are two-way bound directly to `use-report-builder` state (nothing to discard). No loading/error/success UI was added for scheduling because no asynchronous operation exists for it.

**Export**: `lib/report-export.ts` is an unchanged port of the original Blob/filename/MIME logic — `pdf`/`excel` are still JSON content mislabeled with those extensions, `csv` is still metadata-only. `ExportReportDialog` adds a minimal loading label ("Exporting…") and a visible error message on failure — a small, rule-16-sanctioned accessibility improvement (the original only `console.error`d failures), not a change to what gets exported.

## Dashboard Builder

Desktop: byte-for-byte the same non-functional prototype (drag works, but widgets never get real data, `position` is never used for layout, nothing persists into `dashboards`, reload discards everything). Mobile: new tap-to-add + reorder interaction (see "Mobile Layout" above) built on the same `useDashboardBuilder` hook, with the same "no real data, no persistence" limitations preserved — only the input method changed, not what happens after a widget is added.

## Preserved Behaviour

Everything in the original "Behaviour That Must Not Change" and "Known Risks and Uncertainties" sections above, confirmed still true after extraction:

- 5 hardcoded seed reports + their exact copy/derivation formulas.
- The one hardcoded "Executive Dashboard" and its 3 widgets.
- `generateReport`'s metadata-only, lost-on-refresh behaviour.
- Export's PDF/Excel-as-JSON, CSV-metadata-only behaviour, exact filenames/MIME types.
- `/api/analytics`'s discarded-result bug and `/api/workflows`'s `results`-vs-`workflows` key mismatch (both now type-documented in `advanced-reports.types.ts` via `WorkflowPageAssumedShape` and the explicit `unknown`-cast comments in `use-advanced-reports-data.ts`, instead of silently coerced away).
- All decorative buttons (View/Edit/Share/Settings/Pause/Delete, dashboard Edit/Share, canvas widget Settings) remain dead — no `onClick` added.
- `renderChart`'s non-generic `dataKey` assumptions (`report-chart.tsx`).
- Exact string values for report type/chart type/schedule frequency/export format.

**Newly documented (found during extraction, not in the original analysis pass):** report #1/#2/#5's display copy and several filter fields read the React state variable (`ventures`/`gedsiMetrics`/`users`) instead of the freshly-fetched array inside `fetchData`. Because the fetch only ever runs once on mount, that state is always the pre-fetch value (`[]`) at the time it's read, so `Venture Performance Report (0 ventures)`-style copy renders with a **zero count even when real data loads successfully**, while the same report's `totalFunding`/`sectors`/etc. (which do read the fresh array) are correct. This is preserved exactly and made explicit via `SeedReportsInput`'s `stale*` parameters in `lib/report-calculations.ts` (see the doc comment there) rather than silently "fixed" by switching every reference to the fresh array. Flagged here for a product/eng decision, per the same rule the original two confirmed bugs were flagged under.

## Validation Results

- **TypeScript** (`npx tsc --noEmit -p .` from `miv/`): **0 errors in any `advanced-reports` file.** The full repo run reports 184 pre-existing errors in unrelated files (other API routes and dashboard pages, e.g. `improve-gedsi-scores/route.ts`, `custom-dashboards/page.tsx`) that predate this change and were not touched.
- **Lint** (`npx eslint "app/dashboard/(g4-reporting-insights)/advanced-reports/**/*.{ts,tsx}" --format json`): **0 errors, 0 warnings.** (The repo's default `stylish` formatter crashes — `TypeError: util.styleText is not a function` — because this environment runs Node 18.20.8 and that formatter needs Node ≥20; using `--format json` works around the formatter bug without touching any config. Confirmed unrelated to this feature.)
- **Production build** (`npm run build` from `miv/`): **could not run.** Output: `You are using Node.js 18.20.8. For Next.js, Node.js version ">=20.9.0" is required.` This is a pre-existing environment constraint (this Next.js version's minimum Node requirement), not something introduced by this refactor.
- **Dev server smoke check**: an already-running `next dev` (Turbopack) picked up the new `page.tsx` and compiled it — `.next/dev/server/app/dashboard/(g4-reporting-insights)/advanced-reports` and matching client/server chunks were generated for the route, and `GET /dashboard/advanced-reports` returned `200`. This confirms the full ~34-file module graph resolves and bundles without a compile error.
- **Full interactive/visual browser verification was not completed.** No browser-automation tool was available in this environment (`chromium-cli`, `playwright`, and `puppeteer` are all absent, and installing one was avoided per the "don't add dependencies unless necessary" instruction). A single `curl` fetch of the route only returns the outer `app/dashboard/layout.tsx`'s own pre-hydration "Loading..." shell (that layout gates its children behind a client-side check before this page's tree ever mounts), so it can't be used to confirm the page's actual rendered content, tab switching, or the mobile step flow. **Say so explicitly rather than claiming success**: the report generation flow, tab navigation, dialogs, and mobile step wizard have been verified by code review and the type/lint/compile checks above, but not by driving them in a live browser.

## Known Remaining Issues

- The pre-existing, now-documented stale-state bug described under "Preserved Behaviour" above (report #1/#2/#5 display copy always reads pre-fetch state).
- The two original confirmed bugs (`/api/analytics` discarded result, `/api/workflows` key mismatch + nonexistent `status` field) — preserved, not fixed.
- Desktop's drag-and-drop widget palette remains keyboard-unreachable (plain `div[draggable]`, no `tabIndex`/keyboard handlers) — preserved as a known, documented gap rather than redesigning desktop's interaction model; mobile's tap-based equivalent (`MobileDashboardList`) is fully keyboard-operable.
- No dashboard create/edit/duplicate/delete exists anywhere (desktop or mobile) — same gap as the original; not implemented here since it wasn't asked for and would be new functionality, not extraction.
- `updateWidgetPosition`-equivalent resize/precise-position editing still doesn't exist on desktop; mobile's `moveWidget` only reorders the list, it doesn't set `x/y/w/h`.
- Full interactive browser verification (see "Validation Results") is outstanding — recommend running this through the `run` skill again once a Node ≥20 environment or a browser-automation tool is available.
- Two "report category" / "dashboard category" concepts named in the task's type checklist have no basis in current behaviour (there's only `ReportTypeValue`; dashboards have no category field anywhere) and were intentionally not invented as new types — see rule "no invented unsupported fields."

## Future Improvements

- Fix (as a separate, reviewed change) the `/api/analytics` and `/api/workflows` contract mismatches, and the newly-documented stale-state bug — all three are flagged, none silently touched here.
- Decide the product intent behind `generateGEDSIMetricsData`'s `Equity`/`Social Inclusion` remap before reviving it (or delete it if it's confirmed unwanted).
- If dashboard persistence is ever wanted, it needs a real Prisma model — none of `Report`/`Dashboard`/`Widget` are backed by one today.
- Wire the currently-dead buttons (View/Edit/Share/Settings/Pause/Delete, dashboard Edit/Share) as their own explicitly-scoped follow-up, now that each lives in its own small, easy-to-extend component.
- Consider a real PDF/spreadsheet export library if PDF/Excel export needs to stop being JSON-with-a-different-extension.
