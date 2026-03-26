# Payload to Sanity Migration Matrix (miv-first, Vercel-ready)

## Goal
Move backend dependencies from `miv-backend` (Payload) into `miv` incrementally, keeping frontend endpoint compatibility (`/backend/api/*`) and enabling Sanity adoption for CMS content.

## Runtime Switch
- `BACKEND_INTEGRATION_MODE=external`: keep current rewrite to external backend.
- `BACKEND_INTEGRATION_MODE=internal`: disable rewrite and use local compatibility routes under `app/backend`.

## Endpoint Matrix
| Frontend Endpoint | Current Source | Compatibility Status in `miv` | Next Target | Sanity Fit |
|---|---|---|---|---|
| `/backend/api/users/login` | Payload native auth endpoint | Implemented locally (`app/backend/api/users/login`) | NextAuth credentials/session bridge | Not Sanity (auth domain) |
| `/backend/api/register` | Custom Payload wrapper | Implemented locally (`app/backend/api/register`) | DB + NextAuth registration flow | Not Sanity |
| `/backend/api/users` (GET/PATCH) | Custom Payload wrapper | Implemented locally (`app/backend/api/users`) | Session-backed profile APIs | Not Sanity |
| `/backend/api/users/change-password` | Custom Payload wrapper | Implemented locally (`app/backend/api/users/change-password`) | NextAuth account settings + password policy | Not Sanity |
| `/backend/api/auth/login` (DELETE) | Custom Payload wrapper | Implemented locally (`app/backend/api/auth/login`) | Session sign-out endpoint | Not Sanity |
| `/backend/api/users/logout` (POST) | Payload native/logout | Implemented locally (`app/backend/api/users/logout`) | Session sign-out endpoint | Not Sanity |
| `/backend/api/documents*` | Custom Payload + upload storage | Not yet ported (proxied fallback) | Vercel Blob/S3 + DB metadata APIs | Partial (metadata can be mirrored; binaries should stay blob storage) |
| Other `/backend/api/*` | Mixed Payload/custom | Proxied fallback (`app/backend/[...path]`) | Port per endpoint priority | Depends on domain |

## Priority Migration Order
1. Auth/session contract parity in `miv`.
2. User profile and password endpoints.
3. Document upload/download APIs with Vercel storage.
4. CMS-style read models (`lookups`, `settings`, static content) into Sanity.
5. Remove backend proxy fallback and external rewrite.

## Suggested Sanity Scope
Use Sanity for:
- Lookup/content entities: controlled vocabularies, labels, configurable help text.
- Editorial content: guidance pages, copy blocks, dashboards text configuration.
- Potentially venture summaries for analyst-readable content views.

Keep in DB (Prisma/Postgres):
- Users, auth, sessions, RBAC.
- Transactions and workflow state.
- Audit logs and operational records.
- File binary storage references and upload permissions.

## Acceptance Checklist
- Frontend works with `BACKEND_INTEGRATION_MODE=internal`.
- No direct dependency on Payload auth cookie generation.
- `/backend/api/*` compatibility stable during transition.
- Sanity client introduced only for CMS-read concerns first.
- External backend rewrite removable without regressions.
