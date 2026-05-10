# Developer Task List — Vercel Hosting & Project Restructuring

Tracked tasks for handoff to external planners. Each task is scoped for a single developer.

**Phases:**
- [Phase 1 — Vercel & Hosting](#phase-1--vercel--hosting) (T1–T7)
- [Phase 2 — Project Restructuring](#phase-2--project-restructuring) (T8–T14)

**Priority note:** T5 and T6 are security-critical and should be completed before the next production deploy. T3 must be completed before T11.

---

## Phase 1 — Vercel & Hosting

---

## [T1] Fix `/admin` panel styling on Vercel

**Phase:** Vercel & Hosting
**Priority:** High
**Files:**
- `src/app/(payload)/custom.scss`
- `src/payload.config.ts`
- `next.config.mjs`

**Description:**
The `/admin` route (Payload CMS admin panel) displays with broken styling on the live Vercel deployment. This is likely caused by Payload admin CSS not being bundled or served correctly in the Vercel build output.

**Steps:**
1. Reproduce the issue by visiting `/admin` on the Vercel preview/production URL.
2. Inspect network requests for any failing CSS asset loads (check Vercel function logs and browser DevTools).
3. Review `src/app/(payload)/custom.scss` and confirm it is imported in the Payload layout.
4. Check Payload CMS docs for known Vercel/Next.js CSS issues with the current Payload version.
5. Adjust CSS import, Payload config, or `next.config.mjs` webpack settings as needed.
6. Redeploy and verify.

**Acceptance Criteria:**
- `/admin` loads with correct Payload CMS styling on the live Vercel URL.
- No CSS-related console errors or failing network requests.

---

## [T2] Set and document all required Vercel environment variables

**Phase:** Vercel & Hosting
**Priority:** High
**Files:**
- `.env.example`
- `vercel-cheatsheet.md`
- `docs/INTERNAL_DEV_GUIDE.md`

**Description:**
Several required environment variables may be missing from the Vercel project settings. In particular, `NEXTAUTH_URL` being unset causes prerendering failures at build time. All required vars must be verified and documented.

**Required variables to check:**

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Payload CMS MongoDB connection |
| `PAYLOAD_SECRET` | Payload signing secret |
| `DATABASE_URL` | Prisma / PostgreSQL (required during `prisma migrate deploy` in build) |
| `NEXTAUTH_SECRET` | NextAuth JWT signing |
| `NEXTAUTH_URL` | Must be set to the production domain (e.g. `https://your-app.vercel.app`) |
| `GOOGLE_CLIENT_ID` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `SMTP_HOST` | Nodemailer SMTP |
| `SMTP_PORT` | Nodemailer SMTP |
| `SMTP_USER` | Nodemailer SMTP |
| `SMTP_PASS` | Nodemailer SMTP |
| `SMTP_FROM_EMAIL` | Nodemailer sender address |
| `ADMIN_NOTIFICATION_EMAIL` | Target for admin notifications |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (exposed to browser) |
| `ALLOWED_ORIGINS` | CORS whitelist |

**Steps:**
1. Run `vercel env ls` to list currently set variables.
2. Compare against the table above; add any missing variables via `vercel env add` or the Vercel dashboard.
3. Ensure `NEXTAUTH_URL` is set to the correct production domain for the `production` environment.
4. Update `vercel-cheatsheet.md` with the full variable list and instructions for adding/updating them.
5. Update `docs/INTERNAL_DEV_GUIDE.md` with a "Required Environment Variables" section.
6. Trigger a new Vercel deploy and confirm the build succeeds without prerender errors.

**Acceptance Criteria:**
- `vercel env ls` shows all required variables present for the production environment.
- `NEXTAUTH_URL` is set to the production domain.
- `vercel-cheatsheet.md` and `docs/INTERNAL_DEV_GUIDE.md` document the full list.

---

## [T3] Fix silent TypeScript and ESLint errors in `next.config.mjs`

**Phase:** Vercel & Hosting
**Priority:** High — prerequisite for T11
**Files:**
- `next.config.mjs`
- `src/app/dashboard/system-settings/page-enhanced.tsx` (known build blocker)

**Description:**
`next.config.mjs` currently sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`, which silently swallows all type and lint errors during CI and Vercel builds. This masks real bugs, including a known build blocker (`BarChart3` is used but not imported in `page-enhanced.tsx`). These flags must be removed and all surfaced errors resolved.

**Steps:**
1. In `next.config.mjs`, remove `eslint: { ignoreDuringBuilds: true }` and `typescript: { ignoreBuildErrors: true }`.
2. Run `pnpm build` locally to surface all errors.
3. Fix each error:
   - Known: `BarChart3` is undefined in `src/app/dashboard/system-settings/page-enhanced.tsx` — add the correct import from `lucide-react`.
   - For any other errors: fix or suppress with a targeted inline `// eslint-disable-next-line` or `// @ts-expect-error` with a comment explaining why.
4. Confirm `pnpm lint` also passes cleanly.
5. Commit and push; verify the Vercel build does not regress.

**Acceptance Criteria:**
- `pnpm build` completes successfully with both flags removed.
- `pnpm lint` passes with no errors.
- No new type or lint regressions introduced.

---

## [T4] Safer Prisma migration strategy for Vercel builds

**Phase:** Vercel & Hosting
**Priority:** Medium
**Files:**
- `vercel.json`
- `vercel-cheatsheet.md`
- `.github/workflows/ci.yml` (if T11 is complete)

**Description:**
The current `vercel.json` build command is:
```
prisma migrate deploy --schema=./src/prisma/schema.prisma && pnpm run build
```
A failed or timing-out migration blocks the entire Vercel deployment. This is brittle in production. The migration step should either be decoupled from the build or a clear rollback procedure documented.

**Steps:**
1. Evaluate options:
   - **Option A (preferred if CI exists):** Move `prisma migrate deploy` to a GitHub Actions pre-deploy step (requires T11). Remove it from `vercel.json` build command.
   - **Option B (simpler):** Keep it in `vercel.json` but wrap in a script that exits 0 if all migrations are already applied (`prisma migrate status` check).
2. Implement the chosen option.
3. Add a "Migration Rollback" section to `vercel-cheatsheet.md` documenting: how to roll back a bad migration, how to re-run failed deploys, and how to check migration status.
4. Test by deploying to a Vercel preview branch.

**Acceptance Criteria:**
- A Vercel build that encounters a no-op migration (already applied) does not fail.
- A rollback and re-run procedure is documented in `vercel-cheatsheet.md`.

---

## [T5] Seed root admin from Vercel/GitHub environment variables

**Phase:** Vercel & Hosting
**Priority:** Critical — security risk
**Files:**
- `src/payload.config.ts`
- `.env.example`
- `docs/INTERNAL_DEV_GUIDE.md`

**Description:**
The Payload CMS `onInit` callback in `src/payload.config.ts` creates a default admin user with hardcoded credentials (`admin@example.com` / `changeme123`). These must be read from environment variables instead. `todos.md` also flags seeding the root admin from the GitHub repo env as incomplete.

**Steps:**
1. In `src/payload.config.ts`, update `onInit` to read admin credentials from `process.env.SEED_ADMIN_EMAIL` and `process.env.SEED_ADMIN_PASSWORD`.
2. If either variable is missing in a non-development environment, throw a clear startup error (do not fall back to hardcoded values).
3. For local development, allow a `.env.local` fallback with documented test-only credentials.
4. Add `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` to `.env.example` with placeholder values and a warning comment.
5. Add these variables to the Vercel project settings (see T2).
6. Update `docs/INTERNAL_DEV_GUIDE.md` with instructions for setting the admin seed credentials.
7. Test by deploying to a preview environment and confirming the correct admin account is created.

**Acceptance Criteria:**
- No hardcoded admin email or password in `src/payload.config.ts`.
- Deploying with `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` set creates the correct admin.
- Missing vars in production/staging throw a clear startup error.
- `.env.example` documents both variables.

---

## [T6] Remove `admin123` bypass and hardcoded auth fallbacks

**Phase:** Vercel & Hosting
**Priority:** Critical — security risk
**Files:**
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/backend-auth.ts`

**Description:**
Two hardcoded credential fallbacks exist in the authentication code:

1. **NextAuth credentials provider** (`src/app/api/auth/[...nextauth]/route.ts`): Accepts the password `admin123` when a user's `passwordHash` is null and `NODE_ENV !== "production"`. This is exploitable on any staging environment where `NODE_ENV` is not explicitly set to `"production"`.

2. **Backend auth token signing** (`src/lib/backend-auth.ts`): Token secret falls back to the hardcoded string `'dev-insecure-change-me'` when `NEXTAUTH_SECRET` and `PAYLOAD_SECRET` are both absent.

**Steps:**
1. In the NextAuth credentials provider, remove the `admin123` bypass entirely. If a local dev bypass is truly needed, restrict it to `NODE_ENV === "development"` only and add a loud `console.warn` when it is used.
2. In `src/lib/backend-auth.ts`, replace the hardcoded fallback with a thrown error: if `NEXTAUTH_SECRET` and `PAYLOAD_SECRET` are both unset, throw at startup rather than silently using an insecure value.
3. Run `pnpm test:int` to confirm no auth tests rely on the bypass.
4. Test login locally to confirm valid credentials still work.
5. Deploy to a preview environment and confirm staging cannot be logged into with `admin123`.

**Acceptance Criteria:**
- No hardcoded credential strings (`admin123`, `dev-insecure-change-me`) remain in auth code paths.
- Missing required env vars throw a clear error at startup.
- Valid credentials continue to work; invalid credentials are correctly rejected.
- Staging environment cannot be accessed with `admin123`.

---

## [T7] Fill out `vercel-cheatsheet.md` with developer guides

**Phase:** Vercel & Hosting
**Priority:** Medium
**Files:**
- `vercel-cheatsheet.md`

**Description:**
`vercel-cheatsheet.md` is currently almost empty (just a heading). It needs three sections to help developers set up locally, work with Vercel CLI, and deploy to their own Vercel account.

**Steps:**
Write the following three sections in `vercel-cheatsheet.md`:

**Section 1 — Local Developer Guide**
- Prerequisites (Node.js, pnpm, Docker)
- Clone and install: `pnpm install`
- Start databases: `docker-compose up -d`
- Copy env file: `cp .env.example .env.local` and fill in values
- Run migrations: `pnpm db:migrate`
- Seed the database: `pnpm db:seed`
- Start dev server: `pnpm dev`
- Open Prisma Studio: `pnpm db:studio`
- Run tests: `pnpm test:int`, `pnpm test:e2e`

**Section 2 — Working with Vercel**
- Install CLI: `pnpm i -g vercel`
- Login: `vercel login`
- Link project: `vercel link`
- Pull env vars: `vercel env pull .env.local`
- Run local Vercel dev: `vercel dev`
- Deploy preview: `vercel`
- Deploy to production: `vercel --prod`
- View logs: `vercel logs <deployment-url>`
- List env vars: `vercel env ls`
- Add env var: `vercel env add VARIABLE_NAME`

**Section 3 — Deploying to Your Own Vercel Account**
1. Fork the repository on GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import Git Repository → select fork.
3. Set framework preset to **Next.js**.
4. Set all required environment variables (see T2 for the full list).
5. Set build command: `prisma migrate deploy --schema=./src/prisma/schema.prisma && pnpm run build`.
6. Deploy. Monitor the build log for migration and prerender errors.
7. Assign a custom domain if needed under Project Settings → Domains.
8. After first deploy, verify `/admin`, `/auth/login`, and the founder intake flow work correctly.

**Acceptance Criteria:**
- All three sections are present and accurate in `vercel-cheatsheet.md`.
- A developer with no prior project knowledge can follow the guide to run the app locally and deploy to their own Vercel account.

---

## Phase 2 — Project Restructuring

---

## [T8] Fix legacy `/backend/api/users` route in `useAuth` hook

**Phase:** Project Restructuring
**Priority:** High
**Files:**
- `src/hooks/useAuth.ts`
- `src/app/backend/` (check if route exists)
- `src/app/api/` (find correct replacement route)

**Description:**
`src/hooks/useAuth.ts` calls `/backend/api/users` to check the current session. This path appears to be a leftover from a previous monorepo layout where the backend lived in a separate `/miv-backend` package. This route likely does not exist in the current single-app structure, causing silent 404s or auth failures.

**Steps:**
1. Check if `src/app/backend/api/users/` exists and is a valid Next.js route.
2. If it does not exist, identify the correct replacement:
   - For session info: use NextAuth's `/api/auth/session` endpoint or the `useSession()` hook from `next-auth/react`.
   - For user data: use the appropriate Payload CMS API route or a new Next.js API route under `src/app/api/`.
3. Update `src/hooks/useAuth.ts` to call the correct route.
4. Test by logging in as each user role (admin, analyst, founder) and verifying the hook returns correct session data.

**Acceptance Criteria:**
- `useAuth` resolves a valid session without any 404 responses.
- All user roles return correct session data.
- No references to `/backend/api/` remain in the codebase.

---

## [T9] Re-enable intake notification emails

**Phase:** Project Restructuring
**Priority:** High
**Files:**
- `src/hooks/intakes.ts`
- `src/lib/email-service.ts`

**Description:**
Intake notification emails were disabled during the EmailJS → Nodemailer migration. A TODO comment marks the location in `src/hooks/intakes.ts`. New intake submissions currently send no confirmation to founders and no notification to admins.

**Steps:**
1. Review `src/lib/email-service.ts` to understand the existing Nodemailer methods (e.g. `sendWelcomeEmail`).
2. Add two new methods to the email service:
   - `sendIntakeConfirmationToFounder(founderEmail, ventureData)` — confirms receipt of their intake submission.
   - `sendIntakeNotificationToAdmin(adminEmail, ventureData)` — notifies the admin of a new submission.
3. Create HTML/text email templates for both (can be simple inline templates to start).
4. In `src/hooks/intakes.ts`, remove the TODO comment and call both email methods after a successful intake save.
5. Test by submitting a test intake locally and confirming both emails are received.
6. Add the `ADMIN_NOTIFICATION_EMAIL` env var to `.env.example` if not already present (see T2).

**Acceptance Criteria:**
- Submitting a new intake form triggers a founder confirmation email.
- An admin notification email is sent to `ADMIN_NOTIFICATION_EMAIL`.
- No TODO comments related to email notifications remain in `src/hooks/intakes.ts`.

---

## [T10] Fix IRIS catalog seed path bug

**Phase:** Project Restructuring
**Priority:** Low
**Files:**
- `src/prisma/seed.ts` (or wherever `iris-catalog.json` is referenced)

**Description:**
The seed script references `lib/iris-catalog.json` but the file is located at `src/lib/iris-catalog.json`. This causes `pnpm db:seed` to fail with a file-not-found error when seeding IRIS catalog data.

**Steps:**
1. Search for `iris-catalog` in the codebase to find all references: `grep -r "iris-catalog" src/`.
2. Update each path reference from `lib/iris-catalog.json` to `src/lib/iris-catalog.json` (or use a path relative to the file, e.g. `path.join(__dirname, '../lib/iris-catalog.json')`).
3. Run `pnpm db:seed` and confirm it completes without error.

**Acceptance Criteria:**
- `pnpm db:seed` completes successfully with no file-not-found error.
- IRIS catalog data is correctly seeded into the database.

---

## [T11] Add a CI/CD pipeline — build and test on push

**Phase:** Project Restructuring
**Priority:** Medium — depends on T3
**Files:**
- `.github/workflows/ci.yml` (new file)

**Description:**
No build/test pipeline currently exists in GitHub Actions. The only workflow is an upstream sync job. Vercel handles deployments via push-to-deploy, but there is no lint/build/test gate, meaning broken code can be deployed. A CI workflow should gate all PRs to `main` and `development`.

**Pre-requisite:** T3 (fix silent TS/ESLint errors) must be completed first, otherwise the CI build will fail due to suppressed errors being surfaced.

**Steps:**
1. Create `.github/workflows/ci.yml`.
2. Trigger: `push` and `pull_request` targeting `main` and `development` branches.
3. Jobs:
   - **lint-and-build**: `pnpm install → pnpm lint → pnpm build`
   - **test**: `pnpm install → pnpm test:int` (Vitest unit/integration)
   - **e2e** (optional, separate job): `pnpm install → pnpm test:e2e` (Playwright)
4. Set required environment variables for the build job (use GitHub Actions secrets): `DATABASE_URL` (can be a test DB), `MONGODB_URI`, `NEXTAUTH_SECRET`, `PAYLOAD_SECRET`.
5. Enable branch protection on `main` requiring the `lint-and-build` and `test` jobs to pass before merge.

**Acceptance Criteria:**
- PRs to `main` and `development` trigger the CI workflow.
- PRs cannot be merged if lint, build, or unit tests fail.
- Workflow file is documented with comments explaining each step.

---

## [T12] Add unit/integration tests for email service and auth

**Phase:** Project Restructuring
**Priority:** Medium
**Files:**
- `src/lib/email-service.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `vitest.config.mts`
- `vitest.setup.ts`

**Description:**
No tests currently exist for the email service or the authentication credentials provider. These are two critical paths that should have test coverage, especially after the EmailJS → Nodemailer migration and the auth security fixes in T6.

**Steps:**
1. Write tests for `src/lib/email-service.ts`:
   - Mock the Nodemailer transporter.
   - Test `sendWelcomeEmail`: verifies the correct recipient, subject, and body are used.
   - Test `sendIntakeConfirmationToFounder` and `sendIntakeNotificationToAdmin` (after T9).
2. Write tests for the NextAuth credentials provider:
   - Valid credentials → returns user object.
   - Invalid password → returns null.
   - Non-existent email → returns null.
   - `admin123` bypass removed → ensure it is rejected (after T6).
3. Run all tests: `pnpm test:int`.
4. Ensure tests are co-located or placed under `src/__tests__/` following existing conventions.

**Acceptance Criteria:**
- At minimum 3 tests for the email service and 3 for the credentials provider.
- All tests pass with `pnpm test:int`.
- Tests do not make real network calls (use mocks/stubs for Nodemailer and Prisma).

---

## [T13] Evaluate and document dual-database architecture

**Phase:** Project Restructuring
**Priority:** Low — research only, no code changes
**Files:**
- `docs/SYSTEM_ARCHITECTURE.md`
- `docs/INTERNAL_DEV_GUIDE.md`

**Description:**
The application uses two separate databases: MongoDB (for Payload CMS) and PostgreSQL (for Prisma). This adds operational complexity — two connection strings, two Docker services, two migration systems, and two separate auth user stores. This task is a research and documentation effort to evaluate whether consolidation is feasible or if the dual-DB design should be formalised as a deliberate architectural decision.

**Steps:**
1. Review what each database stores (MongoDB: Payload collections — users, ventures, intakes, files, logs; PostgreSQL: Prisma models — users, sessions, dashboards, workflows, fund operations).
2. Identify overlap: both databases have a `users` table/collection with different auth layers — this is the primary pain point.
3. Assess feasibility of consolidation:
   - Can Payload CMS use PostgreSQL instead of MongoDB? (Payload 3.x supports `@payloadcms/db-postgres`.)
   - What would be lost/gained?
4. Write an Architecture Decision Record (ADR) in `docs/SYSTEM_ARCHITECTURE.md` (or a new `docs/ADR-001-dual-database.md`) covering: context, decision, alternatives considered, consequences.
5. Include a recommendation (consolidate, keep dual-DB, or defer).

**Acceptance Criteria:**
- An ADR is written and committed to `docs/`.
- The ADR clearly states the current situation, trade-offs, and a recommendation.
- `docs/INTERNAL_DEV_GUIDE.md` is updated to link to the ADR.

---

## [T14] Update and clean up documentation

**Phase:** Project Restructuring
**Priority:** Medium
**Files:**
- `README.md`
- `docs/INTERNAL_DEV_GUIDE.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/SYSTEM_ARCHITECTURE.md`

**Description:**
Several documentation files reference a previous monorepo layout (`/miv`, `/miv-backend` sub-folders) that no longer exists. The current structure is a single Next.js app at the repo root. `docs/INTERNAL_DEV_GUIDE.md` also has empty placeholder sections. Outdated documentation causes confusion for new developers onboarding to the project.

**Steps:**
1. In `README.md`:
   - Remove any references to `/miv` or `/miv-backend` sub-folders.
   - Update the folder structure diagram to match the current `src/` layout.
   - Ensure all local setup steps are accurate and tested (compare with `vercel-cheatsheet.md` after T7).
2. In `docs/INTERNAL_DEV_GUIDE.md`:
   - Fill in any blank/placeholder sections.
   - Update the "Repository Structure" section to match the current layout.
   - Add a "Required Environment Variables" section (cross-reference with T2).
3. In `docs/PROJECT_OVERVIEW.md` and `docs/SYSTEM_ARCHITECTURE.md`:
   - Update any architecture diagrams or descriptions that reference old packages.
   - Reflect the dual-database design accurately (or link to the ADR from T13).
4. Have a second developer review the updated docs by attempting to follow the local setup guide from scratch.

**Acceptance Criteria:**
- No references to `/miv` or `/miv-backend` remain in any documentation file.
- A developer with no prior project knowledge can run the app locally by following only `README.md` and `docs/INTERNAL_DEV_GUIDE.md`.
- All placeholder sections in `docs/INTERNAL_DEV_GUIDE.md` are filled in.
