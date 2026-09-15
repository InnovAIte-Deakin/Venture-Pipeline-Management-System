# IRIS Metrics – Feature Handover Documentation

## 1. Feature Overview

The IRIS Metrics feature provides a searchable catalogue of IRIS+ impact metrics within the VPMS dashboard.

The page allows users to browse and inspect impact metrics and currently supports:

- Searching by metric code, name, or description.
- Quick filters for common GEDSI-related categories.
- Selecting the number of results displayed.
- Page-based pagination.
- Previous and Next page navigation.
- Desktop table presentation.
- Mobile card presentation for smaller screens.
- Loading, error, retry, and empty-result handling.

The feature is currently implemented within the Impact & GEDSI area of the VPMS frontend.

---

## 2. What Data the Page Needs

The IRIS Metrics page requires the following information for each metric:

- **Code** – unique IRIS metric identifier.
- **Name** – metric name.
- **Description** – explanation of the metric.
- **Unit** – unit associated with the metric, where available.
- **GEDSI suggestion** – suggested GEDSI category derived for the metric.

The page also requires information used for searching and pagination:

- Search query.
- Result limit.
- Current page.
- Total number of matching records.
- Total number of pages.

The API currently returns pagination information including:

- `results`
- `total`
- `page`
- `limit`
- `totalPages`

---

## 3. Current Data Source

The frontend retrieves IRIS Metrics data through the existing VPMS API endpoint:

`/api/iris/metrics`

The frontend sends parameters such as:

- `q` – search query.
- `limit` – number of records requested.
- `page` – current page number.

The API route is physically located at:

`miv/app/api/(impact-gedsi)/iris/metrics/route.ts`

The public route remains:

`/api/iris/metrics`

The main frontend files are located under:

`miv/app/dashboard/(impact-gedsi)/iris-metrics/`

Relevant frontend files include:

- `page.tsx`
- `hooks/use-iris-metrics.ts`
- `lib/iris-metrics.api.ts`
- `lib/iris-metrics.constants.ts`
- `lib/iris-metrics.formatters.ts`
- `types/iris-metrics.types.ts`

The API accesses the IRIS Metrics catalogue through Prisma using the `iRISMetricCatalog` model.

---

## 4. How the Data Is Currently Retrieved

The current frontend data flow is:

1. The user opens the IRIS Metrics page.
2. `page.tsx` renders the feature interface.
3. The page uses the `useIrisMetrics` hook.
4. The hook manages search, page, result limit, loading, error, and retry state.
5. The hook calls `fetchIrisMetrics()` from `lib/iris-metrics.api.ts`.
6. The API helper sends the required parameters to `/api/iris/metrics`.
7. The API reads the request parameters.
8. The API queries the IRIS Metrics catalogue using Prisma.
9. Matching records and pagination information are returned to the frontend.
10. The hook stores the returned results, total count, and total pages.
11. The page displays the metrics using the desktop table or mobile card layout.

The API currently searches the following fields:

- `code`
- `name`
- `description`

The records are ordered by metric code in ascending order.

Pagination is implemented using:

- `skip`
- `take`
- `page`
- `limit`

The offset is calculated using:

`(page - 1) * limit`

The API also counts the total number of matching records so that it can calculate:

`totalPages = Math.ceil(total / limit)`

Each returned result may also include a derived `gedsiSuggestion`.

---

## 5. Search and Pagination Behaviour

The IRIS Metrics feature supports text-based searching across metric code, name, and description.

The search query is managed through the `useIrisMetrics` hook.

The frontend uses a short debounce before sending search requests. This helps avoid sending a new request immediately for every individual keystroke.

The search query is trimmed before it is sent to the API.

If the search query is empty, the `q` parameter is not included in the request.

Pagination is page-based.

The current page, result limit, and search query are included in the request when required.

Changing the search query resets the page to page 1.

Changing the result limit also resets the page to page 1.

The API returns the total number of matching records and `totalPages`, which are used by the frontend to display pagination information.

The feature currently supports:

- Previous page navigation.
- Next page navigation.
- Page count display.
- Result-limit changes.
- Search result count display.

---

## 6. Error and Request Handling

The frontend uses an `AbortController` when retrieving IRIS Metrics data.

This allows an earlier request to be cancelled when a newer request replaces it.

If a request fails, the frontend:

- Clears the current result list.
- Resets the total count.
- Resets the total page count.
- Displays an error state.
- Allows the user to retry the request.

The frontend does not treat an aborted request as a normal error.

The API also catches unexpected errors.

For unexpected API failures, the current implementation returns:

`Internal server error`

with HTTP status:

`500`

The API helper also throws an error when the API response is not successful so that the hook can display the appropriate error state.

---

## 7. Current Refactor Status

The IRIS Metrics feature has been refactored to separate the main UI from data-fetching and supporting logic.

The current frontend structure includes:

- `page.tsx` – renders the IRIS Metrics user interface.
- `hooks/use-iris-metrics.ts` – manages search, pagination, result limit, loading, retry, and error state.
- `lib/iris-metrics.api.ts` – handles requests to the IRIS Metrics API.
- `lib/iris-metrics.constants.ts` – stores shared constants such as result-limit options and default values.
- `lib/iris-metrics.formatters.ts` – contains formatting helpers used by the page.
- `types/iris-metrics.types.ts` – contains feature-specific TypeScript types.
- `tests/iris-metrics.test.ts` – contains automated tests for the IRIS Metrics API helper.

### 7.1 Search and Pagination State

The `useIrisMetrics` hook currently manages:

- Search query.
- Current page.
- Result limit.
- Total number of records.
- Total number of pages.
- Loading state.
- Error state.
- Retry behaviour.

The current page, result limit, and search query are passed to the API when IRIS Metrics data is requested.

### 7.2 API Separation

API request logic has been moved out of the page component and into:

`lib/iris-metrics.api.ts`

The API helper:

- Builds request parameters.
- Trims the search query.
- Omits the `q` parameter when the search query is empty.
- Sends `page` and `limit`.
- Passes the request signal.
- Throws an error when the response is unsuccessful.

### 7.3 Shared Types and Constants

Feature-specific types are maintained in:

`types/iris-metrics.types.ts`

Shared constants are maintained in:

`lib/iris-metrics.constants.ts`

Formatting helpers are maintained in:

`lib/iris-metrics.formatters.ts`

This reduces duplicated logic and keeps the feature easier to understand and maintain.

### 7.4 Automated Testing

Automated tests have been added in:

`tests/iris-metrics.test.ts`

The current automated tests verify that:

- Search query, result limit, and page are sent correctly to the API.
- Search text is trimmed before being included in the request.
- An empty search query does not add the `q` parameter.
- The request signal is passed to the API helper.
- API failures throw an appropriate error.

The default automated test suite (npm test) was executed successfully with:

- 31 tests passed.
- 0 tests failed.

Manual browser testing was also completed for:

- Search.
- Clear/reset behaviour.
- Previous pagination.
- Next pagination.
- Result-limit changes.
- Page count updates.
- Result count updates.

### 7.5 Validation Completed

The following checks were completed successfully:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `git diff --check`

The production build completed successfully.

The IRIS Metrics page compiled successfully.

No whitespace errors were reported by `git diff --check`.

---

## 8. What Should Be Improved Next Trimester

The main build, search, pagination, API separation, shared type, and basic automated testing issues identified during the current review have now been addressed.

The following improvements could still be considered by the next development team.

### High Priority

1. **Expand automated test coverage**
   - Add direct tests for `useIrisMetrics` hook behaviour.
   - Add component-level tests for loading, error, empty-result, and retry states.
   - Add UI tests for pagination and result-limit changes.

2. **Improve frontend error feedback**
   - Provide more specific error messages where possible.
   - Distinguish between network errors, API errors, and empty-result states.

3. **Continue responsive testing**
   - Test the desktop table and mobile card layout across a wider range of viewport sizes.

### Medium Priority

1. **Further componentise the page**
   - Consider separating larger UI areas into reusable components if the feature grows.
   - Possible future components include:
     - Search controls.
     - Pagination controls.
     - Desktop metrics table.
     - Mobile metrics cards.

2. **Review accessibility**
   - Confirm keyboard navigation.
   - Confirm form control and button labels.
   - Review focus states and screen-reader behaviour.

3. **Investigate any remaining content or encoding issues**
   - If encoding issues are identified in metric content, determine the exact data source before making changes.

### Ongoing Maintenance

Keep this documentation updated whenever:

- API response fields change.
- Search behaviour changes.
- Result-limit options change.
- Pagination behaviour changes.
- New filters are introduced.
- New metric fields are added.
- Test coverage changes.
- Feature structure is refactored again.

---

## 9. Recommended Future Structure

The current implementation already separates important responsibilities between the page, hook, API helper, constants, formatters, and shared types.

A possible future structure could continue with:

- Page/layout component.
- Search controls component.
- Pagination controls component.
- Desktop metrics table component.
- Mobile metrics card component.
- IRIS Metrics data hook.
- API/data utilities.
- Shared types.
- Shared constants.
- Formatting helpers.
- Unit tests.
- Hook tests.
- Component tests.

Further separation should only be introduced where it improves readability, reuse, or maintainability.

Because the current page is relatively small, additional componentisation is not urgent unless the feature grows in complexity.

---

## 10. Handover Summary

The IRIS Metrics feature currently provides a working searchable catalogue of IRIS+ impact metrics within the VPMS dashboard.

The feature currently supports:

- Search by metric code, name, or description.
- Quick filters.
- Configurable result limits.
- Page-based pagination.
- Previous and Next navigation.
- Desktop table presentation.
- Mobile card presentation.
- Loading state.
- Empty-result handling.
- Error handling.
- Retry behaviour.

The frontend retrieves data through:

`/api/iris/metrics`

The current frontend implementation separates:

- UI rendering.
- State and request management.
- API request logic.
- Shared constants.
- Formatting helpers.
- Shared types.

Automated tests have been added for the IRIS Metrics API helper, and the default automated test suite (npm test) currently passes.

The feature has also been validated through:

- Linting.
- TypeScript checking.
- Production build.
- Automated tests.
- Manual browser testing.
- Whitespace checks.

The main future priorities are:

- Broader automated test coverage.
- Continued responsive testing.
- Accessibility review.
- More detailed error feedback.
- Further componentisation only if the feature grows in complexity.

This document should be updated whenever the feature structure, API behaviour, pagination logic, filters, or test coverage changes
