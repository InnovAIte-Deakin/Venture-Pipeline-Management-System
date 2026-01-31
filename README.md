# MIV Platform – Venture Pipeline Management System (VPMS)

<div align="center">

![MIV Platform](https://img.shields.io/badge/MIV-Platform-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge)
![Stage](https://img.shields.io/badge/Stage-MVP-orange?style=for-the-badge)

**Venture pipeline management platform developed for Mekong Inclusive Ventures (MIV)**

[![Documentation](https://img.shields.io/badge/Documentation-Complete-blue?style=for-the-badge)](./docs/DOCUMENTATION_INDEX.md)

</div>

---

## 📌 Platform Overview

The **MIV Platform (VPMS)** is a **minimum viable product (MVP)** developed to support venture pipeline operations for Mekong Inclusive Ventures.

The platform focuses on enabling founders to securely submit venture-related documents and allowing MIV administrators to review, approve, reject, or request changes through a structured workflow.

This repository represents an **early-stage implementation** intended for demonstration, evaluation, and further iteration.

---

## 🏗️ System Architecture (High Level)

The system consists of two primary services that run together:

* **Frontend – VPMS Application**

  * Built with Next.js
  * Used by founders and administrators
  * Handles authentication, dashboards, and document interactions

* **Backend – Payload CMS**

  * Manages document storage, metadata, and review workflow
  * Enforces role-based access control
  * Runs as a containerised service using Docker

Application authentication and user data are managed using PostgreSQL via Prisma. Document and CMS data are managed using MongoDB.

---

## 🚀 Core Features (Current MVP)

* Secure document upload and storage
* Document review workflow:

  * Pending
  * Approved
  * Rejected
  * Needs Changes
* Role-based access control (founders vs admins)
* User authentication via NextAuth (Google OAuth and credentials login)
* Clear document categorisation and status visibility

---

## 🛠️ Technology Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* NextAuth

### Backend

* Payload CMS
* Node.js
* Docker & Docker Compose

### Databases

* PostgreSQL (application and authentication data)
* MongoDB (CMS and document data)

---

## 🤖 Running Locally

The MIV Platform consists of two main components that need to be running for local development. Follow these steps to get your local environment up and running.

### 🧱 **miv-backend** | Auth, Storage, and CMS

The backend service provides authentication, database storage, and content management system capabilities using Docker.

```bash
# Navigate to backend directory
cd ./miv-backend

# Start backend services (PostgreSQL, Redis, Auth services)
docker compose up -d

# Stop and remove services with data cleanup (when needed)
docker compose down -v
```

### 🧱 **miv** | Frontend Application

The main frontend application built with Next.js. Make sure the backend is running before starting the frontend.

```bash
# Navigate to frontend directory
cd ./miv

# Install dependencies
npm i

# Generate Prisma client (if you made schema changes)
npm run db:generate

#Push database schema changes
npm run db:push

# Seed database with initial data and test users
npm run db:seed

# Start development server
npm run dev
```

🎉 **Your application should now be running at [http://localhost:3000](http://localhost:3000)**

### 🌐 **Application URLs**

**Frontend:**
- Main Application: [http://localhost:3000](http://localhost:3000)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

**Backend:**
- API Server: [http://localhost:3001](http://localhost:3001)
- Admin/CMS Panel: [http://localhost:3001/admin](http://localhost:3001/admin)

**Database Management:**
- MongoDB UI (mongo-express): [http://localhost:8081](http://localhost:8081)

### 🔐 **Default Credentials**

**Frontend & Backend:**
```
Username: admin@example.com
Password: changeme123

Username: founder@example.com
Password: changeme123

Username: analyst@example.com
Password: changeme123
```

**Admin/CMS Backend:**
```
Username: venture.manager@miv.org
Password: VentureMgr@123
```

---

## 📚 Hosting with Vercel

Vercel.com is the hosting provider that this project uses.

### Development
- ....


### Product (TBA)
- Devilivered via release branches

---

## 📚 Documentation

All project documentation has been consolidated in the `/docs` directory.

➡️ **Start here:** 
- 📘 [Documentation Index](./docs/DOCUMENTATION_INDEX.md)

### Core Documents
- 📄 [Project Overview](./docs/PROJECT_OVERVIEW.md)
- 📄 [Requirements & Software Requirements Specification (SRS)](./docs/REQUIREMENTS_SRS.md)
- 📄 [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- 📄 [User Guide](./docs/USER_GUIDE.md)
- 📄 [Internal Developer Guide](./docs/INTERNAL_DEV_GUIDE.md)
---

## 📄 Project Status

This repository represents a **functional MVP** developed as part of a capstone initiative. The system is not intended for production deployment in its current form and may contain incomplete features or minor bugs.
