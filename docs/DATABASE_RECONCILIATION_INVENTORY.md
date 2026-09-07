# Database Reconciliation Inventory

## 1. Purpose

This document records the current database structures and reconciliation differences between the Prisma/PostgreSQL implementation in `miv` and the Payload/MongoDB implementation in `miv-backend`.

The purpose is to support Phase 0 database reconciliation and identify areas requiring architectural decisions before any migration, write freeze, or cut-over.

This document is an inventory and assessment only. It does not establish a final database source of truth or approve a migration strategy.

## 2. Current Architecture

The VPMS currently contains two database-backed application implementations:

- `miv` uses Prisma with PostgreSQL.
- `miv-backend` uses Payload CMS with MongoDB through the Payload MongoDB adapter.

The two implementations contain overlapping concepts, but their schemas and responsibilities are not equivalent.

The current state therefore requires reconciliation before any database consolidation or migration can safely occur.

## 3. Prisma Inventory

The Prisma schema currently defines the following models:

- User
- Venture
- GEDSIMetric
- Document
- Activity
- CapitalActivity
- IRISMetricCatalog
- Notification
- EmailLog
- Account
- Session
- VerificationToken
- Workflow
- WorkflowRun
- CustomDashboard
- Fund
- LimitedPartner
- CapitalCall
- Distribution
- FundInvestment
- Project
- Task
- Announcement
- TeamEvent
- FundWorkflow
- FundLifecyclePhase
- FundOperationTask
- Report

The Prisma schema currently defines the following enums:

- UserRole
- VentureStatus
- VentureStage
- GEDSICategory
- MetricStatus
- DocumentType
- ActivityType
- CapitalActivityType
- CapitalStatus
- NotificationType
- EmailStatus
- WorkflowRunStatus
- FundStatus
- FundType
- LPType
- LPStatus
- RiskRating
- KYCStatus
- CapitalCallStatus
- DistributionType
- DistributionStatus
- ProjectStatus
- TaskStatus
- Priority
- FundWorkflowType
- WorkflowStatus
- LifecyclePhaseType
- LifecycleStatus
- FundTaskType
- FundTaskStatus
- ReportType
- ReportStatus

## 4. Payload Inventory

The current production Payload collection configuration contains the following collections:

- ActivityLogs
- Agreements
- DataRoomFiles
- Documents
- Founders
- Media
- OnboardingIntakes
- SystemSettings
- Users
- UserSettings
- Ventures

The `example-collection` directory is not counted as a production collection because it is not an exported `CollectionConfig` in the current collection inventory.

## 5. Entity Reconciliation

### 5.1 Users

There is a User entity in Prisma and an authenticated Users collection in Payload.

The Prisma User model supports a broader application user structure and defines its own `UserRole` enum.

The Payload Users collection is an authentication collection with `auth: true`. It currently contains:

- `first_name`
- `last_name`
- `role`
- Payload authentication fields

The Payload role field currently allows:

- founder
- miv_analyst
- admin
- user

The Prisma and Payload role systems are not equivalent.

The current architecture also contains both Prisma/NextAuth-related authentication and Payload authentication.

**Reconciliation status:** OPEN

**Key issue:** A canonical authentication owner and identity/role mapping have not been formally decided.

---

### 5.2 Ventures

Both systems contain a Venture concept, but the models are materially different.

The Prisma Venture model includes:

- lifecycle/status information
- venture stage
- funding information
- review information
- creator relationship
- assignee relationship
- activities
- capital activities
- documents
- fund investments
- GEDS I metrics
- projects

The Payload Ventures collection currently contains:

- required `name`
- required `country`
- required `city`
- required `sector`
- optional `website`
- optional `description`
- embedded founder information
- `triageTrack`
- `triageRationale`

The Payload representation is therefore not a direct equivalent of the Prisma Venture model.

**Reconciliation status:** OPEN

**Key issue:** Ownership of venture data and the mapping between the two representations has not been formally decided.

---

### 5.3 Documents

Both systems contain a Document concept, but there are significant differences.

The Prisma Document model contains:

- `id`
- `ventureId`
- `name`
- `type`
- `url`
- `uploadedAt`
- `updatedAt`

The Prisma document type is represented by the `DocumentType` enum.

The Payload Documents collection contains:

- required `documentType`
- stored `status`
- `version`
- `uploadedBy`
- `venture`
- `notes`
- `reviewedBy`
- `reviewedAt`

The Payload collection also stores uploaded files using its configured document upload storage.

Payload document status values include:

- `pending_review`
- `approved`
- `rejected`
- `needs_revision`

The two systems therefore differ in document fields, document types, status representation, relationships and file handling.

**Reconciliation status:** OPEN

**Key issue:** A canonical document model, document-type mapping, status representation and file ownership have not been formally decided.

---

### 5.4 Activity Logs

Both systems contain activity/audit information, but the representations are different.

The Prisma Activity model is associated with ventures and uses a typed `ActivityType` enum.

The Prisma activity types include events such as:

- venture creation
- venture updates
- metric additions
- metric updates
- document uploads
- stage changes
- capital activity
- notes

The Payload ActivityLogs collection is a more generic audit/event structure containing:

- actor relationship
- action
- entity
- entity ID
- metadata
- timestamp

The two representations should not be assumed to be one-to-one equivalents.

**Reconciliation status:** OPEN

**Key issue:** The ownership, purpose and mapping of activity/audit records require further architectural clarification.

## 6. Enum and Value Differences

The Prisma `DocumentType` enum currently contains:

- PITCH_DECK
- FINANCIAL_STATEMENTS
- BUSINESS_PLAN
- LEGAL_DOCUMENTS
- MARKET_RESEARCH
- TEAM_PROFILE
- OTHER

The Payload Documents collection currently allows:

- pitch_deck
- financial_statements
- legal_documents
- gedsi_reports
- impact_reports
- other

Shared concepts include pitch deck, financial statements, legal documents and other.

Prisma-only document types include:

- business plan
- market research
- team profile

Payload-only document types include:

- GEDSI reports
- impact reports

The values also use different naming/casing conventions.

**Reconciliation status:** Analysis complete; canonical representation remains OPEN.

## 7. Stored vs Computed State

The current implementations use different approaches to document status.

Payload stores document review status directly in the Documents collection. Its current values include:

- pending_review
- approved
- rejected
- needs_revision

The Prisma-side document functionality also contains computed display/status logic based on venture stage and document age.

The current implementation therefore contains both stored review state and computed display/state logic.

No formal architectural decision has been made regarding whether a future consolidated implementation should retain stored status, computed status, or a defined combination of both.

**Reconciliation status:** Analysis complete; decision remains OPEN.

## 8. Write and Access Path Differences

The overlapping entities do not currently have identical access and write behaviour.

Examples include:

- Payload Users is an authentication collection and has Payload-specific role and access controls.
- Payload Ventures allows creation and authenticated reading, while update/delete access is restricted.
- Payload Documents has role-based access for document creation, reading, updating and deleting.
- Payload ActivityLogs allows authenticated reads and creates, while updates are disabled and deletion is restricted.
- Prisma entities are accessed through the application's Prisma-based routes and services and use different relationships and business logic.

These differences mean that database consolidation cannot be treated as a simple schema copy.

Any migration would need to account for existing write paths, access rules, authentication and business logic.

## 9. Reconciliation and Migration Risks

The current differences create several risks:

1. **Non-equivalent schemas**
   Overlapping entities do not contain the same fields or relationships.

2. **Authentication and identity differences**
   Prisma/NextAuth-related authentication and Payload authentication currently coexist.

3. **Role differences**
   Prisma and Payload use different role sets and representations.

4. **Document-type differences**
   The two systems contain different document-type values.

5. **Stored versus computed status**
   Payload stores review status while Prisma-side functionality includes computed document status logic.

6. **Different ownership and relationships**
   Ventures, documents and activity records have different relationships in the two systems.

7. **Potential duplicate write paths**
   Consolidation would require identification and control of all writes to entities that currently exist across both systems.

8. **Migration and rollback complexity**
   Data transformation, validation, application cut-over and rollback would need to be defined before a production migration.

No migration should be performed until the required architectural decisions have been formally established.

## 10. Open Architectural Decisions

The following decisions remain unresolved:

| Decision | Status |
|---|---|
| Source of truth for duplicated entities | OPEN |
| Authentication ownership | OPEN |
| Identity and role mapping | OPEN |
| Canonical document types | OPEN |
| Canonical document status representation | OPEN |
| Entity ownership between Prisma and Payload | OPEN |
| Migration/cutover ownership | OPEN |
| Migration rollback plan | OPEN |
| Production write-freeze policy | BLOCKED |
| Sprint 3 cut-over window | BLOCKED |

These items must not be treated as approved architectural decisions.

## 11. Phase 0 Readiness

| Phase 0 Item | Current Status |
|---|---|
| ADR decision approval | **BLOCKED** — formal architectural decision required |
| Model/enum/computed-field mapping | **SUBSTANTIALLY COMPLETE** for the core duplicated entities; not a complete cross-store mapping for every model |
| Document-type reconciliation | **ANALYSIS COMPLETE; DECISION PENDING** |
| Stored vs computed status decision | **ANALYSIS COMPLETE; DECISION PENDING** |
| Migration plan with rollback | **BLOCKED** pending target architecture/source-of-truth decision |
| Freeze writes to losing store | **BLOCKED** because no losing store has been designated |
| Sprint 3 cut-over with named owners | **BLOCKED** because no approved cut-over window or owners exist |

### Current Phase 0 conclusion

The current inventory and reconciliation analysis can proceed as preparatory work.

However, database consolidation, write freezing, migration execution and Sprint 3 cut-over cannot be finalised until the outstanding architectural decisions are formally resolved.
