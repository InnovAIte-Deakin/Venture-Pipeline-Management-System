# Team Management

Post-refactor handoff for the Team Management route.

## Route

- URL: `/dashboard/team-management`
- Route file: `miv/app/dashboard/(g5-platform-operations)/team-management/page.tsx`
- Next.js route group: `(g5-platform-operations)` is not part of the URL.
- Parent dashboard layout: `miv/app/dashboard/layout.tsx`

This folder implements a client-side operations console for managing team members, projects, announcements, and calendar events. The page is organized into tabs and talks to the existing `/api/team/*` endpoints through a small local API wrapper.

## Refactor Status

The team management feature has been colocated under its route folder. The page is now a thin composition layer that wires together:

- `MembersSection` for team member search, create, edit, and detail viewing.
- `ProjectsSection` for project search, status filtering, create, edit, delete, and detail viewing.
- `AnnouncementsSection` for announcement search, create, edit, delete, and detail viewing.
- `EventsSection` for upcoming event search, create, edit, delete, and detail viewing.
- `teamApi` for typed browser-side calls to `/api/team/*`.
- `team-utils.ts` for display labels, badge classes, date formatting, initials, and event labels.
- Feature-local types in `types/team-management.ts`.

The old shared `components/team-management`, `lib/team-management`, and `types/team-management.ts` files were moved into this route folder so the feature owns its local UI, API wrapper, utilities, and types together.

## Current Folder Structure

```text
team-management/
  page.tsx
  README.md
  components/
    announcement-card.tsx
    announcement-details-dialog.tsx
    announcement-form-dialog.tsx
    announcements-section.tsx
    delete-confirmation-dialog.tsx
    event-card.tsx
    event-details-dialog.tsx
    event-form-dialog.tsx
    events-section.tsx
    member-card.tsx
    member-details-dialog.tsx
    member-form-dialog.tsx
    members-section.tsx
    project-card.tsx
    project-details-dialog.tsx
    project-form-dialog.tsx
    projects-section.tsx
    section-empty-state.tsx
    section-error-state.tsx
    section-loading-state.tsx
    team-management-header.tsx
  lib/
    team-api.ts
    team-utils.ts
  types/
    team-management.ts
```

## Main Responsibilities

### `page.tsx`

Thin route composition only. It renders the shared header and four tabs:

- Members
- Projects
- Communication
- Calendar

Keep data fetching, form state, and CRUD behavior inside the section components rather than moving it back into `page.tsx`.

### `components/*-section.tsx`

Each section owns its local browser state:

- list data
- search/filter values
- loading and error states
- selected item
- create/edit dialog state
- details dialog state
- delete state where deletion is supported

The sections fetch data on mount and debounce search updates by 250ms.

### `lib/team-api.ts`

Centralizes fetch behavior for this feature:

- builds query strings
- serializes JSON request bodies
- parses JSON responses
- throws `ApiError` for failed responses
- exposes grouped API methods for members, projects, events, and announcements

Keep endpoint paths and response typing here so UI components do not duplicate fetch details.

### `lib/team-utils.ts`

Contains presentation helpers only:

- project status labels
- project status badge classes
- priority badge classes
- date and date-time formatting
- member initials
- member display name
- event label generation

Keep React components out of `lib/`.

### `types/team-management.ts`

Contains feature-local TypeScript contracts for:

- team member roles
- project status and priority
- event recurrence
- team members
- projects
- events
- announcements
- paginated API responses

The `PaginatedResponse<K, T>` type intentionally takes the collection key name as a generic parameter, for example `PaginatedResponse<'members', TeamMember[]>`. Do not replace it with a broad string index signature because that forces `pagination` to have the same type as the collection.

## What Was Achieved

- Team management UI files were moved into the route folder for clearer ownership.
- Page imports now point at the colocated module files.
- The page remains a small tab composition layer.
- Members, projects, events, and announcements each have focused section components.
- Shared loading, empty, error, and delete-confirmation UI is reusable within the feature.
- API calls are centralized through `teamApi`.
- Feature-specific types are colocated with the route.
- Tab list spacing was adjusted so wrapped tab buttons do not overlap the section heading.
- The paginated response type was corrected to avoid a TypeScript index-signature conflict.
- `EventFormDialog` no longer uses unsafe `in` checks on nullable values and now derives edit-state IDs from `event.organizer.id` and `event.attendees`.
- `AnnouncementFormDialog` no longer uses unsafe `in` checks on nullable values and now derives edit-state author IDs from `announcement.author.id`.
- Event and announcement date values are normalized before being passed to date inputs.

## Preserved Behavior

These behaviors currently exist in the feature:

- Lists load from `/api/team/*` endpoints on mount.
- Search inputs debounce API calls by 250ms.
- Members support create and update.
- Projects support create, update, and delete.
- Events support create, update, and delete.
- Announcements support create, update, and delete.
- Projects fetch members separately so the project form can choose leads and members.
- Events fetch members separately so the event form can choose organizers and attendees.
- Announcements fetch members separately so the announcement form can choose an author.
- Event lists request events starting from the current date.
- Announcement lists request active announcements only.

## Known Remaining Issues

Fix these as explicit follow-up changes, not silently during unrelated cleanup.

1. Create flows currently cast form payloads with `as any` in section components because create and update form payload types are being shared loosely.
2. `ProjectFormDialog`, `EventFormDialog`, and `AnnouncementFormDialog` receive `loading={false}` from their sections, so submit buttons may not reflect in-flight saves consistently.
3. The section-level API calls are duplicated across sections instead of being extracted into feature hooks.
4. Search and filters are not reflected in the URL, so state is lost on refresh or navigation.
5. Pagination metadata is typed and returned by APIs but the UI currently requests `limit: 50` and does not render pagination controls.
6. Delete behavior is available for projects, events, and announcements, but not for members.
7. Event recurrence is typed and passed through forms, but recurrence behavior should be verified against the backend contract before adding richer UI.
8. Some existing text in the moved files appears to contain encoding artifacts in loading and label strings; normalize those strings in a dedicated cleanup change.

## API Contract Notes

Current endpoint assumptions:

| Endpoint | Current use | Response key |
| --- | --- | --- |
| `/api/team/members` | List, create, update team members | `members[]` for list |
| `/api/team/projects` | List, create projects | `projects[]` for list |
| `/api/team/projects/:id` | Update and delete projects | project object or delete message |
| `/api/team/events` | List, create events | `events[]` for list |
| `/api/team/events/:id` | Update and delete events | event object or delete message |
| `/api/team/announcements` | List, create announcements | `announcements[]` for list |
| `/api/team/announcements/:id` | Update and delete announcements | announcement object or delete message |

When changing an API response shape, update `types/team-management.ts`, `lib/team-api.ts`, and the relevant section component together.

## Development Guidance

- Keep `page.tsx` focused on layout and tab composition.
- Keep fetch wrappers in `lib/team-api.ts`; do not call `fetch` directly from card or dialog components.
- Keep display formatting in `lib/team-utils.ts`.
- Prefer typed create and update payloads over `as any` when touching form submission.
- Add hooks only when they reduce duplication across sections or isolate data orchestration clearly.
- Keep shared UI states in the existing section state components unless a broader design-system component already exists.
- If you fix a known issue, remove the corresponding note from this README in the same change.

## Suggested Next Work

1. Split create and update form payload handling so section components no longer need `as any`.
2. Add proper saving state to project, event, and announcement form submissions.
3. Add pagination controls or remove unused pagination assumptions from the UI.
4. Normalize encoding artifacts in loading and label strings.
5. Add browser-level verification for the tab layout and CRUD dialogs on mobile and desktop.

## Validation Notes

Recent validation from this folder's cleanup:

- `npm.cmd run typecheck` from `miv/`: no longer reports the old `PaginatedResponse` index-signature error or stale `@/components/team-management/*` imports from `page.tsx`.
- `npm.cmd run typecheck` from `miv/`: no longer reports nullable prop narrowing errors in `announcement-form-dialog.tsx` or `event-form-dialog.tsx`.
- The wider repo typecheck still fails because of unrelated pre-existing errors across API routes, dashboard pages, and Prisma seed scripts.
- Full interactive browser verification was not completed.
