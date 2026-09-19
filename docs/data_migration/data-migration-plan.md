# Data Migration Plan

Last checked: 2026-09-14

## The Short Version

The project currently has two different backend/database systems:

```text
miv/
  The older/full dashboard app
  Uses Prisma
  Uses DATABASE_URL
  Owns many local /api/... routes

miv-backend/
  The newer Payload CMS backend/admin
  Uses MongoDB
  Uses DATABASE_URI
  Runs the admin at http://localhost:3001/admin
```

This is why the project feels confusing: it is halfway between two architectures.

The `miv-backend` admin only shows three accounts because those are the only records it creates automatically. The old Prisma data has not been copied into `miv-backend` yet.

## What Is The Issue Right Now?

The main issue is not just "Prisma exists".

The real issue is that the project has two sources of truth:

1. `miv` still has many real API routes that use Prisma.
2. `miv-backend` has a new Payload CMS backend, but it only covers part of the old data model.
3. Some frontend pages use real Prisma-backed data.
4. Some frontend pages use `miv-backend`.
5. Some frontend pages still use mock, fallback, static, or demo data.

So the app is currently mixed:

```text
Some data comes from Prisma.
Some data comes from miv-backend.
Some data is fake/demo/fallback data in the frontend.
```

Because of that, deleting Prisma today would break many dashboard features.

## Why Does http://localhost:3001/admin Only Show Three Accounts?

`http://localhost:3001/admin` is the Payload admin for `miv-backend`.

That admin is looking at the MongoDB database configured by:

```text
miv-backend/.env
DATABASE_URI=...
```

It is not looking at the old Prisma database configured by:

```text
miv/.env
DATABASE_URL=...
```

The three accounts are seeded in `miv-backend/src/payload.config.ts`:

```text
admin@example.com
founder@example.com
analyst@example.com
```

Those accounts prove that `miv-backend` is running, but they do not mean the old Prisma data was migrated.

## What miv-backend Currently Has

`miv-backend` is a Payload CMS app using MongoDB.

It currently registers these Payload collections:

| Payload collection | What it is for | Current migration status |
| --- | --- | --- |
| `users` | Payload users and login accounts | Exists, but only has the default seeded users unless more were created manually |
| `media` | Uploaded media | Exists |
| `ventures` | Venture records | Exists, but has far fewer fields than the Prisma `Venture` model |
| `onboardingIntakes` | Public founder/venture intake submissions | Exists |
| `founders` | Founder records linked to ventures/users | Exists |
| `agreements` | NDA/MOU style agreement status | Exists |
| `dataRoomFiles` | Data room PDF uploads | Exists |
| `activityLogs` | Audit/activity records | Exists |
| `documents` | Document uploads and review status | Exists |
| `system-settings` | Global app/system settings | Exists |
| `user-settings` | Per-user notification settings | Exists |

It also has these Payload globals:

| Payload global | What it is for |
| --- | --- |
| `settings` | General site/app settings |
| `lookups` | Lookup values such as sectors and option lists |

Important: a collection existing does not mean it has data. Most of these are probably empty right now.

## What Prisma Currently Has

The Prisma schema lives here:

```text
miv/prisma/schema.prisma
```

It is configured for PostgreSQL through:

```text
DATABASE_URL
```

The Prisma schema contains many more models than `miv-backend` currently has.

| Prisma model | What it means |
| --- | --- |
| `User` | Old app users |
| `Account` | NextAuth provider accounts |
| `Session` | NextAuth sessions |
| `VerificationToken` | NextAuth/email verification tokens |
| `Venture` | Main venture/company records |
| `GEDSIMetric` | GEDSI metric records linked to ventures |
| `IRISMetricCatalog` | IRIS impact metric catalog |
| `Document` | Old document metadata |
| `Activity` | Old venture/user activity records |
| `CapitalActivity` | Grants, debt, equity, notes, other capital activity |
| `Notification` | User notifications |
| `EmailLog` | Email sending history |
| `Workflow` | Workflow definitions |
| `WorkflowRun` | Workflow execution history |
| `CustomDashboard` | Saved dashboard layouts/widgets |
| `Fund` | Fund management records |
| `LimitedPartner` | LP records |
| `CapitalCall` | Capital call records |
| `Distribution` | Distribution records |
| `FundInvestment` | Fund-to-venture investment records |
| `Project` | Team/project management records |
| `Task` | Project tasks |
| `Announcement` | Team announcements |
| `TeamEvent` | Calendar/team events |
| `FundWorkflow` | Fund operation workflows |
| `FundLifecyclePhase` | Fund lifecycle phases |
| `FundOperationTask` | Fund operation tasks |
| `Report` | Reports |

This means Prisma still represents the larger old system.

## Important: Schema Files Are Not The Same As Real Data

The Prisma folder contains:

```text
miv/prisma/schema.prisma
miv/prisma/migrations/
miv/prisma/seed.ts
miv/prisma/seed-test.ts
```

These files describe or create database structure/data.

They are not necessarily the actual current production/local data.

The actual Prisma data is in the database pointed to by `DATABASE_URL`.

The actual Payload data is in the MongoDB database pointed to by `DATABASE_URI`.

To know what data really exists, we must check live database row/document counts.

## What The Existing Audit Says

The existing audit file is:

```text
BACKEND_PRISMA_AUDIT.md
```

I rechecked the core claims. The audit is generally legitimate:

- It correctly identifies that `/backend/api/...` goes to `miv-backend`.
- It correctly identifies that many `/api/...` routes in `miv` still use Prisma.
- It correctly identifies that only a small part of the dashboard is connected to `miv-backend`.
- It correctly identifies that some features use mock/fallback/demo data.
- It correctly recommends making `miv-backend` the source of truth if Prisma is removed.

One caution: the audit should be treated as a planning reference, not a perfect live database report. It describes code usage, not the exact data currently sitting in each database.

## Current Frontend Data Situation

The frontend is mixed.

Important clarification:

```text
"Uses miv-backend" means the page calls /backend/api/...
It does not mean useful migrated data already exists there.
```

Right now, `miv-backend` has three default user accounts and any records you manually created through the Payload admin or frontend forms. So a page can be correctly connected to `miv-backend` and still show almost nothing.

### Uses miv-backend

These areas are already calling `/backend/api/...`:

| Page/area | Exact backend call | What you should expect right now |
| --- | --- | --- |
| `miv/app/user-dashboard/documents/page.tsx` | `/backend/api/documents` | Connected to Payload documents, but likely empty unless documents were uploaded into `miv-backend` |
| `miv/app/user-dashboard/profile/page.tsx` | `/backend/api/users` and `/backend/api/users/change-password` | Connected to Payload users, so it can show/update the logged-in Payload user |
| `miv/app/user-dashboard/layout.tsx` | `/backend/api/users` | Connected to Payload user identity/profile data |
| `miv/app/user-dashboard/components/user-sidebar.tsx` | `/backend/api/users` | Connected to Payload user identity/profile data |
| `miv/app/auth/register/page.tsx` | `/backend/api/auth/register` | Creates a new Payload user in `miv-backend` |
| `miv/app/dashboard/(operations)/impact-documents` | `/backend/api/documents` | Connected to Payload documents, but likely empty unless documents exist in `miv-backend` |

There are also tests that call backend routes like `/backend/api/auth/login`, `/backend/api/uploads/signed-url`, `/backend/api/ventures/:id/summary`, and `/backend/api/intake/submit`, but those are tests, not normal dashboard pages.

### Uses Prisma Through Local miv APIs

Many dashboard features still call local `/api/...` routes. Those routes live inside `miv/app/api` and often use Prisma.

Examples:

| Frontend call | Usually backed by |
| --- | --- |
| `/api/ventures` | Prisma `Venture` |
| `/api/gedsi-metrics` | Prisma `GEDSIMetric` |
| `/api/iris/metrics` | Prisma `IRISMetricCatalog` |
| `/api/documents` | Prisma `Document` |
| `/api/notifications` | Prisma `Notification` |
| `/api/workflows` | Prisma `Workflow` and `WorkflowRun` |
| `/api/team/projects` | Prisma `Project` |
| `/api/team/events` | Prisma `TeamEvent` |
| `/api/team/announcements` | Prisma `Announcement` |
| `/api/fund-management` | Prisma fund/capital models |
| `/api/custom-dashboards` | Prisma `CustomDashboard` |

### Uses Mock, Static, Fallback, Or Demo Data

Some pages are not fully real yet.

Examples found in the code:

| Area | Current behavior |
| --- | --- |
| GEDSI tracker | Falls back to `mockMetrics`, `mockVentures`, and `mockAiInsights` if API loading fails |
| Fund management | Loads mock funds, LPs, capital calls, distributions, tasks, reports, and documents if API loading fails |
| Exit strategy | Has an empty `mockExitStrategies` array and derives some data from ventures |
| AI analysis | Uses mock quick-analysis venture options and simulated behavior in places |
| Diagnostics | Uses static readiness data |
| Help/support | Uses local UI data/browser behavior instead of a backend ticket system |
| Some analytics/reporting | Uses derived, synthetic, or frontend-generated values |

This does not mean the whole app is fake. It means the app is uneven: some areas are real, some are half real, and some are demo-only.

## Why Prisma And miv-backend Are Separate

Most likely, the project started as:

```text
miv frontend + miv local API routes + Prisma + Postgres
```

Then someone started building a new backend:

```text
miv-backend + Payload CMS + MongoDB
```

That can be a reasonable direction, because Payload gives an admin panel, auth, collections, uploads, and a cleaner backend structure.

But the migration was not finished.

So now both apps act like backends:

```text
miv still owns many /api routes and Prisma data.
miv-backend owns the new Payload admin and some newer APIs.
```

This is the root confusion.

## Target End State

The clean target should be:

```text
miv/
  Frontend dashboard only
  No Prisma
  No direct database access
  Calls miv-backend for business data

miv-backend/
  The only backend
  Owns auth
  Owns database
  Owns uploads
  Owns business logic
  Owns API endpoints
```

In this target, `miv` may still have tiny proxy routes if needed, but it should not own business data or Prisma database logic.

## Main Migration Rule

Do not delete Prisma until this is true:

```text
Every feature that still needs old Prisma data has a replacement in miv-backend.
```

That means:

1. The target Payload collection exists.
2. The old data has been copied or intentionally retired.
3. The frontend calls `/backend/api/...` instead of local `/api/...`.
4. The page still works after Prisma is disconnected.

## Prisma To miv-backend Mapping

This is the main planning table.

| Prisma model | Target in miv-backend | Status |
| --- | --- | --- |
| `User` | Existing `users` collection | Exists, but role/password/auth migration needs care |
| `Account` | Usually do not migrate if moving fully to Payload auth | Decide |
| `Session` | Usually do not migrate if moving fully to Payload auth | Decide |
| `VerificationToken` | Usually do not migrate if moving fully to Payload auth | Decide |
| `Venture` | Existing `ventures` collection | Exists, but must be expanded |
| `GEDSIMetric` | New `gedsiMetrics` collection | Missing |
| `IRISMetricCatalog` | New `irisMetricCatalog` collection or backend static catalog | Missing |
| `Document` | Existing `documents` or `dataRoomFiles` | Exists, but field/file mapping needed |
| `Activity` | Existing `activityLogs` | Exists, but shape is different |
| `CapitalActivity` | New `capitalActivities` collection | Missing |
| `Notification` | New `notifications` collection | Missing |
| `EmailLog` | New `emailLogs` collection | Missing |
| `Workflow` | New `workflows` collection | Missing |
| `WorkflowRun` | New `workflowRuns` collection | Missing |
| `CustomDashboard` | New `customDashboards` collection | Missing |
| `Fund` | New `funds` collection | Missing |
| `LimitedPartner` | New `limitedPartners` collection | Missing |
| `CapitalCall` | New `capitalCalls` collection | Missing |
| `Distribution` | New `distributions` collection | Missing |
| `FundInvestment` | New `fundInvestments` collection | Missing |
| `Project` | New `projects` collection | Missing |
| `Task` | New `tasks` collection | Missing |
| `Announcement` | New `announcements` collection | Missing |
| `TeamEvent` | New `teamEvents` collection | Missing |
| `FundWorkflow` | New `fundWorkflows` collection | Missing |
| `FundLifecyclePhase` | New `fundLifecyclePhases` collection | Missing |
| `FundOperationTask` | New `fundOperationTasks` collection | Missing |
| `Report` | New `reports` collection | Missing |

## Data That Needs Extra Care

### Users and auth

This is sensitive because the old app uses NextAuth/Prisma concepts, while `miv-backend` uses Payload auth.

Old Prisma roles are uppercase:

```text
ADMIN
MANAGER
ANALYST
USER
VENTURE_MANAGER
GEDSI_ANALYST
CAPITAL_FACILITATOR
EXTERNAL_STAKEHOLDER
```

New Payload roles are:

```text
admin
miv_analyst
founder
```

These need a deliberate mapping. Do not guess silently during migration.

### Ventures

The Prisma `Venture` model is much larger than the current Payload `ventures` collection.

Payload currently has basic fields like:

```text
name
country
city
sector
website
description
founders
triageTrack
triageRationale
```

Prisma has many more fields, including:

```text
contactEmail
contactPhone
pitchSummary
inclusionFocus
founderTypes
teamSize
foundingYear
revenue
fundingRaised
lastValuation
stgGoals
financials
documentsMetadata
operationalReadiness
capitalReadiness
gedsiGoals
washingtonShortSet
disabilityInclusion
aiAnalysis
gedsiScore
socialImpactScore
status
stage
intakeDate
screeningDate
dueDiligenceStart
dueDiligenceEnd
investmentReadyAt
fundedAt
nextReviewAt
```

So the Payload `ventures` collection must be expanded before a real migration.

### Documents

Prisma documents are mostly metadata:

```text
name
type
url
size
mimeType
ventureId
uploadedAt
```

Payload documents are upload-backed records with fields like:

```text
documentType
status
version
uploadedBy
venture
notes
reviewedBy
reviewedAt
```

So migration must decide:

1. Are old file URLs still valid?
2. Should files be copied into `miv-backend/uploads`?
3. Should old documents become `documents` or `dataRoomFiles`?
4. What status should old documents get?

### Activities

Prisma activity records use:

```text
type
title
description
metadata
ventureId
userId
createdAt
```

Payload activity logs use:

```text
actor
action
entity
entityId
metadata
timestamp
```

This is not a direct copy. It needs a small transform.

### Migration history drift

The Prisma migration SQL mentions some tables that are not in the current Prisma schema, including:

```text
capital_call_responses
distribution_payments
fund_transactions
venture_metrics
venture_metric_reports
```

That means the migration history and the current schema may not perfectly match.

Before moving data, check the actual live database tables and row counts.

## Recommended Migration Phases

### Phase 0: Freeze the direction

Decision:

```text
miv-backend is the future source of truth.
miv should stop adding new Prisma-backed APIs.
```

Until this is agreed, the project will keep getting more confusing.

### Phase 1: Inventory the live data

Goal: know what data actually exists.

Check row counts in the old Prisma database for every table.

Also check document/file storage:

```text
Where are old document files stored?
Are the URLs still reachable?
Are the files local or remote?
```

Output of this phase should be a table like:

| Old table | Row count | Migrate? | Notes |
| --- | ---: | --- | --- |
| `users` | unknown | yes | Needs role mapping |
| `ventures` | unknown | yes | Core data |
| `gedsi_metrics` | unknown | yes | Needed by GEDSI dashboards |
| `funds` | unknown | maybe | Depends if fund management remains |

### Phase 2: Decide what survives

Not every old table must move.

Use three choices:

```text
Migrate = move into Payload/MongoDB
Archive = export to CSV/JSON but do not build UI around it
Drop = intentionally discard because it is obsolete/demo/test data
```

Do this before writing migration code.

### Phase 3: Build missing Payload collections

Add or expand collections in `miv-backend`.

Start with core models:

1. `users`
2. `ventures`
3. `founders`
4. `documents`
5. `activityLogs`
6. `gedsiMetrics`
7. `irisMetricCatalog`

Then add operational models:

1. `notifications`
2. `emailLogs`
3. `projects`
4. `tasks`
5. `teamEvents`
6. `announcements`
7. `workflows`
8. `workflowRuns`

Then add capital/fund models:

1. `capitalActivities`
2. `funds`
3. `limitedPartners`
4. `capitalCalls`
5. `distributions`
6. `fundInvestments`
7. `fundWorkflows`
8. `fundLifecyclePhases`
9. `fundOperationTasks`
10. `reports`
11. `customDashboards`

### Phase 4: Add backend API endpoints

The frontend currently expects routes like:

```text
/api/ventures
/api/gedsi-metrics
/api/iris/metrics
/api/documents
/api/notifications
/api/workflows
/api/team/projects
/api/team/events
/api/fund-management
```

If `miv-backend` becomes the real backend, it needs equivalent routes under:

```text
/backend/api/...
```

The safest approach is to make `miv-backend` return the same response shapes the frontend already expects. Then the frontend migration is mostly changing URLs from `/api/...` to `/backend/api/...`.

### Phase 5: Write the migration script

The migration script should:

1. Connect to the old Prisma/Postgres database.
2. Connect to the new Payload/MongoDB backend.
3. Read old records.
4. Transform fields and enum values.
5. Create new Payload records.
6. Store old IDs in a field like `legacyPrismaId`.
7. Keep an ID map so relationships still work.

Example:

```text
Old Prisma venture id: clxyz123
New Payload venture id: 66f...

Store:
legacyPrismaId = clxyz123
```

That makes debugging much easier.

### Phase 6: Migrate data in dependency order

Recommended order:

1. Users
2. Ventures
3. Founders/intakes
4. Documents/files
5. Activity logs
6. GEDSI metrics
7. IRIS catalog
8. Notifications and email logs
9. Projects, tasks, events, announcements
10. Workflows and workflow runs
11. Funds, LPs, capital calls, distributions, investments
12. Reports and custom dashboards

This order matters because many records point to users or ventures.

### Phase 7: Validate the migration

For each migrated model, check:

```text
Old count == new count
Important fields are present
Relationships still work
Documents still open/download
Users can log in
Founder access is scoped correctly
Admin/analyst access works
Dashboard pages still load
```

Do not delete Prisma until validation passes.

### Phase 8: Switch the frontend

Change dashboard data calls from local APIs:

```ts
fetch("/api/ventures")
```

to backend APIs:

```ts
fetch("/backend/api/ventures", { credentials: "include" })
```

Do this feature by feature.

Suggested order:

1. Documents, because `miv-backend` already has a document pattern.
2. Users/profile/auth, because everything depends on identity.
3. Ventures, because most dashboard pages depend on ventures.
4. GEDSI and IRIS.
5. Notifications/team/calendar.
6. Workflows.
7. Fund/capital management.
8. Reports/analytics/AI/custom dashboards.

### Phase 9: Remove mock/fallback data

After a feature is fully backed by `miv-backend`, remove demo fallbacks for that feature.

Examples:

```text
mockMetrics
mockVentures
mockAiInsights
mock fund management data
static diagnostics readiness data
mock exit strategies
setTimeout AI simulation
localStorage support requests
random analytics/fallback values
```

Frontend state is fine for filters, tabs, sorting, and temporary UI state. It should not be the source of real business records.

### Phase 10: Delete Prisma

Only do this at the end.

Delete Prisma when:

1. No active frontend page needs a Prisma-backed local API route.
2. All needed old data is in `miv-backend`.
3. `rg "prisma|@prisma/client|@/lib/prisma" miv` shows no required active usage.
4. Tests pass without Prisma.
5. The old database has been backed up/exported.

Then remove:

```text
miv/prisma/
miv/lib/prisma.ts
Prisma-backed routes under miv/app/api
Prisma seed scripts
Prisma test setup
```

Also remove from `miv/package.json`:

```text
@prisma/client
prisma
@next-auth/prisma-adapter
db:generate
db:push
db:migrate
db:studio
db:seed
db:seed:test
```

Only remove `next-auth` itself if the app has fully moved to Payload auth and no code still depends on NextAuth.

## Simple Mental Model

Think of the project like this:

```text
Prisma is the old filing cabinet.
miv-backend is the new filing cabinet.
The labels for the new cabinet exist, but most drawers are empty.
Some pages still open the old cabinet.
Some pages open the new cabinet.
Some pages use paper examples taped to the wall.
```

The migration job is:

```text
1. Decide which old drawers matter.
2. Create matching drawers in the new cabinet.
3. Copy the real files carefully.
4. Teach every page to use the new cabinet.
5. Remove the old cabinet only after nothing needs it.
```

## Immediate Next Steps

1. Do not delete Prisma yet.
2. Get live row counts from the Prisma database.
3. Get live document counts from the Payload/MongoDB database.
4. Decide which Prisma models are required for the final product.
5. Expand `miv-backend` collections for required missing models.
6. Start with users, ventures, documents, GEDSI metrics, and IRIS catalog.
7. Migrate one feature at a time, not the whole app in one risky jump.

## Final Recommendation

The clean future is:

```text
miv = frontend
miv-backend = backend and database owner
Prisma = removed after migration is complete
```

But the current project is not there yet.

Right now, Prisma is still important because it supports many active dashboard routes. `miv-backend` is the right destination, but it needs more collections, more endpoints, real migrated data, and frontend rewiring before Prisma can be safely deleted.
