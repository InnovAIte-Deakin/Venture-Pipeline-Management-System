# VPMS Documentation Index

*Mekong Inclusive Ventures – Venture Pipeline Management System*

This folder contains the consolidated and finalised documentation for the VPMS project.

## 📘 Documentation Set

### 1. Project Context

- **[Project Overview](./PROJECT_OVERVIEW.md)**
  Purpose, goals, scope, and stakeholders.

### 2. Requirements

- **[Requirements & SRS](./REQUIREMENTS_SRS.md)**
  Functional and non-functional requirements aligned with the PRD and handover.

### 3. System Design

- **[System Architecture](./SYSTEM_ARCHITECTURE.md)**
  High-level architecture covering the VPMS application and Payload CMS backend.

### 4. User Documentation

- **[User Guide](./USER_GUIDE.md)**
  Instructions for founders and admins using the document system.

### 5. Internal Documentation

- **[Internal Developer Guide](./INTERNAL_DEV_GUIDE.md)**
  Setup, configuration, authentication, and development notes.

- **[API Contract v1.2](./API_CONTRACT_V1.md)**

- **[MIV API Reference](../miv/docs/API_REFERENCE.md)**
  Implementation/reference documentation for the MIV application's API routes.

### 6. Architecture Decision Records

- **[ADR-001: Dual Database and Authentication Assessment](./adr/ADR-001-Dual-Database-and-Authentication-Assessment.md)**
  Assessment of the dual PostgreSQL/MongoDB and authentication setup.

- **[ADR-002: Next.js Version Split](./adr/ADR-002-Nextjs-Version-Split.md)**
  Decision to keep miv on Next.js 16 and bump miv-backend to Next.js 15.4.11, rather than matching major versions across both apps.

- **[ADR-003: Documents/DataRoomFiles Consolidation](./adr/ADR-003-documents-dataroomfiles-consolidation.md)**
  Architecture decision record for consolidating the `documents` and `dataRoomFiles` collections. Currently unsigned/proposed.

### 7. Security & Access Control

- **[RBAC Matrix](./rbac/RBAC_MATRIX.md)**
  Canonical roles × collections × fields × routes, anomaly register, and adoption sequence. Audited against #57.

- **[Canonical Role List](./rbac/roles.json)**
  Single source of truth for role names both apps must reference (founder, admin, miv_analyst; mentor/investor deferred).

### 8. Governance & Decisions

- **[Phase 0 Consolidation Plan](./planning/phase-0-consolidation-plan.md)**
  Decision log, field inventory, enum reconciliation, computed-status analysis, and migration/rollback plan for the consolidation above.

### 9. Team Progress

- **[Frontend Progress](./progress/FRONTEND_PROGRESS.md)**
  Week-by-week record of completed Frontend work, updated at the end of every week.

- **[Backend Progress](./progress/BACKEND_PROGRESS.md)**
  Week-by-week record of completed Backend work, updated at the end of every week.

## 📌 Notes

- This documentation reflects the **current MVP implementation**.
- Advanced AI features and enterprise compliance are considered **future scope**.