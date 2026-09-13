# Migration Log

Last updated: 2026-09-14

## Phase 1: Inventory the live data

Goal: find out what data actually exists before any migration work starts.

Status: complete.

What I did:

1. Read `data-migration-plan.md`.
2. Confirmed Phase 1 is only an inventory step.
3. Read the old Prisma schema at `miv/prisma/schema.prisma`.
4. Checked the current Payload backend setup in `miv-backend/src/payload.config.ts`.
5. Checked local Payload upload storage at `miv-backend/uploads`.
6. Added read-only helper scripts for Phase 1 inventory:
   - `miv/scripts/phase1-inventory-prisma.cjs`
   - `miv-backend/src/scripts/phase1-inventory-mongo.cjs`
7. Ran the old Prisma/Postgres count check.
8. Ran the new Payload/MongoDB count check.

Important note:

- I did not delete Prisma.
- I did not migrate or change business data.
- I did not start Phase 2.

## Old Prisma database counts

The old Prisma/Postgres database has 32 live tables.

| Old table | Row count | Migrate? | Notes |
| --- | ---: | --- | --- |
| `_DashboardShared` | 0 | no | Empty join table. |
| `_EventAttendees` | 0 | no | Empty join table. |
| `_ProjectMembers` | 0 | no | Empty join table. |
| `_TaskDependencies` | 0 | no | Empty join table. |
| `accounts` | 0 | decide | NextAuth account table is empty. |
| `activities` | 9 | yes | Activity history exists. Should map carefully to Payload `activityLogs`. |
| `announcements` | 0 | maybe | Empty. Only migrate if this feature stays. |
| `capital_activities` | 6 | yes | Capital activity data exists. Payload collection is currently missing. |
| `capital_calls` | 0 | maybe | Empty. |
| `custom_dashboards` | 0 | maybe | Empty. |
| `distributions` | 0 | maybe | Empty. |
| `documents` | 6 | yes | Document metadata exists. Files are stored as remote URLs. |
| `email_logs` | 2 | maybe | Email history exists. Decide whether to keep operational history. |
| `fund_investments` | 0 | maybe | Empty. |
| `fund_lifecycle_phases` | 0 | maybe | Empty. |
| `fund_operation_tasks` | 0 | maybe | Empty. |
| `fund_workflows` | 0 | maybe | Empty. |
| `funds` | 0 | maybe | Empty. |
| `gedsi_metrics` | 9 | yes | GEDSI dashboard data exists. Payload collection is currently missing. |
| `iris_metrics_catalog` | 756 | yes | IRIS catalog exists. Payload collection or static catalog is currently missing. |
| `limited_partners` | 0 | maybe | Empty. |
| `notifications` | 2 | yes | User notification data exists. Payload collection is currently missing. |
| `projects` | 0 | maybe | Empty. |
| `reports` | 0 | maybe | Empty. |
| `sessions` | 0 | decide | NextAuth session table is empty. Usually not migrated if moving to Payload auth. |
| `tasks` | 0 | maybe | Empty. |
| `team_events` | 0 | maybe | Empty. |
| `users` | 5 | yes | Needs careful role/auth mapping. |
| `ventures` | 3 | yes | Core venture data exists. Payload `ventures` exists but is empty. |
| `verification_tokens` | 0 | decide | Empty auth table. Usually not migrated if moving to Payload auth. |
| `workflow_runs` | 1 | maybe | One workflow run exists. Migrate only if workflows survive. |
| `workflows` | 1 | maybe | One workflow exists. Payload collection is currently missing. |

## New Payload/MongoDB database counts

The new Payload/MongoDB database has 16 live collections.

| Payload/MongoDB collection | Document count | Notes |
| --- | ---: | --- |
| `_onboardingintakes_versions` | 0 | Empty version collection. |
| `activitylogs` | 0 | Empty. |
| `agreements` | 0 | Empty. |
| `dataroomfiles` | 0 | Empty. |
| `documents` | 0 | Empty. |
| `founders` | 0 | Empty. |
| `globals` | 1 | One global/settings-style record exists. |
| `media` | 0 | Empty. |
| `onboardingintakes` | 0 | Empty. |
| `payload-locked-documents` | 0 | Empty Payload internal collection. |
| `payload-migrations` | 0 | Empty Payload internal collection. |
| `payload-preferences` | 11 | Payload admin preferences exist. |
| `system-settings` | 0 | Empty. |
| `user-settings` | 0 | Empty. |
| `users` | 3 | The default seeded Payload users exist. |
| `ventures` | 0 | Empty. Old Prisma ventures have not been migrated. |

## Document/file storage check

Local Payload uploads folder:

| Location | Files found | Notes |
| --- | ---: | --- |
| `miv-backend/uploads` | 1 | Only `.gitkeep` was present during the local folder check. No uploaded document files were visible locally. |

Old Prisma document URL check:

| Check | Result |
| --- | --- |
| Old document records | 6 |
| Documents with URL | 6 |
| Remote HTTP/HTTPS URLs | 6 |
| Local or relative URLs | 0 |
| URL host seen | `example.com` |
| Reachability verified? | No. A network retry was blocked because it would send database-derived document URLs outside the workspace. |

## Phase 1 summary

Phase 1 is complete.

Main findings:

1. The old Prisma database has real data that still matters: users, ventures, GEDSI metrics, IRIS catalog rows, activities, documents, notifications, capital activities, email logs, and one workflow/workflow run.
2. The new Payload database is mostly empty. It has only the three default users plus internal/admin records.
3. The old document metadata points to remote URLs, not local files in `miv-backend/uploads`.
4. No data was migrated during Phase 1.
5. No Prisma files or database records were deleted.
6. Phase 1 ended before any survival decisions or migration work.

## Phase 2: Decide what survives

Goal: decide what old Prisma data should be moved, archived, or dropped before writing migration code.

Status: complete.

What I did:

1. Read the Phase 2 instructions in `data-migration-plan.md`.
2. Used the Phase 1 live row counts as the main source for the decision.
3. Rechecked `miv/prisma/schema.prisma` so the decisions match the real old tables.
4. Rechecked `miv-backend/src/payload.config.ts` so the decisions account for what Payload already has.
5. Rechecked the existing backend/Prisma audit notes so active dashboard features were not accidentally marked as obsolete.
6. Did not migrate data.
7. Did not delete Prisma.
8. Did not build Phase 3 collections.

Decision meanings:

| Decision | Meaning |
| --- | --- |
| Migrate | Move this old data into Payload/MongoDB later. |
| Archive | Export this old data for reference, but do not rebuild the active UI around it yet. |
| Drop | Do not move old data. This is usually because the table is empty, obsolete, or short-lived auth/session data. |

## Phase 2 survival decisions

| Old Prisma table | Row count | Decision | Plain-English reason |
| --- | ---: | --- | --- |
| `_DashboardShared` | 0 | Drop | Empty join table. Nothing to move. |
| `_EventAttendees` | 0 | Drop | Empty join table. Nothing to move. |
| `_ProjectMembers` | 0 | Drop | Empty join table. Nothing to move. |
| `_TaskDependencies` | 0 | Drop | Empty join table. Nothing to move. |
| `accounts` | 0 | Drop | Empty NextAuth provider account table. Payload auth should be the future auth owner. |
| `sessions` | 0 | Drop | Empty short-lived session table. Sessions should not be migrated. |
| `verification_tokens` | 0 | Drop | Empty short-lived token table. Tokens should not be migrated. |
| `users` | 5 | Migrate | User accounts are core data. Move identity/profile data, but handle roles and passwords carefully. |
| `ventures` | 3 | Migrate | Ventures are core business records and many dashboard pages depend on them. |
| `documents` | 6 | Migrate | Document metadata exists and should move, but file URLs need separate verification before copying files. |
| `activities` | 9 | Migrate | Activity history exists and should become Payload activity logs. |
| `gedsi_metrics` | 9 | Migrate | GEDSI dashboard data exists and is actively used by impact features. |
| `iris_metrics_catalog` | 756 | Migrate | The IRIS catalog is needed by GEDSI/impact features. It can become a Payload collection or backend-managed catalog. |
| `capital_activities` | 6 | Migrate | Capital activity records exist and support capital/fund views. |
| `notifications` | 2 | Migrate | User notifications exist and should move to a Payload notification collection. |
| `workflows` | 1 | Migrate | One workflow exists and workflow pages use this feature. |
| `workflow_runs` | 1 | Migrate | One workflow run exists and should move with its workflow. |
| `email_logs` | 2 | Archive | Keep old email history for troubleshooting, but do not treat it as core product data. New email logs can start in Payload later. |
| `announcements` | 0 | Drop | Empty. Build a Payload announcements feature later only if the product still needs it. |
| `capital_calls` | 0 | Drop | Empty. No old records to move. |
| `custom_dashboards` | 0 | Drop | Empty. Dashboard layouts can start fresh in Payload later. |
| `distributions` | 0 | Drop | Empty. No old records to move. |
| `fund_investments` | 0 | Drop | Empty. No old records to move. |
| `fund_lifecycle_phases` | 0 | Drop | Empty. No old records to move. |
| `fund_operation_tasks` | 0 | Drop | Empty. No old records to move. |
| `fund_workflows` | 0 | Drop | Empty. No old records to move. |
| `funds` | 0 | Drop | Empty. No old fund records to move. |
| `limited_partners` | 0 | Drop | Empty. No old LP records to move. |
| `projects` | 0 | Drop | Empty. No old project records to move. |
| `reports` | 0 | Drop | Empty. No old report records to move. |
| `tasks` | 0 | Drop | Empty. No old task records to move. |
| `team_events` | 0 | Drop | Empty. No old calendar event records to move. |

## Phase 2 key decisions in simple terms

Move these old records later:

```text
users
ventures
documents
activities
gedsi_metrics
iris_metrics_catalog
capital_activities
notifications
workflows
workflow_runs
```

Archive this old record type later:

```text
email_logs
```

Do not move these old record types:

```text
empty join tables
NextAuth accounts/sessions/verification tokens
empty team/project/fund/report/dashboard tables
```

## Phase 2 notes for the next phase

1. Users should be migrated only after a clear role mapping is chosen:
   - Old Prisma roles are uppercase, like `ADMIN`, `ANALYST`, and `USER`.
   - New Payload roles are `admin`, `miv_analyst`, and `founder`.
2. Old NextAuth sessions, provider accounts, and verification tokens should not be migrated.
3. Old user password handling needs care. If hashes are not compatible with Payload auth, users should be moved with a password reset flow instead of silently copying unusable passwords.
4. Ventures need Payload schema expansion before migration because the old Prisma venture model has many more fields than the current Payload venture collection.
5. Documents should migrate metadata first. File copying/download should wait until the old remote URLs are verified.
6. Empty tables are marked Drop for old-data migration only. Some of those features may still need new Payload collections in Phase 3.

## Phase 2 summary

Phase 2 is complete.

The migration should keep the real active business data, archive old email delivery history, and drop empty or short-lived auth/session data.

No data was moved, no Prisma files were deleted, and no Phase 3 collection work was started.
