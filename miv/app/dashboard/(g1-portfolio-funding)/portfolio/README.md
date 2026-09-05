# Portfolio (Task 20)

The Portfolio route displays funded and investment-stage ventures in responsive desktop and mobile views. It fetches ventures from `/api/ventures`, maps the API records into a stable UI model, calculates GEDSI/impact/readiness indicators, supports search and founder-type filtering, and exports the visible result set to CSV.

## Structure

- `page.tsx`: thin responsive composition entry point.
- `hooks/usePortfolioData.ts`: UI state and service orchestration.
- `lib/portfolioApi.ts`: API request and response-shape validation.
- `lib/portfolioCalculations.ts`: pure scoring and insight calculations.
- `lib/portfolioData.ts`: stage filtering, mapping, search and summaries.
- `lib/portfolioExport.ts`: CSV creation and browser download.
- `components/`: shared dashboard plus desktop/mobile presentations.
- `types.ts` and `constants.ts`: feature contracts and fixed options.
- `tests/portfolio.test.ts`: focused pure-logic tests, placed where the repository test script discovers it.

## Error and action behaviour

Requests can be cancelled during navigation/filter changes, stale errors are cleared on retry, and invalid response shapes produce a user-visible error. Portfolio actions currently have no backend endpoint; the interface therefore reports that workflow integration is required instead of falsely claiming that an action was completed.

## Validation

Run `npx tsx --test tests/portfolio.test.ts`, targeted ESLint on the Portfolio route and test, then `npm run typecheck`. The repository currently has unrelated pre-existing type errors, so Task 20 validation should also check that TypeScript reports no path containing the Portfolio feature.
