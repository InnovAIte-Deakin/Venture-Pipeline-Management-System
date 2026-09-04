# Venture Pipeline Management System (MIV)

A modern, mission-driven platform for Mekong Inclusive Ventures (MIV) to onboard ventures, manage pipeline progress, capture GEDSI context, track impact/readiness, and coordinate investor/partner engagement.

Built with **Next.js** (app UI), **Payload CMS** (secure headless backend), **MongoDB**, **Docker**, and tested end-to-end with **Playwright** and **Vitest**.

---

## Table of Contents

- [Venture Pipeline Management System (MIV)](#venture-pipeline-management-system-miv)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Tech Stack](#tech-stack)
  - [Data Model (Stage 1)](#data-model-stage-1)
  - [API Endpoints (Stage 1)](#api-endpoints-stage-1)
  - [Getting Started](#getting-started)
    - [1) Quick Start with Docker](#1-quick-start-with-docker)
    - [2) Local Dev (Node.js)](#2-local-dev-nodejs)
  - [Configuration](#configuration)
    - [.env example](#env-example)
      - [Root `.env`](#root-env)
      - [apps/api/.env (Payload)](#appsapienv-payload)
      - [apps/web/.env (Next.js)](#appswebenv-nextjs)
  - [Testing](#testing)
    - [Unit / Integration (Vitest)](#unit--integration-vitest)
    - [End-to-End (Playwright)](#end-to-end-playwright)
  - [Scripts](#scripts)
  - [Folder Structure](#folder-structure)
  - [Security \& Compliance](#security--compliance)
  - [Contributing](#contributing)
  - [Roadmap](#roadmap)
  - [License](#license)

---

## Features

- **Founder Intake & Venture Profiles**: Guided intake that captures narrative, basic GEDSI context, and initial artefacts (pitch, registration, etc.).
- **Pipeline Tracking**: “Fast track” vs “slow track,” stage gates, and activity logs.
- **Impact & Readiness Snapshot**: Fields to record early IRIS/GEDSI indicators and capital-readiness markers.
- **Agreements & E-Sign Hooks**: NDAs/MOUs with optional e-sign provider integration.
- **Data Room Files**: Centralised artefact storage with signed upload URLs.
- **Role-based Access**: `founder`, `miv_analyst`, `admin` with collection-level access rules in Payload.
- **Modern Admin**: Payload CMS admin for internal users; Next.js app for founder-facing flows.
- **CI-friendly Testing**: Vitest unit/integration + Playwright E2E.

---

## Architecture

```
apps/
  web (Next.js, front-end UI)
  api (Payload CMS, REST/GraphQL, auth, access control)
db/
  MongoDB (venture data, intake, artefacts metadata)
object storage
  S3-compatible (uploads via signed URLs)  ← optional local MinIO for dev
```

- **Next.js** serves the founder portal and analyst dashboards.
- **Payload CMS** exposes secured endpoints, admin UI, and enforces access rules.
- **MongoDB** stores venture records and logs.
- **S3/MinIO** stores uploaded artefacts (pitch decks, financials) via signed URLs.

---

## Tech Stack

- **Frontend**: Next.js (React, App Router), TypeScript, Tailwind
- **Backend**: Payload CMS (Node.js/Express), TypeScript
- **Database**: MongoDB
- **Storage**: S3-compatible (AWS S3 / MinIO for local)
- **Containerisation**: Docker & Docker Compose
- **Testing**: Playwright (E2E), Vitest (unit/integration)
- **Linting/Formatting**: ESLint, Prettier

---

## Data Model (Stage 1)

Collections (Payload):

- `users`
- `ventures`
- `onboardingIntakes`
- `founders`
- `agreements`
- `dataRoomFiles`
- `activityLogs`
- `lookups`
- `settings`

**Roles & Access** (example):

- `founder`: can create/update **own** intake data and see own venture status.
- `miv_analyst`: can view/update ventures, files, and activity logs; trigger agreements.
- `admin`: full access, system settings.

---

## API Endpoints (Stage 1)

> Base URL examples:
>
> - API (Payload): `http://localhost:4000`
> - Web (Next.js): `http://localhost:3000`

- `POST /api/intake/submit` — submit founder intake (public route with anti-abuse + server validation).
- `GET /api/ventures/:id/summary` — venture snapshot (secured).
- `POST /api/ventures/:id/assign-track` — assign fast/slow track (secured).
- `POST /api/agreements/:id/send-signature` — trigger e-sign workflow (secured; provider optional).
- `POST /api/uploads/signed-url` — get signed URL for artefact upload (secured).

> Note: exact shapes are defined in Payload collections and custom endpoints.

---

## Getting Started

### 1) Quick Start with Docker

Prereqs: Docker Desktop (or compatible) installed.

```bash
# 1) Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 2) Start the stack
docker compose up --build
```

- Next.js UI: [http://localhost:3000](http://localhost:3000)
- Payload Admin: [http://localhost:4000/admin](http://localhost:4000/admin)
- MongoDB: mongodb://localhost:27017 (container network internally)

> First-run seed/migrations (if provided) will run via `api` container entrypoint or with `npm run payload:migrate && npm run seed`.

### 2) Local Dev (Node.js)

Prereqs: Node 18+ and npm.

```bash
# install deps
npm install

# in parallel terminals
npm run dev:api     # starts Payload on :4000
npm run dev:web     # starts Next.js on :3000
```

---

## Configuration

### .env example

#### Root `.env`

```dotenv
# Shared
NODE_ENV=development

# S3 (optional for uploads)
S3_ENDPOINT=http://localhost:9000
S3_REGION=ap-southeast-2
S3_BUCKET=miv-uploads
S3_ACCESS_KEY_ID=dev-access-key
S3_SECRET_ACCESS_KEY=dev-secret
```

#### apps/api/.env (Payload)

```dotenv
PORT=4000
PAYLOAD_SECRET=replace-with-long-random-string
DATABASE_URI=mongodb://mongo:27017/miv # or your local mongodb URI
MONGODB_DB_NAME=miv

# CORS / URLs
SERVER_URL=http://localhost:4000
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:4000
WEB_APP_ORIGIN=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000

# Auth (example)
JWT_EXPIRY=7d

# Integrations (optional)
SLACK_WEBHOOK_URL=
ESIGN_PROVIDER=dropboxsign
ESIGN_PROVIDER_API_KEY=
```

#### apps/web/.env (Next.js)

```dotenv
PORT=3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> If you use MinIO locally, also run the MinIO service (see `docker-compose.yml`) and create the bucket defined in `S3_BUCKET`.

### Using as Backend for a Separate Frontend

When your frontend runs on a different origin (e.g., `http://localhost:3000`) and you want cookie-based sessions:

- Set `ALLOWED_ORIGINS` to a comma-separated list of allowed origins (e.g., `http://localhost:3000`).
- The API sets CORS headers and supports credentials via a middleware for `'/api/*'` routes.
- Auth cookie `payload-token` is issued with `SameSite=None` and `Secure` in production, allowing cross-site use.
- From the frontend, always send requests with credentials enabled:

```ts
// fetch example
await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include',
})

// axios example
axios.post('http://localhost:4000/api/auth/login', { email, password }, { withCredentials: true })
```

Notes:

- Browsers require `Secure` for `SameSite=None`; use HTTPS in production (or trusted localhost in dev).
- Ensure your frontend XHR base URL points to the API origin and includes credentials.

---

## Testing

### Unit / Integration (Vitest)

```bash
# run once
npm run test

# watch mode
npm run test:watch
```

- Place unit tests alongside code (`*.test.ts`).
- Integration tests can spin up in-memory Mongo or hit test DB.

### End-to-End (Playwright)

```bash
# install browsers once
npx playwright install

# run e2e (expects dev or docker stack running)
npm run test:e2e
```

- E2E tests live under `e2e/`.
- Configure baseURL to `http://localhost:3000` (web) and seed test data through `apps/api` test utilities.

> In CI, run `docker compose up -d` then `npm run test:e2e` with a wait-for-healthy step on API/Web.

---

## Scripts

Common npm scripts (root or workspace):

- `dev:web` — start Next.js dev server
- `dev:api` — start Payload dev server
- `build` — build all workspaces
- `start` — start production servers
- `lint` — run ESLint
- `format` — run Prettier
- `test` — Vitest
- `test:e2e` — Playwright
- `payload:migrate` — run Payload migrations
- `seed` — seed initial data (users, lookups, sample venture)

> Exact script names may vary per workspace; see each `package.json`.

---

## Folder Structure

```
.
├── apps/
│   ├── api/            # Payload CMS config, collections, hooks, endpoints
│   │   ├── src/
│   │   │   ├── collections/
│   │   │   ├── endpoints/
│   │   │   ├── hooks/
│   │   │   └── payload.config.ts
│   └── web/            # Next.js app (founder portal, analyst dashboards)
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── e2e/        # Playwright specs
├── db/                 # migrations, seed scripts
├── docker/             # optional docker entrypoints
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Security & Compliance

- **RBAC + Access Control**: Implemented at Payload collection/resolver level for `founder`, `miv_analyst`, `admin`.
- **Auth**: JWT sessions (short expiry) and secure cookie options for web; Bcrypt password hashing.
- **Validation**: Strong server-side validation of intake forms and uploads.
- **PII**: Limit exposure via field-level access; no sensitive fields in public responses.
- **Uploads**: Signed URLs; server never stores secrets in client code.
- **Auditability**: `activityLogs` record changes and touchpoints.
- **Secrets**: Use `.env` for local, and managed secret stores in staging/prod.

---

## Troubleshooting / Known Bugs

### Missing `@eslint/eslintrc` dependency

Lint passed locally by accident but failed on a clean install in CI, because `@eslint/eslintrc` wasn't properly declared as a dependency.

**Fix:** Add `@eslint/eslintrc` as a proper dependency.

### Old `require()` import in email test route

The rest of the codebase uses `import`, but the email test route still used `require()`. This masked the `createTransporter()` typo bug below, since the file wasn't being linted properly.

**Fix:** Swap to standard `import` syntax.

### `nodemailer.createTransporter()` typo

`createTransporter()` isn't a real method on `nodemailer` — it should be `createTransport()`. Went unnoticed because of the `require()` issue above breaking proper linting on that file.

**Fix:** Use `createTransport()`.

### pnpm lockfile drift + stray `package-lock.json`

The pnpm lockfile was out of sync, and a leftover `package-lock.json` was sitting in what's supposed to be a pnpm-only project. Mixing package managers causes lockfile drift.

**Fix:** Regenerate `pnpm-lock.yaml`, delete the npm lockfile.

### Duplicate variable declaration in `impact-users/route.ts`

A `const validation = ...` was declared twice in the same scope, which broke the build outright.

**Fix:** Remove the duplicate declaration.

---


## Contributing

1. Create a feature branch: `git checkout -b feat/short-name`
2. Commit with conventional messages: `feat(intake): add disability fields`
3. Open a PR and include:
   - Summary of changes
   - Screenshots for UI
   - Migration notes (if any)
   - Tests (Vitest/Playwright)

Coding standards: TypeScript strict mode, ESLint clean, Prettier formatted, no unused exports, accessible UI.

---

## Roadmap

- Stage 2: Deeper GEDSI fields & IRIS metric selection UX
- Stage 2: Investor/partner intros & tracking
- Stage 3: Advanced dashboards (readiness, GEDSI, sector lens)
- Stage 3: Multi-tenant support and audit exports
- Optional: AI-assisted intake guidance & document classification (read-only)

---

## License

Private repository. All rights reserved. Contact the maintainers for usage permissions.

---
