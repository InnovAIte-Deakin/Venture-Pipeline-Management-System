# Payload Migration Backlog

## Purpose
This backlog breaks the remaining `miv-backend` migration into three buckets:

1. Move to Sanity
2. Move to Prisma and `miv` app APIs
3. Delete or retire as legacy

Use this as the working checklist before removing `miv-backend`.

## 1. Move To Sanity

| Priority | Payload Source | What It Contains | Target In `miv` | Notes |
|---|---|---|---|---|
| P0 | `src/globals/lookups.ts` | sectors, impact areas, countries, currencies | Sanity schemas: `lookupSet`, `country`, `currency`, `sector` | Best first migration because it is pure CMS data with low operational risk |
| P0 | `src/globals/settings.ts` | global feature flags and locale defaults | Sanity schema: `platformSettings` | Keep only editorial/global config here, not user preferences |
| P1 | `src/collections/systemsettings.ts` | app name, support email, locale, timezone, upload settings, feature toggles | Sanity schema: `platformSettings` or split into `platformSettings` + `uploadPolicy` | Merge carefully with `globals/settings.ts` to avoid duplicate settings models |
| P1 | `src/collections/media.ts` | CMS-style media metadata, captions, uploaded assets | Sanity media library or Sanity asset refs | Only suitable for non-sensitive editorial/media assets |
| P2 | Venture descriptive content from `src/collections/ventures.ts` | name, country, city, sector, website, description | Optional Sanity document: `ventureProfileContent` | Only move descriptive/editorial fields if you want analysts to edit narrative content in Studio |

### Sanity Deliverables

| Priority | Deliverable | Description |
|---|---|---|
| P0 | Sanity Studio setup | Add embedded or hosted Studio for content editing |
| P0 | Sanity client config | Add `sanity.client.ts` and env-driven config in `miv` |
| P0 | Lookup schemas | Create schemas for sectors, impact areas, countries, currencies |
| P1 | Settings schemas | Create schemas for platform settings and feature toggles |
| P1 | Read adapters | Replace current Payload-backed lookup/settings reads with Sanity queries |
| P2 | Content migration script | Export Payload global/collection content and import into Sanity |

## 2. Move To Prisma And App APIs

| Priority | Payload Source | What It Contains | New Home | Notes |
|---|---|---|---|---|
| P0 | `src/collections/users.ts` | auth-enabled users, roles | Prisma `User` + NextAuth/custom auth | Not a Sanity concern |
| P0 | `src/app/api/auth/login/route.ts` | login and cookie issuance | `miv/app/backend/api/users/login` and NextAuth alignment | Compatibility route exists, but full auth consolidation still needed |
| P0 | `src/app/api/register/route.ts` and `src/app/api/auth/register/route.ts` | signup flow | Prisma + `miv` auth APIs | Remove duplicate auth pathways after consolidation |
| P0 | `src/app/api/users/route.ts` | current user fetch/update | Prisma + `miv/app/backend/api/users` | Compatibility route exists |
| P0 | `src/app/api/users/change-password/route.ts` | password update | Prisma + `miv/app/backend/api/users/change-password` | Compatibility route exists |
| P0 | `src/collections/documents.ts` | secure document metadata and uploads | Prisma `Document` + Vercel Blob/S3 + `miv` APIs | Do not move secure docs into Sanity |
| P0 | `src/app/api/documents/route.ts` and `src/app/api/documents/[id]/route.ts` | document CRUD, download, review | `miv/app/backend/api/documents*` or native `/api/documents*` | Still not fully ported |
| P0 | `src/collections/dataRoomFiles.ts` | secure data room uploads | Prisma + blob storage + signed access flow | Operational file workflow, not CMS |
| P0 | `src/collections/onboardingIntakes.ts` | intake submissions and business workflow hooks | Prisma models + service layer in `miv` | Must rewrite hooks as explicit service logic |
| P0 | `src/app/api/intake/submit/route.ts` | intake submission endpoint | `miv` route handler + Prisma transaction | Re-implement venture creation, founder creation, notifications, activity logging |
| P1 | `src/collections/founders.ts` | founder records linked to ventures/users | Prisma relational model | Likely absorbed into `User` and venture member relations |
| P1 | `src/collections/agreements.ts` | NDA/MOU and signature status | Prisma `Agreement` model + e-sign integration service | Workflow state, not CMS |
| P1 | `src/collections/activityLogs.ts` | audit and activity trail | Prisma `Activity` model | Some equivalent already exists in `miv` |
| P1 | `src/collections/userSettings.ts` | notification preferences | Prisma user settings table or JSON field | Keep separate from Sanity global settings |
| P1 | `src/app/api/sytem-settings/route.ts` | merged account, notification, and global settings API | Split into user settings API + Sanity-backed global settings API | Current combined route is a migration smell |
| P1 | `src/app/api/sytem-settings/notifications/route.ts` | notification settings | Prisma-backed user settings route | User-specific state |
| P1 | `src/app/api/sytem-settings/performance/route.ts` | performance/settings support | App API | Evaluate whether still needed |
| P1 | `src/app/api/auth/forgot-password/route.ts` and `src/app/api/auth/reset-password/route.ts` | password reset flow | NextAuth/custom auth service | Payload-specific auth behavior must be removed |
| P2 | `src/collections/ventures.ts` operational fields | triage track, rationale, founder arrays | Prisma venture models | Keep only editorial venture content in Sanity if desired |
| P2 | `src/app/api/reports/impact-users/route.ts` | reporting endpoint | Prisma analytics/reporting service | Business reporting, not CMS |
| P2 | `src/app/api/email/*` | test email routes | `miv` operational APIs or dev-only utilities | Keep only if actively used |

### Prisma/App API Deliverables

| Priority | Deliverable | Description |
|---|---|---|
| P0 | Document migration | Port all `/backend/api/documents*` paths off Payload |
| P0 | Intake workflow service | Replace Payload hooks with explicit service functions and transactions |
| P0 | Auth consolidation | Decide between NextAuth-first or custom compatibility auth and remove overlap |
| P1 | Agreement model and API | Add Prisma model and workflow routes for NDA/MOU lifecycle |
| P1 | User settings model | Add persistent per-user settings separate from Sanity globals |
| P1 | File storage strategy | Standardize on Vercel Blob or S3 for secure files |
| P2 | Reporting migration | Port Payload report routes to Prisma analytics queries |

## 3. Delete Or Retire As Legacy

| Priority | Legacy Item | Why It Can Be Removed | Removal Condition |
|---|---|---|---|
| P0 | `miv-backend/src/app/(payload)/api/[...slug]/route.ts` | Payload REST passthrough | Only after no frontend path depends on Payload REST endpoints |
| P0 | Payload collections in `miv-backend/src/collections/*` | Replaced by Sanity or Prisma | Delete after data migration and endpoint cutover |
| P0 | Payload globals in `miv-backend/src/globals/*` | Replaced by Sanity settings/lookups | Delete after Sanity reads are live |
| P0 | `miv/app/backend/[...path]/route.ts` fallback proxy | Temporary bridge to external backend | Delete after all required endpoints are local |
| P0 | External rewrite in `miv/next.config.ts` | Only needed while `miv-backend` exists | Delete after internal mode is the only mode |
| P1 | Duplicate register/login paths in backend | Multiple auth flows increase migration risk | Delete after one auth system is chosen |
| P1 | Payload seed logic in `payload.config.ts` | Backend-specific bootstrap logic | Delete after Prisma seeding replaces it |
| P2 | `miv-backend` workspace folder | Entire legacy backend | Delete only after build, runtime, and content migration are complete |

## Recommended Execution Order

| Step | Area | Outcome |
|---|---|---|
| 1 | Sanity setup | Studio available in `miv` |
| 2 | Lookups migration | CMS-managed lists come from Sanity |
| 3 | Global settings migration | Platform/global config comes from Sanity |
| 4 | Document API migration | Secure files stop depending on Payload |
| 5 | Intake workflow migration | Submission hooks/business logic are owned by `miv` |
| 6 | Agreements and user settings migration | Remaining operational collections leave Payload |
| 7 | Remove proxy and rewrite | `miv` no longer depends on external backend |
| 8 | Delete `miv-backend` | Legacy backend fully retired |

## Exit Criteria

You can delete `miv-backend` only when all of the following are true:

1. `miv` builds successfully in production.
2. `BACKEND_INTEGRATION_MODE=internal` is the only mode you need.
3. No request path depends on `miv/app/backend/[...path]/route.ts`.
4. Lookups and global settings are served from Sanity.
5. Documents, intakes, agreements, users, and activity logs are served from Prisma-backed APIs in `miv`.
6. The external rewrite to `/backend/:path*` is removed.