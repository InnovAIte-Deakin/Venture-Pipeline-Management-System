# Dashboard Backend and Prisma Usage Audit

Date: 2026-09-11

## Purpose

This document records the current integration state of the `miv/app/dashboard` folder:

- Which dashboard features call `miv-backend`.
- Which dashboard features use the `miv` app's local Prisma-backed API routes.
- Which dashboard features are only partially connected or still use local/mock/demo data.
- What Prisma is currently used for.
- What needs to change if the project should become fully connected to `miv-backend` and remove Prisma from `miv`.

## Important Architecture Distinction

The repository currently has two backend paths:

1. `miv-backend`
   - Separate Payload/Next backend app.
   - Runs separately, default target appears to be `http://localhost:3001`.
   - Accessed from `miv` through `/backend/:path*`.
   - The rewrite is defined in `miv/next.config.ts`.

2. `miv` local API routes
   - Routes under `miv/app/api`.
   - Public URLs look like `/api/ventures`, `/api/users`, `/api/gedsi-metrics`, etc.
   - Most of these routes import `@/lib/prisma`.
   - These use `miv/prisma/schema.prisma` and the Prisma Client.

This means `/backend/api/...` is connected to `miv-backend`, while `/api/...` is not. `/api/...` is handled inside the frontend app itself.

## Current Use of `miv-backend`

Direct `miv-backend` usage inside `miv/app/dashboard` is limited.

| Dashboard feature | Current status | Evidence | Notes |
| --- | --- | --- | --- |
| Operations / Impact Documents | Connected to `miv-backend` | Calls `/backend/api/documents` from `app/dashboard/(operations)/impact-documents/lib/impact-documents.ts` | This is the clearest dashboard feature using `miv-backend`. It supports list, status update, delete, and download. |

Related non-dashboard areas also use `miv-backend`:

| Area | Current status | Evidence | Notes |
| --- | --- | --- | --- |
| User Dashboard / Documents | Connected to `miv-backend` | Calls `/backend/api/documents` | Founder/user document upload and document management path. |
| User Dashboard / Profile | Connected to `miv-backend` | Calls `/backend/api/users` and `/backend/api/users/change-password` | Founder profile/password flow. |
| Auth/Register/Login flows | Mixed | Some calls go through `/backend/api/...`; `useAuth` currently checks local `/api/users/me` | Auth is not unified. |

## Current Use of Prisma

Prisma is the database ORM used by the `miv` Next app. It provides TypeScript database access for the local API routes in `miv/app/api`.

Key files:

| File/folder | Purpose |
| --- | --- |
| `miv/prisma/schema.prisma` | Defines the database schema for `miv`, using PostgreSQL through `DATABASE_URL`. |
| `miv/lib/prisma.ts` | Creates and exports the shared Prisma Client instance. |
| `miv/prisma/migrations` | Migration history for the Prisma database. |
| `miv/prisma/seed.ts` | Development seed data. |
| `miv/prisma/seed-test.ts` | Test seed data. |
| `miv/prisma/dev.db` | Looks like an old/local SQLite artifact, but the current Prisma schema is configured for PostgreSQL. |

Major Prisma models currently used by dashboard APIs:

- `User`
- `Venture`
- `GEDSIMetric`
- `Document`
- `Activity`
- `CapitalActivity`
- `IRISMetricCatalog`
- `Notification`
- `EmailLog`
- `Workflow`
- `WorkflowRun`
- `CustomDashboard`
- `Fund`
- `LimitedPartner`
- `CapitalCall`
- `Distribution`
- `FundInvestment`
- `Project`
- `Task`
- `Announcement`
- `TeamEvent`
- `FundWorkflow`
- `FundLifecyclePhase`
- `FundOperationTask`
- `Report`

## Feature-by-Feature Dashboard State

### Main Dashboard

Path: `miv/app/dashboard/page.tsx`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Indirectly connected through local `/api` routes |
| Mock/local data | Partial local state |

Current behavior:

- Fetches local `/api/ventures?limit=100`.
- Fetches local `/api/gedsi-metrics?limit=200`.
- Fetches local `/api/iris/metrics?limit=100`.
- Fetches local `/api/users?limit=100`.
- Stores dashboard filters in `localStorage`.
- Shows a message about sample data if dashboard data loading fails.

To migrate:

- Add equivalent endpoints in `miv-backend` for ventures, GEDSI metrics, IRIS metrics, and users.
- Replace local `/api/...` calls with `/backend/api/...` calls.
- Remove any sample-data fallback after backend endpoints are reliable.

### Pipeline Management / Ventures

Paths:

- `miv/app/dashboard/(pipeline-management)/ventures/page.tsx`
- `miv/app/dashboard/(pipeline-management)/ventures/[id]/page.tsx`
- `miv/app/dashboard/(pipeline-management)/ventures/lib/ventures.ts`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` and `/api/ventures/:id` |
| Mock/local data | Mostly real local API data |

Current behavior:

- Lists ventures from local `/api/ventures?limit=100`.
- Venture detail loads from local `/api/ventures/:id`.
- The backing routes use Prisma `venture`, `gedsiMetrics`, `documents`, `activities`, and related models.

To migrate:

- Implement matching venture list/detail/update/delete endpoints in `miv-backend`.
- Align response shape with the frontend's expected `ventures`, `pagination`, and detail object fields.
- Move Prisma-side relation includes into `miv-backend` collection/API logic.

### Pipeline Management / Venture Intake

Path: `miv/app/dashboard/(pipeline-management)/venture-intake`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` and `/api/ai/analyze-venture` |
| Mock/local data | Partial, because AI analysis has fallback logic |

Current behavior:

- Submits a venture to local `/api/ventures`.
- Triggers local `/api/ai/analyze-venture`.
- The AI route reads/writes the Prisma `Venture` table and stores `aiAnalysis`.

To migrate:

- Add an intake submission endpoint in `miv-backend`.
- Add an AI analysis endpoint in `miv-backend`, or make `miv-backend` own the AI workflow.
- Update the form to post to `/backend/api/...`.
- Decide whether AI analysis should require authentication; current local route uses NextAuth session checks.

### Pipeline Management / Deal Flow

Path: `miv/app/dashboard/(pipeline-management)/deal-flow`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` |
| Mock/local data | Partial |

Current behavior:

- Fetches ventures from local `/api/ventures?limit=100`.
- Maps ventures into deal-flow UI data.
- Some values are inferred or fallback-generated.
- README notes unused mock deal data and random fallback behavior.

To migrate:

- Expose a real deal-flow endpoint from `miv-backend`, or expose richer venture data that avoids frontend inference.
- Replace random fallback values with persisted backend fields.
- Add backend mutations for deal stage changes, assignments, notes, and pipeline actions if those UI actions are expected to persist.

### Pipeline Management / Portfolio

Path: `miv/app/dashboard/(pipeline-management)/portfolio`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` |
| Mock/local data | Partial derived UI data |

Current behavior:

- Fetches ventures from local `/api/ventures?limit=100`.
- Maps ventures into portfolio display models.
- Calculates GEDSI/impact/readiness indicators in frontend helpers.

To migrate:

- Add portfolio endpoint in `miv-backend`.
- Return normalized portfolio records and aggregate metrics from backend.
- Move business-critical calculations out of the frontend.

### Pipeline Management / Due Diligence

Path: `miv/app/dashboard/(pipeline-management)/due-diligence`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` |
| Mock/local data | Partial/demo-only actions |

Current behavior:

- Fetches ventures from local `/api/ventures?limit=100`.
- Maps venture data into due-diligence items.
- Some checklist/edit/create/report/document actions are demo-only or not persisted.

To migrate:

- Add due-diligence models/collections in `miv-backend`.
- Add endpoints for checklist items, assignments, evidence documents, comments, status changes, and generated reports.
- Replace frontend-generated due-diligence state with backend records.

### Pipeline Management / Diagnostics

Path: `miv/app/dashboard/(pipeline-management)/diagnostics`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Not connected |
| Mock/local data | Fully local/static |

Current behavior:

- Uses static `initialReadinessItems` from `data/readiness-data.ts`.
- No API call.

To migrate:

- Add readiness/diagnostics endpoint in `miv-backend`.
- Store readiness items per venture or per intake.
- Replace static `initialReadinessItems` with backend data.

### Analytics Insights / Performance Analytics

Path: `miv/app/dashboard/(analytics-insights)/performance-analytics`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures`, `/api/gedsi-metrics`, `/api/users`, `/api/analytics` |
| Mock/local data | Partial synthetic analytics |

Current behavior:

- Reads ventures, GEDSI metrics, users, and analytics from local API routes.
- `/api/analytics` uses Prisma counts and activity data.
- Some trend values are generated with random numbers.

To migrate:

- Add analytics summary endpoint in `miv-backend`.
- Backend should return real time-series data instead of random frontend/API-generated values.
- Replace `/api/analytics` with `/backend/api/analytics`.

### Analytics Insights / Advanced Reports

Path: `miv/app/dashboard/(analytics-insights)/advanced-reports`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Partially connected through local `/api` reads |
| Mock/local data | Partial/local-only report generation |

Current behavior:

- Fetches local `/api/ventures`, `/api/gedsi-metrics`, `/api/users`, `/api/analytics`, and `/api/workflows`.
- Seeds reports and dashboards client-side.
- Generated reports, schedules, dashboard-builder changes, and exports are not persisted as real backend records.
- README notes API shape mismatches for analytics/workflows.

To migrate:

- Add report models/endpoints in `miv-backend`.
- Persist generated reports, schedules, report filters, dashboard layouts, and exports.
- Fix API response contracts during migration instead of preserving local mismatches.

### Analytics Insights / AI Analysis

Path: `miv/app/dashboard/(analytics-insights)/ai-analysis`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Partially connected through local `/api/ventures` |
| Mock/local data | Partial |

Current behavior:

- Fetches ventures from local `/api/ventures?limit=50`.
- Builds analysis records from venture data.
- Starting a new analysis is simulated using `setTimeout`.
- The selected venture list comes from `mock-data/ventures.mock-data.ts`.

To migrate:

- Add real AI analysis jobs/results to `miv-backend`.
- Replace `setTimeout` simulation with a backend job or synchronous analysis endpoint.
- Replace quick-analysis mock venture options with backend ventures.

### Analytics Insights / Custom Dashboards

Path: `miv/app/dashboard/(analytics-insights)/custom-dashboards`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/custom-dashboards` and `/api/ventures` |
| Mock/local data | Partial |

Current behavior:

- CRUD uses local `/api/custom-dashboards`, backed by Prisma `CustomDashboard`.
- Fetches portfolio data from local `/api/ventures`.
- A `mockDashboards` array still exists but the page falls back to an empty array rather than using it.
- Widget internals still contain TODO/local behavior.

To migrate:

- Add `custom-dashboards` collection/endpoints in `miv-backend`.
- Store full widget layout/configuration in backend.
- Remove hardcoded fallback user ID and rely on backend auth/session identity.

### Capital Management / Fund Management

Path: `miv/app/dashboard/(capital-management)/fund-management`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Partially connected through local `/api/fund-management` |
| Mock/local data | Partial fallback |

Current behavior:

- Calls local `/api/fund-management?includeCapitalActivities=true&includeLPs=true`.
- API reads ventures, capital activities, reports, limited partners, fund workflows, lifecycle phases, and tasks through Prisma.
- Some returned fund/capital-call/distribution data is generated from venture capital activities.
- If API loading fails, the hook loads mock fund-management data.

To migrate:

- Implement fund-management entities in `miv-backend`.
- Use real backend records for funds, LPs, capital calls, distributions, fund tasks, and reports.
- Remove frontend mock fallback after backend coverage is complete.

### Capital Management / Capital Facilitation

Path: `miv/app/dashboard/(capital-management)/capital-facilitation`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` |
| Mock/local data | Partial derived data |

Current behavior:

- Fetches ventures from local `/api/ventures?limit=100`.
- Builds capital facilitation views from venture data.

To migrate:

- Add capital requests/investor network endpoints in `miv-backend`.
- Persist capital facilitation workflows rather than deriving everything from ventures.

### Capital Management / Investment Rounds

Path: `miv/app/dashboard/(capital-management)/investment-rounds`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` |
| Mock/local data | Partial |

Current behavior:

- Fetches ventures from local `/api/ventures?limit=100`.
- Transforms venture data into investment-round UI records.
- README notes unused mock investment rounds and synthetic/random fallback values.

To migrate:

- Add investment round records to `miv-backend`.
- Persist round type, target raise, committed amount, investors, status, close dates, and documents.
- Stop generating round data from venture fallback logic.

### Capital Management / Exit Strategy

Path: `miv/app/dashboard/(capital-management)/exit-strategy/page.tsx`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Partially connected through local `/api/ventures` |
| Mock/local data | Partial/mostly placeholder for exit records |

Current behavior:

- Fetches ventures from local `/api/ventures?limit=100`.
- `mockExitStrategies` is an empty array.
- Exit-specific records are not clearly persisted.

To migrate:

- Add exit strategy records/endpoints in `miv-backend`.
- Store exit type, target acquirers, readiness, valuation targets, timeline, risks, and documents.

### Impact GEDSI / GEDSI Tracker

Path: `miv/app/dashboard/(impact-gedsi)/gedsi-tracker`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures`, `/api/gedsi-metrics`, `/api/ai/gedsi-insights` |
| Mock/local data | Partial fallback |

Current behavior:

- Loads ventures, GEDSI metrics, and AI insights from local APIs.
- Falls back to `mockMetrics`, `mockVentures`, and `mockAiInsights` if loading fails.
- Can create and delete GEDSI metrics through local `/api/gedsi-metrics`.

To migrate:

- Move GEDSI metric CRUD to `miv-backend`.
- Move GEDSI insight generation to `miv-backend`.
- Remove mock fallback once backend behavior is complete.

### Impact GEDSI / Impact Reports

Path: `miv/app/dashboard/(impact-gedsi)/impact-reports`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` and `/api/gedsi-metrics` |
| Mock/local data | Partial derived reports |

Current behavior:

- Reads local venture and GEDSI metric data.
- Produces impact report views from fetched data.

To migrate:

- Add impact report generation/storage endpoints in `miv-backend`.
- Persist report history and generated files.

### Impact GEDSI / IRIS Metrics

Path: `miv/app/dashboard/(impact-gedsi)/iris-metrics`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/iris/metrics` |
| Mock/local data | Uses local catalog JSON as seed/source data |

Current behavior:

- Reads IRIS metric catalog through local API.
- Local API uses Prisma `IRISMetricCatalog`.
- Local API can seed from `app/api/(impact-gedsi)/iris/data/iris-catalog.json`.

To migrate:

- Add IRIS metric catalog collection or endpoint in `miv-backend`.
- Decide whether catalog data should live in the backend database or remain as static backend-managed JSON.

### Impact GEDSI / Social Impact

Path: `miv/app/dashboard/(impact-gedsi)/social-impact`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` |
| Mock/local data | Partial derived analytics |

Current behavior:

- Reads ventures from local `/api/ventures?limit=100`.
- Calculates social impact display data in frontend feature helpers.

To migrate:

- Add backend social-impact summary endpoint.
- Persist or calculate impact metrics in `miv-backend`.

### Impact GEDSI / Sustainability

Path: `miv/app/dashboard/(impact-gedsi)/sustainability`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/ventures` |
| Mock/local data | Partial derived analytics |

Current behavior:

- Reads ventures from local `/api/ventures?limit=100`.
- Derives sustainability charts/metrics from venture data.

To migrate:

- Add sustainability metrics endpoint in `miv-backend`.
- Persist sustainability metrics if they are business records, not just computed views.

### Operations / Documents

Path: `miv/app/dashboard/(operations)/documents`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/documents`, `/api/documents/upload`, `/api/documents/:id`, `/api/documents/analytics`, `/api/ventures` |
| Mock/local data | Mostly real local API |

Current behavior:

- Lists, uploads, deletes, and analyzes documents through local Prisma-backed routes.
- This is separate from Impact Documents, which uses `miv-backend`.

To migrate:

- Choose one document system.
- Prefer moving all dashboard document management to `miv-backend` if it remains the source of truth.
- Align document type/status fields between Prisma and Payload collections.

### Operations / Impact Documents

Path: `miv/app/dashboard/(operations)/impact-documents`

| Integration | Status |
| --- | --- |
| `miv-backend` | Connected |
| Prisma | Not directly connected in dashboard feature |
| Mock/local data | No obvious mock fallback |

Current behavior:

- Calls `/backend/api/documents`.
- Supports list, status update, delete, and download against `miv-backend`.

To migrate:

- Keep this feature on `miv-backend`.
- Use it as the pattern for moving other document features.

### Operations / Calendar

Path: `miv/app/dashboard/(operations)/calendar`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/calendar/events` and `/api/calendar/analytics` |
| Mock/local data | Mostly real local API |

Current behavior:

- Uses local APIs backed by Prisma `TeamEvent` and related activity/user data.

To migrate:

- Add calendar/event endpoints in `miv-backend`.
- Move event analytics into backend.

### Operations / Notifications

Path: `miv/app/dashboard/(operations)/notifications`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/notifications` |
| Mock/local data | Mostly real local API |

Current behavior:

- Lists and updates notifications through local Prisma-backed API.

To migrate:

- Add notification endpoints in `miv-backend`.
- Unify notification types with backend collection schema.

### Operations / Team Management

Path: `miv/app/dashboard/(operations)/team-management`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/team/members`, `/api/team/projects`, `/api/team/events`, `/api/team/announcements` |
| Mock/local data | Mostly real local API |

Current behavior:

- Team member CRUD uses local `User` model.
- Projects use local `Project`.
- Events use local `TeamEvent`.
- Announcements use local `Announcement`.

To migrate:

- Add equivalent collections/endpoints in `miv-backend`.
- Decide whether team members are Payload users or a separate staff/team collection.
- Replace local team API helper paths with `/backend/api/...`.

### Operations / Workflows

Path: `miv/app/dashboard/(operations)/workflows`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Connected through local `/api/workflows`, `/api/workflows/:id`, `/api/workflows/run`, `/api/workflows/:id/runs` |
| Mock/local data | Partial |

Current behavior:

- Workflow list, builder, monitor, and wizard use local Prisma-backed APIs.
- Several predefined workflow template steps are not implemented by the runner.

To migrate:

- Add workflow and workflow-run collections/endpoints in `miv-backend`.
- Move workflow execution logic into `miv-backend`.
- Implement all template step types or remove unsupported templates.

### Operations / System Settings

Path: `miv/app/dashboard/(operations)/system-settings`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Partially connected through local `/api/users/me` |
| Mock/local data | Partial/local UI state |

Current behavior:

- User profile loads/saves through local `/api/users/me`.
- Password change is simulated/local validation only.
- Notification, accessibility, appearance, and data settings mostly use local state.

To migrate:

- Add user settings/profile endpoints in `miv-backend`.
- Move password change to `miv-backend`.
- Persist notification, accessibility, appearance, and data settings in backend.

### Operations / Help Support

Path: `miv/app/dashboard/(operations)/help-support`

| Integration | Status |
| --- | --- |
| `miv-backend` | Not connected |
| Prisma | Not connected |
| Mock/local data | Fully local |

Current behavior:

- Contact form stores recent support requests in browser `localStorage`.
- Opens a `mailto:support@miv.org` URL.
- No backend ticket is created.

To migrate:

- Add support ticket/contact endpoint in `miv-backend`.
- Persist ticket records and optionally send email from backend.
- Replace `localStorage` as the source of truth.

## Summary Categories

### Connected to `miv-backend`

- Operations / Impact Documents

### Connected to local Prisma-backed APIs, not `miv-backend`

- Main Dashboard
- Pipeline / Ventures
- Pipeline / Venture Intake
- Pipeline / Deal Flow
- Pipeline / Portfolio
- Pipeline / Due Diligence
- Analytics / Performance Analytics
- Analytics / Custom Dashboards
- Capital / Capital Facilitation
- Capital / Investment Rounds
- Impact GEDSI / Impact Reports
- Impact GEDSI / IRIS Metrics
- Impact GEDSI / Social Impact
- Impact GEDSI / Sustainability
- Operations / Documents
- Operations / Calendar
- Operations / Notifications
- Operations / Team Management
- Operations / Workflows

### Partially connected / mixed real data plus mock, synthetic, or local-only behavior

- Main Dashboard
- Venture Intake
- Deal Flow
- Portfolio
- Due Diligence
- Performance Analytics
- Advanced Reports
- AI Analysis
- Custom Dashboards
- Fund Management
- Capital Facilitation
- Investment Rounds
- Exit Strategy
- GEDSI Tracker
- Impact Reports
- Social Impact
- Sustainability
- System Settings

### Fully local/static/mock from the dashboard folder

- Pipeline / Diagnostics
- Operations / Help Support

## Is the Current Separation Optimized?

The current separation is not optimized because both apps act like backends.

The issue is not simply that there are two folders. A separate frontend and backend can be a good architecture. The problem is that the current code has two sources of truth:

- `miv` has its own Prisma database schema and many API routes.
- `miv-backend` has its own Payload collections and API routes.
- Some concepts exist in both places, including users, ventures, documents, and activity logs.
- Auth is mixed between NextAuth, `payload-token`, local `/api/users/me`, and `/backend/api/users`.
- Some dashboard features read real database data but still use generated or mock values for missing business records.

This makes the system harder to reason about, test, deploy, and secure.

## Recommended Target Architecture

If the goal is to remove Prisma completely, the clean target should be:

```text
miv
  Next.js frontend only
  No Prisma
  No database-owning API routes
  Calls /backend/api/... for all business data

miv-backend
  Source of truth
  Owns database
  Owns auth/session
  Owns uploads/documents
  Owns business logic
  Owns report, workflow, notification, and analytics APIs
```

In that architecture, `miv/app/api` should either disappear or only contain very thin proxy/session helpers that do not access a database.

## Migration Plan to Fully Use `miv-backend` and Remove Prisma

### Phase 1: Define ownership

Decide that `miv-backend` owns:

- Auth and sessions
- Users and roles
- Ventures
- Founders/intake forms
- GEDSI metrics
- IRIS catalog
- Documents/uploads/data room files
- Activities/audit logs
- Notifications
- Workflows and workflow runs
- Calendar/team events
- Team members/projects/announcements
- Funds, LPs, capital calls, distributions, investments
- Reports and dashboards
- System/user settings
- Analytics summaries

After this decision, no new Prisma-backed API should be added to `miv`.

### Phase 2: Map Prisma models to Payload collections

Create or extend `miv-backend` collections for every Prisma model currently used by dashboard features.

Suggested mapping:

| Prisma model in `miv` | Target in `miv-backend` |
| --- | --- |
| `User` | Existing or expanded `users` collection |
| `Venture` | Existing or expanded `ventures` collection |
| `GEDSIMetric` | New/expanded `gedsiMetrics` collection |
| `Document` | Existing/expanded `documents` or `dataRoomFiles` collection |
| `Activity` | Existing/expanded `activityLogs` collection |
| `CapitalActivity` | New `capitalActivities` collection |
| `IRISMetricCatalog` | New `irisMetricCatalog` collection or backend-managed static catalog |
| `Notification` | New `notifications` collection |
| `EmailLog` | New `emailLogs` collection |
| `Workflow` | New `workflows` collection |
| `WorkflowRun` | New `workflowRuns` collection |
| `CustomDashboard` | New `customDashboards` collection |
| `Fund` | New `funds` collection |
| `LimitedPartner` | New `limitedPartners` collection |
| `CapitalCall` | New `capitalCalls` collection |
| `Distribution` | New `distributions` collection |
| `FundInvestment` | New `fundInvestments` collection |
| `Project` | New `projects` collection |
| `Task` | New `tasks` collection |
| `Announcement` | New `announcements` collection |
| `TeamEvent` | New `teamEvents` collection |
| `FundWorkflow` | New `fundWorkflows` collection |
| `FundLifecyclePhase` | New `fundLifecyclePhases` collection |
| `FundOperationTask` | New `fundOperationTasks` collection |
| `Report` | New `reports` collection |

### Phase 3: Stabilize API contracts

Before changing frontend code, document the response shapes that the dashboard expects.

Minimum endpoints needed in `miv-backend`:

| Endpoint | Needed by |
| --- | --- |
| `GET /api/ventures` | Main dashboard, ventures, deal flow, portfolio, due diligence, capital, impact, analytics |
| `POST /api/ventures` | Venture intake |
| `GET /api/ventures/:id` | Venture detail |
| `PATCH /api/ventures/:id` | Venture edit/stage updates |
| `DELETE /api/ventures/:id` | Venture deletion |
| `GET /api/gedsi-metrics` | Main dashboard, GEDSI tracker, reports, analytics |
| `POST /api/gedsi-metrics` | GEDSI tracker |
| `PATCH /api/gedsi-metrics/:id` | GEDSI tracker |
| `DELETE /api/gedsi-metrics/:id` | GEDSI tracker |
| `GET /api/iris/metrics` | IRIS metrics, GEDSI metric forms |
| `GET /api/users` | Main dashboard, reports, workflows, team management |
| `GET /api/users/me` | Auth, system settings, dashboard identity |
| `PUT /api/users/me` | Profile/settings |
| `POST /api/users/change-password` | System settings/profile |
| `GET/POST/PATCH/DELETE /api/documents` | Documents and impact documents |
| `GET /api/documents/analytics` | Documents dashboard |
| `GET/POST/PATCH/DELETE /api/custom-dashboards` | Custom dashboards |
| `GET /api/analytics` | Main dashboard, performance analytics, reports |
| `GET/POST/PATCH/DELETE /api/workflows` | Workflows |
| `POST /api/workflows/run` | Workflow execution |
| `GET /api/workflows/:id/runs` | Workflow monitor |
| `GET/POST/PATCH/DELETE /api/notifications` | Notifications |
| `GET/POST/PATCH/DELETE /api/team/members` | Team management |
| `GET/POST/PATCH/DELETE /api/team/projects` | Team management |
| `GET/POST/PATCH/DELETE /api/team/events` | Team management/calendar |
| `GET/POST/PATCH/DELETE /api/team/announcements` | Team management |
| `GET /api/calendar/analytics` | Calendar |
| `GET /api/fund-management` | Fund management |
| `GET/POST/PATCH/DELETE /api/support-tickets` | Help support |
| `GET/PUT /api/system-settings` | System settings |
| `POST /api/ai/analyze-venture` | Venture intake and AI analysis |
| `GET /api/ai/gedsi-insights` | GEDSI tracker |

### Phase 4: Convert frontend API calls

Replace local API calls in `miv/app/dashboard`:

```ts
fetch("/api/ventures")
```

with backend calls:

```ts
fetch("/backend/api/ventures", { credentials: "include" })
```

Recommended approach:

1. Create a single frontend API client, for example `miv/lib/backend-client.ts`.
2. Centralize base URL, credentials, JSON parsing, and error handling.
3. Migrate one feature at a time.
4. Keep old local API routes only temporarily while migrating.

### Phase 5: Remove local mock and synthetic behavior

Remove or replace:

- `localStorage` as source-of-truth for support tickets, dashboard/report state, or settings.
- `mockMetrics`, `mockVentures`, `mockAiInsights`.
- Fund-management mock fallback data.
- Static diagnostics readiness items.
- Empty/mock exit strategies.
- `setTimeout`-based AI analysis.
- Random fallback values for analytics, deal sizes, scores, ownership, expected close dates, and generated financial fields.

Keep frontend-only state only for UI preferences that do not need backend persistence, such as temporary filter selections.

### Phase 6: Move business logic to `miv-backend`

Move these responsibilities out of the frontend:

- Dashboard aggregation.
- GEDSI score calculations.
- Social impact calculations.
- Fund and capital calculations.
- Report generation.
- Workflow execution.
- AI analysis.
- Email sending/logging.
- Document review status transitions.
- Permission checks.

Frontend should display returned data and submit user actions. It should not be the source of business truth.

### Phase 7: Remove Prisma from `miv`

Only do this after all features no longer depend on local `/api` database routes.

Checklist:

1. Search for Prisma usage:

   ```bash
   rg "prisma|@prisma/client|@/lib/prisma" miv
   ```

2. Delete or archive local database-owning routes under `miv/app/api`.
3. Delete `miv/lib/prisma.ts`.
4. Delete `miv/prisma`.
5. Remove Prisma scripts from `miv/package.json`:
   - `db:generate`
   - `db:push`
   - `db:migrate`
   - `db:studio`
   - `db:seed`
   - `db:seed:test`
   - `db:seed:calculations`
6. Remove dependencies from `miv/package.json`:
   - `@prisma/client`
   - `prisma`
   - `@next-auth/prisma-adapter`, if NextAuth is no longer using Prisma
7. Remove or replace tests that seed/query Prisma directly.
8. Update docs and environment variables.
9. Run full typecheck, lint, and integration tests.

### Phase 8: Unify authentication

The migration should also simplify auth.

Current state:

- Dashboard layout has a development auth bypass.
- Middleware checks a `payload-token` cookie.
- Local API uses NextAuth in some routes.
- `miv-backend` uses Payload-style auth/cookies.
- `useAuth` currently checks local `/api/users/me`.

Recommended target:

- `miv-backend` owns auth.
- `miv` checks `/backend/api/users/me`.
- All dashboard data calls send `credentials: "include"`.
- Local NextAuth/Prisma auth routes are removed unless there is a deliberate reason to keep them.

## Suggested Migration Order

Recommended order, from lowest risk to highest impact:

1. Help Support
   - Currently local only.
   - Add support-ticket endpoint in `miv-backend`.

2. Diagnostics
   - Currently static only.
   - Add backend readiness endpoint.

3. Documents
   - There is already a working `miv-backend` pattern through Impact Documents.
   - Consolidate all document features around the same backend.

4. Users/Auth/System Settings
   - Important foundation before migrating permissions-sensitive features.

5. Ventures
   - Core dependency for most dashboard pages.
   - Once ventures move, many features can follow.

6. GEDSI Metrics and IRIS Catalog
   - Required by impact dashboards, reports, analytics, and AI insights.

7. Team, Calendar, Notifications
   - Operational features with clear model boundaries.

8. Workflows
   - Needs careful backend execution logic and template compatibility.

9. Capital/Fund Management
   - Has many generated values and domain-specific records.

10. Reports, Custom Dashboards, Analytics, AI
   - These depend on many other domains being stable first.

## Final Recommendation

If the project goal is production-style maintainability, `miv-backend` should become the only source of truth and `miv` should become a frontend-only dashboard.

The current split is workable for development, but not ideal long term because `miv` and `miv-backend` both define backend behavior and overlapping data concepts. Removing Prisma is possible, but only after `miv-backend` has equivalent models, endpoints, auth, and migration scripts for all current dashboard data.

