# Team Management

Current status for the Team Management route after the route-local refactor and follow-up fixes.

## Route

- URL: `/dashboard/team-management`
- Route file: `miv/app/dashboard/(g5-platform-operations)/team-management/page.tsx`
- Next.js route group: `(g5-platform-operations)` is not part of the URL.
- Parent layout: `miv/app/dashboard/layout.tsx`

This feature is a client-side operations console for managing team members, projects, announcements, and events. It is organized into four tabs and talks to `/api/team/*` through the route-local `lib/team-api.ts` wrapper.

## Current Status

The refactor is now functionally wired for the team-management feature.

Resolved:

- Old shared `components/team-management`, `lib/team-management`, and `types/team-management.ts` files were moved into this route folder.
- Stale imports to deleted `@/lib/team-management/*` paths were fixed.
- The page renders as a thin tab composition layer.
- `MembersSection`, `ProjectsSection`, `AnnouncementsSection`, and `EventsSection` own their own local list, search, loading, error, selected-item, form, and detail state.
- Create/edit dialogs no longer crash when opened without a selected record.
- Event, project, and announcement date values are normalized before being passed to date inputs.
- Project, event, and announcement forms now receive real saving state instead of `loading={false}`.
- The shared dialog component now has viewport width, max height, and vertical scrolling, improving mobile usability for long forms.
- Team member create/update API responses now include the same `_count` and relationship fields expected by member cards.
- Event recurrence writes now use `Prisma.JsonNull` instead of invalid raw `null`.
- Invalid `dependencies` and `dependentOn` task includes were removed from the project detail API.
- `PaginatedResponse<K, T>` now avoids the TypeScript index-signature conflict.
- Team-management tab buttons no longer show the global blue focus outline/stroke when clicked.

## Folder Structure

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

## Behavior

- Members: search, create, update, view details.
- Projects: search, status filter, create, update, delete, view details.
- Announcements: search, create, update, delete, view details.
- Events: search upcoming events, create, update, delete, view details.
- Search inputs debounce API calls by 250ms.
- Project, event, and announcement forms fetch team members so users can select leads, attendees, organizers, and authors.
- Events list requests events starting from the current date.
- Announcements list requests active announcements only.

## API Contract

| Endpoint | Current use | Response shape |
| --- | --- | --- |
| `/api/team/members` | List and create members | list returns `{ members, pagination }`; create returns a member object |
| `/api/team/members/:id` | Update member | returns a member object |
| `/api/team/projects` | List and create projects | list returns `{ projects, pagination }`; create returns a project object |
| `/api/team/projects/:id` | Update and delete projects | returns a project object or delete message |
| `/api/team/events` | List and create events | list returns `{ events, pagination }`; create returns an event object |
| `/api/team/events/:id` | Update and delete events | returns an event object or delete message |
| `/api/team/announcements` | List and create announcements | list returns `{ announcements, pagination }`; create returns an announcement object |
| `/api/team/announcements/:id` | Update and delete announcements | returns an announcement object or delete message |

When changing API response shape, update `types/team-management.ts`, `lib/team-api.ts`, and the affected section component together.

## Remaining Issues

These are known follow-up items. They are not blockers for the current route wiring.

1. Create flows still use `as any` in section components because create and update payloads are shared loosely.
2. Section-level API/loading/search logic is duplicated across sections. Extract hooks only if this duplication starts causing real maintenance cost.
3. Search and filters are not reflected in the URL, so state is lost on refresh or navigation.
4. Pagination metadata is returned and typed, but the UI currently requests `limit: 50` and does not render pagination controls.
5. Delete behavior exists for projects, events, and announcements, but not members.
6. Event recurrence is basic. Richer recurrence UI should be verified against the backend contract before expanding it.
7. Full browser-level visual verification on mobile and desktop has not been completed.

## Validation

Latest checks run from `miv/`:

- `npm.cmd run test:integration -- tests/integration/team-management-page.test.ts`: passed.
- `npm.cmd run lint`: passed with 7 existing warnings outside team-management.
- Filtered typecheck review: no remaining team-management or `/api/team` errors were reported.
- Full `npm.cmd run typecheck`: still fails because of unrelated existing errors elsewhere in the repo, including impact analytics, documents/email routes, workflows, dashboard pages, Prisma seed scripts, and the social-impact test path.

## Development Notes

- Keep `page.tsx` focused on tab layout and route composition.
- Keep fetch behavior inside `lib/team-api.ts`.
- Keep presentation helpers inside `lib/team-utils.ts`.
- Keep feature-specific contracts in `types/team-management.ts`.
- Do not reintroduce the old shared `components/team-management`, `lib/team-management`, or `types/team-management.ts` folders unless the feature becomes shared by multiple routes.
- If a remaining issue is fixed, update this README in the same change.
