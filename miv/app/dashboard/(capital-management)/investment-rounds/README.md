# Investment Rounds Page Refactor Audit

## Scope

This document audits the current implementation of:

- Source: `miv/app/dashboard/(capital-management)/investment-rounds/page.tsx`
- Route: `/dashboard/investment-rounds`
- Current size: 1,618 lines

No application code was changed as part of this audit.

The recommendations also take account of `MIV_ARCHITECTURE.md` and
`PAGE_REFACTOR_PRIORITY.md`. The priority document classifies this route as
Category A, order A07, with high mobile risk. It specifically recommends
extracting venture-to-round conversion and risk/GEDSI calculations before
splitting the list/table and dialogs.

## Executive summary

The page currently acts as a route, API client, domain adapter, calculation
engine, presentation utility library, and renderer for six views. These
responsibilities are all held in one client component.

The most important refactoring boundary is not an arbitrary split by JSX size.
It is the boundary between raw `Venture` API data and a stable, typed
`InvestmentRound` view model. That adapter currently contains business rules,
fallbacks, formatting, and random synthetic values. Once it and the aggregate
calculations are isolated and tested, the page can become a small orchestration
shell composed from focused view components.

## Current file structure

| Approximate lines | Section | Responsibility |
| --- | --- | --- |
| 1-50 | Imports | React hooks, UI primitives, and a large Lucide icon set |
| 52-90 | `InvestmentRound` | Page-facing round model, including GEDSI, AI, and impact fields |
| 92-117 | `Venture` | Locally duplicated API response type with several `any` fields |
| 119-305 | `mockInvestmentRounds` | Large, currently unused fixture dataset |
| 308-493 | `transformVentureToRound` | API-to-view-model mapping plus scoring, risk, targets, formatting, defaults, and synthetic data |
| 495-535 | Option constants | Round types, stages, sectors, and founder types |
| 537-687 | Page state and logic | Fetching, filtering, display helpers, and portfolio aggregates |
| 689-731 | Loading/error branches | Separate full-page loading and error renderers |
| 735-770 | Header/actions | Title, refresh, and placeholder add-round dialog |
| 772-848 | Summary cards | Six portfolio-level KPI cards |
| 850-961 | Distribution cards | Founder, sector, risk, and status distributions |
| 963-1249 | Overview tab | Six filters, nine-column table, row actions, and round-detail dialog |
| 1250-1359 | GEDSI tab | GEDSI/impact summaries and top performer list |
| 1360-1488 | AI Insights tab | Risk distribution, recommendations, strengths, and per-round analysis |
| 1489-1532 | Timeline tab | Closing-date ordered timeline |
| 1533-1585 | Analytics tab | Lead-investor and sector aggregations |
| 1586-1618 | Documents tab | Placeholder upload/share actions and empty state |

## Current responsibilities

### Route and orchestration

The default export owns the entire feature lifecycle. It initiates loading,
selects loading/error/success layouts, owns all interaction state, derives all
view data, and renders every tab.

### Data retrieval

`fetchRounds` calls `/api/ventures?limit=100`, checks the response, transforms
each venture, and sets loading/error/data state. The request uses the browser
`fetch` API directly instead of a feature hook or the shared API-client pattern
noted elsewhere in the architecture audit.

### Domain adaptation

`transformVentureToRound` performs all of the following:

- parses founder types and sometimes AI analysis;
- calculates or selects a GEDSI score;
- maps pipeline stages to round types;
- maps venture statuses to round statuses;
- derives a risk level;
- generates recommendation/strength/improvement fallbacks;
- estimates target funding by stage;
- formats monetary values as display strings;
- manufactures default investor, participant, valuation, ownership, impact,
  sustainability, jobs, community, leadership, disability, and carbon data.

This is the densest business-logic section and the highest-value first
extraction.

### Filtering

The overview supports free-text search plus round type, stage, status, sector,
and founder-type filters. Filtering is recomputed on every render.

### Aggregation

The component derives total/open/closed rounds, target and raised totals,
average scores, jobs, communities, women-led count, and disability-inclusive
count. Additional distributions and aggregates are recomputed inline inside
the JSX for individual cards and tabs.

### Presentation helpers

Five local helpers return status icons/badges, risk icons/badges, GEDSI colour
classes, or founder badges. Some helpers mix domain interpretation with React
elements, which prevents their calculation rules from being tested without
rendering UI.

### Feature views

The page renders a persistent summary area followed by six tabs:

1. Overview: filters, table, actions, and details.
2. GEDSI Impact: aggregate performance and top performers.
3. AI Insights: risk and recommendation summaries plus detailed analyses.
4. Timeline: rounds ordered by closing date.
5. Analytics: lead investor and sector summaries.
6. Documents: a placeholder panel.

## State and behavior inventory

### Active state

| State | Purpose | Consumers |
| --- | --- | --- |
| `searchTerm` | Text search | Overview filters and `filteredRounds` |
| `selectedRoundType` | Round-type filter | Overview filters and `filteredRounds` |
| `selectedStage` | Stage filter | Overview filters and `filteredRounds` |
| `selectedStatus` | Status filter | Overview filters and `filteredRounds` |
| `selectedSector` | Sector filter | Overview filters and `filteredRounds` |
| `selectedFounderType` | Founder filter | Overview filters and `filteredRounds` |
| `selectedRound` | Current detail target | Per-row detail dialogs |
| `isViewDialogOpen` | Detail dialog visibility | Per-row detail dialogs |
| `isAddRoundDialogOpen` | Add dialog visibility | Header dialog |
| `rounds` | Transformed API results | All successful views |
| `loading` | Initial/refresh request status | Page branches and refresh button |
| `error` | Request failure message | Error branch |

### Dead or unfinished state

The following state is declared but never read or updated outside its own
declaration:

- `activeView` / `setActiveView` — tabs are uncontrolled via `defaultValue`.
- `isEditDialogOpen` / `setIsEditDialogOpen` — the edit icon has no handler.
- `isExporting` / `setIsExporting` — no export workflow exists.

### Request lifecycle

The mount effect calls `fetchRounds` once. Refresh calls the same function.
Errors deliberately clear the rounds and do not fall back to the fixture data.
Loading and error states each duplicate the page title/header structure.

## Problems and risks

### 1. Too many layers in one component

The route contains API access, response types, business rules, aggregation,
formatting, state management, and six substantial render trees. Changes to any
one concern require editing and reviewing the same 1,618-line file.

### 2. Unstable and synthetic domain data

The adapter uses `Math.random()` for ownership, fallback impact and
sustainability scores, jobs, communities, leadership, disability inclusion,
and carbon reduction. Values therefore change whenever data is fetched and do
not necessarily represent persisted facts. This makes the UI non-deterministic,
complicates testing, and can change sorting or analytics after refresh.

Defaults such as `MIV Fund`, `Co-investors`, `$5M`, and generated dates also
blur the distinction between source data, inferred data, and placeholders.
Refactoring should preserve current behavior initially, but the adapter should
make these provenance rules explicit so product decisions can follow.

### 3. In-place mutation of React state

The GEDSI top-performers list calls `rounds.sort(...)`, and the timeline calls
`rounds.sort(...)` again. `Array.prototype.sort` mutates the state array. Merely
visiting/rendering one tab can alter the ordering observed by other views.
Derived ordering should use copied arrays or pure selectors.

### 4. Parsing and type-safety weaknesses

- The initial `JSON.parse(venture.founderTypes)` is not guarded, so malformed
  API data can fail transformation of the entire response.
- `aiAnalysis`, `gedsiGoals`, `gedsiMetrics`, and `capitalActivities` use `any`.
- Some code parses string AI analysis while other code accesses
  `venture.aiAnalysis?.riskLevel` directly, producing inconsistent behavior for
  string versus object payloads.
- `sustainabilityGoals` expects `string[]`, but `venture.gedsiGoals` is assigned
  without validation.
- `aiInsights as any` suppresses adapter type errors rather than resolving them.

### 5. Display strings are used as calculation data

Target and raised values are converted to strings such as `$5.0M` in the
adapter and later parsed back into numbers for totals and progress. This couples
calculation correctness to formatting. The domain/view model should retain
numeric amounts and format them only at presentation boundaries.

### 6. Filter vocabulary mismatch

`round.stage` retains the raw venture stage (for example `INTAKE`,
`DUE_DILIGENCE`, or `INVESTMENT_READY`), while the stage filter options are
`Seed`, `Early`, `Growth`, `Late`, and `Exit`. Many or all stage selections can
therefore return no matches. Stage normalization needs one authoritative map.

The sector and round-type filters are also hard-coded, so valid API values not
in those lists are not directly selectable.

### 7. Repeated and scattered calculations

Counts and percentages for founder type, sector, risk, and status are calculated
inside mapped JSX. Other values such as carbon reduction, women leadership,
investor totals, sector GEDSI, and progress are similarly calculated at render
sites. This hides business rules and repeats scans over the same collection.

### 8. Zero-data edge cases

Some ratios guard against zero totals, but others do not. Women-led percentage,
raised-versus-target percentage, disability-inclusive percentage, and average
women leadership can render `NaN` when the API returns an empty list or total
target is zero. There is also no dedicated empty state for zero rounds or zero
filter matches.

### 9. Dialog ownership and row rendering

A complete detail `Dialog` is created inside every table row while visibility is
controlled by shared `selectedRound` state. This duplicates a large subtree and
mixes row rendering with detail presentation. One page-level
`RoundDetailDialog` should receive the selected round.

### 10. Incomplete and misleading controls

- New Round opens a “Coming Soon” placeholder.
- Edit and row download buttons have no handlers.
- Upload Documents and Share All have no handlers.
- The edit and export state variables are unused.

Controls should eventually be implemented, disabled with an explanation, or
removed according to product intent. Component extraction alone should not
silently invent those workflows.

### 11. Responsive and accessibility pressure

The overview uses a nine-column table without an explicit small-screen
presentation. The six-item tab list and dense headers/actions will also need a
mobile treatment. Labels are visually present, but using actual label-to-control
associations would improve form accessibility. Icon-only row actions need
accessible names/tooltips.

### 12. Dead code and import noise

The large mock dataset is never read. Several state pairs and icons are also
unused, including the chart icons and multiple action/content icons. This makes
the feature appear to support behavior it does not have and increases audit
cost.

### 13. No memoized selectors or isolated tests

Filtering, totals, distributions, and tab-specific aggregations rerun during
render. At the current 100-record limit this is unlikely to be a major runtime
issue, but pure selectors plus `useMemo` at the orchestration boundary would be
clearer and directly testable. There are no visible seams for testing mapping,
risk, targets, filters, or aggregates independently.

### 14. Logging and encoding artifacts

Development logging remains in the request/adapter path, including visibly
mis-encoded emoji text. Several rendered separators also appear mis-encoded in
the source. These should be handled as an explicit cleanup during refactoring,
not accidentally propagated into extracted components.

## Recommended feature structure

The exact folder should follow the repository's chosen feature convention. A
cohesive target could be:

```text
app/dashboard/(capital-management)/investment-rounds/page.tsx
components/dashboard/investment-rounds/
  investment-rounds-page.tsx
  investment-rounds-header.tsx
  investment-round-kpis.tsx
  investment-round-distributions.tsx
  round-filters.tsx
  investment-rounds-table.tsx
  investment-rounds-cards.tsx
  round-detail-dialog.tsx
  add-round-dialog.tsx
  tabs/
    gedsi-impact-panel.tsx
    ai-insights-panel.tsx
    investment-timeline.tsx
    investment-analytics.tsx
    round-documents-panel.tsx
hooks/
  use-investment-rounds.ts
lib/investment-rounds/
  types.ts
  venture-to-round.ts
  calculations.ts
  filters.ts
  formatters.ts
  constants.ts
```

If the project prefers feature-owned hooks and domain files, these folders can
instead live together under a single `features/investment-rounds` directory.
The important property is dependency direction: the route imports the feature;
presentational components consume typed models; domain helpers do not import
React or UI primitives.

## Recommended component and module breakdown

### Route page

Keep `page.tsx` as a minimal route entry. Ideally it renders only the feature
page component (or, if the client boundary remains at the route, composes the
feature hook and top-level page component). It should not contain domain rules
or large JSX sections.

### `useInvestmentRounds`

Own:

- request lifecycle and refresh;
- transformation of validated API results;
- loading and error state;
- optionally filter state if it is not placed in a dedicated reducer/hook;
- stable callbacks for selection and dialogs.

Return a small, explicit page model rather than exposing setters for every
internal state value.

### `ventureToInvestmentRound`

Own the pure conversion from normalized API venture data to an investment-round
model. Split parsing/normalization from scoring if necessary. It should be
deterministic, have no JSX, and make fallback/inferred fields distinguishable.

### `investmentRoundCalculations`

Pure functions/selectors for:

- portfolio summary totals and averages;
- funding progress;
- founder/sector/risk/status distributions;
- GEDSI ranking;
- timeline ordering;
- lead-investor totals;
- sector performance.

Selectors must not mutate their inputs and should define zero-data behavior.

### `RoundFilters`

Render the search and five selects. Receive a typed filter object, option lists,
and a single change/reset API. Dynamic options should be derived from normalized
data where appropriate.

### `InvestmentRoundsTable` and `InvestmentRoundsCards`

The table owns desktop row presentation only. A separate card/list
presentation is recommended for narrow screens because collapsing nine columns
inside one table will remain difficult to scan. Both should emit semantic
actions such as `onView`, `onEdit`, and `onDownload`, without owning dialogs.

### `RoundDetailDialog`

Render one dialog outside the collection. Receive `round`, `open`, and
`onOpenChange`. Further internal sections such as round information, GEDSI
scores, impact metrics, and AI insights can remain local unless they become
large or reused.

### `InvestmentRoundKpis`

Render the six top-level KPI cards from a precomputed summary model. A small
data-driven card definition can reduce repetitive markup while preserving
individual icons and colour treatments.

### `InvestmentRoundDistributions`

Compose focused distribution cards for founder diversity, sectors, risk, and
status. A reusable small `DistributionCard` is justified because all four share
the same label/count/percentage structure.

### Tab panels

Extract each non-overview tab as a feature component:

- `GedsiImpactPanel`
- `AIInsightsPanel`
- `InvestmentTimeline`
- `InvestmentAnalytics`
- `RoundDocumentsPanel`

Each should receive already-derived data where practical, keeping repeated
collection calculations outside JSX.

### Dialogs and actions

`AddRoundDialog` can initially preserve the placeholder exactly. Edit, download,
upload, and share require product/API decisions before implementation. Their
component interfaces may be defined during refactoring, but behavior should not
be fabricated.

### Shared status presentation

Replace element-producing helpers with two layers:

1. Pure mappings from status/risk/score to semantic presentation tokens.
2. Small `RoundStatusBadge`, `RiskBadge`, or equivalent UI components.

This keeps rules testable and removes presentation branching from the page.

## Suggested data model improvements

Use numeric source values for calculations and format only when displayed. A
future model should distinguish:

- `targetAmount` and `raisedAmount` as numbers in a documented base currency;
- normalized pipeline stage versus display label;
- persisted values versus inferred fallbacks;
- optional values versus synthetic placeholders;
- normalized AI analysis and GEDSI goal shapes.

The API `Venture` contract should ideally be imported from a shared schema or
client type rather than redefined in the page. Runtime validation is warranted
for JSON-encoded fields.

## Recommended refactor sequence

1. Add characterization tests for current conversion, filtering, aggregates,
   status/risk display rules, and empty data behavior.
2. Move types, constants, JSON normalization, and the venture adapter out of
   the page without intentionally changing output.
3. Remove randomness from the calculation boundary or make the current fallback
   strategy explicit and deterministic, based on a product decision.
4. Extract pure aggregate/filter/sort selectors; fix state mutation and
   zero-denominator behavior.
5. Introduce `useInvestmentRounds` for request and interaction orchestration.
6. Extract header, KPI, distribution, and filter components.
7. Extract the table/card presentations and move to one page-level detail
   dialog.
8. Extract each tab panel.
9. Reduce the route to a thin feature composition.
10. Remove confirmed dead fixtures, state, imports, and logs, then perform the
    responsive pass.

This order follows the architecture and priority guidance: domain boundaries
come before visual fragmentation and mobile changes.

## Proposed end-state page responsibility

After refactoring, the top-level feature page should be responsible only for:

- invoking the feature hook;
- selecting loading, error, empty, or success states;
- passing typed view models and callbacks to composed sections;
- coordinating the selected round and top-level dialogs;
- selecting the active tab if controlled tab state is actually needed.

It should not parse API JSON, calculate scores, mutate/sort collections,
calculate portfolio analytics in JSX, or define the contents of every tab.

## Preservation checklist for the later refactor

- Preserve the `/dashboard/investment-rounds` route and client behavior.
- Preserve the `/api/ventures?limit=100` contract until an API change is
  explicitly authorized.
- Preserve loading, retry, and refresh behavior.
- Preserve all six tabs and current visible labels.
- Preserve all six filters while correcting their normalized value mapping.
- Preserve status, risk, GEDSI, funding, and impact presentation.
- Do not silently turn placeholder controls into fabricated functionality.
- Add explicit empty and no-filter-results states.
- Avoid in-place mutation of fetched/state arrays.
- Make zero-record results render valid values rather than `NaN`.
- Ensure table/card action controls have accessible names.
- Verify desktop and narrow-screen layouts after extraction.

