# ADR-001: Dual Database Architecture Evaluation

## Status
Proposed

## Context
The VPMS currently uses two databases. PostgreSQL is used by the main Next.js application through Prisma for application users, authentication, sessions, accounts, ventures, activities, tasks, reports, funds, notifications, and other structured business data. MongoDB is used by Payload CMS for CMS collections such as users, media, ventures, onboarding intakes, founders, agreements, data room files, activity logs, documents, system settings, and user settings.

The main architectural issue is that both systems contain a users table/collection. PostgreSQL has the main application user model, while Payload CMS also has a users collection with authentication enabled. This creates overlap in user identity, role management, and access control.

## Current Database Responsibilities

### PostgreSQL via Prisma
- Application users
- NextAuth accounts and sessions
- Ventures and related business data
- Documents metadata
- Activities, notifications, workflows, funds, reports, tasks, and projects

### MongoDB via Payload CMS
- Payload CMS users
- Media and uploaded files
- Venture-related CMS collections
- Onboarding intakes
- Agreements
- Data room files
- Activity logs
- Global settings and lookup data

## Identified Overlap
The main overlap is user management. PostgreSQL stores users for the main VPMS application and authentication flow. Payload CMS also stores users because its admin panel and CMS permissions depend on the Payload users collection.

This can cause:
- Duplicate user records
- Role mismatch between Prisma and Payload
- Extra maintenance when updating permissions
- Confusion over which database is the source of truth for users

## Feasibility: Can Payload use PostgreSQL?
Yes. Payload CMS supports PostgreSQL through the official `@payloadcms/db-postgres` adapter. Payload’s documentation states that Payload supports MongoDB, PostgreSQL, and SQLite database adapters, and PostgreSQL can be configured using `postgresAdapter` from `@payloadcms/db-postgres`. :contentReference[oaicite:0]{index=0}

However, moving Payload from MongoDB to PostgreSQL is not only a package change. It would require migration planning, schema testing, data export/import, environment updates, Docker Compose changes, and checking whether Payload-generated PostgreSQL tables can safely coexist with Prisma-managed tables.

## Alternatives Considered

### Option 1: Keep the current dual-database architecture
Continue using PostgreSQL for the main app and MongoDB for Payload CMS.

Advantages:
- Lowest risk for the current MVP
- No migration required
- Existing Payload setup continues working
- Clear separation between application data and CMS data

Disadvantages:
- User duplication remains
- More complex local setup
- Two databases to maintain
- Possible role and permission mismatch

### Option 2: Move Payload CMS to PostgreSQL
Replace `@payloadcms/db-mongodb` with `@payloadcms/db-postgres` and store both application and CMS data in PostgreSQL.

Advantages:
- One database technology
- Easier backup and deployment
- Reduces operational complexity
- Better long-term consolidation path

Disadvantages:
- Requires careful migration
- Payload and Prisma may manage different schemas in the same database
- Risk of breaking CMS collections or authentication
- Needs testing before implementation

### Option 3: Make PostgreSQL the source of truth for users only
Keep both databases, but treat PostgreSQL as the main source of truth for users and roles. Payload users would only be used for CMS/admin access where required.

Advantages:
- Reduces confusion around user ownership
- Safer than full migration
- Good short-term improvement

Disadvantages:
- Still keeps two user stores
- Requires documentation and role-sync rules
- Does not fully remove duplication

## Decision
For the current MVP, the recommended decision is to keep the dual-database architecture but document PostgreSQL as the primary source of truth for application users and authentication. Payload’s users collection should be treated as CMS/admin access data only.

A full migration of Payload CMS from MongoDB to PostgreSQL is feasible, but it should be planned as a future technical improvement rather than completed immediately during the MVP phase.

## Consequences
- The system remains stable for current development.
- The team avoids risky database migration during MVP delivery.
- Developers must understand that Prisma/PostgreSQL owns application users.
- Payload/MongoDB continues to manage CMS-specific collections.
- A future migration to `@payloadcms/db-postgres` can be considered after testing.

## Recommendation
Short term:
- Keep PostgreSQL and MongoDB.
- Document each database responsibility clearly.
- Avoid adding new duplicated user fields unless necessary.
- Use PostgreSQL/Prisma as the main source of truth for users and roles.

Long term:
- Test Payload with `@payloadcms/db-postgres`.
- Create a migration plan from MongoDB to PostgreSQL.
- Review whether Payload and Prisma should use the same PostgreSQL database or separate schemas.
- Consider removing MongoDB only after migration testing is successful.