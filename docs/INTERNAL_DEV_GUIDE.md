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

* Environment variables are defined in `.env` and `.env.example`
* Secrets must not be committed to version control
* Values may differ between development and production

---

## 8. Common Issues

* Frontend not loading → ensure `npm run dev` is running in `miv`
* Backend unavailable → ensure Docker containers are running
* Login issues → verify NextAuth environment variables
* Document upload errors → check file size/type restrictions

---

## 9. Maintenance Notes

* Payload CMS collections and access rules are defined in backend config
* Prisma schema changes require migrations
* Update documentation when system behaviour changes
