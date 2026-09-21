# T18 - Notifications Handover

## Document status

- **Updated:** 16 September 2026
- **Verified code base:** `upstream/main` at `23ac4ccd`, with the feature-local structural refactor from `52984f2` applied under the current `(operations)` route group.
- **Verified** statements come from the inspected source code or Git history.
- **Needs confirmation** items require a product, backend, authentication, or deployment decision.
- **Recommendation** items describe future work rather than completed work.

## 1. Feature overview and purpose

**Verified:** Notifications is a client-rendered dashboard page at `/dashboard/notifications`. It loads notification records, lets the user refresh the collection, searches notification text, filters by type and read status, shows loading, error, and empty states, marks one unread notification as read, and marks all currently unread notifications as read.

The page also calculates summary totals for all loaded notifications, unread notifications, read notifications, and warning notifications.

## 2. Data required by the page

The feature-local `Notification` type expects:

- `id` - notification identifier.
- `type` - currently typed as `info`, `warning`, `success`, or `error`.
- `title` - notification heading.
- `message` - notification body.
- `isRead` - read/unread state.
- `createdAt` - timestamp string used for display.
- `userId` - associated user identifier.

The Prisma `Notification` model also contains optional `metadata` and `updatedAt`, and relates each record to a User. These fields are returned by the API but are not used by this page.

The API creation schema supports `WELCOME`, `VENTURE_CREATED`, `VENTURE_UPDATED`, `GEDSI_ALERT`, `FUNDING_OPPORTUNITY`, `SYSTEM_UPDATE`, `REPORT_READY`, `STG_REMINDER`, and `WEEKLY_UPDATE`. This differs from the lowercase display categories expected by the frontend.

## 3. Current data sources

| Source | Current use | Status |
| --- | --- | --- |
| `GET /api/notifications` | Initial collection and Refresh results | **Verified** |
| Prisma Notification records | Current persisted source | **Verified** |
| `useNotifications` React state | Collection, loading/error state, search query, and filters | **Verified** |
| Feature-local utilities | Searching, filtering, badge classes, date formatting, and summary calculations | **Verified** |
| `content/notifications.en.ts` | English labels and visible page text | **Verified** |
| Mock data | No mock notification collection is imported | **Verified** |
| `PUT /api/notifications` | Updates one notification per request | **Verified** |

The page sends no query parameters in its GET request. Although the API supports `page`, `limit`, `userId`, `type`, and `isRead`, the page requests the default first 50 records and filters them in the browser.

## 4. APIs, database, Prisma, state, and calculations

### `GET /api/notifications`

**Verified:** The current route requires a session through `getSessionUser()`. Non-staff users are restricted to their own notification records. Staff roles can optionally filter by `userId`. The route builds Prisma filters, orders records newest first, includes selected User details, and returns `notifications` plus pagination metadata.

The page uses only `data.notifications`; it does not consume the pagination object.

### `PUT /api/notifications`

**Verified:** The route requires a session, requires an `id`, verifies that the record exists, and prevents non-staff users from updating another user's notification. The page uses it in two ways:

- **Mark Read:** sends `{ id, isRead: true }`; local state changes only after an HTTP success response.
- **Mark All Read:** sends one PUT request per unread record in parallel and updates only the IDs whose requests succeed.

The API route has no DELETE handler, and the page provides no Delete action.

### Local state and calculations

- `useNotifications` owns notifications, loading, error, search, and filter state.
- Search is case-insensitive across title and message.
- Status filtering and unread styling use `isRead`.
- Dates use `new Date(createdAt).toLocaleDateString()`, so presentation depends on browser locale and timezone.
- Summary values are calculated from the complete loaded collection, not the filtered results.

## 5. Current frontend data flow

1. `useNotifications` calls `fetchNotifications()` after mounting.
2. The hook sets loading, clears the previous error, and calls `GET /api/notifications`.
3. A successful response stores `data.notifications`; a failed request exposes the error state.
4. Search, Type, and Status controls update hook state.
5. `filterNotifications()` derives the displayed collection.
6. The list shows either notifications, the unfiltered empty state, or the filtered empty state.
7. Mark Read sends one PUT request and updates local `isRead` only after success.
8. Mark All Read sends one PUT per unread record and updates only successful records.
9. Refresh repeats the GET flow and replaces the loaded collection.

## 6. Missing or incomplete data connections

### Verified gaps

- The frontend display types do not match the API and Prisma NotificationType enum, so filtering, labels, icons, and colours may not represent real records correctly.
- The page ignores API pagination and displays only the default first 50 records.
- Failed Mark Read and Mark All Read requests are logged to the console but are not announced in the UI.
- There is no action-specific pending state, so repeated clicks can send duplicate PUT requests.
- There is no DELETE handler or deletion UI.
- Notification metadata is not used to navigate to a related venture, report, or workflow.
- There is no real-time update mechanism or polling schedule.

### Needs confirmation

- The intended frontend labels, groups, icons, and colours for every backend NotificationType.
- Whether staff should see all users' notifications by default or require an explicit user filter.
- Whether notifications should support navigation, dismissal, deletion, or archival.
- Whether Mark All Read should become a single backend bulk operation.
- Which production events currently create notifications.
- Required retention and pagination behaviour.

## 7. Work completed this trimester

**Verified from PR #97, commits `c50069d` and `fe2e39c`, and structural commit `52984f2`:**

- Replaced the incorrect frontend `read` property with `isRead`.
- Corrected Mark Read and Mark All Read to use the existing PUT endpoint.
- Preserved successful-only local updates and parallel Mark All Read requests.
- Disabled Mark All Read when no loaded notification is unread.
- Removed the unsupported Delete action.
- Fixed narrow-screen overflow while preserving desktop layouts.
- Added accessible labels, status announcements, alert/list semantics, decorative-icon handling, and 44px action heights.
- Split the large page into feature-local components, content, hook, types, and utilities.
- Kept `page.tsx` focused on composition.
- Preserved current main's primary-colour theme tokens.

## 8. Known issues and limitations

- Backend and frontend notification type vocabularies are inconsistent.
- Only the first API page is loaded.
- Action failures are not shown visually.
- No action-specific pending state prevents repeated clicks.
- No Delete capability exists.
- Summary counts describe the loaded collection rather than all database records.
- Date formatting provides only a locale date, with no time or relative context.
- No feature-local automated test file was found during this inspection.

## 9. Recommendations for next trimester

1. Align the frontend with the backend NotificationType contract.
2. Keep session-derived user isolation in the backend and document staff visibility rules.
3. Move Prisma schema, migrations, and database responsibility fully to the backend and expose a stable API contract.
4. Consume pagination or add an accessible load-more/infinite-loading pattern.
5. Add accessible pending, success, and failure feedback for read actions.
6. Consider a bulk-read endpoint if product and performance requirements justify it.
7. Define typed navigation metadata and safe destinations.
8. Consider an approved real-time update mechanism.
9. Add deletion or archival only after product approval and backend support.
10. Add automated coverage for states, filtering, individual read, partial bulk failure, accessibility, and responsive layouts.

## 10. Relevant files, routes, and URLs

### Frontend feature

- `miv/app/dashboard/(operations)/notifications/page.tsx`
- `miv/app/dashboard/(operations)/notifications/components/`
- `miv/app/dashboard/(operations)/notifications/content/notifications.en.ts`
- `miv/app/dashboard/(operations)/notifications/hooks/use-notifications.ts`
- `miv/app/dashboard/(operations)/notifications/types/notification.ts`
- `miv/app/dashboard/(operations)/notifications/utils/notification-utils.ts`
- `miv/app/dashboard/(operations)/notifications/README.md`

### API and database

- `miv/app/api/(operations)/notifications/route.ts`
- Current Prisma model: `miv/prisma/schema.prisma`

### Related but separate component

- `miv/components/dashboard/notification-center.tsx` is a separate shared dashboard component and is not imported by this page.

### Runtime URLs

- Page: `/dashboard/notifications`
- Read: `GET /api/notifications`
- Update: `PUT /api/notifications`
- Creation supported by the route but not used by this page: `POST /api/notifications`
- Typical local page: `http://localhost:3000/dashboard/notifications`

No deployed public host was verified during this inspection.

## 11. Testing performed

### Verified evidence

- PR #97 records focused action, responsive-layout, and accessibility work.
- Source inspection confirms successful-only PUT state updates and parallel Mark All Read requests.
- Source inspection confirms responsive breakpoints, minimum action heights, and ARIA/list semantics.
- Structural verification for the current refactor should be recorded with this branch's final check results.

### Evidence still required

- Browser Network results for GET and PUT requests with an authenticated session.
- Manual checks at 360px, 390px, 768px, and desktop widths.
- Keyboard and screen-reader checks.
- Automated test results if tests are added later.

## 12. Evidence placeholders

- **PR #97:** https://github.com/InnovAIte-Deakin/Venture-Pipeline-Management-System/pull/97
- **Actions/mobile commit:** `c50069d`
- **Accessibility commit:** `fe2e39c`
- **Structural refactor commit:** `52984f2`

## Handover note on database responsibility

The current Next.js Notifications API imports Prisma directly and the current `miv/prisma/schema.prisma` owns the Notification model. The project plan is to move Prisma, migrations, and database responsibility fully to the backend. During that migration, the frontend should depend on a documented, authenticated backend contract covering notification types, user scoping, pagination, updates, errors, and future navigation or archival behaviour.
