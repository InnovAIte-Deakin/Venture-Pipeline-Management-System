# Task 20 – Portfolio Technical Documentation

## Overview

Task 20 implements and refactors the Portfolio dashboard within the Venture Pipeline Management System. The feature provides responsive desktop and mobile views for monitoring portfolio ventures, calculated performance indicators, filtering, company details, recommended actions, and CSV export.

The implementation is located at:

```text
miv/app/dashboard/(pipeline-management)/portfolio/
```

The route remains available to users at:

```text
/dashboard/portfolio
```

## Repository and Branch Integration

The implementation was synchronized with the latest `integration/frontend` branch. During this synchronization, the Portfolio feature was migrated from the previous route group:

```text
(g1-portfolio-funding)/portfolio
```

to the current route group:

```text
(pipeline-management)/portfolio
```

Only Portfolio-related source files and the focused Portfolio test were included. Unrelated Capital Facilitation files, generated instruction files, and package changes were excluded.

## Architecture

The Portfolio feature is divided into presentation, orchestration, API, domain logic, export, constants, and type layers.

### Route Entry Point

`page.tsx` is a thin composition layer. It:

- Invokes the Portfolio controller hook.
- Detects whether the interface is using a mobile viewport.
- Selects the desktop or mobile presentation components.
- Passes Portfolio data, state, and event handlers to `PortfolioDashboard`.

Business rules, API requests, calculations, filtering, and export generation are kept outside the route entry point.

### Portfolio Dashboard

`components/PortfolioDashboard.tsx` renders the shared Portfolio experience. It handles:

- Page heading and primary controls.
- Loading and error states.
- Portfolio summary cards.
- Search and filter controls.
- Empty states.
- Venture lists.
- Company details.
- Action dialogs.
- Desktop and mobile component composition.

The dashboard receives its data and behavior through typed props.

### Responsive Components

Dedicated presentation components are retained for desktop and mobile layouts.

Desktop components:

```text
components/desktop/ActionDialog.tsx
components/desktop/CompanyDetailModal.tsx
components/desktop/PortfolioFilters.tsx
components/desktop/VentureCard.tsx
```

Mobile components:

```text
components/mobile/ActionDialog.tsx
components/mobile/CompanyDetailModal.tsx
components/mobile/PortfolioFilters.tsx
components/mobile/VentureCard.tsx
components/mobile/statusStyles.ts
```

`hooks/useIsMobile.ts` determines which responsive component set is used.

## State and Orchestration

`hooks/usePortfolioData.ts` coordinates the interactive state of the feature.

It manages:

- Portfolio loading and error states.
- Search text.
- Portfolio-stage selection.
- Founder-type selection.
- The selected company.
- Company-detail dialog state.
- Action-dialog state.
- Export progress.
- Retry behavior.

The hook uses `useCallback` for reusable handlers and `useMemo` for filtered companies and dashboard summaries.

### Request Lifecycle

Portfolio requests use `AbortController`. When the component unmounts or the active stage selection causes a replacement request, the previous request can be cancelled. This prevents stale requests from updating the current UI state.

When a new request begins, the previous error is cleared. Valid results replace the current Portfolio collection, while genuine request failures produce a user-visible error state.

### Dialog Keyboard Handling

Escape-key behavior is registered only while a dialog is open. Pressing Escape:

1. Closes the action dialog when it is active.
2. Otherwise closes the selected company details.

The keyboard listener is removed during React effect cleanup.

## API Handling

`lib/portfolioApi.ts` contains the Portfolio API client.

The client:

- Requests ventures from `/api/ventures?limit=100`.
- Accepts an optional `AbortSignal`.
- Checks the HTTP response status.
- Verifies that the response contains a ventures array.
- Accepts venture entries only when they contain a string `id` and `name`.
- Returns typed venture records to the orchestration layer.

Network and response-format failures are converted into errors that can be displayed by the Portfolio dashboard.

## Types

`types.ts` defines the feature contracts used by the API, domain, hook, and presentation layers.

The principal types are:

- `VentureRecord` – the API-facing venture representation.
- `PortfolioCompany` – the normalized representation used by the UI.
- `GedsiMetric` – GEDSI metric values and metadata.
- `CapitalActivity` – capital activity data used by Portfolio.
- `VentureCounts` – related document, activity, and capital-activity counts.
- `PortfolioInsights` – risk, priority, alerts, and next-action information.
- `PortfolioSummary` – calculated dashboard totals.
- `VenturesResponse` – the expected ventures API response.
- `PortfolioStageFilter` – supported Portfolio stage-filter values.

Calculated Portfolio fields are required after mapping, giving presentation components a stable data contract.

## Data Mapping and Filtering

`lib/portfolioData.ts` contains pure data-processing functions.

### Stage Selection

`isPortfolioVenture` determines whether a venture is displayed. The `all` option includes every returned venture. The Portfolio option includes stages defined in `constants.ts`, including funded, exited, seed, series, investment-ready, and due-diligence ventures.

### API-to-UI Mapping

`mapVentureToPortfolioCompany` converts `VentureRecord` into `PortfolioCompany`.

The mapper:

- Normalizes optional values.
- Supplies safe display defaults.
- Normalizes founder types and GEDSI goals.
- Normalizes related-record counts.
- Calculates GEDSI, impact, and readiness scores.
- Generates Portfolio insights.

### Search and Founder Filtering

`filterCompanies` applies case-insensitive search across:

- Company name.
- Inclusion focus.
- Location.

It can also filter companies by founder type.

### Portfolio Summary

`summarisePortfolio` calculates:

- Total companies.
- Average GEDSI score.
- Total GEDSI metrics.
- Total activities.

## Portfolio Calculations

`lib/portfolioCalculations.ts` contains pure scoring and insight functions.

### Safe Value Parsing

Numeric values are converted through a safe helper that returns zero for missing or invalid input. JSON string arrays are parsed through `stringList`, which returns an empty array for malformed or unsupported values.

### GEDSI Score

The GEDSI score uses the first available valid source:

1. A score from the venture's AI analysis.
2. Values from the GEDSI metrics summary.
3. Completion percentages from individual GEDSI metrics.
4. Zero when no valid score source exists.

The resulting score is bounded to the supported range.

### Impact Score

The impact calculation considers:

- Revenue.
- Funding raised.
- Team size.
- Number of GEDSI goals.
- Founder diversity categories.
- Verified or completed GEDSI metrics.
- Venture-stage multiplier.

The final score is rounded and capped at 100.

### Readiness Score

The readiness calculation considers:

- Operational readiness checks.
- Capital readiness checks.
- Recorded revenue.
- Team size.
- Website availability.
- Pitch-summary completeness.
- Document count.

The final readiness score is rounded and capped at 100.

### Portfolio Insights

`generateAIInsights` uses valid AI analysis when available and applies deterministic fallback rules otherwise.

It produces:

- Risk level.
- Priority.
- Recommended next action.
- Days until action.
- Up to three important alerts.

Malformed AI analysis does not interrupt Portfolio rendering.

## CSV Export

`lib/portfolioExport.ts` separates CSV serialization from React state.

The export includes:

- Company name.
- Sector.
- Stage.
- Location.
- GEDSI score.
- Impact score.
- Status.
- Creation date.
- GEDSI metric count.
- Activity count.

CSV fields are quoted, and embedded quotation marks are escaped. The browser download uses a UTF-8 CSV `Blob`, a temporary object URL, and a date-based filename. The temporary link and object URL are removed after the download starts.

## Portfolio Actions

The action dialogs display available operational actions for the selected company. Because these actions do not currently have a dedicated backend submission contract, selecting an action provides an informational toast explaining that a connected workflow is required.

The implementation does not simulate persistence or report an action as completed when no backend operation occurred.

## Error Handling and User Notifications

The feature provides visible feedback for:

- Portfolio loading.
- API failure.
- Invalid API response format.
- Retry operations.
- Successful CSV export.
- Failed CSV export.
- Actions that require workflow integration.
- Empty Portfolio and filtered-result states.

Application toasts are used instead of browser alerts.

## Tests

Focused tests are stored at:

```text
miv/tests/portfolio.test.ts
```

The tests cover:

- Parsing valid string arrays.
- Handling malformed JSON safely.
- GEDSI score calculation.
- Impact score calculation.
- Portfolio-stage filtering.
- API-to-UI mapping defaults.
- Search and founder-type filtering.
- Portfolio summary calculation.
- CSV formatting and escaping.

Run the focused test with:

```bash
cd miv
npx tsx --test tests/portfolio.test.ts
```

## Validation Commands

Run feature-specific linting:

```bash
cd miv
npx eslint 'app/dashboard/(pipeline-management)/portfolio/**/*.{ts,tsx}' \
  'tests/portfolio.test.ts'
```

Run the full TypeScript check:

```bash
npm run typecheck
```

Run the production build:

```bash
npm run build
```

Check patch formatting and conflict markers from the repository root:

```bash
git diff --check
rg -n '^(<<<<<<<|=======|>>>>>>>)' \
  'miv/app/dashboard/(pipeline-management)/portfolio' \
  'miv/tests/portfolio.test.ts'
```

## Validation Results

The completed Task 20 implementation produced the following results:

- Five out of five focused Portfolio tests passed.
- Feature-specific ESLint passed.
- Full TypeScript checking passed.
- The production Next.js build passed.
- `/dashboard/portfolio` was generated successfully.
- No merge-conflict markers were present.
- No patch whitespace errors were present.
- No Portfolio `any` annotations, console statements, simulated delays, or browser alerts remained.

## Files Updated

```text
miv/app/dashboard/(pipeline-management)/portfolio/README.md
miv/app/dashboard/(pipeline-management)/portfolio/components/PortfolioDashboard.tsx
miv/app/dashboard/(pipeline-management)/portfolio/components/desktop/CompanyDetailModal.tsx
miv/app/dashboard/(pipeline-management)/portfolio/components/mobile/CompanyDetailModal.tsx
miv/app/dashboard/(pipeline-management)/portfolio/constants.ts
miv/app/dashboard/(pipeline-management)/portfolio/hooks/usePortfolioData.ts
miv/app/dashboard/(pipeline-management)/portfolio/lib/portfolioApi.ts
miv/app/dashboard/(pipeline-management)/portfolio/lib/portfolioCalculations.ts
miv/app/dashboard/(pipeline-management)/portfolio/lib/portfolioData.ts
miv/app/dashboard/(pipeline-management)/portfolio/lib/portfolioExport.ts
miv/app/dashboard/(pipeline-management)/portfolio/page.tsx
miv/app/dashboard/(pipeline-management)/portfolio/types.ts
miv/tests/portfolio.test.ts
```

## Resulting Structure

The completed implementation keeps UI composition, API communication, state orchestration, domain calculations, data transformation, export behavior, and types separate. This allows each part of the Portfolio feature to be tested and maintained independently while preserving a single `/dashboard/portfolio` user route.
