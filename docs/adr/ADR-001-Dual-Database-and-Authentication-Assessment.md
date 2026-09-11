# ADR-001: Dual Database and Authentication Assessment

## Status

**Proposed**

This ADR is based on the current codebase audit and is intended to support future architectural decisions regarding database and authentication management.

## Context

The Venture Pipeline Management System (VPMS) consists of two primary applications:

- **VPMS Application (`miv`)** – A Next.js application using Prisma with PostgreSQL.
- **Payload Backend (`miv-backend`)** – A Payload CMS application using MongoDB through the Mongoose adapter.

During development, concerns were raised regarding duplicate data storage and multiple authentication mechanisms. An architectural audit was conducted to determine whether overlapping functionality exists between the two applications and to identify areas that may require future consolidation.

## Problem Statement

The project contains two separate applications that both manage core business data and user authentication.

The purpose of this assessment is to determine:

- whether duplicate entities exist across the two systems;
- whether multiple authentication implementations are present;
- the architectural implications of the current design; and
- recommendations that can guide future architectural decisions.

## Current Architecture

The current implementation consists of two independent applications that work together to deliver the VPMS platform.

### VPMS Application (`miv`)

- Built using Next.js (App Router)
- Uses Prisma ORM
- Connects to a PostgreSQL database
- Contains business entities such as Users, Ventures, Documents, Activities, Projects, Tasks, Reports, and other relational data
- Includes a configured NextAuth authentication system with Google OAuth and Credentials providers

### Payload Backend (`miv-backend`)

- Built using Payload CMS
- Uses the Mongoose adapter
- Connects to a MongoDB database
- Manages Payload collections including Users, Ventures, Documents, Activity Logs, Media, Agreements, Data Room Files, Onboarding Intakes, User Settings, and System Settings
- Uses Payload's built-in authentication for the Users collection

## Findings

### Database Audit

The audit confirmed that the system currently uses two separate databases.

| Application | Database | Technology |
|---|---|---|
| VPMS Application (`miv`) | PostgreSQL | Prisma ORM |
| Payload Backend (`miv-backend`) | MongoDB | Payload CMS with Mongoose Adapter |

The dual-database architecture is intentional and aligns with the current system architecture documentation. PostgreSQL is used for structured relational application data, while MongoDB is used by Payload CMS to manage content, documents, and CMS collections.

### Authentication Audit

The audit identified two authentication implementations within the current codebase.

#### NextAuth

The VPMS application includes a configured NextAuth authentication system that:

- Uses Google OAuth and Credentials providers
- Uses the Prisma Adapter
- Stores session information using JWT
- Connects to the PostgreSQL database through Prisma

#### Payload Authentication

The Payload backend enables authentication through the `users` collection using Payload's built-in authentication system. The backend exposes authentication endpoints that are currently used by the frontend.

#### Current Behaviour

Although NextAuth remains configured, the current Login and Register pages communicate directly with the Payload backend using:

- `/backend/api/users/login`
- `/backend/api/register`

This indicates that two authentication implementations currently coexist within the project.

### Duplicate Entities

The audit identified several business entities that exist in both the VPMS application and the Payload backend.

| Entity | VPMS (Prisma/PostgreSQL) | Payload (MongoDB) |
|---|---|---|
| Users | ✓ | ✓ |
| Ventures | ✓ | ✓ |
| Documents | ✓ | ✓ |
| Activity Logs | ✓ | ✓ |

Additional Payload-only collections include:

- Media
- Agreements
- Data Room Files
- Onboarding Intakes
- User Settings
- System Settings

### Architectural Observations

The current implementation demonstrates overlap between the two applications.

Observed areas of duplication include:

- User management
- Venture information
- Document management
- Activity logging
- Authentication mechanisms

While the dual-database architecture appears intentional, the duplication of core entities and authentication logic increases architectural complexity and may lead to additional maintenance effort if both implementations continue to evolve independently.

## Consequences

The current architecture provides flexibility by separating the application and CMS responsibilities. However, the audit identified several consequences of maintaining duplicate functionality across both systems.

### Benefits

- Clear separation between the application and CMS.
- Payload CMS provides document management capabilities.
- PostgreSQL remains suitable for structured relational business data.
- Independent services can be deployed and scaled separately.

### Challenges

- Core business entities are maintained in two systems.
- Two authentication implementations increase maintenance complexity.
- Future enhancements may require synchronising duplicate data.
- Developers may be uncertain which application is the source of truth for shared entities.

## Architectural Options Considered

### Option 1 – Maintain the Current Architecture

- Continue using PostgreSQL for the VPMS application and MongoDB for Payload CMS.
- Maintain both authentication implementations until a future architectural decision is approved.

**Pros**

- No immediate development effort.
- Minimal disruption to the current system.

**Cons**

- Duplicate business entities remain.
- Two authentication mechanisms require ongoing maintenance.

### Option 2 – Consolidate Authentication

- Select either NextAuth or Payload Auth as the single authentication service.

**Pros**

- Reduced maintenance.
- Clear authentication ownership.

**Cons**

- Requires migration effort and testing.
- Requires a formal architectural decision before implementation.

### Option 3 – Consolidate Shared Business Entities

- Define a single source of truth for Users, Ventures, Documents, and Activity data.

**Pros**

- Reduced duplication.
- Clear ownership of business data.

**Cons**

- Requires architectural planning and data migration.
- Requires agreement on ownership before implementation.

## Decision

At this stage, the project will continue operating with the existing dual-database architecture while the identified duplication is reviewed by the development team.

The current dual-database architecture is therefore retained for now:

- PostgreSQL remains in use by the VPMS application (`miv`).
- MongoDB remains in use by the Payload backend (`miv-backend`).
- No database consolidation is approved by this ADR.
- No authentication consolidation is approved by this ADR.
- No single source of truth for the duplicated entities is designated by this ADR.

No migration, data consolidation, authentication migration, or Sprint 3 database cut-over work is proposed as part of this assessment.

Any future change to the database or authentication architecture should be supported by a formal architectural decision and an agreed migration plan.

## Recommendations

The following recommendations are proposed for future consideration:

1. Determine and document the authoritative authentication service.
2. Review ownership of shared business entities across the VPMS application and Payload backend.
3. Minimise duplicated business logic where practical.
4. Define a clear source of truth for shared entities before any migration is started.
5. Update the system architecture documentation following any approved architectural changes.
6. Record future architectural decisions as additional ADRs.

## References

- `docs/SYSTEM_ARCHITECTURE.md`
- `docs/INTERNAL_DEV_GUIDE.md`
- `miv/prisma/schema.prisma`
- `miv/app/api/auth/[...nextauth]/route.ts`
- `miv-backend/src/payload.config.ts`
- `miv-backend/src/collections/users.ts`
- `miv-backend/src/collections/ventures.ts`
- `miv-backend/src/collections/documents.ts`
- `miv-backend/src/collections/activityLogs.ts`