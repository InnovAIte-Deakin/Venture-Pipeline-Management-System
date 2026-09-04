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
├── miv/                 # Frontend (Next.js VPMS application)
├── miv-backend/         # Backend (Payload CMS)
├── docs/                # Project documentation
└── README.md
```

---

## 3. System Overview

VPMS is composed of two services that must run together:

* **Frontend (VPMS App)**

  * Built with Next.js
  * Provides dashboards and UI for founders and admins
  * Uses NextAuth for authentication
  * Uses Prisma with PostgreSQL for application data

* **Backend (Payload CMS)**

  * Built with Payload CMS
  * Handles document uploads, metadata, and review workflow
  * Enforces role-based access control
  * Uses MongoDB for CMS and document data
  * Runs using Docker

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

### Step 1: Start Backend (Payload CMS)

```bash
cd miv-backend
docker compose up -d
```

This starts Payload CMS and required database services.

To stop backend services:

```bash
docker compose down -v
```

---

### Step 2: Start Frontend (VPMS Application)

```bash
cd miv
npm install
npm run dev
```

---

### Step 3: Access Application

Open:

```
http://localhost:3000
```

> Both backend and frontend must be running for the system to work.

---

## 7. Environment Configuration

* `.env` files are not tracked (removed from the repo in #78, ignored via `.gitignore`). Create your own copy from the template: `cp .env.example .env` in `miv-backend/` (and in `miv/`), then fill in the values
* `PAYLOAD_SECRET` must be identical in `miv/.env` and `miv-backend/.env` since #78 — the frontend proxy verifies the session token with it
* To test e-mail locally, put your own SMTP credentials (e.g. a Gmail app password) in the `SMTP_*` variables of `miv-backend/.env`
* Secrets must not be committed to version control
* Values may differ between development and production

---

## 8. Intake Notification Email Configuration

* Sends a confirmation email to the founders when a venture intake is submitted.
* It uses email service from miv-backend/src/lib/email-service.ts to send the email.
* Adde the real time email feature in miv-backend/src/hooks/intakes.ts using the afterIntakeCreate hook.

### Environment Variables
SMTP_HOST = 
SMTP_PORT = 
SMTP_USER = 
SMTP_PASS = 
SMTP_FROM_EMAIL = 

* During development, emails can be tested using free service like Mailtrap instead of sending messages to real email addresses.
* When the application is deployed to production, configure the SMTP settings provided by the official email service and keep the credentials securely stored as deployment secrets rather than committing them to a .env file.

### To Test Locally
* A temporary testing endpoint is available at src/app/api/email/test-intake/route.ts to test the intake email without going through the full submission process.
* The endpoint accepts a POST request containing founderEmail, founderName, ventureName, and an optional country field.

> End-to-end testing through the actual intake submission form is currently not possible because of a separate issue with venture creation, which is explained in the Common Issues section.

## 9. Common Issues

* Frontend not loading → ensure `npm run dev` is running in `miv`
* Backend unavailable → ensure Docker containers are running
* Login issues → verify NextAuth environment variables
* Document upload errors → check file size/type restrictions
* Intake email not working → check that the required SMTP settings are correctly added in the .env file.
The full intake submission is currently affected by a separate venture creation issue, which is not related to the email setup.

---

## 10. Troubleshooting
### Prisma P1000 Authentication Failed
#### Issue

During local development, developers may encounter the following error when running:

```bash
npm run db:push
```

```
Error: P1000: Authentication failed against database server
```

#### Cause
This issue may occur if a local PostgreSQL service is already running on port **5432**. In this case, Prisma attempts to connect to the local PostgreSQL instance instead of the PostgreSQL Docker container used by the VPMS project.
#### Resolution

1. Check which process is using port 5432:
```cmd
netstat -ano | findstr :5432
```

2. If a local PostgreSQL service is running, identify the service:
```cmd
sc query type= service | findstr /I postgres
```

3. Stop the local PostgreSQL service (example):
```cmd
net stop postgresql-x64-18
```

4. Verify that only the Docker PostgreSQL container is listening on port 5432:
```cmd
netstat -ano | findstr :5432
```

5. Run the Prisma setup commands again:
```bash
npm run db:push
npm run db:seed
```

If successful, the database schema will be synchronised and the development data will be seeded successfully.
## 11. Maintenance Notes

* Payload CMS collections and access rules are defined in backend config
* Prisma schema changes require migrations
* Update documentation when system behaviour changes

