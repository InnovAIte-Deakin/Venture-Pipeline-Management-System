# Deal Flow Page

## Purpose

The deal-flow page is a client-side dashboard for viewing the venture investment pipeline as deal records. It loads ventures from the local ventures API, maps them into a `Deal` presentation model, calculates GEDSI, impact, readiness, probability, expected close, risk, and portfolio summary metrics, then renders overview, pipeline, impact, and AI insight views.

Expected users are internal MIV dashboard users who manage or review venture pipeline activity, such as administrators, analysts, investment team members, and portfolio or impact reviewers. The page itself does not enforce role-specific behavior.

## Current Route

- Source file: `miv/app/dashboard/(g3-venture-pipeline)/deal-flow/page.tsx`
- Public route: `/dashboard/deal-flow`
- Route group: `(g3-venture-pipeline)` is a Next.js route group and is not part of the URL.

## Current Responsibilities

The current `page.tsx` is responsible for all of the following:

- Declaring the `Deal` UI/domain type.
- Holding mock deal data that is currently unused by rendering.
- Declaring deal stage, sector, and founder type constants.
- Fetching venture data from `/api/ventures?limit=100`.
- Transforming raw venture records into deal records.
- Calculating or deriving GEDSI, impact, readiness, probability, close date, team assignment, activity label, status, founder types, sustainability goals, and AI insights.
- Holding all page state for filters, tabs, loading, error, export, selected deal, hover state, and dialogs.
- Filtering deals by search, stage, sector, status, and founder type.
- Calculating portfolio summary metrics.
- Rendering the page header, export button, add button, tabs, overview metrics, pipeline visualization, table, impact view, insight view, and four dialogs.
- Simulating export and generating a CSV download in the browser.
- Simulating add/edit behavior with disabled demo form controls.

Imports and usage:

- `React`, `useState`, `useEffect`: client component state and initial data loading.
- `calculateGEDSIScore` from `@/lib/gedsi-utils`: primary GEDSI score calculation when `venture.gedsiMetrics` exists.
- UI primitives from `@/components/ui/*`: `Card`, `Button`, `Badge`, `Input`, `Select`, `Table`, `Tabs`, `Progress`, `Alert`, and `Dialog` are used throughout rendering.
- `DialogTrigger` is imported but not used.
- Lucide icons: most imported icons are used for labels, actions, and statuses; `TrendingUp`, `Award`, `MessageSquare`, and `X` appear unused in this page.

Local TypeScript types:

- `Deal`: presentation model for transformed venture data.
- Inline `aiInsights`: `{ riskLevel, recommendation, keyStrengths, areasForImprovement }`.
- Inline `metrics`: `{ jobsCreated, communitiesServed, womenLeadership, disabilityInclusive }`.
- Inline `stageDealsDialog` state shape: `{ open: boolean; stage: string; deals: Deal[] }`.

## Current Data Sources

Page request:

- `GET /api/ventures?limit=100`
- Called once on mount by `fetchDeals`.
- Response is expected to contain `{ ventures: Venture[], pagination, isMobile }`.
- The page reads only `data.ventures`; `pagination` and `isMobile` are ignored.

Route handler inspected:

- `miv/app/api/(g3-venture-pipeline)/ventures/route.ts`
- Public endpoint: `/api/ventures`
- Supported query params: `page`, `limit`, `search`, `sector`, `stage`, `status`.
- The deal-flow page only passes `limit=100`, so all filtering is client-side after load.
- Mobile user agents are capped to `limit=5` by the API route, which can unexpectedly reduce deal-flow data if the page is opened on mobile.

GET response includes ventures from Prisma with:

- Always included: `createdBy`, `assignedTo`, and `_count`.
- Desktop included: `gedsiMetrics`, recent `documents`, recent `activities`, and `capitalActivities`.
- Mobile excluded: full GEDSI metrics, documents, activities, and capital activities.

Important raw venture fields consumed by this page:

- `id`, `name`, `sector`, `location`, `stage`, `status`, `updatedAt`
- `fundingRaised`, `revenue`, `teamSize`
- `founderTypes`, `inclusionFocus`, `stgGoals`, `gedsiGoals`, `sustainabilityGoals`
- `gedsiMetrics`, `gedsiMetricsSummary`
- `jobsCreated`, `totalBeneficiaries`, `womenEmpowered`, `disabilityInclusive`
- `operationalReadiness`, `capitalReadiness`
- `createdBy.name`, `assignedTo.name`

## Current Data Flow

1. `useEffect` calls `fetchDeals()` on mount.
2. `fetchDeals()` sets `loading` to `true`.
3. The browser fetches `/api/ventures?limit=100`.
4. The route returns raw Prisma ventures.
5. The page reads `data.ventures || []`.
6. The page logs raw venture stage counts.
7. Each venture is transformed inline into a `Deal`.
8. Transformation calls all scoring, mapping, parsing, and insight helpers declared inside the component.
9. Transformed deals are stored in `deals`.
10. The page logs transformed stage counts.
11. Derived values recompute during render from `deals` and filter state.
12. Tabs present the same transformed deal data in overview, pipeline/table, impact, and AI insight views.
13. Dialogs consume `selectedDeal` or `stageDealsDialog`.
14. Export consumes `filteredDeals`, generates CSV text, creates a browser blob, and downloads it.

Transformation details:

- `gedsiScore`
  - Location: `fetchDeals`, inline IIFE.
  - Inputs: `venture.gedsiMetrics`, `venture.aiAnalysis`, `venture.gedsiMetricsSummary`, individual metric values.
  - Output: rounded and clamped `0..100`.
  - Purity: not pure because fallback uses `Math.random()`.
  - Refactor target: utility or mapper helper, preserving current fallback behavior until clarified.

- `impactScore`
  - Location: local `calculateImpactScore`.
  - Inputs: founder types, inclusion focus, GEDSI metrics, GEDSI/SDG goals, metrics, sector.
  - Output: clamped score with minimum 15 and maximum 100.
  - Purity: mostly pure for a given venture, except debug logging.
  - Refactor target: `lib/deal-flow-calculations.ts`.

- `readinessScore`
  - Location: local `calculateReadinessScore`.
  - Inputs: truthy values in `operationalReadiness` and `capitalReadiness`.
  - Output: score starting at 60 and capped at 100.
  - Purity: pure for a given venture.
  - Refactor target: `lib/deal-flow-calculations.ts`.

- `dealStage`
  - Location: local `mapVentureStageToDealer`.
  - Inputs: raw venture stage enum string.
  - Output: display stage.
  - Purity: pure.
  - Refactor target: `lib/deal-flow-mappers.ts` or constants.

- `dealSize`
  - Location: `fetchDeals` mapper.
  - Inputs: `venture.fundingRaised`.
  - Output: formatted string such as `$2.5M`.
  - Purity: not pure because missing funding uses `Math.random()`.
  - Refactor target: mapper/calculation helper.

- `probability`
  - Location: local `calculateDealProbability`.
  - Inputs: raw venture stage, GEDSI score, impact score.
  - Output: number capped at 100.
  - Purity: pure.
  - Refactor target: `lib/deal-flow-calculations.ts`.

- `expectedClose`
  - Location: local `calculateExpectedClose`.
  - Inputs: raw venture stage and current date.
  - Output: ISO date string.
  - Purity: not pure because it uses `Date.now()` and `Math.random()`.
  - Refactor target: calculation helper with injectable date/random source for tests.

- `team`
  - Location: local `getAssignedTeam`.
  - Inputs: `createdBy.name`, `assignedTo.name`.
  - Output: string array, default `["Unassigned"]`.
  - Purity: pure.
  - Refactor target: mapper helper.

- `lastActivity`
  - Location: local `getLastActivity`.
  - Inputs: `updatedAt` and current time.
  - Output: relative text.
  - Purity: depends on current time.
  - Refactor target: mapper/date utility.

- `founderType`
  - Location: local `parseFounderTypes`.
  - Inputs: JSON string.
  - Output: string array or `[]`.
  - Purity: pure.
  - Refactor target: mapper helper.

- `sustainabilityGoals`
  - Location: local `parseSustainabilityGoals`.
  - Inputs: JSON string.
  - Output: mapped goals with `SDG_` changed to `SDG `, or `["Sustainable Development"]`.
  - Purity: pure.
  - Refactor target: mapper helper.

- `aiInsights`
  - Location: local `generateDealAIInsights`.
  - Inputs: raw venture, GEDSI score, impact score.
  - Output: risk level, recommendation, up to 5 strengths, up to 4 improvement areas.
  - Purity: pure for a given venture.
  - Refactor target: `lib/deal-flow-calculations.ts` or `lib/deal-flow-mappers.ts`.

## Business Rules and Calculations

Stage constants:

- `Intake`
- `Screening`
- `Due Diligence`
- `Investment Ready`
- `Funded`
- `Series A`
- `Series B`
- `Series C`
- `Exited`

Only the first six stages are shown in the pipeline flow visualization: `Intake` through `Series A`.

Sector constants:

- `CleanTech`, `Agriculture`, `FinTech`, `Healthcare`, `Education`, `E-commerce`, `Manufacturing`, `Services`, `Technology`

Founder type constants:

- `women-led`, `youth-led`, `disability-inclusive`, `rural-focus`, `indigenous-led`, `refugee-led`, `veteran-led`

Venture stage mapping:

- `INTAKE` -> `Intake`
- `SCREENING` -> `Screening`
- `DUE_DILIGENCE` -> `Due Diligence`
- `INVESTMENT_READY` -> `Investment Ready`
- `FUNDED` -> `Funded`
- `SEED` -> `Funded`
- `SERIES_A` -> `Series A`
- `SERIES_B` -> `Series B`
- `SERIES_C` -> `Series C`
- `EXITED` -> `Exited`
- Unknown -> `Intake`

Status mapping:

- `ACTIVE` -> `active`
- `INACTIVE` -> `paused`
- `ARCHIVED` -> `closed`
- Unknown -> `active`
- `lost` is supported by UI but does not currently map from the inspected backend enum.

Impact score rules:

- Starts at 0, max 100, final minimum 15.
- Leadership and governance, max 25:
  - `women-led`: +10
  - `disability-inclusive`: +8
  - `indigenous-led`: +7
  - `youth-led`: +5
  - `lgbtq-led`: +5
  - Parse fallback checks name/description for women/female (+8), disability/accessible (+6), youth/young (+4).
- Social impact and inclusion, max 30:
  - Rural/underserved/remote/community in inclusion focus: +8
  - Low-income/poverty/financial inclusion/microfinance: +8
  - Healthcare/medical/health access: +7
  - Education/learning/skills development: +7
  - At least three inclusion areas among gender, disability, rural, youth, education, healthcare: +5
- GEDSI metrics implementation, max 20:
  - Up to 12 points from total metrics at 2 points each.
  - Up to 8 points from verified/completed metric rate.
- SDG alignment, max 15:
  - Parses `venture.gedsiGoals || venture.sustainabilityGoals || "[]"`.
  - Up to 10 points at 2 points per goal.
  - Up to 5 bonus points at 2 points per high-impact SDG.
  - Parse fallback gives +6 for cleantech/sustainability sectors and +4 if inclusion focus exists.
- Operational evidence, max 10:
  - Jobs: 1 point per 10 jobs, max 4, using `venture.metrics?.jobsCreated`.
  - Communities: 1 point per 5 communities, max 3, using `venture.metrics?.communitiesServed`.
  - Disability inclusive: +3, using `venture.metrics?.disabilityInclusive`.
- Sector multiplier:
  - healthcare 1.1
  - education 1.1
  - agriculture 1.05
  - fintech 1.05
  - cleantech 1.05
  - default 1.0

Readiness score rules:

- Starts at 60.
- Adds 5 for each truthy `operationalReadiness` value.
- Adds 3 for each truthy `capitalReadiness` value.
- Caps at 100.

Deal probability rules:

- Base by raw stage:
  - `INTAKE`: 20
  - `SCREENING`: 35
  - `DUE_DILIGENCE`: 65
  - `INVESTMENT_READY`: 85
  - `FUNDED`: 100
  - `SEED`: 80
  - `SERIES_A`: 85
  - `SERIES_B`: 90
  - `SERIES_C`: 95
  - Unknown: 30
- GEDSI score above 80 adds 10.
- Impact score above 85 adds 5.
- Caps at 100.

Expected close date rules:

- `INTAKE`: random 120-300 days from now.
- `SCREENING`: random 90-210 days from now.
- `DUE_DILIGENCE`: random 30-120 days from now.
- `INVESTMENT_READY`: random 15-75 days from now.
- Other stages: random 30-120 days from now.

Portfolio summary rules:

- `totalDeals`: `deals.length`.
- `activeDeals`: deals with `status === "active"`.
- `totalValue`: parses numeric value from `deal.dealSize` and sums it as millions.
- Average pipeline value is rendered as `totalValue / totalDeals`, which can become `NaN` when `totalDeals` is 0.
- Average GEDSI and impact scores clamp each individual score into `0..100` before averaging.
- Jobs and communities totals coerce invalid values to 0 and prevent negative contribution.
- Women-led count checks `founderType.includes("women-led")`.
- Disability-inclusive count checks `metrics.disabilityInclusive === true`.

Pipeline flow rules:

- Stage counts use all `deals`, not `filteredDeals`.
- Conversion rate is calculated as `nextStageDeals.length / stageDeals.length * 100`.
- Bottleneck visual threshold: conversion below 30%.
- High conversion threshold: conversion above 70%.
- Bottleneck list only records transitions where current and next stages both have deals, conversion is below 30%, and current stage has more than 2 deals.
- Recent movement count is simulated as `min(previousStageCount, currentStageCount, 3)`.

## State Management

State variables:

- `searchTerm`: pipeline table search text.
- `selectedStage`: selected stage filter.
- `selectedSector`: selected sector filter.
- `selectedStatus`: selected status filter.
- `selectedFounderType`: selected founder type filter.
- `activeView`: active tab; initial value is `overview`.
- `selectedDeal`: current deal used by view/edit dialogs.
- `isViewDialogOpen`: view dialog open state.
- `isEditDialogOpen`: edit dialog open state.
- `isAddDealDialogOpen`: add dialog open state.
- `isExporting`: export progress flag.
- `deals`: transformed deal records.
- `loading`: data loading flag.
- `error`: failed-load message.
- `selectedStageForFilter`: tracks the clickable pipeline-stage filter.
- `hoveredStage`: hover state for pipeline stage cards and arrows.
- `stageDealsDialog`: stage dialog state and its copied stage deals.

Effects:

- One `useEffect` with an empty dependency array calls `fetchDeals()` on mount.

Mutation flows:

- Fetch mutation: updates `loading`, `error`, and `deals`.
- Retry: error alert calls `fetchDeals`.
- View deal: sets `selectedDeal` and opens the view dialog.
- Edit deal: sets `selectedDeal` and opens the edit dialog.
- Add new deal: opens add dialog only.
- Stage click: opens the stage deals dialog with the stage and stage deal snapshot.
- Stage filter: toggles `selectedStageForFilter` and updates `selectedStage`.
- Export: sets `isExporting`, waits 2 seconds, downloads CSV, resets `isExporting`.

There are no backend mutations from this page today. Add and edit forms are explicitly demo/read-only.

## Filters and Search

Filters are applied only to `filteredDeals`, which is used by the deals table and CSV export. The board, overview, impact, and AI tabs use all `deals`.

Search matches:

- `deal.company`
- `deal.id`
- `deal.inclusionFocus`

Filters:

- Stage: `all` or exact display stage.
- Sector: `all` or exact sector string.
- Founder type: `all` or `deal.founderType.includes(selectedFounderType)`.
- Status: `all`, `active`, `paused`, `closed`, or `lost`.

Sorting:

- No explicit client-side sorting exists.
- Display order follows API order, currently `createdAt desc` from the route handler.

Pagination:

- No client-side pagination exists.
- The page requests up to 100 ventures.
- API pagination metadata is ignored.

## Desktop Behaviour

The desktop page uses:

- A header with export and add buttons.
- Four tabs: Overview, Pipeline, Impact, AI Insights.
- Overview summary cards and impact metric cards.
- Pipeline filters in a five-column responsive grid.
- A horizontal, six-stage pipeline flow diagram with hover effects, clickable stage cards, arrows, conversion rates, bottleneck/high-conversion coloring, and simulated recent movement badges.
- A wide deals table with columns for venture, stage, scores, deal size, founder type, team, risk, status, and actions.
- Impact and AI insight tabs with card-based lists.
- Dialogs constrained with max widths and vertical scroll.

## Mobile Problems in the Current Page

The current page has no separate mobile presentation. Mobile is attempted through generic responsive classes around a desktop-first experience.

Known mobile risks:

- The API caps mobile requests to 5 ventures, so mobile may not show the same deal flow as desktop.
- The pipeline flow is a fixed horizontal six-stage layout with arrows and hover interactions; this is not a touch-first interaction model.
- Stage quick filter appears only on hover, which is not reliable on touch screens.
- The table is still a wide table; the shared table wrapper allows horizontal scrolling, but this does not create a mobile-native review workflow.
- Dialogs use large max widths and dense card grids, which can become cramped.
- Several controls and action buttons are icon-only without visible text or clear accessible labels.
- Filter controls use a five-column desktop grid at large sizes and collapse generically, without a mobile-specific filter sheet.

The refactor should introduce separate mobile components and interactions while sharing data, types, calculations, filters, and actions.

## Dialogs and Actions

Actions available:

- Retry failed load.
- Export pipeline.
- Add new deal.
- Change active tab.
- Search deals.
- Filter by stage, sector, founder type, and status.
- Click a pipeline stage to open the stage deals dialog.
- Use hover quick action to filter by a stage.
- View deal details from table or stage dialog.
- Edit deal from table or stage dialog.
- Click the table more button, although it currently has no behavior.
- Close dialogs.

Dialogs:

- View Deal Dialog:
  - Uses `selectedDeal`.
  - Shows basic information, impact scores, risk, inclusion focus, founder types, impact metrics, sustainability goals, AI recommendations, strengths, improvement areas, and team members.
- Edit Deal Dialog:
  - Uses `selectedDeal`.
  - Read-only demo state.
  - Shows disabled company, stage, sector, deal size, GEDSI, impact, and inclusion focus fields.
  - `Save Changes (Demo)` is disabled.
- Add New Deal Dialog:
  - Demo-only form.
  - Contains basic information, GEDSI/impact information, founder checkboxes, expected impact metrics, and team fields.
  - `Create Deal (Demo)` is disabled.
- Stage Deals Dialog:
  - Uses `stageDealsDialog`.
  - Shows stage-level total deals, total value, average GEDSI, and women-led count.
  - Lists deals in the selected stage.
  - Provides view, edit, filter by this stage, add deal to stage, and close actions.

## Loading, Empty, Error, and Success States

Loading:

- Shows a card with spinner and text `Loading deal flow from database...`.
- Main content is hidden while loading.

Error:

- Shows an alert with `Error: Failed to load deals: ...`.
- Retry button calls `fetchDeals`.
- Main content is hidden while `error` is set.

Empty:

- Pipeline flow card shows an empty message when `totalDeals === 0`.
- The deals table does not render a specific empty row if filters produce zero rows.
- Overview can render divide-by-zero output for average pipeline value when there are zero deals.
- Impact and AI tabs render empty lists if there are no deals; some percentages guard against zero and some do not.

Success:

- Main tabbed content renders after `loading` is false and `error` is null.
- Export has a visible `Exporting...` state and disables the export button.
- Export failures are only logged to the console; no user-visible error is shown.

## Accessibility Risks

- Icon-only table action buttons lack `aria-label`.
- Pipeline stage cards are clickable `div` elements, not buttons, and do not provide keyboard activation.
- Hover-only quick filter is not available to keyboard and touch users.
- Several labels are plain `<label>` elements without `htmlFor`, except the add-dialog founder checkboxes.
- Add-dialog native checkboxes do not share the design system and may have inconsistent focus styling.
- The table has no caption and may be difficult to navigate on small screens.
- The pipeline visualization uses color to communicate bottleneck/high-conversion status; text exists in places but the visual cards rely heavily on color.
- Loading spinner has no explicit live region.
- Export creates a download without an announced success/failure state.

## Refactor Goals

- Keep route and API contracts stable.
- Keep all business rules exactly the same until product/backend clarification.
- Separate data orchestration from presentation.
- Move pure and time/random-dependent calculations into testable utilities.
- Introduce typed venture input shapes instead of untyped raw values.
- Centralize constants for stages, sectors, statuses, founder types, and export columns.
- Share one data hook and shared logic between desktop and mobile.
- Build mobile as a distinct presentation model, not as a responsive version of the desktop table/board.
- Reduce duplicated rendering for score badges, risk badges, team avatars, and deal cards.
- Add focused tests for mappers, calculations, filters, export generation, and key UI states.

## Proposed Folder Structure

```text
deal-flow/
|-- page.tsx
|-- README.md
|-- components/
|   |-- deal-flow-header.tsx
|   |-- deal-flow-summary.tsx
|   |-- deal-flow-filters.tsx
|   |-- desktop/
|   |   |-- deal-flow-desktop.tsx
|   |   |-- pipeline-board.tsx
|   |   |-- pipeline-stage-card.tsx
|   |   |-- pipeline-performance.tsx
|   |   `-- deal-table.tsx
|   |-- mobile/
|   |   |-- deal-flow-mobile.tsx
|   |   |-- mobile-deal-list.tsx
|   |   |-- mobile-deal-card.tsx
|   |   `-- mobile-filter-sheet.tsx
|   |-- dialogs/
|   |   |-- deal-detail-dialog.tsx
|   |   |-- deal-editor-dialog.tsx
|   |   |-- add-deal-dialog.tsx
|   |   `-- stage-deals-dialog.tsx
|   `-- shared/
|       |-- deal-score-stack.tsx
|       |-- risk-badge.tsx
|       |-- status-badge.tsx
|       `-- team-avatar-stack.tsx
|-- hooks/
|   `-- use-deal-flow.ts
|-- lib/
|   |-- deal-flow-calculations.ts
|   |-- deal-flow-filters.ts
|   |-- deal-flow-mappers.ts
|   `-- deal-flow-export.ts
|-- types/
|   `-- deal-flow.types.ts
`-- constants/
    `-- deal-flow.constants.ts
```

## Responsibility of Each Proposed File

- `page.tsx`: route entry point; renders the feature shell and chooses desktop/mobile presentation.
- `README.md`: behavioral contract and refactor notes.
- `components/deal-flow-header.tsx`: title, subtitle, export action, add action, export loading state.
- `components/deal-flow-summary.tsx`: overview metric cards shared by desktop/mobile where appropriate.
- `components/deal-flow-filters.tsx`: shared controlled filter fields for non-mobile layouts.
- `components/desktop/deal-flow-desktop.tsx`: desktop tab layout and desktop-only composition.
- `components/desktop/pipeline-board.tsx`: desktop pipeline flow visualization.
- `components/desktop/pipeline-stage-card.tsx`: clickable stage card, conversion indicators, hover visuals.
- `components/desktop/pipeline-performance.tsx`: bottleneck and high-performer lists.
- `components/desktop/deal-table.tsx`: desktop deals table and row actions.
- `components/mobile/deal-flow-mobile.tsx`: mobile navigation, summary, filters, and list composition.
- `components/mobile/mobile-deal-list.tsx`: mobile list grouped or filtered for touch workflows.
- `components/mobile/mobile-deal-card.tsx`: compact mobile card replacing the wide table row.
- `components/mobile/mobile-filter-sheet.tsx`: touch-first filter/search sheet.
- `components/dialogs/deal-detail-dialog.tsx`: full selected deal details.
- `components/dialogs/deal-editor-dialog.tsx`: current read-only demo edit form until mutation behavior is implemented.
- `components/dialogs/add-deal-dialog.tsx`: current demo add form until create behavior is implemented.
- `components/dialogs/stage-deals-dialog.tsx`: stage summary, stage deal list, and stage-scoped actions.
- `components/shared/deal-score-stack.tsx`: GEDSI, impact, and readiness score display.
- `components/shared/risk-badge.tsx`: AI risk badge variant/class mapping.
- `components/shared/status-badge.tsx`: status icon and badge mapping.
- `components/shared/team-avatar-stack.tsx`: team initials and overflow count.
- `hooks/use-deal-flow.ts`: fetch lifecycle, transformed deals, filters, selected deal, dialog flags, and action handlers.
- `lib/deal-flow-calculations.ts`: impact score, readiness score, probability, expected close, portfolio metrics, pipeline metrics, and AI insight generation.
- `lib/deal-flow-filters.ts`: filter predicate and search matching.
- `lib/deal-flow-mappers.ts`: venture-to-deal adapter, stage/status mapping, parsing helpers, team and activity mapping.
- `lib/deal-flow-export.ts`: CSV column definition, escaping, filename, and browser download helper.
- `types/deal-flow.types.ts`: `Deal`, `DealStatus`, `DealStage`, `DealRiskLevel`, `DealMetrics`, `DealInsights`, `DealFlowFilters`, and a typed raw venture DTO with explicit optional fields and JSON-like aliases.
- `constants/deal-flow.constants.ts`: stage, sector, founder type, status, multiplier, probability, and export constants.

## Shared Logic Between Desktop and Mobile

Desktop and mobile should share:

- Fetching and transformation from `use-deal-flow`.
- `Deal` and raw venture DTO types.
- Stage, sector, founder type, and status constants.
- All score and portfolio calculations.
- All mapping functions.
- Filter and search predicates.
- Export CSV generation.
- Dialog actions and selected-deal state.
- Risk/status badge helpers where presentation is compatible.

## Separate Desktop and Mobile Presentation Strategy

Desktop should keep the current tabbed dashboard model with a horizontal pipeline visualization and table.

Mobile should use a separate touch-first model:

- Summary strip or compact cards for key metrics.
- Stage list or accordion instead of a horizontal pipeline board.
- Deal cards instead of a table.
- Filter sheet/drawer instead of a dense filter grid.
- Persistent visible stage filter actions instead of hover-only controls.
- Action buttons with labels or accessible names.
- Dialog content simplified into stacked sections with safe viewport heights.

Mobile should not be implemented only by adding Tailwind responsive classes to the existing desktop board/table.

## Behaviour That Must Not Change

- Public route remains `/dashboard/deal-flow`.
- Page remains a client component unless data strategy is intentionally changed later.
- Initial API call remains `GET /api/ventures?limit=100`.
- Existing stage, status, sector, and founder type display values stay the same.
- Client-side filters use exact current matching behavior.
- Search stays limited to company, deal id, and inclusion focus unless product changes it.
- Board, table, impact, and insight views continue using the same deal calculations.
- Export continues to export currently filtered table deals, not all deals.
- Export columns remain `Company,Stage,Sector,Deal Size,GEDSI Score,Impact Score,Location,Inclusion Focus`.
- Add and edit dialogs remain demo/read-only until backend mutation behavior is intentionally added.
- The table more button remains behaviorless unless separately scoped.
- Random fallback behavior should be preserved during mechanical extraction, then removed only after business approval.

## Known Risks and Uncertainties

- `mockDeals` is unused and may be stale, but it should not be removed during analysis.
- Many raw venture values were previously untyped, and JSON fields are handled inconsistently as strings, objects, or arrays.
- `parseFounderTypes` assumes a string, but API/schema comments and create validation indicate founder types may be arrays before persistence and JSON strings after persistence.
- `parseSustainabilityGoals` reads `stgGoals`, but `calculateImpactScore` reads `gedsiGoals || sustainabilityGoals`; this inconsistency should be preserved until clarified.
- `venture.gedsiMetricsSummary` is a Prisma JSON field but may arrive as an object; other helpers in `gedsi-utils` tolerate string or object for similar fields.
- `calculateImpactScore` evidence uses `venture.metrics`, but the mapper later creates `deal.metrics` from top-level venture fields. Raw API ventures may not have `venture.metrics`.
- GEDSI score fallback returns random 60-99 when there are no metrics, even though the shared `calculateGEDSIScore` final fallback returns 0.
- Deal size fallback is random when `fundingRaised` is missing.
- Expected close is random every fetch.
- API mobile limiting may make mobile behavior materially different from desktop.
- `avg pipeline value` can render `NaN` with zero deals.
- GEDSI distribution percentages in the impact tab can divide by zero in some rows.
- Some console log strings appear mojibake/encoding-corrupted.
- Backend authentication is commented out in the inspected ventures route.
- No backend route is called for export, add, edit, stage changes, or status changes.

## Suggested Implementation Order

1. Add typed constants and deal-flow types without changing behavior.
2. Extract pure mappers and calculations, including existing random fallbacks.
3. Add unit tests around current calculations, mappings, filtering, and CSV generation.
4. Extract `use-deal-flow` with the same fetch URL and state transitions.
5. Extract shared badge/avatar/score display components.
6. Extract dialogs one at a time.
7. Extract desktop header, summary, filters, pipeline board, performance list, and table.
8. Add mobile-specific components backed by the shared hook.
9. Run desktop/mobile visual checks and fix layout regressions.
10. Only after parity is proven, clarify and replace random/demo behavior in a separate change.

## Testing Checklist

- Loading ventures shows the loading state and then renders content.
- Failed API request shows the error alert and retry re-runs the fetch.
- Empty ventures show the pipeline empty state and do not render `NaN` or invalid percentages after refactor.
- Board view renders stage counts for the same stages as today.
- Board stage click opens the stage deals dialog with the correct deals.
- Board stage filter toggles selected stage and table results.
- Table view renders all current columns and row actions.
- Stage filter works for every stage value.
- Sector filter works for every sector value.
- Founder type filter works for every founder type value.
- Status filter works for `active`, `paused`, `closed`, and `lost`.
- Combined filters intersect results.
- Search matches company, id, and inclusion focus.
- Sorting remains unchanged unless a future story adds it.
- Pagination remains absent unless a future story adds it.
- Stage changes remain demo-only/no backend mutation unless a future story adds mutation.
- View dialog opens from table and stage dialog.
- Edit dialog opens from table and stage dialog and remains read-only/demo.
- Add dialog opens from header and stage dialog and remains demo-only.
- Export uses currently filtered deals.
- Export filename uses `miv-pipeline-export-YYYY-MM-DD.csv`.
- Export columns and order match the current CSV structure.
- Desktop viewport preserves current tab, board, table, and dialog behavior.
- Tablet viewport has no broken grids or clipped controls.
- Mobile viewport has no horizontal overflow.
- Mobile viewport uses separate mobile presentation components.
- Keyboard navigation can reach and activate filters, tabs, dialogs, and deal actions.
- Pipeline/stage actions have keyboard equivalents.
- Icon-only buttons have screen-reader labels.
- Dialogs have accessible titles/descriptions and focus management remains intact.
- Loading and export progress states are announced or otherwise accessible.

## Implemented Structure

The refactor was implemented in the existing Next.js route-group folder so the public URL remains `/dashboard/deal-flow`:

```text
deal-flow/
|-- page.tsx
|-- README.md
|-- components/
|   |-- deal-flow-content.tsx
|   |-- deal-flow-filters.tsx
|   |-- deal-flow-header.tsx
|   |-- deal-flow-summary.tsx
|   |-- desktop/
|   |   |-- deal-flow-desktop.tsx
|   |   |-- deal-table.tsx
|   |   `-- pipeline-board.tsx
|   |-- dialogs/
|   |   |-- add-deal-dialog.tsx
|   |   |-- deal-detail-dialog.tsx
|   |   |-- deal-editor-dialog.tsx
|   |   `-- stage-deals-dialog.tsx
|   |-- mobile/
|   |   |-- deal-flow-mobile.tsx
|   |   |-- mobile-deal-card.tsx
|   |   |-- mobile-deal-list.tsx
|   |   `-- mobile-filter-sheet.tsx
|   `-- shared/
|       |-- deal-score-stack.tsx
|       |-- risk-badge.tsx
|       |-- status-badge.tsx
|       `-- team-avatar-stack.tsx
|-- constants/
|   `-- deal-flow.constants.ts
|-- hooks/
|   `-- use-deal-flow.ts
|-- lib/
|   |-- deal-flow-calculations.ts
|   |-- deal-flow-export.ts
|   |-- deal-flow-filters.ts
|   `-- deal-flow-mappers.ts
`-- types/
    `-- deal-flow.types.ts
```

## Component Responsibilities

- `page.tsx`: thin client route composition; initializes `useDealFlow`, renders the header and feature content.
- `deal-flow-content.tsx`: loading/error states, desktop/mobile presentation switch, and shared dialog mounting.
- `deal-flow-header.tsx`: title, subtitle, export button, and add button.
- `deal-flow-summary.tsx`: summary and impact metric cards reused by desktop and mobile.
- `deal-flow-filters.tsx`: shared controlled filter form.
- `desktop/deal-flow-desktop.tsx`: desktop tabs for overview, pipeline, impact, and AI insights.
- `desktop/pipeline-board.tsx`: desktop pipeline flow visualization and stage performance analysis.
- `desktop/deal-table.tsx`: desktop table and row actions.
- `mobile/deal-flow-mobile.tsx`: mobile-first summary, search, stage chips, filter sheet, and deal list composition.
- `mobile/mobile-deal-list.tsx`: mobile empty state and card list.
- `mobile/mobile-deal-card.tsx`: compact mobile deal presentation with one primary action and secondary menu actions.
- `mobile/mobile-filter-sheet.tsx`: touch-first filter panel.
- `dialogs/*`: isolated view, edit, add, and stage deal dialogs.
- `shared/*`: reusable risk/status badges, score stack, and team avatar stack.

## Desktop Layout

Desktop keeps the current tabbed dashboard model:

- Overview tab with summary and impact cards.
- Pipeline tab with the filter toolbar, six-stage pipeline board, performance analysis, and table.
- Impact tab with impact overview, GEDSI distribution, and venture impact details.
- AI Insights tab with risk counts and per-deal recommendations.

The desktop table and board remain desktop-only and are hidden on small screens.

## Mobile Layout

Mobile has a separate presentation instead of rendering the desktop table or full pipeline board:

- Compact summary cards.
- Search field and filter button.
- Filter sheet for stage, sector, founder type, status, and search.
- Touch-friendly stage chips.
- Vertical deal card list.
- One clear primary card action, with secondary actions in a dropdown menu.
- No horizontal table or board is required for the primary mobile workflow.

## Shared State and Logic

Desktop and mobile share:

- `useDealFlow` for loading, error, selected deal, dialogs, filters, active view, export state, and actions.
- `Deal`, raw venture DTO, filter, summary, stage group, and hook state types.
- `/api/ventures?limit=100` fetch contract.
- Venture-to-deal mapping.
- GEDSI, impact, readiness, probability, expected close, risk, summary, stage grouping, and pipeline performance calculations.
- Search, filtering, and sort placeholder behavior.
- CSV export preparation and browser download logic.

## Preserved Behaviour

- Public route remains `/dashboard/deal-flow`.
- API endpoint remains `GET /api/ventures?limit=100`.
- Backend code was not modified.
- Deal stages, sector values, founder type values, status values, and mappings are preserved.
- Current score formulas, stage conversion formulas, summary calculations, and nondeterministic placeholder fallbacks are preserved.
- Search still matches company, deal id, and inclusion focus.
- Export still uses currently filtered deals and the same CSV columns.
- Add/edit remain demo/read-only; no backend mutations were introduced.
- Stage dialog actions still open view/edit, filter the stage, or open add-deal demo flow.

## Validation Results

- `npm run typecheck`: blocked by PowerShell execution policy for `npm.ps1`.
- `npm.cmd run typecheck`: failed due to repository-wide TypeScript errors outside this feature. After fixing the one local deal-flow error it surfaced, rerunning with `Select-String -Pattern 'deal-flow'` returned no deal-flow-specific errors.
- `npm.cmd run lint`: passed with 14 warnings, all in files outside `deal-flow`.
- `npm.cmd run build`: first failed because restricted network access prevented Next.js from fetching Google Fonts.
- `npm.cmd run build` with approved network access: compiled successfully, then failed during TypeScript on `app/api/(g1-impact-analytics)/improve-gedsi-scores/route.ts:15`, where `string[]` is not assignable to the Prisma `VentureStage[]` filter type.

## Known Remaining Issues

- Full repo typecheck/build is blocked by existing unrelated TypeScript errors.
- The API route still caps mobile user-agent requests to 5 ventures; this refactor did not change backend behavior.
- Random fallback behavior for GEDSI score, deal size, and expected close is preserved and remains a product risk.
- The desktop board still uses hover as an enhancement, though stage cards are now buttons.
- Add/edit forms remain demo-only.
- Some current business rules use inconsistent raw fields, especially `stgGoals`, `gedsiGoals`, `sustainabilityGoals`, and `venture.metrics`; these were preserved rather than corrected.

## Future Improvements

- Resolve repo-wide TypeScript errors so full typecheck/build can become a reliable gate.
- Clarify and replace random score/date/deal-size fallbacks.
- Decide whether mobile should receive the same venture count as desktop by changing backend mobile limit behavior.
- Add unit tests for calculations, mappers, filters, and CSV export.
- Add interaction tests for desktop table actions, stage dialog actions, and mobile filter sheet behavior.
- Convert demo add/edit flows into real mutations only after API contracts are defined.
