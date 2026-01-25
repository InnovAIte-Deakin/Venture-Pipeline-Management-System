# Internal Developer Guide

## Venture Pipeline Management System (VPMS)

---

## 1. Purpose

This document provides internal developers with clear instructions for setting up, running, and maintaining the Venture Pipeline Management System (VPMS) during the current development phase.

The guide reflects the **actual workflow used by the team**, based on project handover and onboarding messages.

---

## 2. Repository Structure

```
/
├── miv/                 # VPMS frontend application
├── miv-backend/         # Payload CMS backend
├── docs/                # Project documentation
└── README.md
```

---

## 3. System Components

### VPMS Application (Frontend)

* Built using **Next.js**
* Provides dashboards and UI for founders and admins
* Handles navigation and user interaction
* Uses **NextAuth** for authentication
* Uses **Prisma ORM** with **PostgreSQL** for application data

### Payload CMS Backend

* Built using **Payload CMS**
* Manages document uploads, metadata, and review workflow
* Enforces role-based access control
* Uses **MongoDB** as the backing database

---

## 4. Authentication

Authentication for the VPMS application is implemented using **NextAuth** with the following configuration:

* Google OAuth login
* Credentials-based login (email or user ID and password)
* Session management using **JWT**
* Prisma Adapter for persisting authentication-related data in PostgreSQL

> ⚠️ Development Note: A development-only bypass password exists for non-production environments. This must never be enabled or relied upon in production.

---

## 5. Databases

### PostgreSQL

* Stores application users and authentication/session data
* Managed using Prisma ORM
* Connection configured via environment variables

### MongoDB

* Used by Payload CMS
* Stores document records, metadata, and review workflow states

---

## 6. Local Development Setup

### Prerequisites

* Node.js (LTS)
* npm
* Local access to required databases (as configured for the project)

> Note: Docker configuration exists in the repository but is **not currently used** in the standard development workflow.

---

### Backend Setup (Payload CMS)

Open a terminal and run:

```bash
cd miv-backend
npm install
npm run dev
```

This starts the Payload CMS backend in development mode.

---

### Frontend Setup (VPMS App)

Open a second terminal and run:

```bash
cd miv
npm install
npm run dev
```

The VPMS application will be available at:

```
http://localhost:3000
```

---

## 7. Environment Configuration

* Environment variables are defined using `.env` and `.env.example` files
* Secrets such as database URLs and authentication secrets must not be committed to version control
* Configuration may differ between development and production environments

---

## 8. Common Issues

* **Authentication errors**: verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
* **Backend not running**: ensure `npm run dev` is active in `miv-backend`
* **Document upload issues**: check file type and size restrictions

---

## 9. Maintenance Notes

* Payload collections and access rules are defined in configuration files
* Prisma schema changes require migration updates
* Documentation should be updated alongside f

