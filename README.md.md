---
title: README.md

---

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

The **MIV Platform (VPMS)** is a minimum viable product (MVP) developed to support venture pipeline workflows for Mekong Inclusive Ventures.

The platform supports:
- Venture application submissions
- Document uploads and management
- Review and approval workflows
- User authentication and role-based access

This project was developed as part of a Capstone initiative.

---

## 🚧 Trimester 1 2026 Progress

Completed during Trimester 1:
- Repository and project setup
- User onboarding workflow
- Dashboard system
- Venture submission workflow
- Business profile management
- Meeting management system
- Document upload functionality
- Initial documentation structure
- Sprint planning and contributor coordination

Current focus areas:
- UI/UX improvements
- Workflow refinement
- Documentation expansion
- Accessibility improvements

---

## 🏗️ System Architecture

The platform consists of two main services:

### Frontend – VPMS Application
- Built with Next.js
- Used by impact users and administrators
- Handles dashboards, authentication, and workflows

### Backend – Payload CMS
- Handles document storage and workflow management
- Supports role-based access control
- Runs using Docker

### Databases
- PostgreSQL → Authentication and application data
- MongoDB → CMS and document data

---

## 🚀 Core Features

- Secure document uploads
- Venture review workflow
- Role-based access control
- User authentication
- Dashboard and status tracking
- Responsive and accessibility-focused UI design

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

## 📚 Documentation

All project documentation has been consolidated in the `/docs` directory.

➡️ **Start here:** 
- 📘 [VPMS Wiki Page](./docs/vpms-wiki.md)

## 📚 Documentation

Project documentation is located in the `/docs` directory.

### Documentation Structure

- `0-overview` → Project overview and FAQs
- `1-product` → Product planning and roadmap
- `2-design` → UI/UX and accessibility documentation
- `3-architecture` → System architecture documentation
- `4-features` → Feature documentation
- `5-development` → Development and contributor resources
- `6-process` → Workflow and process documentation
- `7-future` → Future improvements and roadmap planning

### Core Documents

- [Project Overview](./docs/0-overview/project-overview.md)
- [Project Requirements](./docs/0-overview/project-requirements.md)
- [System Architecture](./docs/3-architecture/system-architecture.md)
- [Information Architecture (IA)](./docs/2-design/information-architecture.md)
- [User Guide](./docs/0-overview/mobile-user-guide.md)
- [Internal Developer Guide](./docs/5-development/internal-dev-guide.md)
- [Product Roadmap](./docs/1-product/roadmap.md)
- [Changelog](./docs/6-process/changelog.md)

---

## 📄 Project Status

This repository represents a functional MVP developed as part of a Capstone project.

The platform is currently under active development and ongoing refinement. Mobile-focused workflows and responsive UI support are currently part of the design and planning process for future development stages.