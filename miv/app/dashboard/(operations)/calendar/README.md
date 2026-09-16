# Calendar & Events

## Purpose

Calendar & Events is a dashboard for reviewing team schedules, meetings, calls, due-diligence sessions, presentations and deadlines. It displays summary metrics, distributions, server-filtered event cards and a monthly calendar. The page is currently a read-only review interface; its visible per-event action buttons do not implement mutations.

## Source Snapshot

Reviewed on 16 September 2026 against `InnovAIte-Deakin/Venture-Pipeline-Management-System`, main commit `ca71c2d`, plus the focused `fix/calendar-validation-tests-docs` branch. The branch adds event-list response validation, extracts the existing category rules without changing them, and adds tests and this README. These additions are pending PR merge; they are not yet part of main. The public route, endpoints and responsive markup remain unchanged.

## Current Route

- Source: `miv/app/dashboard/(operations)/calendar/page.tsx`
- Public URL: `/dashboard/calendar`
- `(operations)` is a Next.js route group, not a URL segment.
- `page.tsx` renders `CalendarPageContent` through the folder's `index.ts` export.
- Shared dashboard shell: `miv/app/dashboard/layout.tsx`.

The former `features/calendar` and `(g5-platform-operations)` paths are historical and should not be used for new imports.

## Current Architecture

```text
miv/app/dashboard/(operations)/calendar/
|-- page.tsx
|-- index.ts
|-- README.md
|-- api/
|   `-- calendar-api.ts
|-- components/
|   |-- calendar-page-content.tsx
|   |-- calendar-header.tsx
|   |-- calendar-stats.tsx
|   |-- calendar-distributions.tsx
|   |-- calendar-filters.tsx
|   |-- calendar-event-list.tsx
|   |-- calendar-event-card.tsx
|   |-- calendar-month-view.tsx
|   |-- calendar-loading-state.tsx
|   `-- calendar-error-state.tsx
|-- hooks/
|   |-- use-calendar-data.ts
|   `-- use-calendar-filters.ts
|-- lib/
|   |-- calendar-date-utils.ts
|   |-- calendar-display-utils.tsx
|   `-- calendar-event-filters.ts
`-- types/
    `-- calendar.ts

miv/tests/calendar.test.ts
```

`README.md`, `calendar-event-filters.ts` and `tests/calendar.test.ts` are additions in the current PR branch.

## Component Responsibilities

| File | Responsibility |
| --- | --- |
| `calendar-page-content.tsx` | Client composition, data/filter hooks, selected month, derived category lists and four tabs. |
| `calendar-header.tsx` | Title, subtitle and New Event link. |
| `calendar-stats.tsx` | Total Events, Today's Events, High Priority and This Week cards. |
| `calendar-distributions.tsx` | Type, priority and status distributions with event-derived fallbacks. |
| `calendar-filters.tsx` | Search and type/priority/status/time-view controls. |
| `calendar-event-list.tsx` | Shared list and configurable empty-result message. |
| `calendar-event-card.tsx` | Title, badges, description, date/time, location, attendee count, company, notes and action icons. |
| `calendar-month-view.tsx` | Month navigation and 42-day grid. |
| `calendar-loading-state.tsx` | Spinner and loading text. |
| `calendar-error-state.tsx` | Header, request error and Retry button. |

## State, Hooks and Types

`useCalendarFilters` owns `{ search, type, priority, status, view }`. Initial values are blank search, `all` for type/priority/status and `upcoming` for view. Each setter preserves the other fields. Filters are not stored in the URL or persistent storage.

`useCalendarData` owns events, optional analytics, loading, error and the analytics-loaded reference. Filter changes schedule a request; a non-empty search uses a 300 ms delay, otherwise the delay is zero. Effect cleanup clears the timer and aborts its request. Successfully loaded analytics are cached for the mounted hook; failures can be retried during a later load. Retry invokes the current load directly.

`CalendarPageContent` separately owns the displayed month, initially the local current month's first day. The tab control defaults to Events. Loading/error gates unmount the tabs, so a new request can reset the active tab to Events.

`types/calendar.ts` defines events, analytics, distributions, filters and response pagination. Supported types are `meeting`, `call`, `board_meeting`, `due_diligence`, `presentation`, `deadline`, `other`; priorities are `high`, `medium`, `low`; statuses are `scheduled`, `in_progress`, `completed`, `cancelled`; time views are `all`, `upcoming`, `past`.

## Current Data Sources

| Request | Source handler | Usage |
| --- | --- | --- |
| `GET /api/calendar/events?limit=100&...` | `miv/app/api/(operations)/calendar/events/route.ts` | Filtered event array. |
| `GET /api/calendar/analytics?period=30` | `miv/app/api/(operations)/calendar/analytics/route.ts` | Summary and distributions, independent of active event filters. |

Event requests trim search text and omit blank search and `all` selections. No page number or displayed-month date range is sent. Response pagination and the events endpoint's own analytics object are not consumed by this page.

The GET handler reads Prisma `teamEvent` records with organizer and attendee relations. Search matches title, description or location case-insensitively. Upcoming/past filtering compares the stored event date with the current instant. Results are ordered by date ascending and database-paginated before inferred type, priority and status filters are applied. The returned total describes that filtered page, not a complete count across all pages.

GET transformations infer type and priority from title/description text, infer past events as completed, extract a company prefix before ` -`, and return UTC date-only strings. The events GET path does not retrieve the extended metadata written to activity records by POST. Consequently, stored metadata and displayed inferred values are not guaranteed to agree.

The analytics handler reads all matching team events; `period=30` supports period/trend comparisons but does not restrict all summary/distribution values to thirty days. The frontend uses only `summary` and `distributions`, not trends or insights.

## Current Data Flow

1. The route renders `CalendarPageContent`, which obtains filters and calls the data hook.
2. The hook starts events and, until successful, analytics requests together.
3. HTTP failures reject. The PR branch also rejects a null payload or any payload whose `events` property is not an array.
4. Event errors display the error gate. Analytics errors are logged and converted to null so event content can still load.
5. Successful events are stored; successful analytics are retained for the mounted hook.
6. The same event array feeds Events and Calendar View. Meetings and Deadlines narrow that array by type.
7. Month navigation changes only the displayed month; it does not fetch another event range.

## Business Rules and Calculations

- Meetings includes `meeting`, `call`, `board_meeting` and `due_diligence`.
- Deadlines includes only `deadline`.
- Category helpers preserve result order and do not alter events, status or priority.
- Summary fields use nullish fallback, so valid analytics zeroes remain zeroes.
- Without analytics, Total Events is the fetched array length; High Priority counts `high`; Today's Events compares date strings to the current UTC date; Upcoming compares date strings against that date. This Week falls back to zero.
- The high-priority percentage divides by total, using `0.0%` for an empty total. The displayed past count is clamped to at least zero.
- Fallback distributions count each supported type/priority/status and round percentages to one decimal place; empty input produces zero percentages.
- Month utilities produce 42 consecutive cells, starting at the Sunday on/before the month's first day. Leading/trailing dates remain visible with muted styling.
- Grouping uses date-only `startDate` keys without timezone conversion. The guard checks the `yyyy-MM-dd` string shape, not whether a date such as 30 February is real. Timestamp strings are excluded.
- Multi-day events appear on their start date only. Up to three indicators/titles are shown per cell; desktop shows a remaining-event count.
- Local time is used for the current month and today ring, while API date strings and fallback summary date comparisons use UTC conventions.

## Filters, Tabs and Actions

Events exposes Search, Event Type, Priority, Status and View. These controls combine in the API request and affect all category/month tabs because they share the same result array. The month description says “all events,” but the actual grid contains only the current filtered response, at most the first requested page.

Available working actions are changing filters, switching tabs, Retry, Prev/Today/Next month navigation and New Event navigation to `/dashboard/team-management`. That link does not open an event dialog directly. View, Edit, Share and More options buttons have accessible labels but no handlers. There are no Calendar-local dialogs, export workflow, create/edit form or persistence operations.

## Desktop Layout

The header becomes a horizontal title/action row at `sm`. Filters become two columns at `sm` and five at `lg`; summary cards reach four columns at `lg`; distributions use three columns at `md`. Event metadata expands to two columns at `md` and four at `lg`. At `sm` and above, month cells show truncated event titles, larger spacing and overflow counts.

## Mobile Layout

The header stacks, New Event spans the available width, cards use wrapping content, and action icons occupy a separate row on narrow screens. Summary cards use one column below 375 px and two from 375 px. Tabs scroll horizontally within their own container. Month cells stay in seven columns, using one-letter weekday labels and compact event bars below `sm`; count badges appear from 375 px. Month navigation stacks above the label on narrow screens. Both layouts share state, data and action handlers; there is no separate mobile data hook.

## Loading, Error, Empty and Success States

- Loading replaces main content with `Loading calendar...` for both initial and subsequent loads.
- Event HTTP/network/JSON errors and invalid event-list envelopes show `Error: ...` with Retry. Envelope validation does not validate each event's fields.
- Events, Meetings and Deadlines have their own empty messages. Calendar View retains an empty month grid.
- Analytics failure permits event-based fallback cards; there is no visible analytics-specific warning. Because requests are awaited together, slow analytics can still delay event rendering.
- Successful loading renders the summary, distributions and tabs; no success toast is emitted.

## Validation Results

Checks run on 16 September 2026 with the locked frontend dependencies and a generated Prisma client:

| Check (from `miv/`) | Result |
| --- | --- |
| `npm run typecheck` | Passed, no TypeScript errors. |
| `npm run lint` | Passed, no reported errors or warnings. |
| `node --import tsx --test tests/*.test.ts` | Passed: 58 tests, including 30 Calendar and 8 Social Impact tests. |
| `node --import tsx --test tests/calendar.test.ts tests/social-impact.test.ts` | Passed: 38 tests. |
| `node --import tsx --test tests/integration/*.test.ts` | Six tests passed; live development-API and security-gate suites were skipped because their opt-in environment was not configured. |
| `npm run build` | Environment-blocked: Turbopack worker port binding failed with `Operation not permitted`, including a retry with expanded access. |
| `npm run build -- --webpack` | Passed: optimized compilation, TypeScript and static generation completed, including both feature routes. |
| `git diff --check` | Passed. |

The equivalent direct Node test invocation was used because the `tsx` CLI used by `npm test` could not create its local IPC socket in this sandbox. No test runner or dependency configuration was changed.

The deterministic tests cover month/leap-year/year-boundary behavior, date-only grouping, category rules, populated/loading/empty server-rendered output, filter serialization, malformed response envelopes, HTTP/network/JSON failures, repeat requests and cancellation-signal forwarding. They do not mount the data hook or prove interactive retry/cancellation behavior. No authenticated desktop/mobile browser session was exercised during this review.

## Known Remaining Issues and Limitations

- View/Edit/Share/More options are presentation-only; New Event is navigation, not an in-place creation workflow.
- The page fetches a single batch of 100 and provides no pagination. Post-pagination server filtering may omit matches on later pages.
- Analytics are unfiltered and cached after success, while event lists are filtered; summary figures can therefore differ from visible results.
- Retry calls `load()` without an AbortSignal. Unlike effect requests it is not aborted by cleanup, leaving a possible stale-update race. Hook lifecycle tests remain absent.
- Event array entries and analytics shapes are trusted after parsing. Malformed nested data can still break rendering.
- Grid indicators are not clickable and mobile titles are not visibly expanded. Multi-day spans and recurring occurrence expansion are not implemented here.
- UTC/local date conventions and current-instant upcoming checks can disagree near day boundaries.
- String-shape validation does not reject impossible dates.
- API GET derives metadata rather than restoring the extended POST metadata.

## Things To Take Note

Keep the route thin and changes inside the route-local feature. Keep endpoint parameter names, category membership and responsive breakpoints stable during maintenance. Reuse the shared category helpers rather than duplicating rules. Tests live at `miv/tests/calendar.test.ts` and are included by the existing root frontend test script. Backend writes, pagination changes and metadata semantics require separate focused work.

## Future Improvements

1. Add mounted-hook tests and make Retry share a cancellable request lifecycle.
2. Add interaction and browser viewport checks for filters, tabs, retry, navigation and long content.
3. Define event details/edit/share workflows and wire the currently inactive actions to agreed APIs.
4. Align analytics scope with filters or label the scope explicitly.
5. Implement reliable server-side pagination/filtering and month-range loading.
6. Validate nested API data and agree on timezone, multi-day and recurrence semantics.
