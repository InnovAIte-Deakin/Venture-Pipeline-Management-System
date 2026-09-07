# API Contract v1

Venture Pipeline Management System
Backend and API Integration Team
Status: Draft, pre publication
Last updated: 7 September 2026
Canonical location: docs/API_CONTRACT_V1.md on the main repository. If you are reading a copy anywhere else, treat the repo version as authoritative.
Re-verified against frozen origin/main at commit c3e2a4b. Group folder names like (g3-venture-pipeline) do not appear in URLs, so paths remain independent of those on-disk route-group locations.

This document describes the agreed API between the miv frontend and the miv-backend service, plus the frontend's own internal API routes. It covers every endpoint we use for integration work: the method, the path, what goes in the request, what comes back in the response, and what each role is allowed to see. This is the single source of truth. If the code and this document disagree, one of them needs a pull request. Nothing should quietly drift apart.

## 1. Conventions

### 1.1 Base URLs and the backend proxy

The frontend never calls the backend host directly. The Next.js config in the miv app has a rewrite rule that forwards anything under /backend to the backend server:

```
/backend/:path*  forwards to  NEXT_PUBLIC_BACKEND_URL/:path*  (defaults to http://localhost:3001)
```

So when the browser calls /backend/api/auth/login, the backend receives it as /api/auth/login.

Rule for this document: all paths are written as backend paths starting with /api. Frontend code must call them with the /backend prefix added. When comparing what the frontend calls against what the backend implements, strip the prefix first.

Some routes are handled by the miv app itself using Prisma, not by the backend. Those are called without the prefix and are marked as "frontend internal" below.

### 1.2 Authentication

Auth is cookie based. A successful login or registration sets an HTTP only cookie called payload-token, which lasts 7 days. All authenticated fetches from the frontend must include credentials: 'include'. We do not use an Authorization header in v1, and the login response does not return the token in the JSON body.

### 1.3 Roles

The backend role values are the canonical set for this contract:

| Role value | Who this is |
|---|---|
| admin | Full access to everything, including settings |
| miv_analyst | Staff analyst. Can read and review across all ventures and documents, but cannot change global settings |
| founder (also stored as USER for impact applicants) | External user. Limited to their own records |

Known problem, now blocking: the frontend Prisma schema defines a different role list (ADMIN, MANAGER, ANALYST, USER, VENTURE_MANAGER, GEDSI_ANALYST, CAPITAL_FACILITATOR, EXTERNAL_STAKEHOLDER). Self-registration creates the Payload role `founder`, while the frontend maps that backend role to Prisma USER. The broader mapping is no longer just a tidiness issue: staff-role alignment is still absent from the RBAC matrix. Suggested mapping to discuss: the backend list is canonical, founder maps to USER, ANALYST and GEDSI_ANALYST map to miv_analyst, ADMIN and MANAGER map to admin. This remains Decision 1 in section 9.

### 1.4 Standard response shape

Backend endpoints wrap their responses like this:

```jsonc
// success
{ "success": true, "message": "some message", ...the actual data }

// error
{ "success": false, "error": "short code", "message": "human readable explanation", "details": [] }
```

The details field only appears on validation errors and contains the individual validation issues.

Status codes we use: 200 for success, 201 for created, 400 for validation problems, 401 for not logged in, 403 for logged in but not allowed, 404 for not found, 409 for conflicts like a taken email, 429 for rate limiting, 500 for server errors.

A few older endpoints (ventures summary, lookups, signed url) return bare objects without this wrapper. We will leave them as they are for v1 and bring them in line in v1.1.

### 1.5 Field naming

The backend database stores first_name and last_name, but everything on the wire uses camelCase (firstName, lastName). Any new endpoint should follow camelCase in both requests and responses.

## 2. Auth endpoints

### 2.1 POST /api/auth/login (canonical)

Logs in with email and password and sets the payload-token cookie.

Auth: none, public.

Request body:

```json
{ "email": "valid email", "password": "at least 1 character" }
```

Response 200:

```json
{
  "success": true,
  "message": "Login successful",
  "user": { "id": "string", "email": "string", "firstName": "string", "lastName": "string", "role": "string" }
}
```

Errors: 400 validation failed, 401 wrong email or password, 500 server error.

Visibility: public endpoint. The response only ever contains the caller's own user object.

Caller status: resolved on main as of commit f3297d1, in a different way than this contract originally prescribed. The login page and the useAuth hook no longer call /backend/api/users/login (the original mismatch). They now call POST /api/session/login, a new frontend internal proxy route described in 2.6, which forwards to this canonical backend endpoint. So the mismatch is gone, but the fix introduced a second live login pattern: some code goes through the session proxy while other code still calls /backend/api/auth/login directly. Decision item for section 9: bless one pattern, proposed as the session proxy for browser login since it re mints the cookie first party, and update the remaining direct callers.

Deprecated: /api/users/login. Do not add it. The backend has one login path and this is it.

### 2.2 DELETE /api/auth/login (canonical logout)

Clears the auth cookie.

Auth: cookie, but calling it without one is harmless.

Request: empty body.

Response 200:

```json
{ "success": true, "message": "Logged out successfully" }
```

Callers to update: the dashboard page (miv/app/dashboard/page.tsx line 864) calls POST /backend/api/users/logout, which does not exist. It should call DELETE /backend/api/auth/login instead. The useAuth hook and sidebar already do this correctly.

Note: the team may prefer a dedicated POST /api/auth/logout route because it reads better. If we decide that, the backend adds it first and both callers move over. Either way, there is exactly one logout path.

### 2.3 POST /api/auth/register (canonical)

POST /api/auth/register is the only registration endpoint. It creates a Payload user with the server-controlled `founder` role and sets the login cookie. The request schema does not accept a client-supplied role. Passwords require a minimum of eight characters.

Auth: none, public.

Request body:

```jsonc
{
  "firstName": "required",
  "lastName": "required",
  "email": "valid email, must be unique",
  "password": "required, minimum 8 characters",
  "ventureName": "optional",
  "positionInVenture": "optional",
  "phone": "optional",
  "countryCode": "optional"
}
```

Response 201:

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": { "id": "string", "email": "string", "firstName": "string", "lastName": "string", "role": "founder" }
}
```

Errors: 400 bad JSON or validation, 409 email already registered, 500.

The register page calls `/backend/api/auth/register`, which the frontend backend proxy forwards to this canonical endpoint.

The former POST /api/register duplicate was removed in #73 (`47d7d78`).

### 2.4 POST /api/auth/forgot-password

Requests a password reset email.

Auth: none.

Request: `{ "email": "string" }`

Response 200: `{ "success": true }`. The same response comes back whether or not the account exists, so nobody can use this endpoint to check which emails are registered.

Errors: 400 missing email, 500.

Callers: nothing in the miv frontend uses this yet. Wire it up when the forgot password screen is built.

### 2.5 POST /api/auth/reset-password

Completes the reset using the token from the email.

Auth: none, the token in the body is the proof.

Request: `{ "token": "string", "password": "string" }`

Response 200: `{ "success": true }`

Errors: 400 for a missing, invalid or expired token, 500.

### 2.6 POST /api/session/login (frontend internal)

New on main as of commit f3297d1. A thin proxy in the miv app that forwards the login request to the canonical backend POST /api/auth/login, then copies the payload-token from the backend response and re sets it as a first party cookie on the frontend origin (httpOnly, secure in production, sameSite lax, 7 days). This sidesteps cross site cookie problems when the frontend and backend run on different domains.

Request and response are identical to 2.1, since the proxy passes both through unchanged, including the status code.

Callers: the login page (miv/app/auth/login/page.tsx line 31) and useAuth (line 83).

Contract position: the backend endpoint in 2.1 remains canonical. This proxy is the blessed browser entry point for login, pending the section 9 decision. It must never grow its own logic beyond cookie handling, otherwise we get two login behaviours.

Related backend change: the backend login route now sets the cookie with a dynamic sameSite value, lax for same site callers and none for cross site ones, instead of a hardcoded value.

## 3. User and profile endpoints

### 3.1 GET /api/users

Returns the currently logged in user. Despite the plural name, this behaves like a "me" endpoint.

Auth: cookie required.

Response 200:

```json
{
  "success": true,
  "user": { "id": "string", "email": "string", "firstName": "string", "lastName": "string", "role": "string", "createdAt": "ISO date", "updatedAt": "ISO date" }
}
```

Errors: 401 if there is no valid session, 500.

Visibility: every role only ever sees their own record here. There is no JSON endpoint for listing all users. Admins manage users through the Payload admin panel.

Callers: useAuth, the user sidebar, the user dashboard layout and the profile page all already call this correctly.

Note: renaming this to /api/users/me in v1.1 would free up /api/users for a proper admin list endpoint later. For v1 the path stays as it is. The Payload Users collection now has `create: adminOnly`, so the historical public-creation blocker no longer applies; any rename should still be treated as an API compatibility decision rather than tidy-up work.

### 3.2 PATCH /api/users

Updates the current user's own profile.

Auth: cookie required.

Request, all fields optional but send at least one:

```json
{ "firstName": "string", "lastName": "string", "email": "valid email" }
```

Response 200:

```json
{ "success": true, "message": "Profile updated successfully", "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "...", "role": "..." } }
```

Errors: 400 validation, 401, 404 if the user record somehow no longer exists, 409 if the new email is taken by someone else, 500.

Rules: the role field can never be changed through this endpoint, the server always preserves it. Users can only update themselves, there is no id parameter.

### 3.3 POST /api/users/change-password

Auth: cookie required.

Request:

```json
{ "currentPassword": "required", "newPassword": "minimum 8 characters", "confirmPassword": "must match newPassword" }
```

Response 200: `{ "success": true, "message": "..." }`

Errors: 400 for validation problems or a wrong current password, 401, 500.

### Existing Team Members APIs — not approved for public v1.1 use

GET and POST /api/team/members, plus GET, PUT and DELETE /api/team/members/{id}, currently exist as Prisma-backed team-user CRUD APIs.

At verification commit c3e2a4b, they contain no authentication or role checks. They expose user records and support account creation, role assignment, update, and deletion. They must be protected by an approved staff/administrator access model before they can be treated as supported v1.1 API.

## 4. Dashboard endpoints

### 4.1 GET /api/reports/impact-users

Returns the current user's profile plus upload counters. This powers the header cards on the impact user dashboard.

Auth: cookie required.

Response 200:

```json
{
  "success": true,
  "user": {
    "id": "string", "email": "string", "firstName": "string", "lastName": "string",
    "role": "string", "createdAt": "ISO date", "updatedAt": "ISO date",
    "totalUploads": 0, "totalMedia": 0
  }
}
```

Errors: 401, 500.

Visibility: available to all roles. The counters are always scoped to the caller's own uploads.

Cleanup needed: this file also contains a PATCH handler that was copy pasted from the users route and duplicates profile updates. That PATCH is not part of the contract and should be removed. Profile updates go through PATCH /api/users only.

### 4.2 GET /api/lookups

Returns reference data such as countries, legal types and sectors from the Payload lookups global. Used to fill dropdowns on the intake form and dashboard filters.

Auth: none at the moment, it is a public read.

Response 200: the raw lookups object as stored in Payload. This is one of the endpoints without the standard wrapper.

Visibility: the same data for everyone.

### 4.3 GET and PATCH /api/sytem-settings

Yes, the path really is spelled "sytem". The canonical name should be system-settings and the rename is in the inventory below.

Auth: cookie required.

GET returns `{ "success": true, "settings": { ...user settings merged with global settings } }`.

PATCH lets any user update their own preference block. The global settings block can only be changed by an admin, anyone else gets a 403. The sub routes for notifications and performance follow the same pattern.

Visibility: admins read and write the global config. Analysts and founders can read the global config but only write their own preferences.

### 4.4 GET /api/analytics (frontend internal)

Prisma backed aggregate statistics for the main staff dashboard. The route detects mobile user agents and sends a trimmed payload to phones.

Query params: period, one of 7d, 30d, 90d or 1y. Anything else falls back to 30d.

Response 200:

```jsonc
{
  "period": "30d",
  "dateRange": { "start": "ISO date", "end": "ISO date" },
  "overview": {
    "totalVentures": 0,
    "venturesInPeriod": 0,
    "totalUsers": 0,
    "activeUsers": 0,
    "gedsiComplianceRate": 0,        // percent of metrics completed or verified
    "userEngagementRate": 0,
    "workflowAutomationRate": 0,
    "workflowSuccessRate": 0
  },
  "isMobile": false,
  "performance": {
    "trends": [ { "week": "Week 1", "ventures": 0, "gedsiScore": 0, "users": 0, "conversionRate": 0 } ],
    "recentActivities": [ "activity records with venture name, sector and user name attached" ],
    "activityBreakdown": { "type": "count" }
  },
  "workflows": { "total": 0, "active": 0, "recentRuns": [], "successRate": 0 },
  "insights": {
    "topSectors": [ { "sector": "string", "ventures": 0, "successRate": 0, "totalCapital": 0 } ],
    "riskFactors": { "pipeline": "low, medium or high", "compliance": "same", "market": "same", "operational": "same" },
    "recommendations": [ { "type": "success or warning", "title": "string", "description": "string", "priority": "low, medium or high" } ]
  }
}
```

On mobile the trends list shrinks to 3 points, recent activities to 5, insights drop to top sectors only, and workflows lose the recent runs list.

Errors: 500 with `{ "error": "Internal server error" }`.

Honesty note for reviewers: the trends use database-derived values. Where source data is absent, the implementation uses fixed fallback constants: GEDSI score 75 and conversion rate 15. Those fallbacks should not be presented as measured results.

Auth: the route calls `getSessionUser()` before processing the request.

### 4.5 GET /api/custom-dashboards (frontend internal)

Returns a list of dashboard cards for the custom dashboards page. These are not stored dashboards. The route builds four hardcoded dashboards (Pipeline Overview, Portfolio Performance, GEDSI Impact Tracker, Due Diligence Status) and fills their numbers from live venture data. Real user created dashboards would need a new table.

Auth: GET and POST call `getSessionUser()`.

Response 200:

```jsonc
{
  "dashboards": [
    {
      "id": "DASH-001",
      "name": "Pipeline Overview",
      "description": "string",
      "category": "Pipeline, Portfolio, Impact or Operations",
      "widgets": 0,
      "lastModified": "ISO date",
      "isPublic": true,
      "isFavorite": true,
      "createdBy": "user name",
      "createdById": "user id",
      "data": { "metrics specific to each dashboard": 0 }
    }
  ]
}
```

Visibility target: staff roles only. Founders have no use for this page.

### 4.6 Notifications (frontend internal)

GET /api/notifications lists notifications with paging and filters.

Query params: page (default 1), limit (default 50), userId, type, isRead (true or false as a string).

Response 200:

```json
{
  "notifications": [ { "the notification": "with user name, email and role attached" } ],
  "pagination": { "page": 1, "limit": 50, "total": 0, "pages": 0 }
}
```

POST /api/notifications creates one. Request:

```json
{
  "userId": "required",
  "type": "one of: WELCOME, VENTURE_CREATED, VENTURE_UPDATED, GEDSI_ALERT, FUNDING_OPPORTUNITY, SYSTEM_UPDATE, REPORT_READY, STG_REMINDER, WEEKLY_UPDATE",
  "title": "required",
  "message": "required",
  "metadata": { "optional": "free form" }
}
```

Returns 201 with the created notification, 404 if the target user does not exist, 400 on validation.

PUT /api/notifications updates one, mainly to mark it read. Request is `{ "id": "required", "isRead": true }` plus any other fields to change. Returns the updated record.

Auth: GET, POST and PUT call `getSessionUser()`. The handlers require a session before processing notification data.
## 5. Venture and intake endpoints

### 5.1 POST /api/intake/submit (canonical)

Submits a venture onboarding application. A server side hook then automatically creates or links the venture record, creates NDA and MOU agreement stubs, sends notification emails and writes an activity log entry.

Implementation: the retained canonical handler is `miv-backend/src/app/(payload)/api/intake/submit/route.ts`. The `(payload)` route group does not change the public URL.

Auth: none; this is the public application form. POST has a per-IP rate limit of 10 requests per minute.

Request body:

```jsonc
{
  "ventureName_en": "required",
  "ventureName_km": "optional, Khmer name",
  "country": "required",
  "description_en": "optional",
  "description_km": "optional",
  "wss": {
    "seeing": "one of: no_difficulty, some_difficulty, a_lot_of_difficulty, cannot_do_at_all",
    "hearing": "same options",
    "walking": "same options",
    "cognition": "same options",
    "selfCare": "same options",
    "communication": "same options"
  },
  "registration": {
    "number": "optional", "country": "optional", "legalType": "optional",
    "yearEstablished": "optional number between 1900 and 2100"
  },
  "impactAreas": ["any of: agri, gender, climate"],
  "founders": [
    { "fullName": "required", "email": "valid email", "phone": "optional" }
  ],
  "financials": { "currency": "optional", "lastFYRevenue": "optional number", "avgMonthlyRevenue": "optional number" },
  "gedsi": { "hasPolicy": "optional boolean", "notes": "optional" },
  "triageTrack": "one of: unassigned, fast, slow. Defaults to unassigned",
  "triageRationale": "optional"
}
```

The wss block is the Washington Group Short Set of disability questions and all six answers are required. At least one founder is required.

Response 200:

```json
{
  "success": true,
  "message": "Venture application submitted successfully",
  "data": { "intakeId": "string", "ventureName": "string", "submissionDate": "ISO date", "status": "submitted" }
}
```

Errors: 400 validation with details, 409 duplicate venture/founder, 429 rate limited, 500.

The former `miv-backend/src/app/api/intake/submit/route.ts` duplicate was removed in #73 (`47d7d78`).

### 5.2 GET /api/intake/submit?id={intakeId}

Checks the status of a submission.

Auth: required. The handler authenticates through `payload.auth`. Admin and `miv_analyst` users can access submissions as staff; non-staff access is scoped to the caller's own submission. Unauthenticated requests receive 401 and unauthorized requests receive 403.

Response 200:

```json
{ "success": true, "data": { "id": "...", "ventureName_en": "...", "country": "...", "triageTrack": "...", "createdAt": "...", "updatedAt": "..." } }
```

Errors: 400 if the id is missing, 401 unauthenticated, 403 unauthorized, 404 not found, 500.

### 5.3 GET /api/ventures/{id}/summary

The full venture summary for detail pages: the venture itself, the latest intake, agreements and financials.

Auth: required. The handler requires a Payload user, permits staff (`admin` and `miv_analyst`) or the venture owner, and returns 401 or 403 when access is not permitted. Triage track and rationale are redacted for founders.

Response 200 (no wrapper on this one):

```json
{ "venture": {}, "latestIntake": {}, "agreements": [], "financials": {} }
```

latestIntake and financials are null when there is no intake yet.

Errors: 404 with `{ "error": "message" }`.

Current visibility:

| Field group | admin | miv_analyst | founder |
|---|---|---|---|
| Venture basics (name, country, stage, status) | yes | yes | own ventures only |
| Latest intake including the disability answers | yes | yes | own only |
| Financials | yes | yes | own only |
| Agreements | yes | yes | own only |
| Triage track and rationale | yes | yes | no, this is internal |

### 5.4 POST /api/ventures/{id}/assign-track

Assigns a fast or slow triage track to a venture and writes an activity log entry.

Auth: cookie required. Only admin and miv_analyst may call this, everyone else gets a 403.

Request: `{ "track": "fast or slow", "rationale": "optional" }`

Response 200: `{ "ok": true, "ventureId": "string", "triageTrack": "fast or slow" }`

Errors: 400 invalid track, 403, 500.

There is a disabled dead copy of this route in a dot prefixed folder sitting next to it. It should be deleted, see the inventory.

### 5.5 Venture CRUD (frontend internal)

The miv app has its own Prisma backed venture routes used by the staff dashboard. These carry the richest venture shape in the system.

GET /api/ventures lists ventures.

Query params: page (default 1), limit (default 10), search (matches name, sector or location, case insensitive), sector, stage, status. The route also detects mobile and trims the payload.

Response 200:

```jsonc
{
  "ventures": [
    {
      "id": "string",
      "name": "string",
      "sector": "string",
      "location": "string",
      "stage": "one of: INTAKE, SCREENING, DUE_DILIGENCE, INVESTMENT_READY, FUNDED, EXITED, SEED, SERIES_A, SERIES_B, SERIES_C",
      "status": "one of: ACTIVE, INACTIVE, ARCHIVED",
      "createdBy": { "name": "string", "email": "string" },
      "assignedTo": { "name": "string", "email": "string" },
      "_count": { "documents": 0, "activities": 0, "capitalActivities": 0 },
      "gedsiMetrics": [ "desktop only" ],
      "documents": [ "desktop only, latest 5" ],
      "activities": [ "desktop only, latest 10, with user attached" ],
      "capitalActivities": [ "desktop only" ]
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 0, "pages": 0 },
  "isMobile": false
}
```

POST /api/ventures creates a venture. Request body:

```jsonc
{
  "name": "required",
  "sector": "required",
  "location": "required",
  "contactEmail": "required, valid email",
  "contactPhone": "optional",
  "pitchSummary": "optional",
  "inclusionFocus": "optional",
  "founderTypes": ["required, at least one string"],
  "teamSize": "optional",
  "foundingYear": "optional",
  "targetMarket": "optional",
  "revenueModel": "optional",
  "operationalReadiness": { "optional": "free form" },
  "capitalReadiness": { "optional": "free form" },
  "gedsiGoals": ["optional strings"],
  "washingtonShortSet": { "the same six WSS questions as intake, all optional here": "..." },
  "disabilityInclusion": {
    "disabilityLedLeadership": "optional boolean",
    "inclusiveHiringPractices": "optional boolean",
    "accessibleProductsOrServices": "optional boolean",
    "notes": "optional"
  },
  "challenges": "optional",
  "supportNeeded": "optional",
  "timeline": "optional"
}
```

Returns 201 with the created venture. The server also writes activity log entries and, depending on the payload, kicks off AI analysis.

GET /api/ventures/{id} returns one venture with its relations included, or 404. PUT /api/ventures/{id} updates it using the same schema with everything optional. DELETE /api/ventures/{id} removes it.

Serious problems, all tracked in the inventory:

1. The session checks are commented out on list, create, read, update and delete.
2. POST attaches the first user in the database as the creator, and if the database is empty it silently creates a Development User with the ADMIN role. That must go before v1.

Contract requirement: all five handlers need auth, create, update and delete are staff only, and founder reads are scoped to their own ventures.

Decision on founder reads: this contract and the fixes doc (section 4.1 there) currently disagree. The contract says founder reads are scoped to their own ventures, while Jeevan's snippet returns a flat 403 to founders. The contract's position stands as the target behaviour: founders can read their own ventures, because the my ventures view depends on it. A flat 403 is acceptable only as a labelled interim measure until the scoping is implemented. The fixes doc needs updating to say the same, so the two documents agree.

### 5.6 GET and POST and PUT and DELETE /api/ventures/{id}/gedsi (frontend internal)

GEDSI metrics attached to a venture. Unlike its neighbours, this route actually enforces auth: every handler checks the session and returns 401 without one. This is the pattern the other venture routes should copy.

GET returns the metrics for the venture.

POST creates a metric. Request:

```json
{
  "metricCode": "required",
  "metricName": "required",
  "category": "one of: GENDER, DISABILITY, SOCIAL_INCLUSION, CROSS_CUTTING",
  "targetValue": "required positive number",
  "currentValue": "required, zero or more",
  "unit": "required",
  "status": "optional, one of: NOT_STARTED, IN_PROGRESS, VERIFIED, COMPLETED",
  "notes": "optional"
}
```

PUT updates a metric, request is `{ "id": "required" }` plus any fields from the same schema. DELETE removes one by id. Errors: 400 missing id or validation, 401, 404 metric, venture or user not found, 500.

Visibility target: staff can manage metrics on any venture, founders can view metrics on their own ventures only.

### 5.7 GET /api/users/ventures (frontend internal)

Returns the current user plus every venture where they are the creator or the assignee. Powers the "my ventures" view.

Response 200:

```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "role": "...", "name": "...", "organization": "...", "createdAt": "...", "updatedAt": "..." },
  "ventures": [ "ventures with createdBy and assignedTo attached" ],
  "ventureCount": 0
}
```

Implementation bug worth fixing: this route learns who the caller is by making a server side fetch to /api/users/me, but it does not forward the caller's cookies on that fetch, so the identity lookup cannot actually see the session. The fix is to call getServerSession(authOptions) directly, passing the auth options in. Note that the gedsi route, while it does enforce auth, calls getServerSession() bare with no authOptions, which is why it cannot see custom session fields. Jeevan's version, which passes authOptions, is the pattern to copy.
## 6. Document endpoints

### 6.1 GET /api/documents

Lists the documents the caller is allowed to see.

Auth: cookie required.

Scoping: admin and miv_analyst see every document. Every other role only sees documents they uploaded themselves.

Response 200:

```json
{
  "success": true,
  "documents": [
    {
      "id": "string",
      "filename": "string",
      "documentType": "one of: Pitch Deck, Financial Statements, Legal Documents, GEDSI Reports, Impact Reports, Other",
      "status": "string",
      "version": 1,
      "filesize": 12345,
      "mimeType": "string",
      "url": "string",
      "notes": "string or null",
      "uploadedBy": { "the uploading user": "..." },
      "venture": { "linked venture or null": "..." },
      "reviewedBy": { "reviewing user or null": "..." },
      "reviewedAt": "ISO date or null",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ],
  "totalDocs": 0,
  "totalPages": 0,
  "page": 1
}
```

Errors: 401, 500.

Callers: the user dashboard documents page and the impact documents page both call this correctly.

### 6.2 POST /api/documents

Uploads a document. This one is multipart form data, not JSON.

Auth: cookie required, any role. The upload is attached to the caller.

Form fields: file (required, maximum 10 MB), documentType (required, the display name or the backend value both work), ventureId (optional), notes (optional).

Response 200: `{ "success": true, "document": { same shape as a list item } }`

Errors: 400 for a missing file, missing type or oversized file, 401, 500.

### 6.3 DELETE /api/documents?id={documentId} (canonical delete)

Auth: cookie required. Allowed for admin, miv_analyst, or the person who uploaded the document. Anyone else gets a 403.

Response 200: `{ "success": true, "message": "Document deleted" }`

Errors: 400 missing id, 401, 403, 404, 500.

Why the query string form: a path style DELETE /api/documents/{id} would be tidier, but that handler does not exist on the backend, and both working frontend callers already use the query string form. So v1 makes the query string form canonical. If we ever want the path form, the backend adds it first, both callers migrate, and then this one goes away. There should never be a period with two live delete routes.

Caller to fix: the impact documents page has one delete call using the path form (line 157), which currently fails with a 405. It needs to switch to the query string form.

### 6.4 GET /api/documents/{id} and GET /api/documents/{id}?download=true

Fetches a document's metadata, or the actual file when download=true is added.

Auth: cookie required. Admin, miv_analyst or the uploader, otherwise 403.

Response 200 without download: `{ "success": true, "document": { same shape as a list item } }`

Response 200 with download: the raw file bytes with the correct Content-Type, a Content-Disposition attachment header carrying the filename, and Content-Length.

Errors: 401, 403, 404 when the record or the file on disk is missing, 500.

### 6.5 PATCH /api/documents/{id}

Reviews a document, changing its status and notes. The server also stamps who reviewed it and when.

Auth: cookie required. Admin and miv_analyst only, everyone else gets a 403.

Request: `{ "status": "string", "notes": "optional" }`. The exact status values come from the Documents collection config, for example pending, approved and rejected. Confirm against the collection before relying on specific values.

Response 200: `{ "success": true, "document": { updated document } }`

Errors: 400, 401, 403, 404, 500.

### 6.6 POST /api/uploads/signed-url

Returns a presigned upload URL. Right now this is a mock that returns a fake URL, so do not build production flows on it yet. Only PDFs up to 10 MB are accepted.

Auth: required through Payload authentication. Storage remains mock/non-production; do not build production flows on it yet.

Request: `{ "fileName": "string", "contentType": "application/pdf", "size": 12345 }`

Response 200: `{ "url": "string", "fields": {}, "key": "string", "contentType": "application/pdf", "expiresIn": 300 }`

Errors: 400 for a wrong content type or an oversized file.

### 6.7 Frontend internal document routes

The miv app also has its own Prisma backed document routes (documents, documents/{id}, documents/upload, documents/analytics). The user facing document flows already go through the backend routes described above, so these internal ones overlap. Our proposal is to either retire them or scope them strictly to staff analytics. To be decided by the team.

## 7. Duplicate and mismatch inventory

This is the cleanup list. Each row names the problem, the path we are keeping, the exact files that need updating, and who owns the change.

| Issue | Current state | Resolution | Files to update | Owner |
|---|---|---|---|---|
| Register duplicate | Resolved in #73: POST /api/register was removed; POST /api/auth/register is canonical, requires an 8 character password, and creates `founder` users | Keep the canonical route and record its server-controlled role in section 2.3 | miv-backend/src/app/api/auth/register/route.ts | Backend |
| Intake submit duplicate | Resolved in #73: the retained Payload-backed route-group handler serves POST and GET /api/intake/submit; the former app/api duplicate was removed | Retain the current handler, including its per-IP POST rate limit and authenticated GET access rules | miv-backend/src/app/(payload)/api/intake/submit/route.ts | Backend |
| Login URL mismatch | Resolved on main at f3297d1. The login page and useAuth now go through the new /api/session/login proxy, which calls the canonical /api/auth/login | Done, with a follow up: two login patterns now exist (session proxy versus direct /backend calls), pick one in section 9 | remaining direct /backend/api/auth/login callers once the decision lands | Frontend |
| Logout route mismatch | Resolved: the dashboard calls DELETE /backend/api/auth/login, which the backend implements | Keep the current canonical logout path unless Decision 3 chooses a dedicated endpoint | miv/app/dashboard/page.tsx | Frontend |
| Dead disabled routes | Dot prefixed copies of assign-track and send-signature sit next to the live versions | Delete the files | none | Backend |
| Copy pasted PATCH on the reports route | PATCH /api/reports/impact-users duplicates PATCH /api/users | Remove the handler, profile updates go through /api/users only | none found | Backend |
| Misspelled settings path | Canonical routes now use /api/system-settings | Decide separately whether a legacy redirect is required; no old route is present | miv-backend/src/app/api/system-settings | Backend and frontend |
| Broken delete call | Resolved: the impact documents page uses the query-string delete form | Keep the current DELETE /api/documents?id={documentId} call | miv/app/dashboard/(g3-admin-review-readiness)/impact-documents/page.tsx | Frontend |
| Ventures live in two databases | Prisma in the frontend and Payload in the backend, nothing syncs them | Documented as is for v1, single source of truth to be decided for v2 | not applicable yet | Whole team |
| Page-level authentication | Resolved: Next.js 16 uses the active proxy.ts convention | See current page-level authentication statement below | miv/proxy.ts | Frontend |
| Identity lookup that cannot work | Resolved: /api/users/ventures calls getSessionUser() directly | Keep the direct session lookup | miv/app/api/(g5-user-support-settings)/users/ventures/route.ts | Frontend |
| Analytics fallback values | Trends are database-derived, with fixed GEDSI fallback 75 and conversion-rate fallback 15 when source data is absent | Do not present fallback values as measured results | miv/app/api/(g1-impact-analytics)/analytics/route.ts | Frontend |

### Security items that must be fixed before v1 sign off

Page-level authentication uses the Next.js 16 `proxy.ts` convention. `miv/proxy.ts` exports `proxy`, validates the signed and unexpired Payload session token, and fails closed for protected page routes. API-route authorization remains the responsibility of each route handler because API and `/backend/*` paths are excluded from the proxy matcher.

| Endpoint | Problem |
|---|---|
| Frontend internal /api/ventures routes and /api/analytics | Resolved: handlers call getSessionUser() before processing requests |
| Frontend internal /api/notifications | Resolved: GET, POST and PUT call getSessionUser() |
| Frontend internal /api/custom-dashboards | Resolved: GET and POST call getSessionUser() |
| GET /api/intake/submit?id= | Resolved: payload.auth enforces authentication and staff/non-staff access rules with 401/403 responses |
| GET /api/ventures/{id}/summary | Resolved: requires a Payload user, applies staff/owner access, and redacts triage fields for founders |
| POST /api/uploads/signed-url | Resolved: requires Payload authentication. The upload URL remains a mock and is not production storage |
| Users collection update access | Resolved: role field create/update access is protected with fieldAdminOnly |
| Users collection create access | Resolved: collection create access is adminOnly |
| All auth routes | No rate limiting on login, register, forgot password or reset password, leaving them open to brute force and enumeration by volume |
| Team Members APIs | GET/POST /api/team/members and GET/PUT/DELETE /api/team/members/{id} have no authentication or role checks and expose team-user CRUD and role-management capability |
| Repository hygiene | Repository templates and environment documentation were scrubbed in c3e2a4b. External credential rotation is not verifiable from this repository |

One improvement to acknowledge from the same restructure: the seed, test and set password development routes were moved out of app/api into an archive folder, so they are no longer live endpoints. That closes a real attack surface.

## 8. Role visibility summary

A quick reference for who can do what. The per endpoint sections above are the authoritative version.

| Operation | admin | miv_analyst | founder or USER | not logged in |
|---|---|---|---|---|
| Login, register, forgot and reset password | yes | yes | yes | yes |
| Read and update own profile, change password | yes | yes | yes | no |
| Impact users report (own counters) | yes | yes | yes | no |
| Lookups | yes | yes | yes | yes, read only |
| Submit an intake | yes | yes | yes | yes |
| Venture summary | all ventures | all ventures | own only, without triage fields | no |
| Assign a triage track | yes | yes | no | no |
| List documents | all | all | own only | no |
| Upload a document | yes | yes | yes, own | no |
| Review a document | yes | yes | no | no |
| Delete a document | any | any | own only | no |
| Change global system settings | yes | no | no | no |

## 9. Decisions needed at sprint review

These are the open calls that the contract deliberately does not make alone. To be settled at the sprint review with Jeevan, Philip and Abhishek, then recorded here with the date.

1. Role mapping between the frontend Prisma enum and the backend role values. Blocking Jeevan's staff checks and absent from Philip's RBAC matrix. Suggested mapping is in section 1.3.
2. **Resolved — default role for self-registered accounts is `founder`.** Change #73 (`47d7d78`, 26 August 2026) removed the duplicate `POST /api/register`, moved the frontend registration page to the canonical `POST /api/auth/register` endpoint, and set the retained handler to create Payload users with the server-controlled role `founder`. The registration request schema does not accept a client-supplied role. The related Payload-to-Prisma mapping remains covered by Decision 1.
3. Logout route naming, DELETE /api/auth/login as it stands or a new POST /api/auth/logout.
4. Single source of truth for ventures, Prisma or Payload, for v2 planning.
5. Browser login pattern: the new /api/session/login proxy or direct /backend/api/auth/login calls. Proposed: the proxy, because it re mints the cookie first party. Whichever wins, the losing pattern's callers get migrated so only one remains.

Already decided by the contract owner and recorded above: founder venture reads are scoped to own ventures as the target behaviour, with a flat 403 acceptable only as a labelled interim, see section 5.5.

## 10. Change log

| Date | Version | Change |
|---|---|---|
| 26 July 2026 | v1 draft | First draft covering auth, users, dashboard, ventures and intake, documents, the duplicate inventory and the security items |
| 26 July 2026 | v1 draft 2 | Checkpoints 1 and 2 completed: full request and response shapes for analytics, custom dashboards, notifications, venture CRUD, GEDSI metrics and my ventures. Added new findings: random numbers in analytics trends, notifications open to everyone, and the cookie forwarding bug in /api/users/ventures |
| 31 July 2026 | v1 draft 4 | Historical re-verification against f3297d1 after the route-group restructure. Login mismatch was recorded as resolved via /api/session/login; registration and logout callers were then still recorded as broken. The historical proxy concern is superseded by the v1.1 verification: Next.js 16 uses the active `proxy.ts` convention. Noted the archived development routes as closed attack surface. |
| 31 July 2026 | v1 draft 3 | Pre publication amendments from review: corrected the getServerSession guidance in 5.7 to require authOptions, escalated the role mapping in 1.3 to a sprint review decision, recorded the founder read decision in 5.5, added four security items (analyst self promotion via role writes, create anyone on the Users collection, no rate limiting on auth routes, committed credentials), blocked the 3.1 rename pending the create lockdown, surfaced the register role minting difference, and added section 9 for decisions, moving the change log to section 10 |
| 7 September 2026 | v1.1 correction pass | Re-verified against frozen origin/main c3e2a4b; corrected registration, intake ownership, Next.js 16 proxy authentication, resolved security-status claims, analytics fallback wording, and documented existing-but-security-blocked Team Members APIs. |
