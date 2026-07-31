---
title: system-architecture.md

---

# System Architecture
## Venture Pipeline Management System (VPMS)

---

# 1. Overview

The VPMS is designed using a modular web application architecture consisting of two main applications:

- **miv** — Frontend application for founders and administrators
- **miv-backend** — Backend service powered by Payload CMS

This separation improves maintainability, scalability, and organisation of responsibilities.

---

# 2. Frontend Application (`miv`)

### Technologies
- Next.js
- React
- TypeScript
- Auth.js (NextAuth)

### Responsibilities
- User authentication
- Dashboard interface
- Venture and document views
- Navigation and user interaction
- Communication with backend services

---

# 3. Backend Application (`miv-backend`)

### Technologies
- Payload CMS
- Node.js / Next.js backend architecture

### Responsibilities
- Document management
- File uploads
- Workflow management
- Access control
- Metadata storage

---

# 4. Database Architecture

The system uses PostgreSQL with Prisma ORM for relational application data such as:
- Users
- Sessions
- Authentication data
- Venture relationships

Payload CMS manages document-related content and metadata through its configured database adapter.

---

# 5. Authentication Flow

1. User logs into the VPMS frontend
2. Authentication handled through Auth.js
3. Session information is validated
4. User permissions are applied
5. Protected pages become accessible

---

# 6. Document Workflow

1. Founder uploads a document
2. Document is sent to the backend service
3. Metadata and workflow state are stored
4. Initial status is set to **Pending**
5. Admin reviews the submission
6. Status is updated:
   - Approved
   - Rejected
   - Needs Changes

---

# 7. Security Considerations

The system includes:
- Role-based access control
- Secure authentication handling
- File upload validation
- Environment variable protection for secrets and credentials

---

# 8. Deployment Context

The frontend and backend are maintained as separate applications.

Local development uses:
- Docker
- Environment-based configuration
- Isolated backend services

---

# 9. Current Scope

The system is currently implemented as an MVP (Minimum Viable Product).

The architecture is designed to support future improvements without requiring major redesign.