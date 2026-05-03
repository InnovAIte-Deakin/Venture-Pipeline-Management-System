# Internal Developer Guide

## Venture Pipeline Management System (VPMS)

---

## 1. Purpose

This guide explains how to set up, run, and maintain the Venture Pipeline Management System (VPMS) for internal development.

All instructions reflect the **current, official implementation provided by the development team** and are aligned with the project README.

---

## 2. Repository Structure

```
/
├── src/
│   ├── app/             # Next.js App Router pages and API routes
│   ├── collections/     # Payload CMS collections
│   ├── prisma/          # Prisma schema and seed scripts
│   └── lib/             # Shared services and utilities
├── docs/                # Project documentation
├── docker-compose.yml   # Local MongoDB and PostgreSQL services
├── package.json         # Application scripts
└── README.md
```

---

## 3. System Overview

VPMS uses one application codebase with two required data services:

* **Application (Next.js + Payload)**

  * Built with Next.js
  * Provides dashboards and UI for founders and admins
  * Uses NextAuth for authentication
  * Uses Prisma with PostgreSQL for application data

* **Data Services**

  * MongoDB for Payload CMS content and document data
  * PostgreSQL for Prisma-managed relational data
  * Both can be started locally via Docker Compose

---

## 4. Authentication

Authentication is implemented using **NextAuth** with:

* Google OAuth
* Credentials-based login (email and password)
* JWT-based sessions
* Prisma adapter for persistence in PostgreSQL

### Development Test Accounts

**VPMS Application:**

* Admin: `admin@example.com` / `changeme123`
* Founder: `founder@example.com` / `changeme123`
* Analyst: `analyst@example.com` / `changeme123`

**Payload CMS Admin:**

* `venture.manager@miv.org` / `VentureMgr@123`

> These accounts are for development and testing only.

---

## 5. Databases

* **PostgreSQL**

  * Stores users, sessions, and authentication data
  * Managed via Prisma ORM

* **MongoDB**

  * Used by Payload CMS
  * Stores documents, metadata, and review states

---

## 6. Local Development Setup (Canonical)

VPMS requires **two running services**:

### Prerequisites

* Node.js (LTS)
* npm
* Docker and Docker Compose
* Git

---

### Step 1: Start Local Databases

```bash
docker compose up -d mongo postgres
```

This starts the MongoDB and PostgreSQL services used by the application.

To stop backend services:

```bash
docker compose down -v
```

---

### Step 2: Start Frontend (VPMS Application)

```bash
pnpm install
pnpm run db:generate
$env:DATABASE_URL="postgresql://app_miv:supersecret@localhost:5432/app_miv?schema=public"; pnpm run db:push
$env:DATABASE_URL="postgresql://app_miv:supersecret@localhost:5432/app_miv?schema=public"; pnpm run db:seed
pnpm run dev
```

---

### Step 3: Access Application

Open:

`http://localhost:3000`

The Payload admin is available at `http://localhost:3000/admin`.

Both MongoDB and PostgreSQL must be running for the full system to work.

---

## 7. Environment Configuration

* Environment variables are defined in `.env`, `.env.local`, and `.env.example`
* Secrets must not be committed to version control
* Values may differ between development and production

Minimum local variables for current development:

```dotenv
MONGODB_URI="mongodb://127.0.0.1:27017/payload"
DATABASE_URL="postgresql://app_miv:supersecret@localhost:5432/app_miv?schema=public"
PAYLOAD_SECRET="replace-with-long-random-string"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 8. Common Issues

* App not loading → ensure `pnpm run dev` is running from the repository root
* Prisma commands fail with `Environment variable not found: DATABASE_URL` → define `DATABASE_URL` or export it inline when running Prisma commands
* Payload or document features fail → ensure MongoDB is running and `MONGODB_URI` is set
* Prisma commands fail to connect → ensure `docker compose up -d postgres` is running
* Login issues → verify NextAuth environment variables
* Document upload errors → check file size/type restrictions

---

## 9. Maintenance Notes

* Payload CMS collections and access rules are defined under `src/collections`
* Prisma schema is located at `src/prisma/schema.prisma`
* Prisma scripts in `package.json` use the schema path explicitly
* The verified local PostgreSQL connection string from `docker-compose.yml` is `postgresql://app_miv:supersecret@localhost:5432/app_miv?schema=public`
* Update documentation when system behaviour changes
