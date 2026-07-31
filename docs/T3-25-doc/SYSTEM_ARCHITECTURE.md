# System Architecture
## Venture Pipeline Management System (VPMS)

---

## 1. Architecture Overview
The VPMS follows a modular web application architecture consisting of two primary subsystems:

1. **VPMS Application** — user-facing application for founders and admins  
2. **Payload CMS Backend** — document management and content backend

This separation supports clear responsibilities, scalability, and maintainability.

---

## 2. High-Level Architecture

### Components
- **Frontend (VPMS App)**
  - Next.js (App Router)
  - User dashboard and document interface
  - Handles user interaction and navigation

- **Authentication**
  - NextAuth
  - Supports Google OAuth and Credentials login
  - Session management via JWT
  - Uses Prisma Adapter

- **Relational Database**
  - PostgreSQL
  - Stores application users, sessions, and relational data
  - Accessed via Prisma ORM

- **Backend CMS**
  - Payload CMS (Next.js-based)
  - Manages document records, metadata, and access control
  - Handles secure file uploads and downloads

- **Document Database**
  - MongoDB
  - Stores Payload collections and document metadata

---

## 3. Dual Database Design

The system uses two databases, each serving a distinct purpose:

### PostgreSQL (via Prisma)
- Application-level users and authentication
- Session and account data
- Structured relational data

### MongoDB (via Payload CMS)
- Document records
- File metadata
- Role-based access rules
- Review workflow states

This design reflects a common real-world pattern where:
- Relational data is stored in PostgreSQL
- Content and document data is managed via a CMS backed by MongoDB

---

## 4. Core Data Flow

### User Authentication Flow
1. User accesses the VPMS application
2. Authentication handled via NextAuth
3. User session created and validated
4. Role information used to control access

### Document Upload & Review Flow
1. Founder logs into VPMS
2. Founder uploads a document
3. Document is sent to Payload CMS
4. Metadata stored in MongoDB
5. Initial status set to *Pending*
6. Admin reviews document
7. Admin updates status (*Approved*, *Rejected*, *Needs Changes*)
8. Updated status visible to authorised users

---

## 5. Security Considerations
- Role-based access control enforced at application and CMS level
- File type and size restrictions applied during upload
- Secure document access limited to authorised users
- Environment variables used for secrets and credentials

---

## 6. Deployment Context
- VPMS App and Payload CMS run as separate services
- Local development uses Docker for backend dependencies
- Environment configuration controls database connections and authentication

---

## 7. Architectural Constraints
- System is implemented as an MVP
- Enterprise-grade compliance certifications are outside current scope
- Architecture supports future enhancement without major redesign

