# Notifications

This directory owns the `/dashboard/notifications` feature.

## Structure

- `page.tsx` composes the feature states and UI sections.
- `components/notification-header.tsx` renders the page heading and Refresh and Mark All Read actions.
- `components/notification-filters.tsx` renders the Search, Type and Status controls.
- `components/notification-list.tsx` renders the notification collection or its empty state.
- `components/notification-card.tsx` renders one notification and its Mark Read action.
- `components/notification-states.tsx` contains loading, error and empty states.
- `components/notification-summary.tsx` renders totals for the complete loaded collection.
- `hooks/use-notifications.ts` owns API requests, state and client-side filtering.
- `types/notification.ts` contains feature-local notification and filter types.
- `utils/notification-utils.ts` contains filtering, badge, date and summary calculations.
- `content/notifications.en.ts` contains user-facing English text and filter labels.

General UI primitives remain in the global `components/ui` directory.

## Data flow

1. `useNotifications` requests `GET /api/notifications` when the page mounts and when Refresh is selected.
2. Search, Type and Status filtering is performed locally against the loaded collection.
3. Mark Read sends `PUT /api/notifications` with `{ id, isRead: true }` and updates local state only after a successful response.
4. Mark All Read sends the same PUT request in parallel for every currently unread notification and updates only successful IDs.
5. Summary values are calculated from the complete loaded collection, not the filtered results.

## Accessibility and responsive behaviour

- Search, Type and Status labels are associated with stable control IDs.
- Loading and empty states use polite status announcements.
- The error state uses `role="alert"`.
- The collection and cards use list and list-item semantics.
- Decorative icons are hidden from assistive technology.
- Action buttons have a minimum 44px height.
- Header actions and notification cards stack on mobile and return to row layouts at the existing breakpoints.

## Current limitations

- The frontend uses lowercase display types (`info`, `success`, `warning`, and `error`), while the current API and Prisma enum use a different notification-type vocabulary. That contract mismatch is intentionally unchanged by this structural refactor.
- The current API route has no DELETE handler, so the page does not offer deletion.
- Failed read actions remain unchanged locally and are logged to the console.
- The page performs client-side filtering and does not consume the API pagination metadata.
- Authentication and user scoping are responsibilities of the API and are not changed by this feature structure.

## Verification

- Run `git diff --check` from the repository root.
- Run `npm run typecheck` from `miv`.
- Run focused ESLint against this feature directory.
- Verify loading, error, unfiltered empty and filtered empty states.
- Verify Refresh, Mark Read and Mark All Read requests in the browser Network panel.
- Verify search and filters, summary totals, keyboard operation and layouts at 360px, 390px, 768px and desktop widths.
